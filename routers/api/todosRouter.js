import express from 'express';
import Todo from '../../models/todoModel.js';

const router = express.Router();

// GET – hent alle todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Fejl ved hentning af todos' });
  }
});

// POST – opret ny todo
router.post('/', async (req, res) => {
  try {
    const { title, completed = false, dueDate } = req.body;

    // Valider at både title og dueDate findes
    if (!title || !dueDate) {
      return res.status(400).json({ message: 'Title og dueDate er påkrævet' });
    }

    const todo = new Todo({
      title,
      completed,
      dueDate
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    console.error("Fejl ved POST /todos:", err);
    res.status(400).json({ message: 'Fejl ved oprettelse' });
  }
});

// PUT – opdater eksisterende todo
router.put('/:id', async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Fejl ved opdatering' });
  }
});

// DELETE – slet todo
router.delete('/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo slettet' });
  } catch (err) {
    res.status(500).json({ message: 'Fejl ved sletning' });
  }
});

export default router;
