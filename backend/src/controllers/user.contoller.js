const getUsers = (req, res) => {
  res.json({ 
    message: 'Controlador de usuarios funcionando desde el controlador' });
}
module.exports = {
  getUsers
}