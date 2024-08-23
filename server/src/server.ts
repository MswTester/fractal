import path from 'path'
import dotenv from 'dotenv'

const rootDir = path.join(__dirname, '/../')
const envPath = path.join(rootDir, '/.env')
dotenv.config({ path: envPath })
