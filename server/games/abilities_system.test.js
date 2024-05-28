import { test_ability, useOnce } from "./abilities.js";
import { get_ability_function, use_ability } from "./abilities_system.js";

const get_game_mock = jest.spyOn(require("./game.js"), "get_game");

get_game_mock.mockImplementation((_) => {
    return {
        players: {
            "id": { role: { ability: "test" } },
            "id_health": { role: { ability: "increaseHealth" } },
            "id_health_decrease": { role: { ability: "decreaseHealth" } },
            "id_crew": { role: { ability: "increaseCrew" } },
            "id_crew_decrease": { role: { ability: "decreaseCrew" } },
            "id_fuel": { role: { ability: "increaseFuel" } },
            "id_fuel_decrease": { role: { ability: "decreaseFuel" } },
            "id_power": { role: { ability: "increasePower" } },
            "id_power_decrease": { role: { ability: "decreasePower" } },
            "id_life_support": { role: { ability: "increaseLifeSupport" } },
            "id_life_support_decrease": { role: { ability: "decreaseLifeSupport" } }
        },
        statusBars: {
            health: { value: 50 },
            crew: { value: 1 },
            fuel: { value: 50 },
            power: { value: 50 },
            life_support: { value: 50 }
        }
    };
});

const test_ability_mock = jest.spyOn(require("./abilities.js"), "test_ability");
//increase
const increaseHealth_mock = jest.spyOn(require("./abilities.js"), "increaseHealth"); 
const increaseCrew_mock = jest.spyOn(require("./abilities.js"), "increaseCrew");
const increaseFuel_mock = jest.spyOn(require("./abilities.js"), "increaseFuel"); 
const increasePower_mock = jest.spyOn(require("./abilities.js"), "increasePower");
const increaseLifeSupport_mock = jest.spyOn(require("./abilities.js"), "increaseLifeSupport"); 
//decrease
const decreaseHealth_mock = jest.spyOn(require("./abilities.js"), "decreaseHealth"); 
const decreaseCrew_mock = jest.spyOn(require("./abilities.js"), "decreaseCrew");
const decreaseFuel_mock = jest.spyOn(require("./abilities.js"), "decreaseFuel"); 
const decreasePower_mock = jest.spyOn(require("./abilities.js"), "decreasePower");
const decreaseLifeSupport_mock = jest.spyOn(require("./abilities.js"), "decreaseLifeSupport"); 




describe("ability system", () => {

    beforeEach(() => {
        jest.clearAllMocks(); 
        get_game_mock.mockClear();
        test_ability_mock.mockClear();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test("test increase health ability", () => {
        const player_id = "id_health";
        const code = "code";
        const test_data = { amount: 10 };
        use_ability(code, player_id, test_data);
        expect(increaseHealth_mock).toBeCalledWith(code, player_id, test_data);
    });

    test("test for decreaseHealth ability", () => {
        const player_id = "id_health_decrease";
        const code = "code";
        const test_data = { amount: 5 };
        use_ability(code, player_id, test_data);  
        expect(decreaseHealth_mock).toBeCalledWith(code, player_id, test_data);
    });

    test("test increase crew ability", () => {
        const player_id = "id_crew";
        const code = "code";
        const test_data = { amount: 3 };
             use_ability(code, player_id, test_data);
             expect(increaseCrew_mock).toBeCalledWith(code, player_id, test_data);
    });

    test("test decrease crew ability", () => {
        const player_id = "id_crew_decrease";
        const code = "code";
        const test_data = { amount: 2 };
        use_ability(code, player_id, test_data);
        expect(decreaseCrew_mock).toBeCalledWith(code, player_id, test_data);
    });

    test("test increase fuel ability", () => {
        const player_id = "id_fuel";
        const code = "code";
        const test_data = { amount: 20 };
        use_ability(code, player_id, test_data);
        expect(increaseFuel_mock).toBeCalledWith(code, player_id, test_data);
    });

    test("test decrease fuel ability", () => {
        const player_id = "id_fuel_decrease";
        const code = "code";
        const test_data = { amount: 15 };
        use_ability(code, player_id, test_data);
        expect(decreaseFuel_mock).toBeCalledWith(code, player_id, test_data);
    });

    test("test increase power ability", () => {
        const player_id = "id_power";
        const code = "code";
        const test_data = { amount: 15 };
        use_ability(code, player_id, test_data);
        expect(increasePower_mock).toBeCalledWith(code, player_id, test_data);
    });

    test("test decrease power ability", () => {
        const player_id = "id_power_decrease";
        const code = "code";
        const test_data = { amount: 10 };
        use_ability(code, player_id, test_data);
        expect(decreasePower_mock).toBeCalledWith(code, player_id, test_data);
    });

    test("test increase life support ability", () => {
        const player_id = "id_life_support";
        const code = "code";
        const test_data = { amount: 25 };
        use_ability(code, player_id, test_data);
        expect(increaseLifeSupport_mock).toBeCalledWith(code, player_id, test_data);
    });

    test("test decrease life support ability", () => {
        const player_id = "id_life_support_decrease";
        const code = "code";
        const test_data = { amount: 20 };
        use_ability(code, player_id, test_data);
        expect(decreaseLifeSupport_mock).toBeCalledWith(code, player_id, test_data);
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
        get_game_mock.mockImplementation((_) => { return {players: {"id": { role: { ability: "fake"}}}}});
        const ab_func = get_ability_function("code", player_id);

        expect(ab_func).toBeUndefined();
        get_game_mock.mockImplementation((_) => { return {players: {"id": { role: {ability: "test"}}}}});
    });

    test("get and run ability function", () => {
        const player_id = "id";
        const code = "code";
        const test_data = {test_data: "test"};
        use_ability(code, player_id, test_data);

        expect(test_ability_mock).toBeCalledWith(code, player_id, test_data);
    });

    test("use non-existant ability", () => {
        const player_id = "nothere";
        const code = "code";
        const test_data = {test_data: "test"};
        use_ability(code, player_id, test_data);

        expect(test_ability_mock).toHaveBeenCalledTimes(0);
    });

    test("use ability once", () => {
        const game_id = "game";
        const player_id = "plr";
        let game = {players: {
            plr: {
                role: {

                }
            }
        }};

        get_game_mock.mockImplementation((_) => {
            return game;
        });

        const action = jest.fn(() => {});
        useOnce(game_id, player_id, action);
        expect(action).toHaveBeenCalledTimes(1);
        useOnce(game_id, player_id, action);
        expect(action).toHaveBeenCalledTimes(1);
    });
});
