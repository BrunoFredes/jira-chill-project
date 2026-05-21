const {
    getUserByEmail
} = require("../models/auth.models");




// GET BY EMAIL
const getUserByEmailService = async (email) => {
    return await getUserByEmail(email);
};




// EXPORT CORRECTO
module.exports = {
    getUserByEmailService
};