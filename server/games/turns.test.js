import { PHASE_STATES, PHASE_TIMINGS, PLAYER_INITIAL_POIS } from "./game_globals";
import { get_winners_from_role_win_conditions, get_winners_from_global_win_conditions } from "./turns";

import * as turns from "./turns";

const get_status_mock = jest.spyOn(require("./game.js"), "get_status_bars");
get_status_mock.mockImplementation((_) => {return "status"});

const get_game_mock = jest.spyOn(require("./game.js"), "get_game");
get_game_mock.mockImplementation((_) => { return {players: {}}});

const shuffle_pois_mock = jest.spyOn(require("./game.js"), "shuffle_pois");
shuffle_pois_mock.mockImplementation(() => {return PLAYER_INITIAL_POIS});

const automatic_status_bar_updates_mock = jest.spyOn(require("./game.js"), "automatic_status_bar_updates");
automatic_status_bar_updates_mock.mockImplementation((_) => {});

describe("turn phases and timings", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    test("phases", async () => {
        const sleep_mock = jest.fn(async () => {});

        let game = {    players: { "player": { username: "username", role: { type: "e_leader", win_condition:{ "crew": { min: 90, max: 100 }}}}},
                        currentState: {},
                        statusBars: {"crew": 5 },
                        pois: PLAYER_INITIAL_POIS};
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
        const date = new Date('2020-01-01');
        jest.useFakeTimers().setSystemTime(date);
        turns.set_timer_update_callback(update_timer_mock);
        turns.updateClientsPhase(PHASE_STATES.INFORMATION_PHASE, PHASE_TIMINGS.INFORMATION_PHASE_LENGTH, lobbyCode);
        expect(update_timer_mock).toHaveBeenCalledWith(PHASE_STATES.INFORMATION_PHASE, PHASE_TIMINGS.INFORMATION_PHASE_LENGTH, Date.now(), lobbyCode);
        turns.set_timer_update_callback(() => {});
    });

    test("should call status bar update during info phase", async () => {
        const lobbyCode = "testCode";
        const status_bar_mock = jest.fn(() => {});
       
        turns.set_status_bar_update(status_bar_mock);

        await turns.execute_turn({currentState: PHASE_STATES.INFORMATION_PHASE, players: {}}, lobbyCode, async () => {});
        expect(get_status_mock).toHaveBeenCalledWith(lobbyCode);
        
        turns.set_status_bar_update(() => {});
    });


    test("should call send ids and names during info phase", async () => {
        const lobbyCode = "testCode";
        const update_ids_names_mock = jest.fn(() => {});
        turns.set_ids_and_names_callback(update_ids_names_mock);
        await turns.execute_turn({currentState: PHASE_STATES.INFORMATION_PHASE, players: {}}, lobbyCode, async () => {});
        expect(update_ids_names_mock).toHaveBeenCalledWith(PLAYER_INITIAL_POIS, lobbyCode);
        
        turns.set_ids_and_names_callback(() => {});
    });

    test("should call automatic status updates during server processing", async () => {
        let game = {    players: { "player": { username: "username", role: { type: "e_leader", win_condition:{ "crew": { min: 90, max: 100 }}}}},
                        currentState: PHASE_STATES.SERVER_PROCESSING_PHASE,
                        statusBars: {"crew": 5 }};
        const lobbyCode = "testCode";
        await turns.execute_turn(game, lobbyCode, async () => {});
        expect(automatic_status_bar_updates_mock).toHaveBeenCalledWith(lobbyCode);
    });

    test("role specific win condition checking", () => {
        // no winners
        const game1 = {
            players: {
                "player1": {
                    username: "username1",
                    role: { 
                        win_condition: {
                            "crew":           { min: 5,  max: 20 },
                            "ship_health":    { min: 20, max: 100 },
                            "fuel":           { min: 80, max: 100 },
                            "life_support":   { min: 50, max: 100 },
                            "power":          { min: 30, max: 100 }},
                        group_name: "team-1",
                        type: "good" }},
                "player2": {
                    username: "username2",
                    role: { 
                        win_condition: {
                            "crew":           { min: 70, max: 100 },
                            "ship_health":    { min: 50, max: 100 },
                            "fuel":           { min: 90, max: 100 },
                            "life_support":   { min: 50, max: 100 },
                            "power":          { min: 45, max: 100 }},
                        group_name: "team-2",
                        type: "e_leader" }}},
            statusBars: {   "crew":           { value: 50 },
                            "ship_health":    { value: 50 },
                            "fuel":           { value: 50 },
                            "life_support":   { value: 50 },
                            "power":          { value: 50 }}};

        // evil team wins
        const game2 = {
            players: {
                "player1": {
                    username: "username1",
                    role: { 
                        win_condition: {
                            "crew":           { min: 5,  max: 20 },
                            "ship_health":    { min: 20, max: 100 },
                            "fuel":           { min: 80, max: 100 },
                            "life_support":   { min: 50, max: 100 },
                            "power":          { min: 30, max: 100 }},
                        group_name: "team-1",
                        type: "good" }},
                "player2": {
                    username: "evil_leader",
                    role: { 
                        win_condition: {
                            "crew":           { min: 70, max: 100 },
                            "ship_health":    { min: 50, max: 100 },
                            "fuel":           { min: 90, max: 100 },
                            "life_support":   { min: 50, max: 100 },
                            "power":          { min: 45, max: 100 }},
                        group_name: "evil_team",
                        type: "e_leader" }},
                "player3": {
                    username: "evil_minion",
                    role: {
                        type: "e_minion" }}},
            statusBars: {   "crew":           { value: 75 },
                            "ship_health":    { value: 80 },
                            "fuel":           { value: 95 },
                            "life_support":   { value: 50 },
                            "power":          { value: 50 }}};

        // a good guy wins
        const game3 = {
            players: {
                "player1": {
                    username: "username1",
                    role: { 
                        win_condition: {
                            "crew":           { min: 5,  max: 60 },
                            "ship_health":    { min: 20, max: 100 },
                            "fuel":           { min: 40, max: 100 },
                            "life_support":   { min: 50, max: 100 },
                            "power":          { min: 30, max: 100 }},
                        group_name: "team-1",
                        type: "good" }},
                "player2": {
                    username: "username2",
                    role: { 
                        win_condition: {
                            "crew":           { min: 70, max: 100 },
                            "ship_health":    { min: 50, max: 100 },
                            "fuel":           { min: 90, max: 100 },
                            "life_support":   { min: 50, max: 100 },
                            "power":          { min: 45, max: 100 }},
                        group_name: "team-2",
                        type: "e_leader" }}},
            statusBars: {   "crew":           { value: 50 },
                            "ship_health":    { value: 50 },
                            "fuel":           { value: 50 },
                            "life_support":   { value: 50 },
                            "power":          { value: 50 }}};

        const result1 = get_winners_from_role_win_conditions(game1);
        const result2 = get_winners_from_role_win_conditions(game2);
        const result3 = get_winners_from_role_win_conditions(game3);
        expect(result1).toEqual({ team: "", names: [] });
        expect(result2).toEqual({ team: "evil_team", names: ["evil_leader", "evil_minion"] });
        expect(result3).toEqual({ team: "team-1", names: ["username1"] });
    });

    test("global win condition checking", () => {
        // no winning team
        const game1 = {
            players: {
                "player1": {
                    username: "username1",
                    role: {
                        win_group: "good",
                        group_name: "heros"}},
                "player2": {
                    username: "username2",
                    role: {
                        win_group: "evil",
                        group_name: "vilians"}}},
            statusBars: {   "crew":           { value: 50 },
                            "ship_health":    { value: 50 },
                            "fuel":           { value: 50 },
                            "life_support":   { value: 50 },
                            "power":          { value: 50 }}};

        // crew at 0, evil team wins
        const game2 = {
            players: {
                "player1": {
                    username: "username1",
                    role: {
                        win_group: "good",
                        group_name: "heros"}},
                "player2": {
                    username: "username2",
                    role: {
                        win_group: "evil",
                        group_name: "vilians"}},
                "player3": {
                    username: "username3",
                    role: {
                        win_group: "evil",
                        group_name: "vilians"}}},
            statusBars: {   "crew":           { value: 0 },
                            "ship_health":    { value: 50 },
                            "fuel":           { value: 50 },
                            "life_support":   { value: 50 },
                            "power":          { value: 50 }}};

        const result1 = get_winners_from_global_win_conditions(game1);
        const result2 = get_winners_from_global_win_conditions(game2);
        expect(result1).toEqual({ team: "", names: [] });
        expect(result2).toEqual({ team: "vilians", names: ["username2", "username3"] });
    });
});
