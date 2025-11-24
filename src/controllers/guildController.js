const Task = require('../Models/Task');
const User = require('../Models/User');
const discordService = require('../services/discordBot');

exports.createTask = (req, res) => {
    const { user } = req.session;

    // Verifica permissão (Lógica simples: Apenas Marechal/General)
    if (!user || !['Marechal', 'General'].includes(user.role)) {
        return res.status(403).json({ error: 'Apenas alto comando pode criar tasks.' });
    }

    const { code, points, time } = req.body;

    // Usa o Model para criar
    const newTask = Task.create(code, parseInt(points), parseInt(time));

    // Usa o Service para notificar no Discord
    discordService.sendNotification(newTask);

    res.json({ success: true, message: 'Task criada e notificada!' });
};

exports.redeemCode = (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Login necessário' });

    const { code } = req.body;
    const activeTask = Task.getActive();

    if (!activeTask) return res.status(400).json({ error: 'Nenhuma task ativa ou expirada.' });

    if (code !== activeTask.code) return res.status(400).json({ error: 'Código incorreto.' });

    // Adiciona pontos via Model
    const newPoints = User.addPoints(req.session.user.id, activeTask.points);

    // Update session
    req.session.user.points = newPoints;

    res.json({ success: true, newPoints });
};

exports.assignRole = (req, res) => {
    const { user } = req.session;

    // Only Marechal and General can assign roles
    if (!user || !['Marechal', 'General'].includes(user.role)) {
        return res.status(403).json({ error: 'Apenas alto comando pode gerenciar cargos.' });
    }

    const { userId, role } = req.body;

    if (!userId || !role) {
        return res.status(400).json({ error: 'userId e role são obrigatórios.' });
    }

    // Update user role
    const updatedUser = User.updateRole(userId, role);

    if (!updatedUser) {
        return res.status(404).json({ error: 'Usuário não encontrado. O usuário precisa fazer login primeiro.' });
    }

    res.json({ success: true, message: `Cargo ${role} atribuído ao usuário ${userId}`, user: updatedUser });
};

exports.getLeaderboard = (req, res) => {
    const leaderboard = User.getLeaderboard();
    res.json({ success: true, leaderboard });
};