import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
// //to make input as json
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:["http://localhost:3001"], credentials:true}))

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log(error);
});

app.listen(3000,() => {
    console.log(`Server is running on port 3000`);
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

