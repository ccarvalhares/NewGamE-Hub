const axios = require('axios');
const User = require('../Models/User');
const discordService = require('../services/discordBot');
const logger = require('../utils/logger');

exports.loginRedirect = (req, res) => {
    const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=identify%20guilds.members.read`;
    res.redirect(url);
};

exports.loginCallback = async (req, res) => {
    const { code } = req.query;
    if (!code) return res.redirect('/');

    try {
        // 1. Exchange code for token
        const tokenRes = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: process.env.REDIRECT_URI,
            scope: 'identify guilds.members.read',
        }).toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

        const accessToken = tokenRes.data.access_token;

        // 2. Get user basic data
        const userRes = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const discordUser = userRes.data;

        // 3. Get Role via Bot Service (Optional/Future)
        // For now, we keep existing role if user exists, or default to 'Recruta'
        // const role = await discordService.getUserRole(discordUser.id); 

        // 4. Find or Create User in MongoDB
        const user = await User.findOneAndUpdate(
            { discordId: discordUser.id },
            {
                username: discordUser.username,
                avatar: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
                // We don't overwrite role or points here to preserve progress
                // $setOnInsert: { role: 'Recruta', points: 0 } // Default values handled by Schema
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // 5. Create Session
        req.session.user = {
            id: user._id, // Internal MongoDB ID
            discordId: user.discordId,
            username: user.username,
            avatar: user.avatar,
            role: user.role,
            points: user.points
        };

        logger.info(`User logged in: ${user.username} (${user.discordId})`);

        res.redirect('/');
    } catch (error) {
        logger.error("Login error:", error);
        res.redirect('/?error=login_failed');
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            logger.error("Logout error:", err);
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.json({ success: true });
    });
};

exports.getCurrentUser = async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });

    try {
        // Fetch fresh data from DB
        const user = await User.findById(req.session.user.id);

        if (!user) {
            // User might have been deleted from DB but session persists
            req.session.destroy();
            return res.status(401).json({ error: 'User not found' });
        }

        // Update session with fresh data (optional, but good for consistency)
        req.session.user.points = user.points;
        req.session.user.role = user.role;

        res.json(user);
    } catch (error) {
        logger.error("getCurrentUser error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};