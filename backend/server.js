
const app = require("./src/app");
const port = 3000;


app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
app.get('/', (req, res) => {
  res.send('Jira Chill backend funcionando 🚀');
});