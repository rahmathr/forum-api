const express = require('express');
const handler = require('./handler');

const router = express.Router();
router.post('/users', handler.postUserHandler);

module.exports = router;