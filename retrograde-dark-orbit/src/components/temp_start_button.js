import { start_game } from "@/server/socket";

// not testing this becasue it will be removed once the ready mechanisim is done
export default function GameStartButton() {
    return(
        <div>
            <button className="bg-slate-800"
            onClick={start_game}>
                Start Game
            </button>
        </div>
    );
}