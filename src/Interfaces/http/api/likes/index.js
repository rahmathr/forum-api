const express = require('express');
const handler = require('./handler');

const router = express.Router();
router.put('/threads/:threadId/comments/:commentId/likes', handler.putLikeHandler);

module.exports = router;