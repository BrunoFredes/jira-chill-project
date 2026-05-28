const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
    createSala,
    getMySala,
    joinSala,
    getUsersFromMySala
} = require("../controllers/salas.controller");


// CREATE SALA
router.post(
    "/create",
    authMiddleware,
    createSala
);

// GET MY SALA
router.get(
    "/me",
    authMiddleware,
    getMySala
);
// JOIN SALA
router.post(
    "/join",
    authMiddleware,
    joinSala
);

//GET USERS FROM SALA 
router.get(
  "/me/users",
  authMiddleware,
  getUsersFromMySala
);


module.exports = router;