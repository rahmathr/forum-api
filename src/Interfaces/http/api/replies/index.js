const express = require('express');
const handler = require('./handler');

const router = express.Router();
router.post('/threads/:threadId/comments/:commentId/replies', handler.postReplyHandler);
router.delete('/threads/:threadId/comments/:commentId/replies/:replyId', handler.deleteReplyHandler);

module.exports = router;