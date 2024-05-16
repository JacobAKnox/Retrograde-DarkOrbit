import { get_game } from "./game";
export function test_ability() {}

export const increaseStatusBar = (game, amount, statusBarName) => {
    if (!game.statusBars) {
        game.statusBars = {};
    }
    game.statusBars[statusBarName] = game.statusBars[statusBarName] || 0;
    game.statusBars[statusBarName] += amount;
    game.statusBars[statusBarName] = Math.min(game.statusBars[statusBarName], 100); 
};

export const decreaseStatusBar = (game, amount, statusBarName) => {
    if (!game.statusBars) {
        game.statusBars = {};
    }
    game.statusBars[statusBarName] = game.statusBars[statusBarName] || 0;
    game.statusBars[statusBarName] -= amount;
    game.statusBars[statusBarName] = Math.max(game.statusBars[statusBarName], 0); 
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
