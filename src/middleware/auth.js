/**
 * Middleware de Autenticação
 * Protege rotas que requerem usuário logado ou permissões específicas
 */

/**
 * Verifica se o usuário está autenticado
 */
function requireAuth(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({
            error: 'Não autorizado. Faça login para continuar.'
        });
    }
    next();
}

/**
 * Verifica se o usuário tem permissões de administrador
 * Roles permitidas: Marechal, General
 */
function requireAdmin(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({
            error: 'Não autorizado. Faça login para continuar.'
        });
    }

    const adminRoles = ['Marechal', 'General'];
    const userRole = req.session.user.role;

    if (!userRole || !adminRoles.includes(userRole)) {
        return res.status(403).json({
            error: 'Acesso negado. Você não tem permissão para realizar esta ação.'
        });
    }

    next();
}

/**
 * Verifica se o usuário tem permissões de moderador ou superior
 * Roles permitidas: Marechal, General, Capitão
 */
function requireModerator(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({
            error: 'Não autorizado. Faça login para continuar.'
        });
    }

    const modRoles = ['Marechal', 'General', 'Capitão'];
    const userRole = req.session.user.role;

    if (!userRole || !modRoles.includes(userRole)) {
        return res.status(403).json({
            error: 'Acesso negado. Você precisa ser moderador ou superior.'
        });
    }

    next();
}

/**
 * Middleware de logging para requisições autenticadas
 */
function logAuthRequest(req, res, next) {
    if (req.session && req.session.user) {
        console.log(`[AUTH] ${req.method} ${req.path} - User: ${req.session.user.username} (${req.session.user.discordId})`);
    }
    next();
}

module.exports = {
    requireAuth,
    requireAdmin,
    requireModerator,
    logAuthRequest
};
