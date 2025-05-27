import express from "express";
import User from "../../models/userModel.js";

const router = express.Router();

//Signup 
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) return res.status(400).json({ message: "Bruger findes allerede"});

        const user = new User({ username, email, password });
        await user.save();

        await sendSignupEmail(email, username);

        req.session.userId = user._id;
        res.status(201).json({ message: "Bruger oprettet"});
    } catch (err) {
        res.status(500).json({ message: "Fejl ved oprettelse af bruger"});
    }
});

//Login 
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
        return res.status(400).json({ message: "Forkert email eller adgangskode" });
    }
    
    req.session.userId = user._id;
    res.json({ message: "Logget ind" });
});

//Logout
router.post("/logout", (req, res) => {
    req.session.destroy(() => res.json({ message: "Logget ud" }));
});



export default router;