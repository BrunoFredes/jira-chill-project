const pool = require("../config/database");

// CREATE SALAS
const createSala = async (
    nombre_sala,
    codigo_sala,
    creador_sala
) => {

    const result = await pool.query(
        `INSERT INTO "Salas"
        (nombre_sala, codigo_sala, creador_sala)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [nombre_sala, codigo_sala, creador_sala]
    );

    return result.rows[0];
};
// UPDATE SALAS
const updateUserSala = async (
    id_usuario,
    id_sala
) => {

    const result = await pool.query(
        `UPDATE "Usuarios"
        SET id_sala = $1
        WHERE id_usuario = $2
        RETURNING *`,
        [id_sala, id_usuario]
    );

    return result.rows[0];
};
// GET MY SALA
const getMySala = async (id_usuario) => {

    const result = await pool.query(
        `SELECT s.*
        FROM "Salas" s
        JOIN "Usuarios" u
        ON s.id_sala = u.id_sala
        WHERE u.id_usuario = $1`,
        [id_usuario]
    );

    return result.rows[0];
};
// GET SALA BY CODE

const getSalaByCode = async (
    codigo_sala
) => {

    const result = await pool.query(
        `SELECT *
        FROM "Salas"
        WHERE codigo_sala = $1`,
        [codigo_sala]
    );

    return result.rows[0];
};

const getUsersBySala = async (id_sala) => {

    const result = await pool.query(
        `
        SELECT *
        FROM "Usuarios"
        WHERE id_sala = $1
        `,
        [id_sala]
    );

    return result.rows;
};

module.exports = {
    createSala,
    updateUserSala,
    getMySala,
    getSalaByCode,
    getUsersBySala
};