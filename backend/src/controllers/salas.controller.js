const {
   createSalaService,
  
   getMySalaService,
   
   joinSalaService,
   getUsersBySalaService,
   
} = require("../services/salas.service");

// GET ALL
const getMySala = async (req, res) => {

    console.log(req.user); // Verificar que req.user esté disponible

    try {
        const sala = await getMySalaService(req.user.id);
        console.log("📋 SALA OBTENIDA:", sala);
        if (!sala) {

            return res.status(404).json({
                message: "Usuario sin sala"
            });

            }
        res.json(sala);
    } catch (error) {

        console.log("❌ ERROR OBTENIENDO SALA:", error.message);
        res.status(500).json({
            message: error.message
        });
    }
};
// CREATE
const createSala = async (req, res) => {
    try {

        console.log("🔥 CREATE SALA: REQUEST RECIBIDA");

        const {
            nombre_sala
        } = req.body;
        const creador_sala = req.user.id; // Asignar el ID del usuario autenticado como creador

        const newSala = await createSalaService(
            nombre_sala,
            creador_sala,
        );

        console.log("✅ CREADO CORRECTAMENTE:");

        return res.status(201).json({
            ok: true,
            message: "Sala creada correctamente",
            data: newSala
        });

    } catch (error) {

        console.log("❌ ERROR AL CREAR SALA:", error.message);

        return res.status(500).json({
            ok: false,
            message: "Error al crear sala",
            error: error.message
        });
    }
};
         
// JOIN SALA
const joinSala = async (
    req,
    res
) => {

    try {

        const { codigo_sala } = req.body;

        const sala = await joinSalaService(
            codigo_sala,
            req.user.id
        );

        res.json({
            ok: true,
            message: "Te uniste a la sala",
            data: sala
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            message: error.message
        });

    }

};
const getUsersFromMySala = async (req, res) => {

    try {

        const userId = req.user.id;

        const sala = await getMySalaService(
            userId
        );

        if (!sala) {

            return res.status(404).json({
                message: "El usuario no pertenece a ninguna sala"
            });

        }

        const users = await getUsersBySalaService(
            sala.id_sala
        );

        res.json(users);

    } catch (error) {

    console.log(error);

    res.status(500).json({
        message: error.message
    });

}

};


module.exports = {
    getMySala,
    createSala,
    joinSala,
    getUsersFromMySala
};