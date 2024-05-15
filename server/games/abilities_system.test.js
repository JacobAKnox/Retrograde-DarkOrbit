import { test_ability, increaseStatusBar, decreaseStatusBar } from "./abilities.js";
import { get_ability_function, use_ability} from "./abilities_system.js";

const get_game_mock = jest.spyOn(require("./game.js"), "get_game");
get_game_mock.mockImplementation((lobby_code) => {
    return {
        players: {
            "id": {ability: "test"}
        },
        statusBars: {
            health: 50, 
            mana: 30 
        }
    };
});


const test_ability_mock = jest.spyOn(require("./abilities.js"), "test_ability");

describe("ability system", () => {

    beforeEach(() => {
        get_game_mock.mockClear();
        test_ability_mock.mockClear();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test("pick ability function", () => {
        const player_id = "id";
        const ab_func = get_ability_function("code", player_id);
        test_ability_mock.mockImplementation(() => {return "pass";});

        expect(ab_func()).toBe("pass");
    });

    test("get ability missing player", () => {
        const player_id = "not_here";
        const ab_func = get_ability_function("code", player_id);

        expect(ab_func).toBeUndefined();
    });

    test("get unknown ability", () => {
        const player_id = "id";
        get_game_mock.mockImplementation((_) => { return {players: {"id": {ability: "fake"}}}});
        const ab_func = get_ability_function("code", player_id);

        expect(ab_func).toBeUndefined();
        get_game_mock.mockImplementation((_) => { return {players: {"id": {ability: "test"}}}});
    });

    test("get and run ability function", () => {
        const lobby_code = "code";
        const player_id = "id";
        const test_data = { test_data: "test" };
        const abilityName = 'increaseHealth'; 
    
        use_ability(lobby_code, player_id, abilityName, test_data);
        console.log('Calling test_ability_mock with:', test_data);
    
        expect(test_ability_mock).toBeCalledWith(test_data);
    });
    
    

    test("use non-existant ability", () => {
        const player_id = "nothere";
        const code = "code";
        const test_data = {test_data: "test"};
        use_ability(code, player_id, test_data);

        expect(test_ability_mock).toHaveBeenCalledTimes(0);
    });

    test('increase status bar correctly', () => {
        const game = { statusBars: { health: 80 } };
        increaseStatusBar(game, 15, 'health');
        expect(game.statusBars['health']).toBe(95);
    });

    test('decrease status bar correctly', () => {
        const game = { statusBars: { health: 50 } };
        decreaseStatusBar(game, 30, 'health');
        expect(game.statusBars['health']).toBe(20);
    });

});
