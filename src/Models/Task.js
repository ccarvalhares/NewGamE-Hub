const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    points: {
        type: Number,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdBy: {
        type: String, // Discord ID of the admin who created it
        required: true
    },
    redeemedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Task', taskSchema);
