import { assign_roles,
    get_role_info, 
    roles, 
    roles_by_player_count, 
    start_game, 
    validate_received_user_poi_values,
    set_player_POIs,
    get_player_POIs, 
    get_status_bars,
    get_status_bar_values ,
    delete_game,
    process_turn,
    automatic_status_bar_updates} from "./game.js";
import { PLAYER_INITIAL_POIS, get_new_status_bars, default_role_info, PER_PLAYER_POWER_INCREASE } from "./game_globals.js";

const get_num_players_mock = jest.spyOn(require("./../lobbies/lobbies.js"), "get_num_players");
get_num_players_mock.mockImplementation((_) => { return 10; });


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

    test("each turn status bar values update", () => {
      // Make a game
      let game_list = {}
      let game_code = 'ABCDEF'
      // Mock players
      let players = {
        1: {},
        2: {},
        3: {}
      }
      
      // Mock starting a game on lobby
      game_list[game_code] = {};
      game_list[game_code].players = players;
      game_list[game_code].statusBars = get_new_status_bars();
      // Get game status bars
      const init_status_bars = game_list[game_code].statusBars;
      // Check status bar initial values
      expect(init_status_bars).toEqual(get_new_status_bars());
      // Mock POI allocations
      game_list[game_code].players[1].pois = {
        '1': {allocated: 1},
        '2': {allocated: 2},
        '3': {allocated: 3}
      }
      game_list[game_code].players[2].pois = {
        '1': {allocated: 1},
        '2': {allocated: 2},
        '3': {allocated: 3}
      }
      game_list[game_code].players[3].pois = {
        '1': {allocated: 1},
        '2': {allocated: 2},
        '3': {allocated: 3}
      }
      // Process turn
      process_turn(game_code, game_list);
      // Get game status bars
      const updated_status_bars_1 = game_list[game_code].statusBars;
      // Check status bar updated values
      // Total point allocations: 1: 3, 2: 6, 3: 9
      expect(updated_status_bars_1).toEqual({
        "crew": {name: "Crew", value: 50+(3 * PLAYER_INITIAL_POIS[1].crew), max_value: 100},
        "ship_health": {name: "Ship Health", value: 50+(6 * PLAYER_INITIAL_POIS[2].ship_health), max_value: 100},
        "fuel": {name: "Fuel", value: 50+(9 * PLAYER_INITIAL_POIS[3].fuel), max_value: 100},
        "life_support": {name: "Life Support", value: 50, max_value: 100},
        "power": {name: "Power", value: 50, max_value: 100}
      });
      /// NEXT, test status bar upper bounds
      // Mock POI allocations
      game_list[game_code].players[1].pois = {
        '1': {allocated: 50},
        '2': {allocated: 0},
        '3': {allocated: 0}
      }
      game_list[game_code].players[2].pois = {
        '1': {allocated: 0},
        '2': {allocated: 50},
        '3': {allocated: 0}
      }
      game_list[game_code].players[3].pois = {
        '1': {allocated: 0},
        '2': {allocated: 0},
        '3': {allocated: 50}
      }
      // Process turn
      process_turn(game_code, game_list);
      // Get game status bars
      const updated_status_bars_2 = game_list[game_code].statusBars;
      //Check status bar updated values
      expect(updated_status_bars_2).toEqual({
        "crew": {name: "Crew", value: 100, max_value: 100},
        "ship_health": {name: "Ship Health", value: 100, max_value: 100},
        "fuel": {name: "Fuel", value: 100, max_value: 100},
        "life_support": {name: "Life Support", value: 50, max_value: 100},
        "power": {name: "Power", value: 50, max_value: 100}
      });
    });

    test("Power increase by a constant rate each round", () => {
      const game_list = {
        ABCD: {
          statusBars: get_new_status_bars()
        }
      }

      expect(game_list.ABCD.statusBars.power.value).toBe(50);

      automatic_status_bar_updates("ABCD", game_list);

      expect(game_list.ABCD.statusBars.power.value).toBe(50+(10*PER_PLAYER_POWER_INCREASE));
    });
});
