import express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import path from 'path'
import dotenv from 'dotenv'
import { MongoClient, ObjectId } from 'mongodb'
import Room from '../../shared/room'

const rootDir = path.join(__dirname.replaceAll('src', '').replace('dist', ''), '../');
const envPath = path.join(rootDir, '/.env');
dotenv.config({ path: envPath });
console.log('envPath:', envPath);

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const PORT = process.env.PORT || 8080;
const client = new MongoClient(uri);

let rooms:Room[] = [];
const showingRooms = () => rooms.filter(room => !room.isPrivate).map(room => room.display);

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
        res.send('server is running');
    });

    io.on('connection', (socket) => {
        const destroyConnection = (id:string) => {
            const room = rooms.find(room => room.players.find(player => player.id === id));
            if(room){
                room.leave(id);
                socket.leave(room.id);
                if(room.ownerId === id){
                    io.to(room.id).emit('roomDestroyed', 'Room owner left the room');
                    rooms = rooms.filter(r => r.id !== room.id);
                } else {
                    io.to(room.id).emit('roomUpdated', room.serialize());
                }
                socket.broadcast.emit('rooms', showingRooms());
            }
        }
        socket.on('logined', async (id:string) => {
            io.to(id).emit('kick', 'You are logged in from another device');
            destroyConnection(id);
            io.to(id).socketsLeave(id);
            console.log('logined:', id);
            await db.collection('users').updateOne({id}, {$set: {lastLogin: Date.now()}});
            socket.join(id);
        });
        socket.on('disconnecting', async () => {
            const id = userIdOf(socket);
            if(id){
                // destroy connection
                destroyConnection(id);
                
                console.log('logout:', id);
                await db.collection('users').updateOne({id}, {$set: {lastLogout: Date.now()}});
            }
        });

        // Room System
        socket.on('getRooms', () => {socket.emit('rooms', showingRooms())})
        socket.on('createRoom', (user:IUser, name:string, maxPlayers:number, isPrivate:boolean, callback:(err:string, room:IRoom|null) => void) => {
            if(maxPlayers < 2 || maxPlayers > 6){
                callback('Invalid max players', null);
                return;
            }
            const room = new Room(name, user, maxPlayers, isPrivate);
            rooms.push(room);
            socket.join(room.id);
            socket.broadcast.emit('rooms', showingRooms());
            callback('', room.serialize());
        });
        socket.on('joinRoom', (id:string, user:IUser, callback:(err:string, room:IRoom|null) => void) => {
            const room = rooms.find(room => room.id === id);
            if(room){
                if(room.isFull()){
                    callback('room is full', null);
                } else {
                    room.join(user);
                    socket.join(id);
                    io.to(room.id).emit('roomUpdated', room.serialize());
                    socket.broadcast.emit('rooms', showingRooms());
                    callback('', room.serialize());
                }
            }else{
                callback('room not found', null);
            }
        });
        socket.on('leaveRoom', (id:string, callback:(err:string) => void) => {
            const room = rooms.find(room => room.id === id);
            const userId = userIdOf(socket);
            if(room){
                if(!userId) return callback('User not found');
                room.leave(userId);
                socket.leave(id);
                if(room.ownerId === userId){
                    io.to(room.id).emit('roomDestroyed', 'Room owner left the room');
                    rooms = rooms.filter(r => r.id !== room.id);
                } else {
                    io.to(room.id).emit('roomUpdated', room.serialize());
                }
                socket.broadcast.emit('rooms', showingRooms());
                callback('');
            }else{
                callback('Room not found');
            }
        });
        socket.on('chat', (id:string, chat:string) => {
            const room = rooms.find(room => room.id === id);
            if(room){
                const userId = userIdOf(socket);
                const user = room.players.find(player => player.id === userId)
                if(user){
                    io.to(room.id).emit('chat', `[${user.username}] ${chat}`);
                }
            }
        });
        socket.on('changeMap', (id:string, map:number) => {
            const room = rooms.find(room => room.id === id);
            if(room){
                if(room.ownerId !== userIdOf(socket)) return;
                room.setMap(map);
                io.to(room.id).emit('roomUpdated', room.serialize());
            }
        });
        socket.on('changeMode', (id:string, mode:number) => {
            const room = rooms.find(room => room.id === id);
            if(room){
                if(room.ownerId !== userIdOf(socket)) return;
                room.setMode(mode);
                io.to(room.id).emit('roomUpdated', room.serialize());
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