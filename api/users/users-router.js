const express = require('express');
const {validateUserId,
  validateUser,
  validatePost } = require('../middleware/middleware')
const Users = require('./users-model')
const Posts = require('../posts/posts-model')
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user)
});

router.post('/',validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.user)
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users.update(req.params.id, req.user)
    .then(updated => {
      Users.getById(req.params.id)
        .then(dbUser => {
          res.status(200).json(dbUser)
        })
        .catch(next)
    })
    .catch(next)
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  await Users.remove(req.params.id)
  try {
    res.status(200).json(req.user)
  } catch (err) {
    next(err)
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  const posts = await Users.getUserPosts(req.params.id)
  try {
    if(!posts) {
        res.status(404).json({
        message: 'user does not have any posts'
      })
    } else {
      res.status(200).json(posts)
    }
  } catch (err) {
    next(err)
  }
});


router.post('/:id/posts', validateUserId, validatePost,  async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const post = await Posts.insert({ 
      user_id: req.params.id, 
      text: req.text 
    })
    res.status(200).json(post)
  } catch (err) {
    next(err)
  }
})
// do not forget to export the router

module.exports = router;