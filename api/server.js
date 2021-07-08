const express = require('express');
const { logger } = require('../api/middleware/middleware')
const server = express();
const userRouter = require('./users/users-router');

// remember express by default cannot parse JSON in request bodies
server.use(express.json())
server.use(logger)
// global middlewares and the user's router need to be connected here
server.use('/api/users', userRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('*', (req, res) => {
  res.status(404).send(`
    <h2>Users API</h2>
    <p>Oops, can't find that!</p>
  `);
})

server.use((err, req, res, next) => { // eslint-disable-line
  console.log('err handling midd kicking in!', err.message)
  res.status(err.status || 500).json({
    custom: 'something exploded inside the app',
    message: err.message,
    stack: err.stack,
  })
});


module.exports = server;