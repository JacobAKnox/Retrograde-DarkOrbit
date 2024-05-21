import { get_game, get_status_bars } from "./game.js";
import { status_bar_update_callback } from "./turns.js";

export function test_ability() {}

export function doctor_ability(lobby_code, player_id, data) {
    const game = get_game(lobby_code);
    const role = game.players[player_id].role;
    if (!role || role.used) {
        return;
    }
    handleAbilityAction(lobby_code, player_id, {amount: 20}, increaseStatusBar, "life_support");
    status_bar_update_callback(lobby_code, get_status_bars(lobby_code));
    role.used = true;
}

export const increaseStatusBar = (game, amount, statusBarName) => {
    if (!game.statusBars) {
        game.statusBars = {};
    }
    game.statusBars[statusBarName].value = game.statusBars[statusBarName].value || 0;
    game.statusBars[statusBarName].value += amount;
    game.statusBars[statusBarName].value = Math.min(game.statusBars[statusBarName].value, 100); 
};

export const decreaseStatusBar = (game, amount, statusBarName) => {
    if (!game.statusBars) {
        game.statusBars = {};
    }
    game.statusBars[statusBarName].value = game.statusBars[statusBarName].value || 0;
    game.statusBars[statusBarName].value -= amount;
    game.statusBars[statusBarName].value = Math.max(game.statusBars[statusBarName].value, 0); 
};

function handleAbilityAction(lobby_code, player_id, data, action, statusBarName) {
    const game = get_game(lobby_code);
    if (!game || !game.players[player_id]) {
        console.log(`Game or player not found for ${statusBarName}`);
        return;
    }
    action(game, data.amount, statusBarName);
}

//ability functions
export function increaseHealth(lobby_code, player_id, data) {
    handleAbilityAction(lobby_code, player_id, data, increaseStatusBar, 'health');
}

export function decreaseHealth(lobby_code, player_id, data) {
    handleAbilityAction(lobby_code, player_id, data, decreaseStatusBar, 'health');
}

export function increaseCrew(lobby_code, player_id, data) {
    handleAbilityAction(lobby_code, player_id, data, increaseStatusBar, 'crew');
}

export function decreaseCrew(lobby_code, player_id, data) {
    handleAbilityAction(lobby_code, player_id, data, decreaseStatusBar, 'crew');
}

export function increaseFuel(lobby_code, player_id, data) {
    handleAbilityAction(lobby_code, player_id, data, increaseStatusBar, 'fuel');
}

export function decreaseFuel(lobby_code, player_id, data) {
    handleAbilityAction(lobby_code, player_id, data, decreaseStatusBar, 'fuel');
}

export function increasePower(lobby_code, player_id, data) {
    handleAbilityAction(lobby_code, player_id, data, increaseStatusBar, 'power');
}

export function decreasePower(lobby_code, player_id, data) {
    handleAbilityAction(lobby_code, player_id, data, decreaseStatusBar, 'power');
}

export function increaseLifeSupport(lobby_code, player_id, data) {
    handleAbilityAction(lobby_code, player_id, data, increaseStatusBar, 'life_support');
}

export function decreaseLifeSupport(lobby_code, player_id, data) {
    handleAbilityAction(lobby_code, player_id, data, decreaseStatusBar, 'life_support');
}
