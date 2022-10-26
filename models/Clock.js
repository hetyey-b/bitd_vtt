const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClockSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    value: {
        type: Number,
        default: 0,
    },
    size: {
        type: Number,
        default: 4,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Clock = mongoose.model('clock', ClockSchema);