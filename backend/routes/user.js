const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Router = express.Router();
const User = require('./../models/user');


Router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {

      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(createdUser => {
          console.log(createdUser);
          res.status(201).json({
            message: 'User created successfully!!',
            user: createdUser
          });
        })
        .catch(error => {
          console.log(error);
        });
    });

});


Router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {

        console.log('User not authenticated');

        return res.status(401).json({
          message: 'User not found!!'
        });
      }
      fetchedUser= user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        console.log('User not authenticated');

        return res.status(401).json({
          message: 'User Authentication failed!!'
        });
      }
      //json web token create
      const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, 'j_lekheni_hunxa_but_it_must_be_long',
        { expiresIn: '1h' });
      console.log('User  authenticated');

      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        message: 'User authenticated succesfully!'
      });
    }).
    catch(error => {
      console.log('User not authenticated');

      return res.status(401).json({
        message: 'User Authentication failed!!'
      });
    });
});




module.exports = Router;
