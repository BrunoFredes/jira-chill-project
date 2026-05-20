const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require("../models/user.models");


// GET ALL
const getUsersService = async () => {
    return await getAllUsers();
};


// GET BY ID
const getUserByIdService = async (id) => {
    return await getUserById(id);
};


// CREATE
const createUserService = async (
    nombre_usuario,
    apellido_usuario,
    email_usuario,
    telefono_usuario,
    password_usuario,
    estado_usuario
) => {
    return await createUser(
        nombre_usuario,
        apellido_usuario,
        email_usuario,
        telefono_usuario,
        password_usuario,
        estado_usuario
    );
};


// UPDATE
const updateUserService = async (
    nombre_usuario,
    apellido_usuario,
    email_usuario,
    telefono_usuario,
    password_usuario,
    estado_usuario,
    id
) => {
    return await updateUser(
        nombre_usuario,
        apellido_usuario,
        email_usuario,
        telefono_usuario,
        password_usuario,
        estado_usuario,
        id
    );
};


// DELETE
const deleteUserService = async (id) => {
    return await deleteUser(id);
};


// EXPORT CORRECTO
module.exports = {
    getUsersService,
    getUserByIdService,
    createUserService,
    updateUserService,
    deleteUserService
};