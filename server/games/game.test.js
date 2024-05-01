import { assign_roles,
    get_role_info, 
    roles, 
    roles_by_player_count, 
    start_game, 
    validate_received_user_poi_values,
    set_player_POIs,
    get_player_POIs, 
    get_status_bars,
    delete_game} from "./game.js";
import { PLAYER_INITIAL_POIS, default_role_info } from "./game_globals";

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
        const role_list = default_role_info;

        assign_roles(game, role_list, role);

        let role1_count = 0;
        let role2_count = 0;
        for (let i = 1; i <= users; i++) {
            expect(game.players[`usr${i}`].role).toBeDefined();
            switch(game.players[`usr${i}`].role.id) {
                case "crew":
                    role1_count++;
                    break;
                case "rebel":
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

        expect(result).toEqual({name: "test1", points: 10});
    });

    test("fail to get player role", () => {
        let game = {players: {"usr1": {}, "usr2": {role: {name: "test2"}}}};
        
        const result = get_role_info(game, "usr1");

        expect(result).toEqual({name: "Error Role", points: 0});
    });

    test("validate client-sent poi values", () => {
        const game = {players: {"player1": {role: {points: 10}}}};
        const userID = "player1";
        const BadPOIs = {
            "1": {name: "name1", allocated: 5},
            "2": {name: "name2", allocated: 5},
            "3": {name: "name3", allocated: 5}
        }
        const GoodPOIs = {
            "1": {name: "name1", allocated: 1},
            "2": {name: "name2", allocated: 2},
            "3": {name: "name3", allocated: 4}
        }

        const result1 = validate_received_user_poi_values(game, userID, BadPOIs);
        const result2 = validate_received_user_poi_values(game, userID, GoodPOIs);

        expect(result1).toEqual(false);
        expect(result2).toEqual(true);
    });

    test("set player POIs", () => {
        // POIs don't already exist in player object.
        // POIs exist but don't have same structure.
        // POIs exist and have same structure.
        const game1 = {players: {"player1": {}}};
        const game2 = {players: {"player1": {pois: {"1": {name: "name1", allocated: 0}}}}};
        const game3 = {players: {"player1": {pois: {"1": {name: "name1", allocated: 2},
                                                    "2": {name: "name2", allocated: 4},
                                                    "3": {name: "name3", allocated: 6}}}}};
        const userID = "player1";
        const POIs = {"1": {name: "name1", allocated: 1},
                      "2": {name: "name2", allocated: 2},
                      "3": {name: "name3", allocated: 3}};
        
        set_player_POIs(game1, userID, POIs);
        set_player_POIs(game2, userID, POIs);
        set_player_POIs(game3, userID, POIs);

        const game1_result = game1.players[userID].pois;
        const game2_result = game2.players[userID].pois;
        const game3_result = game3.players[userID].pois;

        expect(game1_result).toEqual(POIs);
        expect(game2_result).toEqual(POIs);
        expect(game3_result).toEqual(POIs);
    });

    test("get player POIs", () => {
        // Player object has no POIs.
        // Player object has POIs.
        const game1 = {players: {"player1": {}}};
        const game2 = {players: {"player1": {pois: {"1": {name: "name1", allocated: 1},
                                                    "2": {name: "name2", allocated: 2},
                                                    "3": {name: "name3", allocated: 3}}}}};
        const userID = "player1";
        const POIs = {"1": {name: "name1", allocated: 1},
                      "2": {name: "name2", allocated: 2},
                      "3": {name: "name3", allocated: 3}};

        const result1 = get_player_POIs(game1, userID);
        const result2 = get_player_POIs(game2, userID);

        expect(result1).toEqual(PLAYER_INITIAL_POIS);
        expect(result2).toEqual(POIs);
    });

    test("starting game adds status bars", () => {
        let games = {};
        let lobby = {"usr1": {username: "usrnm1"}};

        const result = start_game(lobby, "code", games);

        expect(result.status).toBe(200);
        expect(games["code"]["statusBars"]["crew"]).toBeDefined();
    });

    test("get status bars", () => {
        let games = {"code": { statusBars: "data" }};
        
        const result = get_status_bars("code", games);
        expect(result).toBe("data");
    });

    test("get status bars game not found", () => {
        let games = {};
        
        const result = get_status_bars("code", games);
        expect(result).toBeUndefined();
    });

    test("delete game when over", () => {
        let games = {code: {foo: ""}};

        delete_game("code", games);
        expect(games.code).toBeUndefined();
    });
});