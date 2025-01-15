import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import userRouter from './routes/user.route.js';
import productRouter from './routes/product.route.js';
import categoryRouter from './routes/category.route.js';
import orderRouter from './routes/order.route.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// connection to db
connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/order', orderRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
