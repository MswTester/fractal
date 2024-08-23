import express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import path from 'path'
import dotenv from 'dotenv'
import { MongoClient, ObjectId } from 'mongodb'

const rootDir = path.join(__dirname.replaceAll('src', '').replace('dist', ''), '../');
const envPath = path.join(rootDir, '/.env');
dotenv.config({ path: envPath });
console.log('envPath:', envPath);

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const PORT = process.env.PORT || 8080;
const client = new MongoClient(uri);

const main = async () => {
    await client.connect();
    const db = client.db('fractal');
    console.log('db connected:', uri);
    const app = express();
    const server = createServer(app);
    const corsOptions = {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Access-Control-Allow-Origin']
    };
    const io = new Server(server, {cors: corsOptions});

    app.get('/', (req, res) => {
        res.send('Server is running: ' + uri);
    });

    io.on('connection', (socket) => {
        socket.on('logined', async (id:string) => {
            console.log('logined:', id);
            await db.collection('users').updateOne({id}, {$set: {lastLogin: Date.now()}});
            socket.join(id);
        });
        socket.on('disconnecting', async () => {
            const id = userIdOf(socket);
            if(id){
                console.log('logout:', id);
                await db.collection('users').updateOne({id}, {$set: {lastLogout: Date.now()}});
            }
        });
    });

    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};
main();

function userIdOf(socket: Socket):string|null{
    const id = Array.from(socket.rooms).find(room => room.length === 36 && room !== socket.id && room.split('-').length === 5);
    return id || null;
}