import { start_game } from "./game";

describe("game service", () => {
    test("successful start", () => {
        let games = {};
        let lobby = {"usr1": {username: "usrnm1"}};

        const result = start_game(lobby, "code", games);

        expect(result.status).toBe(200);
        expect(games["code"]).toEqual(lobby);
    });

    test("passed lobby with game already", () => {
        let games = {"code": {}};
        let lobby = {"usr1": {username: "usrnm1"}};

        const result = start_game(lobby, "code", games);

        expect(result.status).toBe(400);
        expect(result.message).toBe("Game with code 'code' already exists");
        expect(games["code"]).toEqual({});
    });
});