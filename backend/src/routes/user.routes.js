const express = require('express');
const router = express.Router();

const { getUsers } = require('../controllers/user.contoller');

router.get('/', getUsers);

module.exports = router;