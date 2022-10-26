const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Hides the info that we are using Express from tools such as curl
app.disable('x-powered-by');

// Connect database
connectDB();

app.use(express.json({extended: false}));

app.get('/', (req,res) => res.send('API Running'));

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));