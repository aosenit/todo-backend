import Todo from "../model/todos.js";

export const createTodo = async (req, res) => {
  try {
    const { description, title, date, priority } = req.body;
    if (!title) {
      res.status(400).json({ message: "title not specified" });
    }

    const newTodo = new Todo({
      title: title,
      description: description,
      date: date,
      priority: priority,
      userId: req.user.userId,
    });

    await newTodo.save();

    res.status(200).json(newTodo);
  } catch (error) {
    res
      .status(error.status | 500)
      .json({ status: "Error", message: error.message || "Server error" });
  }
};

export const getTodos = async (req, res) => {
  try {
    const allTodos = await Todo.find({ userId: req.user.userId });
    if (!allTodos) {
      return res.status(404).json({ message: "No Todos found" });
    }
    res.status(200).json(allTodos);
  } catch (error) {
    res
      .status(error.status | 500)
      .json({ status: "Error", message: error.message || "Server error" });
  }
};

export const getTodo = async (req, res) => {
  try {
    const todo = await Todo.findById({ _id: req.params.id });

    if (!todo) {
      return res.status(404).json({ message: "No Todo found" });
    }
    res.status(200).json(todo);
  } catch (error) {
    res
      .status(error.status | 500)
      .json({ status: "Error", message: error.message || "Server error" });
  }
};

export const editTodo = async (req, res) => {
  try {
    const todo = await Todo.findById({ _id: req.params.id });
    if (!todo) {
      return res.status(404).json({ message: "No Todo found" });
    }

    Object.assign(todo, req.body);
    await todo.save();
    res.status(200).json(todo);
  } catch (error) {
    res
      .status(error.status | 500)
      .json({ status: "Error", message: error.message || "Server error" });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById({ _id: req.params.id });
    if (!todo) {
      return res.status(404).json({ message: "No Todo found" });
    }

    if (todo.userId !== req.user.userId) {
      return res.status(404).json({ message: "You can only delete your todo" });
    }

    await todo.deleteOne();
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res
      .status(error.status | 500)
      .json({ status: "Error", message: error.message || "Server error" });
  }
};

export const latestTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 }).limit(3);

    res.status(200).json({ todos });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};
