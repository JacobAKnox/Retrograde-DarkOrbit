import { test_ability, increaseStatusBar, decreaseStatusBar } from "./abilities";
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

export function use_ability(lobby_code, player_id, abilityName, data) {
    const ability = get_ability_function(lobby_code, player_id);
    if (!ability) {
        console.log("Ability function not found.");
        return;
    }

    ability(data);

    const game = get_game(lobby_code);
    if (!game) {
        console.log("Game not found.");
        return;
    }

    switch(abilityName) {
        case 'increaseCrew':
            increaseStatusBar(game, data.amount, 'crew');
            break;
        case 'decreaseCrew':
            decreaseStatusBar(game, data.amount, 'crew');
            break;
        case 'increaseHealth':
            increaseStatusBar(game, data.amount, 'health');
            break;
        case 'decreaseHealth':
            decreaseStatusBar(game, data.amount, 'health');
            break;
        case 'increaseFuel': 
            increaseStatusBar(game, data.amount, 'fuel');
            break;
        case 'decreaseFuel':
            decreaseStatusBar(game, data.amount, 'fuel');
            break;
        case 'increaseLifeSupport':
            increaseStatusBar(game, data.amount, 'life');
            break;
        case 'decreaseLifeSupport':
            decreaseStatusBar(game, data.amount, 'life');
            break;
        case 'increasePower':
            increaseStatusBar(game, data.amount, 'power');
            break;
        case 'decreasePower':
            decreaseStatusBar(game, data.amount, 'power');
            break;
        default:
            console.log("No such ability.");
            return;
    }

    console.log(`Ability used: ${abilityName} by ${player_id} with amount ${data.amount}`);
}

