import { Router } from "express";

const router = Router();

let todos = [
  { id: 1, text: "Lær Node.js" },
  { id: 2, text: "Lav en god to-do liste" }
];

// GET – Hent alle todos
router.get("/", (req, res) => {
  res.send({ data: todos });
});

// POST – Tilføj ny todo
router.post("/", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send({ success: false, message: "Mangler tekst" });

  const newTodo = { id: Date.now(), text };
  todos.push(newTodo);
  res.status(201).send({ success: true, data: newTodo });
});

// PUT – Rediger todo
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const { text } = req.body;
  const todo = todos.find(t => t.id === id);

  if (!todo) return res.status(404).send({ success: false, message: "Todo ikke fundet" });

  todo.text = text;
  res.send({ success: true, data: todo });
});

// DELETE – Slet todo
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) return res.status(404).send({ success: false, message: "Todo ikke fundet" });

  todos.splice(index, 1);
  res.send({ success: true });
});

export default router;
