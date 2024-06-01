import {
    test_ability,
    increaseHealth,
    decreaseHealth,
    increaseCrew,
    decreaseCrew,
    increaseFuel,
    decreaseFuel,
    increasePower,
    decreasePower,
    increaseLifeSupport,
    decreaseLifeSupport,
    doctor_ability,
} from "./abilities.js";
import { get_game } from "./game.js";


export function get_ability_function(lobby_code, player_id) {
    const ability_map = Object.freeze({
        test: test_ability,
        increaseHealth: increaseHealth,
        decreaseHealth: decreaseHealth,
        increaseCrew: increaseCrew,
        decreaseCrew: decreaseCrew,
        increaseFuel: increaseFuel,
        decreaseFuel: decreaseFuel,
        increasePower: increasePower,
        decreasePower: decreasePower,
        increaseLifeSupport: increaseLifeSupport,
        decreaseLifeSupport: decreaseLifeSupport,
        doctor: doctor_ability
    });
    const game = get_game(lobby_code);
    if (!game || !game.players[player_id]) {
        return undefined;
    }
    const ability_id = game.players[player_id].role.ability;
    return ability_map[ability_id];
}

export function use_ability(lobby_code, player_id, data) {
    const ability = get_ability_function(lobby_code, player_id);
    if (!ability) {
        return;
    }
    ability(lobby_code, player_id, data);
}