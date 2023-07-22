import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: null,
    },
    description: {
      type: String,
    },
    priority: {
      type: String,
      enum: ["high", "intermediate", "low"],
      default: "low",
    },
    userId: {
      type: String,
      default: "Anonymous",
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", TodoSchema);

export default Todo;
