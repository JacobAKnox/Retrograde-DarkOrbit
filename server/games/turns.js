import { PHASE_STATES, PHASE_TIMINGS, PLAYER_INITIAL_POIS } from "./game_globals.js"
import { get_game, get_status_bars, set_status_bar_value, get_status_bar_value, get_player_POIs, set_player_POIs, process_turn} from "./game.js";

let timer_update_callback = (phase, time, start, lobbyCode) => {};

let ids_and_names_callback = (IDSANDNAMES, lobbyCode) => {};

export function set_timer_update_callback(cb) {
    timer_update_callback = cb;
}

export function set_ids_and_names_callback(cb) {
    ids_and_names_callback = cb;
}

let status_bar_update_callback = (lobbyCode, status_bars) => {};

export function set_status_bar_update(cb) {
    status_bar_update_callback = cb;
}

// used as a timer that does not block other code execution from happening
export const sleep_function = (delay) => new Promise((resolve) => setTimeout(resolve, delay));


export async function execute_turn(game, lobby_code, sleep=sleep_function) {
    switch(game.currentState) {

        case PHASE_STATES.GAME_SETUP_PHASE:
            // call setupNewGame function?
            game.currentState = PHASE_STATES.INFORMATION_PHASE;
            await sleep(1000); // give clients a chance to load the page
            break;

        case PHASE_STATES.INFORMATION_PHASE:

            updateClientsPhase(PHASE_STATES.INFORMATION_PHASE, PHASE_TIMINGS.INFORMATION_PHASE_LENGTH, lobby_code);
            //Send Ids and Names here
            ids_and_names_callback(PLAYER_INITIAL_POIS, lobby_code)
            status_bar_update_callback(lobby_code, get_status_bars(lobby_code));
        
            // add function to send client the data for information phase here
            await sleep(PHASE_TIMINGS.INFORMATION_PHASE_LENGTH);
            game.currentState = PHASE_STATES.DISCUSSION_PHASE;
            break;

        case PHASE_STATES.DISCUSSION_PHASE:
            updateClientsPhase(PHASE_STATES.DISCUSSION_PHASE, PHASE_TIMINGS.DISCUSSION_PHASE_LENGTH, lobby_code);
            // add function to enable client chat here
            await sleep(PHASE_TIMINGS.DISCUSSION_PHASE_LENGTH);
            game.currentState = PHASE_STATES.ACTION_PHASE;
            break;

        case PHASE_STATES.ACTION_PHASE:
            updateClientsPhase(PHASE_STATES.ACTION_PHASE, PHASE_TIMINGS.ACTION_PHASE_LENGTH, lobby_code);
            // add function to disable client chat here
            await sleep(PHASE_TIMINGS.ACTION_PHASE_LENGTH);
            game.currentState = PHASE_STATES.SERVER_PROCESSING_PHASE;
            break;

        case PHASE_STATES.SERVER_PROCESSING_PHASE:
            game.currentState = PHASE_STATES.INFORMATION_PHASE;
            // add function to process clients' choices during action phase
            process_turn(lobby_code);
            //updateClientsPhase(PHASE_STATES.SERVER_PROCESSING_PHASE);
            // add fucntion to check for win condition
            // set to game over if a win is found
            break;
          
        case PHASE_STATES.GAME_OVER_PHASE:
          //handle a win
          updateClientsPhase(PHASE_STATES.GAME_OVER_PHASE, PHASE_TIMINGS.GAME_OVER_PHASE_LENGTH, lobby_code);
          await sleep(PHASE_TIMINGS.GAME_OVER_PHASE_LENGTH);
          break;
    }
}

export function updateClientsPhase(phase, time, lobbyCode) {
    // send phase to client
    // call Update Timer 
    timer_update_callback(phase, time, Date.now(), lobbyCode);
    return phase;
}

export async function gameLoop(lobbyCode){
    //Gameloop - execute turns
    //define game
    let game = get_game(lobbyCode);
    //Run game loop and pass in game object
    while (true){
        await execute_turn(game, lobbyCode);
    }
}

