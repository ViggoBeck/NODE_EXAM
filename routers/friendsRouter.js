import { Router } from 'express';
import User from '../models/userModel.js';

const router = Router();

// GET – alle venner
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'username');
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ message: 'Fejl ved hentning af venner' });
  }
});

// GET – indkommende venneanmodninger
router.get('/requests', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friendRequests', 'username');
    res.json(user.friendRequests);
  } catch (err) {
    res.status(500).json({ message: 'Fejl ved hentning af anmodninger' });
  }
});

// POST – send venneanmodning
router.post('/request/:username', async (req, res) => {
  try {
    const target = await User.findOne({ username: req.params.username });
    if (!target) return res.status(404).json({ message: 'Bruger ikke fundet' });

    // Undgå at sende til sig selv
    if (target._id.equals(req.user._id)) {
      return res.status(400).json({ message: 'Du kan ikke sende en anmodning til dig selv' });
    }

    const alreadyRequested = target.friendRequests.includes(req.user._id);
    const alreadyFriends = target.friends.includes(req.user._id);

    if (alreadyRequested || alreadyFriends) {
      return res.status(400).json({ message: 'Allerede sendt eller allerede venner' });
    }

    target.friendRequests.push(req.user._id);
    await target.save();

    res.json({ message: `Anmodning sendt til ${target.username}` });
  } catch (err) {
    res.status(500).json({ message: 'Fejl ved afsendelse af anmodning' });
  }
});

// POST – accepter venneanmodning
router.post('/accept/:username', async (req, res) => {
  try {
    const requester = await User.findOne({ username: req.params.username });
    if (!requester) return res.status(404).json({ message: 'Bruger ikke fundet' });

    const user = await User.findById(req.user._id);
    const alreadyRequested = user.friendRequests.includes(requester._id);
    if (!alreadyRequested) return res.status(400).json({ message: 'Ingen anmodning fra denne bruger' });

    // Fjern anmodning
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requester._id.toString());

    // Tilføj hinanden som venner (dobbeltsidet)
    if (!user.friends.includes(requester._id)) user.friends.push(requester._id);
    if (!requester.friends.includes(user._id)) requester.friends.push(user._id);

    await user.save();
    await requester.save();

    res.json({ message: `Du er nu venner med ${requester.username}` });
  } catch (err) {
    res.status(500).json({ message: 'Fejl ved accept af anmodning' });
  }
});

// GET – søgning for brugere
router.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.json([]);

    const users = await User.find({
      username: { $regex: query, $options: 'i' },
      _id: { $ne: req.user._id } // undgå at finde sig selv
    }).limit(5).select('username');

    res.json(users);
  } catch (err) {
    console.error('[GET /friends/search] Fejl:', err);
    res.status(500).json({ message: 'Fejl ved søgning' });
  }
});

// DELETE – fjern en ven
router.delete('/:username', async (req, res) => {
  try {
    const target = await User.findOne({ username: req.params.username });
    if (!target) return res.status(404).json({ message: 'Bruger ikke fundet' });

    const user = await User.findById(req.user._id);

    user.friends = user.friends.filter(id => id.toString() !== target._id.toString());
    target.friends = target.friends.filter(id => id.toString() !== user._id.toString());

    await user.save();
    await target.save();

    res.json({ message: `Du er ikke længere venner med ${target.username}` });
  } catch (err) {
    console.error('[DELETE /friends/:username] Fejl:', err);
    res.status(500).json({ message: 'Fejl ved fjernelse af ven' });
  }
});


export default router;
