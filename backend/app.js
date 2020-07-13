const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/user');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/posts', postsRouter);
app.use('/api/user', usersRouter);


app.use('/images', express.static(path.join('backend/images')));

mongoose.connect("mongodb+srv://ajay:F2L8GknFjWPAWqLS@cluster0-9qnrw.mongodb.net/test"
  , { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connection successfull to Cloud MongoDB!!');
  }).catch((error) => {
    console.log(error);
    console.log('Connection Failed!!');
  });



module.exports = app;
