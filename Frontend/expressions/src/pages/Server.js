// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./User');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/Logs");
app.listen(3001, () => {
    console.log("Server is running on port 3001");
})


app.post ("login", (req, res) => {
    const {username, password} = req.body;
    UserModel.findOne({username: username})
    .then(user =>{
        if(user){
            if(user.password == password){
                res.json("Success")
        }else{
            res.json("Password is incorrect")
        }
    }else{
        res.json("User does not exist")
    
    }

    })


})

app.post('/register', (req, res) => {
  UserModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err))
});
