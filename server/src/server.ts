import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

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
