import User from "../model/user.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(403).json({ message: "Invalid email" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(403).json({ message: "Invalid password" });
    }

    if (!username) {
      return res.status(403).json({ message: "Invalid username" });
    }

    // check if user already exists
    const userExists = await User.findOne({ email });

    if (
      userExists &&
      (username === userExists.username || email === userExists.email)
    ) {
      return res.status(403).json({ message: "This user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username,
      password: hashedPassword,
      email: email,
    });
    await newUser.save();

    const excludePassword = {
      email: newUser.email,
      username: newUser.username,
      userId: newUser._id,
    };

    res.status(200).json(excludePassword);
  } catch (error) {
    res
      .status(error.status | 500)
      .json({ status: "Error", message: error.message || "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(403).json({ message: "This user does not exist" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_JWT, {
      expiresIn: "1h", // Token expiration time
    });

    // Send the token in the response
    res.status(200).json({ username: user.username, token: token });
  } catch (error) {
    res
      .status(error.status | 500)
      .json({ status: "Error", message: error.message || "Server error" });
  }
};
