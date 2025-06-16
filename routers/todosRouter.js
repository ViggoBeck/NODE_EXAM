import express from 'express';
import Todo from '../models/todoModel.js';

const router = express.Router();

// GET – hent både egne og delte to-dos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({
      $or: [
        { user: req.user._id },
        { sharedWith: req.user._id }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('sharedWith', 'username'); // Populér brugernavne for delte brugere

    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Fejl ved hentning af todos' });
  }
});

// POST – opret ny to-do
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

// POST – del en to-do med en ven
router.post('/:id/share/:friendId', async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!todo) {
      return res.status(404).json({ message: 'To-do ikke fundet eller du ejer den ikke' });
    }

    if (!todo.sharedWith.includes(req.params.friendId)) {
      todo.sharedWith.push(req.params.friendId);
      await todo.save();
    }

    res.json({ message: 'To-do delt med ven' });
  } catch (err) {
    console.error('Fejl ved deling:', err);
    res.status(500).json({ message: 'Fejl ved deling af to-do' });
  }
});

// PUT – både ejer og delte brugere kan opdatere
router.put('/:id', async (req, res) => {
  try {
    const updated = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [
          { user: req.user._id },
          { sharedWith: req.user._id }
        ]
      },
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
    const todo = await Todo.findById(req.params.id);

    if (!todo) return res.status(404).json({ message: 'To-do ikke fundet' });

    const isOwner = todo.user.equals(req.user._id);
    const isSharedWith = todo.sharedWith.includes(req.user._id);

    if (!isOwner && !isSharedWith) {
      return res.status(403).json({ message: 'Ingen adgang' });
    }

    await todo.deleteOne();

    res.json({ message: 'To-do slettet for alle brugere' });
  } catch (err) {
    console.error('Fejl ved sletning:', err);
    res.status(500).json({ message: 'Fejl ved sletning af to-do' });
  }
});

export default router;
