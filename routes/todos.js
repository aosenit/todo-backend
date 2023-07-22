import express from "express";
import {
  createTodo,
  getTodos,
  getTodo,
  editTodo,
  deleteTodo,
  latestTodos,
} from "../controller/todos.js";

const router = express.Router();

router.post("/todo", createTodo);
router.get("/todos", getTodos);
router.get("/todo/:id", getTodo);
router.get("/latest-todo", latestTodos);
router.patch("/todo/:id", editTodo);
router.delete("/todo/:id", deleteTodo);

export default router;
