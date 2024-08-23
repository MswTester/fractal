import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'
import dotenv from 'dotenv'
import { MongoClient, WithId } from 'mongodb'

const rootDir = path.join(__dirname, '/../');
const envPath = path.join(rootDir, '/.env');
dotenv.config({ path: envPath });
console.log('envPath:', envPath);

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const PORT = process.env.PORT || 3000;

const main = async () => {
    const app = express();
    const server = createServer(app);
    const corsOptions = {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Access-Control-Allow-Origin']
    };
    const io = new Server(server, {cors: corsOptions});
    const client = new MongoClient(uri);
    console.log('uri:', uri);
    await client.connect();
    const db = client.db('fractal');

    app.get('/', (req, res) => {
        res.send('Server is running');
    });
    
    io.on('connection', (socket) => {
        socket.on('logined', async (id:string) => {
            console.log('logined:', id);
            socket.join(id);
        });
        socket.on('disconnect', async () => {
            if(socket.rooms.size > 0){
                let id = '';
                for(const room of socket.rooms){
                    if(!room.startsWith('room:')){
                        id = room;
                        break;
                    }
                }
                if(id){
                    console.log('logout:', id);
                    await db.collection('users').updateOne({id}, {$set: {lastLogout: Date.now()}});
                }
            }
        });
    });
    
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};
main();
