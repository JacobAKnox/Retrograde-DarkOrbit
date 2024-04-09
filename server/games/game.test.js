import { assign_roles, get_role_info, roles, roles_by_player_count, start_game } from "./game";

describe("game service", () => {
    test("successful start", () => {
        let games = {};
        let lobby = {"usr1": {username: "usrnm1"}};

        const result = start_game(lobby, "code", games);

        expect(result.status).toBe(200);
        expect(games["code"].players).toEqual(lobby);
    });

    test("passed lobby with game already", () => {
        let games = {"code": {}};
        let lobby = {"usr1": {username: "usrnm1"}};

        const result = start_game(lobby, "code", games);

        expect(result.status).toBe(400);
        expect(result.message).toBe("Game with code 'code' already exists");
        expect(games["code"]).toEqual({});
    });

    test("assign roles to users", () => {
        let game = {players: {}};
        const users = 5
        for (let i = 1; i <= users; i++) {
            game.players[`usr${i}`] = {username: `usrnm${i}`};
        }
        const role = roles_by_player_count;
        const role_list = {"test1": {name: "test_role1", id: "test1"}, "test2": {name: "test_role2", id: "test2"}};;

        assign_roles(game, role_list, role);

        let role1_count = 0;
        let role2_count = 0;
        for (let i = 1; i <= users; i++) {
            expect(game.players[`usr${i}`].role).toBeDefined();
            switch(game.players[`usr${i}`].role.id) {
                case "test1":
                    role1_count++;
                    break;
                case "test2":
                    role2_count++;
                    break;
            }
        }

        expect(role1_count).toBe(4);
        expect(role2_count).toBe(1);
        expect(role.length).toBe(16);
    });

    test("get player role", () => {
        let game = {players: {"usr1": {role: {name: "test1", points: 10}}, "usr2": {role: {name: "test2", points: 10}}}};

        const result = get_role_info(game, "usr1");

        expect(result).toEqual({name: "test1", max_points: 10});
    });

    test("fail to get player role", () => {
        let game = {players: {"usr1": {}, "usr2": {role: {name: "test2"}}}};
        
        const result = get_role_info(game, "usr1");

        expect(result).toEqual({name: "Error Role", max_points: 0});
    });
});