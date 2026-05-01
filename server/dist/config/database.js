"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
async function connectToDatabase() {
    if (!env_1.env.mongoUri) {
        console.warn('MONGODB_URI nao configurada. API usando seed em memoria.');
        return false;
    }
    await mongoose_1.default.connect(env_1.env.mongoUri);
    console.log('MongoDB conectado.');
    return true;
}
