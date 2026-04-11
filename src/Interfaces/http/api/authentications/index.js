const express = require('express');
const handler = require('./handler');

const router = express.Router();
router.post('/authentications', handler.postAuthenticationHandler);
router.put('/authentications', handler.putAuthenticationHandler);
router.delete('/authentications', handler.deleteAuthenticationHandler);

module.exports = router;