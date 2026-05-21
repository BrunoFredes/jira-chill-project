const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        // Obtener header Authorization
        const authHeader = req.headers.authorization;

        // Verificar si existe
        if (!authHeader) {
            return res.status(401).json({
                message: "Token no proporcionado"
            });
        }

        // Separar Bearer del token
        const token = authHeader.split(" ")[1];

        // Verificar token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Guardar datos del usuario en req
        req.user = decoded;

        // Continuar
        next();

    } catch (error) {

        return res.status(401).json({
            message: "Token inválido"
        });

    }

};

module.exports = authMiddleware;