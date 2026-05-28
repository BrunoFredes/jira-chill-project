const {
    createSala,
    updateUserSala,
    getMySala,
    getSalaByCode,
    getUsersBySala
} = require("../models/salas.models");

// CREATE SALAS SERVICE
const createSalaService = async (
    nombre_sala,
    creador_sala
) => {

    // generar código
    const codigo_sala = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    // crear sala
    const sala = await createSala(
        nombre_sala,
        codigo_sala,
        creador_sala
    );

    // actualizar usuario
    await updateUserSala(
        creador_sala,
        sala.id_sala
    );

    // devolver sala
    return sala;
};
// GET MY SALA SERVICE
const getMySalaService = async (
    id_usuario
) => {

    return await getMySala(id_usuario);
};
// JOIN SALA SERVICE
const joinSalaService = async (
    codigo_sala,
    id_usuario
) => {
//buscar sala por código
const sala = await getSalaByCode(codigo_sala);
    //verificar que la sala exista
    console.log(codigo_sala);
    console.log(sala);
    if (!sala) {
        throw new Error("Sala no encontrada");
    }
    //actualizar usuario con id_sala
    await updateUserSala(
        id_usuario,
        sala.id_sala
    );
    return sala;
}
// GET USERS FROM SALA SERVICE
// GET USERS FROM SALA SERVICE
const getUsersBySalaService = async (id_sala) => {

    return await getUsersBySala(id_sala);

};
module.exports = {
    createSalaService,
    getMySalaService,
    joinSalaService,
    getUsersBySalaService,
};