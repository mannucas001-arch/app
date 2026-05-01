"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthMiddleware = createAuthMiddleware;
function createAuthMiddleware(authService) {
    return async (req, res, next) => {
        const authorization = req.headers.authorization;
        const token = authorization?.startsWith('Bearer ') ? authorization.slice('Bearer '.length) : null;
        if (!token) {
            res.status(401).json({ message: 'Autenticacao obrigatoria' });
            return;
        }
        const user = await authService.getUserByToken(token);
        if (!user) {
            res.status(401).json({ message: 'Sessao expirada' });
            return;
        }
        next();
    };
}
