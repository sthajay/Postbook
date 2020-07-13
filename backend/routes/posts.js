const express = require('express');
const multer = require('multer');

const router = express.Router();
const checkAuth = require('./../middleware/check-auth');
const Post = require('./../models/post');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    //server.js ko context ma folder khojxa
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext)
  }
});

const img_type = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}
const store = multer.diskStorage({
  destination: (req, file, cb) => {
    const isvalid = img_type[file.mimetype];
    const error = new Error('error');
    if (isvalid) {
      error = null;
    }

  }
});

router.post('', checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });

  post.save()
    .then(createdPost => {
      console.log(createdPost);

      res.status(201).json({

        message: 'Post added successfully!',
        post: {
          ...createdPost,
          id: createdPost._id,

          //yo garnu ani ... garnu same
          // title:createdPost.title,
          // content: createdPost.content,
          // imagePath: createdPost.imagePath
        }
      });
    });
});


router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.
      skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(documents => {

      fetchedPosts = documents;
      return Post.count();
    }).then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully!!',
        posts: fetchedPosts,
        maxPosts: count
      });
    });
});

router.put('/:id', checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userid
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.nModified > 0) {

        res.status(200).json({
          message: 'Post updated successfully!!'
        });
      } else {

        res.status(401).json({
          message: 'User Unauthorized!!'
        });
      }
    })
});

router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).
    then(result => {
      if (result.n> 0) {

        res.status(200).json({
          message: 'Deletion successful!!'
        });
      } else {

        res.status(401).json({
          message: 'User Unauthorized!!'
        });
      }

    })
});

router.get('/:id', checkAuth, (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        console.log('Post yeah xa ', post);
        res.status(200).json({

          post: post,
          message: 'Post found!!'
        });
      } else {
        res.status(404).json({
          message: 'Post not Found!!',
          post: null
        });
      }
    });
});

module.exports = router;
