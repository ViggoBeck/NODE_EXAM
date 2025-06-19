import { Router } from 'express';
import Todo from '../models/todoModel.js';
import { io } from '../app.js';

const router = Router();

// GET – hent både egne og delte to-dos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({
      $or: [{ user: req.user._id }, { sharedWith: req.user._id }]
    })
      .sort({ dueDate: 1 })
      .populate('sharedWith', 'username')
      .populate('user', 'username');

    res.json(todos);
  } catch (err) {
    console.error("[GET /todos] Fejl:", err);
    res.status(500).json({ message: 'Fejl ved hentning af todos' });
  }
});

// POST – opret ny to-do
router.post('/', async (req, res) => {
  try {
    const { title, completed = false, dueDate, comment = "" } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ message: 'Title og dueDate er påkrævet' });
    }

    const todo = new Todo({
      title,
      completed,
      dueDate,
      comment,
      user: req.user._id
    });

    const savedTodo = await todo.save();
    const populatedTodo = await Todo.findById(savedTodo._id)
      .populate('sharedWith', 'username')
      .populate('user', 'username')
      .lean(); // sikre objekt der kan sendes via socket

    // Emit til ejer
    io.to(req.user._id.toString()).emit("new-todo", populatedTodo);

    // Emit til alle delte brugere
    if (populatedTodo.sharedWith?.length > 0) {
      populatedTodo.sharedWith.forEach(friend => {
        io.to(friend._id.toString()).emit("new-todo", populatedTodo);
      });
    }

    res.status(201).json(populatedTodo);
  } catch (err) {
    console.error("[POST /todos] Fejl:", err);
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
      const updated = await todo.save();
      const populated = await Todo.findById(updated._id)
        .populate('sharedWith', 'username')
        .populate('user', 'username')
        .lean();

      io.to(req.params.friendId.toString()).emit("new-todo", populated);
    }

    res.json({ message: 'To-do delt med ven' });
  } catch (err) {
    console.error('[POST /todos/:id/share] Fejl:', err);
    res.status(500).json({ message: 'Fejl ved deling af to-do' });
  }
});

// PUT – både ejer og delte brugere kan opdatere
router.put('/:id', async (req, res) => {
  try {
    const updated = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [{ user: req.user._id }, { sharedWith: req.user._id }]
      },
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(403).json({ message: 'Ingen adgang' });
    }

    res.json(updated);
  } catch (err) {
    console.error("[PUT /todos/:id] Fejl:", err);
    res.status(400).json({ message: 'Fejl ved opdatering' });
  }
});

// DELETE – ejer og delte brugere kan slette
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'To-do ikke fundet' });
    }

    const isOwner = todo.user.equals(req.user._id);
    const isSharedWith = todo.sharedWith.includes(req.user._id);

    if (!isOwner && !isSharedWith) {
      return res.status(403).json({ message: 'Ingen adgang' });
    }

    await todo.deleteOne();
    res.json({ message: 'To-do slettet for alle brugere' });
  } catch (err) {
    console.error('[DELETE /todos/:id] Fejl:', err);
    res.status(500).json({ message: 'Fejl ved sletning af to-do' });
  }
});

export default router;
