import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
// import { sendSignupEmail } from "../../utils/emailService.js"; // senere

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Signup
router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: "Alle felter er påkrævet" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Brugernavn eller email findes allerede" });
    }

    const user = new User({ username, password, email });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 time
      secure: process.env.NODE_ENV === "production",
    });

    // MANGLER await sendSignupEmail(email, username);

    res.status(201).json({ message: "Bruger oprettet" });
  } catch (err) {
    console.error("Signup-fejl:", err.message);
    res.status(500).json({ message: "Fejl ved oprettelse af bruger" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Udfyld både brugernavn og adgangskode" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Bruger ikke fundet" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Forkert adgangskode" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax',
      domain: 'localhost'
    });

    res.json({ message: "Logget ind" });
  } catch (err) {
    console.error("Login-fejl:", err.message);
    res.status(500).json({ message: "Login-fejl" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logget ud" });
});

export default router;
