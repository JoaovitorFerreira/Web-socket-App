const { stringify } = require("querystring");
const WebSocket = require("ws");
const simulateStock = require("./stock.js");
const chatWebSocket = new WebSocket.Server({ noServer: true });
const stockWebSocket = new WebSocket.Server({ noServer: true });
const server = require("http").createServer();

let stockPrice = { price: 1000.22, stockStatus: "+", newPrice: 0 };
let sockets = [];
let stockInterval;
let messageReq = {
  UserData: { cmd: "", wallet: 0, userBoughtOrSold: false },
  StockPrice: stockPrice,
};

chatWebSocket.on("connection", function connection(ws) {
  console.log("iniciado o websocket de chat");
  if (sockets.find((el) => el == ws) === undefined) sockets.push(ws);
  console.log("usuarios no chat:", sockets.length);
  ws.on("message", function incoming(data) {
    const message = JSON.parse(data);
    console.log(message);
    chatWebSocket.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  });
  ws.on("close", () => {
    ws.send("usuario desconectou do chat");
    sockets = sockets.filter((s) => s !== ws);
  });
});

stockWebSocket.on("connection", function connection(ws) {
  console.log("iniciado o websocket de stockPrices");
  ws.on("message", (data) => {
    let userData = JSON.parse(data);
    switch (userData.cmd) {
      case "buy":
        messageReq = {
          StockPrice: stockPrice,
          UserData: {
            cmd: "",
            wallet: userData.wallet - stockPrice.price,
            boughtOrSold: true,
          },
        };
        ws.send(JSON.stringify(messageReq));
        break;
      case "sell":
        messageReq = {
          StockPrice: stockPrice,
          UserData: {
            cmd: "",
            wallet: userData.wallet + stockPrice.price,
            boughtOrSold: true,
          },
        };
        ws.send(JSON.stringify(messageReq));
        break;
      default:
        break;
    }
  });

  stockInterval = setInterval(() => {
    const { price, stockStatus, newPrice } = simulateStock(2.5);
    stockPrice = { price, stockStatus, newPrice };
    messageReq = {
      ...messageReq,
      StockPrice: stockPrice,
    };
    ws.send(JSON.stringify(messageReq));
  }, 5000);

  ws.on("close", () => {
    if (stockInterval) {
      clearInterval(stockInterval);
    }
    messageReq = {
      UserData: { cmd: "", wallet: 0, userBoughtOrSold: false },
      StockPrice: stockPrice,
    };
    console.log("usuario desconectou");
  });
});

server.on("upgrade", function upgrade(request, socket, head) {
  const { pathname } = require("url").parse(request.url);
  if (pathname === "/") {
    chatWebSocket.handleUpgrade(request, socket, head, function done(ws) {
      chatWebSocket.emit("connection", ws, request);
    });
  } else if (pathname === "/stockPrice") {
    stockWebSocket.handleUpgrade(request, socket, head, function done(ws) {
      stockWebSocket.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(8080);
