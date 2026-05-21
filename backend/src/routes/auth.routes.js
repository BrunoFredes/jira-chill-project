const express = require('express');
const router = express.Router();

const {
    loginUser
} = require('../controllers/auth.controller');
// LOGIN
router.post('/login', loginUser);

module.exports = router;