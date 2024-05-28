import { get_game, get_status_bars } from "./game.js";
import { status_bar_update_callback } from "./turns.js";

export function test_ability() {}

export function doctor_ability(lobby_code, player_id, data) {
    useOnce(lobby_code, player_id, () => {
        handleAbilityAction(lobby_code, player_id, {amount: 20}, increaseStatusBar, "life_support");
        status_bar_update_callback(lobby_code, get_status_bars(lobby_code));
    });
}

export function engineer_ability(lobby_code, player_id, data) {
    useOnce(lobby_code, player_id, () => {
        handleAbilityAction(lobby_code, player_id, {amount: 10}, decreaseStatusBar, "power");
        status_bar_update_callback(lobby_code, get_status_bars(lobby_code));
    });
}

export function rebel_ability(lobby_code, player_id, data) {
    useOnce(lobby_code, player_id, () => {
        handleAbilityAction(lobby_code, player_id, {amount: 5}, increaseStatusBar, "fuel");
        status_bar_update_callback(lobby_code, get_status_bars(lobby_code));
    });
}

export function alien_ability(lobby_code, player_id, data) {
    useOnce(lobby_code, player_id, () => {
        handleAbilityAction(lobby_code, player_id, {amount: 2}, decreaseStatusBar, "crew");
        status_bar_update_callback(lobby_code, get_status_bars(lobby_code));
    });
}

export function robot_ability(lobby_code, player_id, data) {
    useOnce(lobby_code, player_id, () => {
        handleAbilityAction(lobby_code, player_id, {amount: 10}, increaseStatusBar, "power");
        status_bar_update_callback(lobby_code, get_status_bars(lobby_code));
    });
}

export function parasite_ability(lobby_code, player_id, data) {
    useOnce(lobby_code, player_id, () => {
        handleAbilityAction(lobby_code, player_id, {amount: 10}, decreaseStatusBar, "life_support");
        status_bar_update_callback(lobby_code, get_status_bars(lobby_code));
    });
}

export function scavenger_ability(lobby_code, player_id, data) {
    useOnce(lobby_code, player_id, () => {
        handleAbilityAction(lobby_code, player_id, {amount: 5}, decreaseStatusBar, "fuel");
        status_bar_update_callback(lobby_code, get_status_bars(lobby_code));
    });
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

// allows the use of action once per game
export function useOnce(lobby_code, player_id, action) {
    const game = get_game(lobby_code);
    const role = game.players[player_id].role;
    if (!role || role.used) {
        return;
    }
    action();
    role.used = true;
}

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
