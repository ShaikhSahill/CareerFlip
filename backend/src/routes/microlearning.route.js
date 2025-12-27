const express = require('express');
const { createMicrolearningContent } = require('../controller/microlearning.controller');

const router = express.Router();

router.post('/generate-content', createMicrolearningContent);
module.exports = router;