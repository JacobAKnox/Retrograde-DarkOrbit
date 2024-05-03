import { PHASE_STATES, PHASE_TIMINGS, PLAYER_INITIAL_POIS } from "./game_globals";
import { win_conditions_check, get_winners } from "./turns";

import * as turns from "./turns";

const get_status_mock = jest.spyOn(require("./game.js"), "get_status_bars");
get_status_mock.mockImplementation((_) => {return "status"});

const get_game_mock = jest.spyOn(require("./game.js"), "get_game");
get_game_mock.mockImplementation((_) => { return {players: {}}});

describe("turn phases and timings", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    test("phases", async () => {
        const sleep_mock = jest.fn(async () => {});

        let game = {    players: { "player": { username: "username", role: { win_condition:{ "crew": { min: 90, max: 100 }}}}},
                        currentState: {},
                        statusBars: {"crew": 5 }};
        const phases = [PHASE_STATES.GAME_SETUP_PHASE,
                        PHASE_STATES.INFORMATION_PHASE,
                        PHASE_STATES.DISCUSSION_PHASE,
                        PHASE_STATES.ACTION_PHASE,
                        PHASE_STATES.SERVER_PROCESSING_PHASE,
                        PHASE_STATES.GAME_OVER_PHASE];
        let resultingPhases = [];

        async function doTurn(phase) {
            game.currentState = phase;
            await turns.execute_turn(game, "", sleep_mock);
            resultingPhases.push(game.currentState);
        }

        for(const phase of phases) {
            await doTurn(phase);
        }

        const expectedPhases = ["Information phase", "Discussion phase", "Action phase", "Server processing", "Information phase", PHASE_STATES.GAME_OVER_PHASE];

        expect(resultingPhases).toEqual(expectedPhases);
    });

    test("timings", async () => {
        const sleep_mock = jest.fn(async () => {});
        const lobbyCode = "TestLobbyCode";
        let game = {    players: { "player": { username: "username", role: { win_condition:{}}}},
                        currentState: {},
                        statusBars: {}};

        game.currentState = PHASE_STATES.INFORMATION_PHASE;
        await turns.execute_turn(game, lobbyCode, sleep_mock);
        expect(sleep_mock).toHaveBeenCalledWith(PHASE_TIMINGS.INFORMATION_PHASE_LENGTH);

        game.currentState = PHASE_STATES.DISCUSSION_PHASE;
        await turns.execute_turn(game, lobbyCode, sleep_mock);
        expect(sleep_mock).toHaveBeenCalledWith(PHASE_TIMINGS.DISCUSSION_PHASE_LENGTH);

        game.currentState = PHASE_STATES.ACTION_PHASE;
        await turns.execute_turn(game, lobbyCode, sleep_mock);
        expect(sleep_mock).toHaveBeenCalledWith(PHASE_TIMINGS.ACTION_PHASE_LENGTH);

        game.currentState = PHASE_STATES.GAME_OVER_PHASE;
        await turns.execute_turn(game, lobbyCode, sleep_mock);
        expect(sleep_mock).toHaveBeenCalledWith(PHASE_TIMINGS.GAME_OVER_PHASE_LENGTH);
    });

    test("should call updateTimer with the correct parameters", () => {
        const lobbyCode = "testCode";
        const update_timer_mock = jest.fn(() => {});
        turns.set_timer_update_callback(update_timer_mock);
        turns.updateClientsPhase(PHASE_STATES.INFORMATION_PHASE, PHASE_TIMINGS.INFORMATION_PHASE_LENGTH, lobbyCode);
        expect(update_timer_mock).toHaveBeenCalledWith(PHASE_STATES.INFORMATION_PHASE, PHASE_TIMINGS.INFORMATION_PHASE_LENGTH, lobbyCode);
        turns.set_timer_update_callback(() => {});
    });

    test("should call status bar update during info phase", async () => {
        const lobbyCode = "testCode";
        const status_bar_mock = jest.fn(() => {});
       
        turns.set_status_bar_update(status_bar_mock);

        await turns.execute_turn({currentState: PHASE_STATES.INFORMATION_PHASE}, lobbyCode, async () => {});
        expect(get_status_mock).toHaveBeenCalledWith(lobbyCode);
        
        turns.set_status_bar_update(() => {});
    });


    test("should call send ids and names during info phase", async () => {
        const lobbyCode = "testCode";
        const update_ids_names_mock = jest.fn(() => {});
        turns.set_ids_and_names_callback(update_ids_names_mock);
        await turns.execute_turn({currentState: PHASE_STATES.INFORMATION_PHASE}, lobbyCode, async () => {});
        expect(update_ids_names_mock).toHaveBeenCalledWith(PLAYER_INITIAL_POIS, lobbyCode);
        
        turns.set_ids_and_names_callback(() => {});
    });

    test("win condition checking", () => {
        // no winners
        const game1 = {
            players: {
                "player1": {
                    username: "username1",
                    role: { 
                        win_condition: {
                            "crew":           { min: 5,  max: 20 },
                            "ship_health":    { min: 20, max: 100},
                            "fuel":           { min: 80, max: 100},
                            "life_support":   { min: 50, max: 100},
                            "power":          { min: 30, max: 100}}}},
                "player2": {
                    username: "username2",
                    role: { 
                        win_condition: {
                            "crew":           { min: 70, max: 100},
                            "ship_health":    { min: 50, max: 100},
                            "fuel":           { min: 90, max: 100},
                            "life_support":   { min: 50, max: 100},
                            "power":          { min: 45, max: 100}}}}},
            statusBars: {   "crew":           { value: 50 },
                            "ship_health":    { value: 50 },
                            "fuel":           { value: 50 },
                            "life_support":   { value: 50 },
                            "power":          { value: 50 }}};

        // player 2 is a winner
        const game2 = {
            players: {
                "player1": {
                    username: "username1",
                    role: { 
                        win_condition: {
                            "crew":           { min: 5,  max: 20 },
                            "ship_health":    { min: 20, max: 100},
                            "fuel":           { min: 80, max: 100},
                            "life_support":   { min: 50, max: 100},
                            "power":          { min: 30, max: 100}}}},
                "player2": {
                    username: "username2",
                    role: { 
                        win_condition: {
                            "crew":           { min: 70, max: 100},
                            "ship_health":    { min: 50, max: 100},
                            "fuel":           { min: 90, max: 100},
                            "life_support":   { min: 50, max: 100},
                            "power":          { min: 45, max: 100}}}}},
            statusBars: {   "crew":           { value: 75 },
                            "ship_health":    { value: 80 },
                            "fuel":           { value: 95 },
                            "life_support":   { value: 50 },
                            "power":          { value: 50 }}};

        const result1 = get_winners(game1);
        const result2 = get_winners(game2);
        expect(result1).toEqual({});
        expect(result2).toEqual({"player2": "username2"});
    });
});