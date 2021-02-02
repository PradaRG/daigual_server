const redis = require("redis");

const cliente = redis.createClient({
  port: 6379,
  host: "127.0.0.1"
});

cliente.on("connect", () => {
  console.log("Conectado a Redis");
});

cliente.on('ready', ()=> {
  console.log('Client conectado y listo para usar')
})

cliente.on("error", (err) => {
  console.log(err.message);
});

cliente.on("end", () => {
  console.log("Cliente desconectado de Redis");
});

process.on("SIGINT", () => {
  cliente.quit();
});

module.exports = cliente;
