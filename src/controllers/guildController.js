const Task = require('../Models/Task');
const User = require('../Models/User');
const discordService = require('../services/discordBot');
const logger = require('../utils/logger');

exports.createTask = async (req, res) => {
    const { user } = req.session;

    // Check permissions
    if (!user || !['Marechal', 'General'].includes(user.role)) {
        return res.status(403).json({ error: 'Apenas alto comando pode criar tasks.' });
    }

    const { code, points, time } = req.body;

    if (!code || !points || !time) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const expiresAt = new Date(Date.now() + parseInt(time) * 1000);

        const newTask = new Task({
            code,
            points: parseInt(points),
            expiresAt,
            createdBy: user.discordId
        });

        await newTask.save();

        // Notify Discord (Fire and forget)
        discordService.sendNotification(newTask).catch(err => logger.error("Discord notification error:", err));

        logger.info(`Task created: ${code} by ${user.username}`);
        res.json({ success: true, message: 'Task criada e notificada!' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Já existe uma task com este código.' });
        }
        logger.error("Create task error:", error);
        res.status(500).json({ error: 'Erro ao criar task.' });
    }
};

exports.redeemCode = async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Login necessário' });

    const { code } = req.body;
    const userId = req.session.user.id;

    try {
        // Find active task with this code
        const task = await Task.findOne({
            code,
            expiresAt: { $gt: new Date() }
        });

        if (!task) {
            return res.status(400).json({ error: 'Código inválido ou expirado.' });
        }

        // Check if already redeemed
        if (task.redeemedBy.includes(userId)) {
            return res.status(400).json({ error: 'Você já resgatou este código.' });
        }

        // Add points to user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $inc: { points: task.points } },
            { new: true }
        );

        // Mark task as redeemed by user
        task.redeemedBy.push(userId);
        await task.save();

        // Update session
        req.session.user.points = updatedUser.points;

        logger.info(`Code ${code} redeemed by ${updatedUser.username} (+${task.points})`);
        res.json({ success: true, newPoints: updatedUser.points });
    } catch (error) {
        logger.error("Redeem code error:", error);
        res.status(500).json({ error: 'Erro ao resgatar código.' });
    }
};

exports.assignRole = async (req, res) => {
    const { user } = req.session;

    // Only Marechal and General can assign roles
    if (!user || !['Marechal', 'General'].includes(user.role)) {
        return res.status(403).json({ error: 'Apenas alto comando pode gerenciar cargos.' });
    }

    const { userId, role } = req.body;

    if (!userId || !role) {
        return res.status(400).json({ error: 'userId e role são obrigatórios.' });
    }

    try {
        // Update user role by Discord ID (assuming userId input is Discord ID as per original UI placeholder)
        // Original UI placeholder: "ID do Usuário Discord"
        const updatedUser = await User.findOneAndUpdate(
            { discordId: userId },
            { role },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuário não encontrado. O usuário precisa ter feito login no site pelo menos uma vez.' });
        }

        logger.info(`Role ${role} assigned to ${updatedUser.username} by ${user.username}`);
        res.json({ success: true, message: `Cargo ${role} atribuído ao usuário ${updatedUser.username}`, user: updatedUser });
    } catch (error) {
        logger.error("Assign role error:", error);
        res.status(500).json({ error: 'Erro ao atribuir cargo.' });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find()
            .sort({ points: -1 })
            .limit(10)
            .select('username role points avatar'); // Select only necessary fields

        res.json({ success: true, leaderboard });
    } catch (error) {
        logger.error("Get leaderboard error:", error);
        res.status(500).json({ error: 'Erro ao buscar classificação.' });
    }
};