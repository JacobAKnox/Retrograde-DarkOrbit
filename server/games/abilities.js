
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
