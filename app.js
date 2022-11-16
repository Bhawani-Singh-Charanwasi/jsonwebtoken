import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";



const app = express();
const port = process.env.PORT || 3001;
const DataBase = process.env.DATABASE_URL;

// cors policy
app.use(cors());

// DATABASE
mongoose
  .connect(DataBase, { useUnifiedTopology: true })
  .then(() => app.listen(port, () => console.log(`server listen on port ${port}`)))
  .catch((err) => {
    console.log(err);
  });

// JSON
app.use(express.json());  

// Load Routes
app.use("/api/user", userRoutes);

//   server listning
// app.listen(port,()=>console.log(`Listning on PORT ${port}`));