const ioc = require("socket.io-client");
const {closeServer, io} = require("./index");

describe("retrograde-darkorbit socket.io server test", () => {
  let clientSocket;

  beforeEach((done) => {
    io.on("connection", (socket) => {
      socket.on("test_join", (code) => {
        socket.roomCode = code;
        socket.join(code);
      });
    });
    clientSocket = ioc(`http://localhost:4000`);
    clientSocket.on("connect", done);
  });

  afterAll(() => {
    clientSocket.disconnect();
    closeServer();
  });

  test("client disconnects", () => {
    let result = "";
    clientSocket.on("disconnect", () => {
        result = "client has disconnected";
      });
    clientSocket.disconnect();

    expect(result).toBe("client has disconnected");
  });

  test("join confirmation", async () => {
    const result = await clientSocket.emitWithAck("join" , {code: "ABCD", username: "test"});
    expect(result.status).toBe(200);
  });

  test("client sends chat message", async () => {
    clientSocket.emit("test_join", "FOO");
    const result = new Promise((resolve) => {
      clientSocket.once("receive chat msg", (data) => {
        resolve(data.message);
      });
    });

    clientSocket.emit("send chat msg", {message: "test"});
    expect((await result)).toBe("test");
  });

  //test player ready 
  // remove skip when test is implemented
  test.skip("Player toggles ready", done => {
    clientSocket.on("ready state updated", (data) => {
      expect(data.ready).toBe(true); // Assuming the initial state is false
      done();
    });
  
    clientSocket.emit("player_ready", { userID: "test-user" });
  });
});
