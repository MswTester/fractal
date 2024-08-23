import { MongoClient, Db } from 'mongodb';

// MongoDB 연결 문자열 (MongoDB URI)
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'; // 본인의 MongoDB URI로 변경

// MongoDB 클라이언트 생성
const client = new MongoClient(uri);

// 데이터베이스 연결 함수 (async/await 사용)
async function connectToMongoDB(): Promise<void> {
  try {
    // MongoDB 연결
    await client.connect();
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

// 데이터베이스 객체 반환 함수
function getMongoDB(): Db {
  return client.db('fractal'); // 데이터베이스 이름으로 변경
}

export { connectToMongoDB, getMongoDB };
