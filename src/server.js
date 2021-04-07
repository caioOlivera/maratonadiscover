const express = require("express");
const server = express();
const routes = require("./routes");
const path = require("path");

//usando template engine (js no html)
server.set("view engine", "ejs");

//mudar a localizacao da pasta views
server.set("views", path.join(__dirname, "views"));

//habilitar  arquivos statics
server.use(express.static("public"));

//usar o req.body
// use eh usado para setar configs do servidor
// a funcao url encoded faz uma extensao da codificacao dos dados
server.use(express.urlencoded({ extend: true }));

//routes
server.use(routes);
server.listen(3000, () => console.log("rodando"));
