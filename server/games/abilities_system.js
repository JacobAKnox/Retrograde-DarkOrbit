import { test_ability } from "./abilities";
import { get_game } from "./game";

export function get_ability_function(lobby_code, player_id) {
    const ability_map = Object.freeze({
        test: test_ability
    });
    
    const game = get_game(lobby_code);
    if (!game) {
        return undefined;
    }

    if (!game.players[player_id]) {
        return undefined;
    }

    const ability_id = game.players[player_id].ability;
    if (!ability_id || !ability_map[ability_id]) {
        return undefined;
    }

    return ability_map[ability_id];
}

export function use_ability(lobby_code, player_id, data) {
    const ability = get_ability_function(lobby_code, player_id);
    if (!ability) {
        return;
    }
    ability(lobby_code, player_id, data);
}
