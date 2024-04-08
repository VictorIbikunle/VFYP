const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./User'); // Assuming you have a User model defined

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/Logs");
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Secret key for JWT
const secretKey = 'ibikunle';

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Find the user in MongoDB based on username and password
    UserModel.findOne({ username: username, password: password })
        .then(user => {
            if (user) {
                // Create a token with user information
                const token = jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: '1h' });

                res.json({ message: 'Login successful', token });
            } else {
                res.status(401).json({ message: 'Login failed' });
            }
        })
        .catch(error => {
            console.error('Error finding user:', error);
            res.status(500).json({ message: 'Internal server error' });
        });
});

// Example secure route
app.get('/secure', verifyToken, (req, res) => {
    // Token is verified, send some secure data
    res.json({ message: 'This is a secure route', user: req.user.username });
});

// Token verification middleware
function verifyToken(req, res, next) {
    // Check if the request contains a valid token
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token not provided' });
    }

    // Verify the token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Token is valid, store user information in the request for further use
        req.user = decoded;
        next();
    });
}
