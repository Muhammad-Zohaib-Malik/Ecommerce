import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRouter from './routes/user.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// connection to db
connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/user', userRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
