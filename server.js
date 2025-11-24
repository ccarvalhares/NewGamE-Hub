require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authController = require('./src/controllers/authController');
const guildController = require('./src/controllers/guildController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true
}));

// Routes
// Static Files
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + '/style.css');
});

app.get('/script.js', (req, res) => {
    res.sendFile(__dirname + '/script.js');
});

// Auth Routes
app.get('/auth/discord', authController.loginRedirect);
app.get('/auth/discord/callback', authController.loginCallback);
app.get('/auth/logout', authController.logout);
app.get('/api/me', authController.getCurrentUser);

// API Routes
app.post('/api/create-task', guildController.createTask);
app.post('/api/redeem', guildController.redeemCode);
app.post('/api/assign-role', guildController.assignRole);
app.get('/api/leaderboard', guildController.getLeaderboard);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
