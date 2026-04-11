const express = require('express');
const handler = require('./handler');

const router = express.Router();
router.post('/threads/:threadId/comments', handler.postCommentHandler);
router.delete('/threads/:threadId/comments/:commentId', handler.deleteCommentHandler);

module.exports = router;