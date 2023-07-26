import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import AuthRouter from "./routes/auth.js";
import authenticateToken from "./util/authenticate.js";
import TodosRouter from "./routes/todos.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT;

app.use("/api/v1", AuthRouter);

app.use("/api/v1", authenticateToken, TodosRouter);

try {
  mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () =>
    console.log("App connected to db and Working on port " + port)
  );
} catch (error) {
  console.log("Error connecting to db" + error.message);
}
