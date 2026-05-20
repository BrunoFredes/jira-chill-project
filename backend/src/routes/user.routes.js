const express = require('express');
const router = express.Router();

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/user.controller');

// GET ALL
router.get('/', getUsers);

// GET BY ID
router.get('/:id', getUserById);

// CREATE
router.post('/', createUser);

// UPDATE
router.put('/:id', updateUser);

// DELETE
router.delete('/:id', deleteUser);

module.exports = router;