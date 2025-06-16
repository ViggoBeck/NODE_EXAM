import express from 'express';
import User from '../models/userModel.js';

const router = express.Router();

// Get all friends
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'username');
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ message: 'Fejl ved hentning af venner' });
  }
});

// Get incoming friend requests
router.get('/requests', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friendRequests', 'username');
    res.json(user.friendRequests);
  } catch (err) {
    res.status(500).json({ message: 'Fejl ved hentning af anmodninger' });
  }
});

// Send friend request
router.post('/request/:username', async (req, res) => {
  try {
    const target = await User.findOne({ username: req.params.username });
    if (!target) return res.status(404).json({ message: 'Bruger ikke fundet' });

    if (target.friendRequests.includes(req.user._id) || target.friends.includes(req.user._id)) {
      return res.status(400).json({ message: 'Allerede sendt eller allerede venner' });
    }

    target.friendRequests.push(req.user._id);
    await target.save();

    res.json({ message: `Anmodning sendt til ${target.username}` });
  } catch (err) {
    res.status(500).json({ message: 'Fejl ved afsendelse af anmodning' });
  }
});

// Accept friend request
router.post('/accept/:username', async (req, res) => {
  try {
    const requester = await User.findOne({ username: req.params.username });
    if (!requester) return res.status(404).json({ message: 'Bruger ikke fundet' });

    const user = await User.findById(req.user._id);
    const alreadyRequested = user.friendRequests.includes(requester._id);
    if (!alreadyRequested) return res.status(400).json({ message: 'Ingen anmodning fra denne bruger' });

    // Fjern anmodning
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requester._id.toString());
    // Tilføj hinanden som venner
    user.friends.push(requester._id);
    requester.friends.push(user._id);

    await user.save();
    await requester.save();

    res.json({ message: `Du er nu venner med ${requester.username}` });
  } catch (err) {
    res.status(500).json({ message: 'Fejl ved accept af anmodning' });
  }
});

export default router;