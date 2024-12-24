import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
dotenv.config();
import path, { dirname } from 'path';

// Debug: Print current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log('Current directory:', __dirname);

// Try multiple possible paths
const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '.env')
];

// Load environment variables
let loaded = false;
for (const envPath of envPaths) {
    console.log('Trying path:', envPath);
    const result = dotenv.config({ path: envPath });
    if (!result.error) {
        console.log('Loaded env from:', envPath);
        loaded = true;
        break;
    }
}

if (!loaded) {
    throw new Error('Could not load .env file');
}

const app = express();
// //to make input as json
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['https://deluxe-mooncake-8c7269.netlify.app'], // Allow your frontend origin
    credentials: true,                // Allow cookies to be sent
}));

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log(error);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
});

import authRouter from './routes/auth.route.js';
import noteRouter from './routes/note.route.js';
app.use("/api/auth",authRouter)
app.use("/api/note",noteRouter)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

