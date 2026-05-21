const pool = require("../config/database");
// Obtener por email
const getUserByEmail = async (email_usuario) => {
    const result = await pool.query(
        'SELECT * FROM "Usuarios" WHERE email_usuario = $1',
        [email_usuario]
    );

    return result.rows[0];
};

module.exports = {
    getUserByEmail
};