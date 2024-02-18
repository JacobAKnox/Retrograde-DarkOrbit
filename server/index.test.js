const ioc = require("socket.io-client");
const {closeServer} = require("./index")

describe("retrograde-darkorbit socket.io server test", () => {
  let clientSocket;

  beforeAll((done) => {
    clientSocket = ioc(`http://localhost:4000`);
    clientSocket.on("connect", done);
  });

  afterAll(() => {
    clientSocket.disconnect();
    closeServer();
  });

  test("join confirmation", async () => {
    const result = await clientSocket.emitWithAck('join' , {code: "ABCD", username: "test"});
    expect(result.status).toBe(200);
  });
});
