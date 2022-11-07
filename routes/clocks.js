const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const socketEmit = requre('../index');

const Clock = require('../models/Clock');

const emitAllClocks = async () => {
    let clocks = await Clock.find();
    socketEmit('clocks', clocks);
}

// @route   POST api/clocks
// @desc    Create/Update a clock
// @access  Private
router.post(
    '/',
    [
        auth,
        [
           check('name', 'Name is required').not().isEmpty(),
        ]
    ],
    async (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
       
        const {name, value, size} = req.body;

        const clockFields = {};
        clockFields.name = name;
        if (value) clockFields.value = value;
        if (size) clockFields.size = size;

        try {
            let clock = await Clock.findOne({ name: req.name });

            if (clock) {
                clock = await Clock.findOneAndUpdate(
                    { name: req.name },
                    { $set: clockFields },
                    { new: true }
                );
                
                await emitAllClocks();

                return res.json(clock);
            }

            clock = new Clock(clockFields);

            await clock.save();

            await emitAllClocks();
            
            return res.json(clock);
        } catch (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }
    }
);

// @route   DELETE api/clocks
// @desc    Delete clock
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        await Clock.findOneAndRemove({ name: req.name });
        
        return res.json({ msg: 'Clock deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
});

module.exports = router;