const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

// @route   GET api/auth
// @desc    Auth route
// @access  Private
router.get('/', auth, async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        return res.json(user);
    } catch(err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});

// @route   POST api/auth
// @desc    Login user
// @access  Public
router.post(
    '/',
    [
        check('email', 'Email is required').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({email});

            if (!user) {
                return res.status(400).json({
                    errors: [{msg: 'Invalid Credentials'}],
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    errors: [{msg: 'Invalid Credentials'}],
                });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

            const expire = process.env.NODE_ENV === 'development' ? 9999999999999999999999999 : 8 * 3600;
            
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                {
                    expiresIn: expire,
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }
);

module.exports = router;