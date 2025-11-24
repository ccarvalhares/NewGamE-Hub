require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authController = require('./src/controllers/authController');
const guildController = require('./src/controllers/guildController');
const { requireAuth, requireAdmin, logAuthRequest } = require('./src/middleware/auth');
const logger = require('./src/utils/logger');
const connectDB = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet - Protege headers HTTP
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "https://cdn.discordapp.com", "data:", "https:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'"]
        }
    }
}));

// CORS - Controle de origem
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate Limiting - Prevenir abuso
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requisições por IP
    message: { error: 'Muitas requisições deste IP, tente novamente mais tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 50, // 50 requisições por IP para APIs
    message: { error: 'Limite de requisições da API excedido.' }
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 10, // 10 tentativas de login por hora
    message: { error: 'Muitas tentativas de login. Tente novamente mais tarde.' }
});

// ============================================
// GENERAL MIDDLEWARE
// ============================================

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS only em produção
        httpOnly: true, // Previne XSS
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
        sameSite: 'lax' // Proteção CSRF
    },
    name: 'sessionId' // Nome customizado do cookie
}));

// Apply general rate limiter
app.use(generalLimiter);

// Logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// ============================================
// STATIC FILES
// ============================================

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + '/style.css');
});

app.get('/script.js', (req, res) => {
    res.sendFile(__dirname + '/script.js');
});

// ============================================
// AUTH ROUTES
// ============================================

app.get('/auth/discord', authLimiter, authController.loginRedirect);
app.get('/auth/discord/callback', authLimiter, authController.loginCallback);
app.get('/auth/logout', authController.logout);
app.get('/api/me', authController.getCurrentUser);

// ============================================
// API ROUTES (Protected)
// ============================================

// Apply API rate limiter to all API routes
app.use('/api/', apiLimiter);

// Public API
app.get('/api/leaderboard', guildController.getLeaderboard);

// Protected API - Require Authentication
app.post('/api/redeem', requireAuth, logAuthRequest, guildController.redeemCode);

// Admin Only API
app.post('/api/create-task', requireAdmin, logAuthRequest, guildController.createTask);
app.post('/api/assign-role', requireAdmin, logAuthRequest, guildController.assignRole);

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler
app.use((req, res) => {
    logger.warn(`404 Not Found: ${req.method} ${req.path}`);
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Erro interno do servidor'
            : err.message
    });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`, {
        environment: process.env.NODE_ENV || 'development',
        port: PORT
    });

    if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET === 'dev-secret-change-in-production') {
        logger.warn('⚠️  WARNING: Using default SESSION_SECRET. Change this in production!');
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});
