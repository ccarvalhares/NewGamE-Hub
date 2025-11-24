const winston = require('winston');

/**
 * Logger configurado com Winston
 * Níveis: error, warn, info, debug
 */
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'newgame-hub' },
    transports: [
        // Console output
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ level, message, timestamp, ...metadata }) => {
                    let msg = `${timestamp} [${level}]: ${message}`;
                    if (Object.keys(metadata).length > 0) {
                        msg += ` ${JSON.stringify(metadata)}`;
                    }
                    return msg;
                })
            )
        })
    ]
});

// Em produção, adicionar logs de erro em arquivo
if (process.env.NODE_ENV === 'production') {
    logger.add(new winston.transports.File({
        filename: 'error.log',
        level: 'error'
    }));
    logger.add(new winston.transports.File({
        filename: 'combined.log'
    }));
}

module.exports = logger;
