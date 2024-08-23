"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
const rootDir = path_1.default.join(__dirname, '/../');
const envPath = path_1.default.join(rootDir, '/.env');
dotenv_1.default.config({ path: envPath });
console.log('envPath:', envPath);
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const PORT = process.env.PORT || 3000;
const main = async () => {
    const app = (0, express_1.default)();
    const server = (0, http_1.createServer)(app);
    const corsOptions = {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Access-Control-Allow-Origin']
    };
    const io = new socket_io_1.Server(server, { cors: corsOptions });
    const client = new mongodb_1.MongoClient(uri);
    console.log('uri:', uri);
    await client.connect();
    app.get('/', (req, res) => {
        res.send('Server is running');
    });
    io.on('connection', (socket) => {
        console.log('a user connected');
    });
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};
main();
//# sourceMappingURL=server.js.map