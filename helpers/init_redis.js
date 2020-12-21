const redis = require("redis");

const cliente = redis.createClient();

cliente.on("connect", () => {
  console.log("connected to Redis");
});

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
