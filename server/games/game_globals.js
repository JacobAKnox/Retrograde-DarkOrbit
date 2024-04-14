export const PHASE_STATES = Object.freeze({
    GAME_SETUP_PHASE: "Game setup",
    SERVER_PROCESSING_PHASE: "Server processing",
    INFORMATION_PHASE: "Information phase",
    DISCUSSION_PHASE: "Discussion phase",
    ACTION_PHASE: "Action phase"
})

// time in milliseconds
export const PHASE_TIMINGS = Object.freeze({
    INFORMATION_PHASE_LENGTH: 20000,
    DISCUSSION_PHASE_LENGTH: 60000,
    ACTION_PHASE_LENGTH: 20000
})

export function get_new_status_bars() {
    return structuredClone(STATUS_BAR_TEMPLATE);
}

const STATUS_BAR_TEMPLATE = Object.freeze({
    "crew": {name: "Crew", value: 50, max_value: 100},
    "ship_health": {name: "Ship Health", value: 50, max_value: 100},
    "fuel": {name: "Fuel", value: 50, max_value: 100},
    "life_support": {name: "Life Support", value: 50, max_value: 100},
    "power": {name: "Power", value: 50, max_value: 100}
});