const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');

// Route for rendering the signup form
router.get('/signup', (req, res) => {
    res.render('signup'); 
});

// Route for handling the signup form submission
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password, passcode } = req.body;

        if (passcode !== 'members_only_secret') {
            return res.status(400).send('Invalid passcode');
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });
        await newUser.save();

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route for rendering the login form
router.get('/login', (req, res) => {
    res.render('login', { message: req.flash('error') }); 
});

// Route for handling the login form submission
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
}));

// Route for handling logout
router.get('/logout', (req, res) => {
    req.logout(); // This function is provided by Passport.js to terminate a login session
    req.flash('success_msg', 'You have been logged out');
    res.redirect('/');
});

module.exports = router;
