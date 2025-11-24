const axios = require('axios');
const User = require('../Models/User');
const discordService = require('../services/discordBot');

exports.loginRedirect = (req, res) => {
    const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=identify%20guilds.members.read`;
    res.redirect(url);
};

exports.loginCallback = async (req, res) => {
    const { code } = req.query;
    if (!code) return res.redirect('/');

    try {
        // 1. Trocar código por token
        const tokenRes = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: process.env.REDIRECT_URI,
            scope: 'identify guilds.members.read',
        }).toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

        const accessToken = tokenRes.data.access_token;

        // 2. Pegar dados básicos do usuário
        const userRes = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        // 3. Pegar Cargo via Bot Service
        const role = await discordService.getUserRole(userRes.data.id);

        const userData = {
            id: userRes.data.id,
            username: userRes.data.username,
            avatar: `https://cdn.discordapp.com/avatars/${userRes.data.id}/${userRes.data.avatar}.png`,
            role: role
        };

        // 4. Salvar/Atualizar no Model
        const savedUser = User.save(userData);

        // 5. Criar sessão
        req.session.user = savedUser;

        res.redirect('/');
    } catch (error) {
        console.error("Erro no login:", error);
        res.redirect('/?error=login_failed');
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.json({ success: true });
    });
};

exports.getCurrentUser = (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
    // Busca dados atualizados do Model (para pegar pontos atualizados)
    const user = User.findById(req.session.user.id);
    res.json(user);
};