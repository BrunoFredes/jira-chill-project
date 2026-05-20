const {
    getUsersService,
    getUserByIdService,
    createUserService,
    updateUserService,
    deleteUserService
} = require("../services/user.service");
const bcrypt = require("bcrypt");

// GET ALL
const getUsers = async (req, res) => {
    try {
        const users = await getUsersService();
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET BY ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await getUserByIdService(id);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// CREATE
const createUser = async (req, res) => {
    try {

        console.log("🔥 CREATE USER: REQUEST RECIBIDA");

        const {
            nombre_usuario,
            apellido_usuario,
            email_usuario,
            telefono_usuario,
            password_usuario,
            estado_usuario
        } = req.body;
        const hashedPassword = await bcrypt.hash(password_usuario, 10);

        const newUser = await createUserService(
            nombre_usuario,
            apellido_usuario,
            email_usuario,
            telefono_usuario,
            hashedPassword,
            estado_usuario
        );

        console.log("✅ CREADO CORRECTAMENTE:");

        return res.status(201).json({
            ok: true,
            message: "Creado correctamente",
            data: newUser
        });

    } catch (error) {

        console.log("❌ ERROR AL CREAR:", error.message);

        return res.status(500).json({
            ok: false,
            message: "Error al crear usuario",
            error: error.message
        });
    }
};
// UPDATE
const updateUser = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            nombre_usuario,
            apellido_usuario,
            email_usuario,
            telefono_usuario,
            password_usuario,
            estado_usuario,
        } = req.body;
        const hashedPassword = await bcrypt.hash(password_usuario, 10);

        const updatedUser = await updateUserService(
            
            nombre_usuario,
            apellido_usuario,
            email_usuario,
            telefono_usuario,
            hashedPassword,
            estado_usuario,
            id
            
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        console.log("✏️ OK: Usuario actualizado");

        return res.json({
            ok: true,
            message: "Usuario actualizado correctamente",
            data: updatedUser
        });

    } catch (error) {

        console.log("❌ ERROR UPDATE:", error.message);

        return res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};
// DELETE
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await deleteUserService(id);

        if (!deletedUser) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        res.json({
            message: "Usuario eliminado",
            user: deletedUser
        });
        console.log("🗑️ OK: Usuario eliminado");

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
        console.log("❌ ERROR DELETE:", error.message);
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};