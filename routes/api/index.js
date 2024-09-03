const router = require('express').Router();
const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');


// Attaches user routes to '/users'
router.use('/users', userRoutes);


// Attaches thought routes to '/thoughts'
router.use('/thoughts', thoughtRoutes);


module.exports = router;