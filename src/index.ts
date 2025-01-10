import express, {Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import eventRoutes from './routes/events.ts'; 
import userRoutes from './routes/users.ts'; 

dotenv.config();

const app = express();

const allowedOrigins = [
    'http://localhost:3000',// Example: Allow requests from localhost
    'http://192.168.122.165:5173', 
    'http://localhost:5173', 
]
app.use(cors({
    origin: allowedOrigins, // Replace with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
}));
app.use(express.json());
app.use('/events', eventRoutes);
app.use('/users', userRoutes);





app.get('/test', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello from the server!');
    return;
});

const PORT = process.env.PORT;
console.log(process.env.PORT)
console.log(process.env.DB)
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
