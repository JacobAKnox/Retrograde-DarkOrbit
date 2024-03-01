let games = {};

export function start_game(lobby, lobby_code, game_list=games) {
    if (lobby_code in game_list) {
        return {status: 400, message: `Game with code '${lobby_code}' already exists`};
    }

    game_list[lobby_code] = JSON.parse(JSON.stringify(lobby)); // deep coppy lobby object;

    // assign roles
    return {status: 200};
}