"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRouter = createAuthRouter;
const express_1 = require("express");
function createAuthRouter(controller) {
    const router = (0, express_1.Router)();
    router.post('/login', controller.login);
    router.get('/me', controller.me);
    router.post('/logout', controller.logout);
    return router;
}
