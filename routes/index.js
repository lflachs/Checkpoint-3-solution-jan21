const router = require('express').Router();
const albumRoutes = require('./album.routes');

router.use('/albums', albumRoutes);

module.exports = router;
