import connectToDatabase from './connect.js';
import User from '../models/userModel.js';
import Todo from '../models/todoModel.js';

await connectToDatabase();
await User.create({ username: "test", email: "test@test.dk", password: "1234" });
await Todo.create({ title: "Demo todo", completed: false });
