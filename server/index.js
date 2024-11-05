import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./router/router.js";
import errorMiddleware from './middlewares/error-middleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
  } catch (error) {
    console.log(error.message);
  }
}

start();
