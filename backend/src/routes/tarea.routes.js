const express = require('express');
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    updateEstadoTask,
    deleteTask,
    assignTaskController
} = require('../controllers/tarea.controller');

// GET ALL
router.get('/', authMiddleware, getTasks);

// GET BY ID
router.get('/:id', authMiddleware, getTaskById);

// CREATE
router.post('/', authMiddleware, createTask);

// UPDATE
router.put('/:id', authMiddleware, updateTask);

// UPDATE ESTADO
router.put(
  '/:id/estado',
  authMiddleware,
  updateEstadoTask
);

// ASSIGN USER
router.put(
  '/:id/assign',
  authMiddleware,
  assignTaskController
);

// DELETE
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router;