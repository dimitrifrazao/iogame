import express = require("express");
var path = require("path");
var http = require("http");

const app: express.Application = express();
var serv = http.Server(app);

const rooDir = path.resolve(__dirname, "../");
var indexPath = path.join(rooDir + "/client/index.html");
var gamePath = path.join(rooDir + "/client/game.html");
var clientPath = path.join(rooDir + "/client");

app.get("/", function (req, res) {
  res.sendFile(indexPath);
});

let PlayerNames = new Set<string>();
var queryName: string = "";
app.get("/start", function (req, res) {
  queryName = "";
  let name = req.query.name;
  if (typeof name === "string" && name.length !== 0 && !PlayerNames.has(name)) {
    res.sendFile(gamePath);
    queryName = name;
  } else {
    res.sendFile(indexPath);
  }
});

app.use("/client", express.static(clientPath));

const PORT = process.env.PORT || 3000;
serv.listen(PORT);
console.log("Server listening on port " + PORT);

import { Game } from "./mainGame/game";
import { World } from "./mainGame/world";
import { Player } from "./gameObjects/player";
import { DataPack } from "../shared/data";

Game.inst.Init();

const SOCKET_LIST = new Map<number, any>();
const NAME_LIST = new Map<number, string>();

var io = require("socket.io")(serv, {});
io.sockets.on("connection", function (socket: any) {
  console.log("socket connection!");
  console.log("id: " + socket.id);
  console.log("querryName = " + queryName);
  if (queryName.length === 0 || PlayerNames.has(queryName)) {
    queryName = "";
    socket.disconnect();
    return;
  }

  SOCKET_LIST.set(socket.id, socket);
  NAME_LIST.set(socket.id, queryName);
  PlayerNames.add(queryName);

  socket.emit("worldData", World.inst.GenerateDataPack());
  socket.emit("worldSize", World.inst.GetWorldSizeData());
  socket.emit("setPlayerId", { id: socket.id });

  console.log("Adding player: " + queryName);
  Game.inst.AddPlayer(socket.id, queryName, EmitDeadPlayer);

  socket.on("playerDir", function (data: any) {
    //console.log("press " + data.dir);
    Game.inst.SetPlayerDir(socket.id, data.dir);
  });

  socket.on("shoot", function (data: any) {
    //console.log("shoot");
    Game.inst.Shoot(socket.id, data.dir);
  });

  socket.on("dash", function (data: any) {
    //console.log("shoot");
    Game.inst.Dash(socket.id, data.dash);
  });

  socket.on("weaponChange", function (data: any) {
    Game.inst.ChangeWeapon(socket.id, data.type);
  });

  socket.on("ClientRequest", function (data: any) {
    Game.inst.ClientRequest(socket.id, data);
  });

  socket.on("disconnect", function () {
    let name = NAME_LIST.get(socket.id);
    if (name !== undefined) {
      console.log("disconnecting " + name);
      PlayerNames.delete(name);
    }
    Player.DeletePlayer(socket.id);
    NAME_LIST.delete(socket.id);
    SOCKET_LIST.delete(socket.id);
  });
});

var EmitDeadPlayer = function (dead_id: number, data: any) {
  SOCKET_LIST.forEach((socket, id) => {
    socket.emit("worldAddDeadBody", data);
  });
  let name = NAME_LIST.get(dead_id);
  if (name !== undefined) PlayerNames.delete(name);
  NAME_LIST.delete(dead_id);
  console.log("releasing name: " + name);
};

const FRAME_RATE = 50;
setInterval(function () {
  Game.inst.Tick();

  let pack: DataPack[] = [];
  try {
    pack = Game.inst.Update();
  } catch (error) {
    console.log("UPDATE ERROR");
    console.log(error);
  }

  SOCKET_LIST.forEach((socket, id) => {
    let player = Player.GetPlayer(socket.id);
    if (player !== null) socket.emit("cameraPos", { pos: player.GetPos() });
    socket.emit("update", pack);
  });
}, 1000 / FRAME_RATE);
