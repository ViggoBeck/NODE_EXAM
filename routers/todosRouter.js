import express from 'express';
import Todo from '../models/todoModel.js';

const router = express.Router();

// GET 
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Fejl ved hentning af todos' });
  }
});

// POST 
router.post('/', async (req, res) => {
  try {
    const { title, completed = false, dueDate } = req.body;
    if (!title || !dueDate) {
      return res.status(400).json({ message: 'Title og dueDate er påkrævet' });
    }

    const todo = new Todo({
      title,
      completed,
      dueDate,
      user: req.user._id
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    console.error("Fejl ved POST /todos:", err);
    res.status(400).json({ message: 'Fejl ved oprettelse' });
  }
});

// PUT 
router.put('/:id', async (req, res) => {
  try {
    const updated = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, 
      { $set: req.body },
      { new: true }
    );

    if (!updated) return res.status(403).json({ message: 'Ingen adgang' });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Fejl ved opdatering' });
  }
});

// DELETE 
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!deleted) return res.status(403).json({ message: 'Ingen adgang' });

    res.json({ message: 'Todo slettet' });
  } catch (err) {
    res.status(500).json({ message: 'Fejl ved sletning' });
  }
});

export default router;
