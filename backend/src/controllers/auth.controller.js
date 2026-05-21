const {
    getUserByEmailService
    
   
} = require("../services/auth.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// LOGIN    
const loginUser = async (req, res) => {
    try {
        const { email_usuario, password_usuario } = req.body;

        const user = await getUserByEmailService(email_usuario);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        const isMatch = await bcrypt.compare(password_usuario, user.password_usuario);

        if (!isMatch) {
            return res.status(401).json({
                message: "Contraseña incorrecta"
            });
        }

        const token = jwt.sign(
            {
                id: user.id_usuario,
                email: user.email_usuario,
                rol: user.estado_usuario
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
            );
        const { password_usuario: hashedPassword, ...userWithoutPassword } = user;
        res.json({
            message: "Login exitoso",
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    loginUser
};