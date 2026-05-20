const pool = require("../config/database");

// Obtener todos
const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM "Usuarios"');
    return result.rows;
};

// Obtener por ID
const getUserById = async (id_usuario) => {
    const result = await pool.query(
        'SELECT * FROM "Usuarios" WHERE id_usuario = $1',
        [id_usuario]
    );

    return result.rows[0];
};

// Crear usuario
const createUser = async ( nombre_usuario,apellido_usuario, email_usuario, telefono_usuario, password_usuario, estado_usuario) => {
    const result = await pool.query(
        `INSERT INTO "Usuarios" ( nombre_usuario, apellido_usuario, email_usuario, telefono_usuario, password_usuario, estado_usuario)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [nombre_usuario, apellido_usuario, email_usuario, telefono_usuario, password_usuario, estado_usuario]
    );

    return result.rows[0];
};

// Actualizar usuario
const updateUser = async (nombre_usuario,  apellido_usuario,email_usuario, telefono_usuario, password_usuario, estado_usuario, id_usuario) => {
    const result = await pool.query(
        `UPDATE "Usuarios"
         SET nombre_usuario = $1,
             apellido_usuario = $2,
             email_usuario = $3,
             telefono_usuario = $4,
             password_usuario = $5,
             estado_usuario = $6
         WHERE id_usuario = $7
         RETURNING *`,
        [nombre_usuario, apellido_usuario, email_usuario,  telefono_usuario, password_usuario, estado_usuario, id_usuario]
    );

    return result.rows[0];
};

// Eliminar usuario
const deleteUser = async (id_usuario) => {
    const result = await pool.query(
        `DELETE FROM "Usuarios"
         WHERE id_usuario = $1
         RETURNING *`,
        [id_usuario]
    );

    return result.rows[0];
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};