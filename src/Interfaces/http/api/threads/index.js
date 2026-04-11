const express = require('express');
const handler = require('./handler');

const router = express.Router();
router.post('/threads', handler.postThreadHandler);
router.get('/threads/:threadId', handler.getThreadDetailHandler);

module.exports = router;