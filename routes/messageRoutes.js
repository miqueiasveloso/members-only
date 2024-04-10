const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Route for creating a new message
router.post('/messages/new', async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.redirect('/login');
        }

        const newMessage = new Message({
            title: req.body.title,
            text: req.body.text,
            author: req.user._id
        });

        await newMessage.save();

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route for deleting a message
router.post('/messages/delete/:id', async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.redirect('/login');
        }

        if (!req.user.isAdmin) {
            return res.status(403).send('Unauthorized');
        }

        await Message.findByIdAndDelete(req.params.id);

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
