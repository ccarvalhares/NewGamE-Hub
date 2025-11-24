const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    points: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: 'Recruta',
        enum: ['Marechal', 'General', 'Capitão', 'Soldado', 'Recruta']
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
