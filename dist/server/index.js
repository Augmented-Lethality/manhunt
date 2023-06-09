"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const dist = path_1.default.resolve(__dirname, '..', 'client', 'dist');
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, { /* options */});
const port = process.env.PORT || 3666;
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.resolve(__dirname, '../client/dist')));
app.use(express_1.default.urlencoded({ extended: true }));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(dist, 'index.html'), (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
});
io.on("connection", (socket) => {
    // ...
});
httpServer.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
