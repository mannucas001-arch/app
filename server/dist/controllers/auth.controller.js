"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    service;
    constructor(service) {
        this.service = service;
    }
    login = async (req, res, next) => {
        try {
            res.json(await this.service.login(req.body));
        }
        catch (error) {
            next(error);
        }
    };
    me = async (req, res, next) => {
        try {
            const token = getBearerToken(req);
            if (!token) {
                res.status(401).json({ message: 'Sessao nao encontrada' });
                return;
            }
            const user = await this.service.getUserByToken(token);
            if (!user) {
                res.status(401).json({ message: 'Sessao expirada' });
                return;
            }
            res.json({ user });
        }
        catch (error) {
            next(error);
        }
    };
    logout = async (req, res, next) => {
        try {
            const token = getBearerToken(req);
            if (token) {
                await this.service.logout(token);
            }
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthController = AuthController;
function getBearerToken(req) {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
        return null;
    }
    return authorization.slice('Bearer '.length);
}
