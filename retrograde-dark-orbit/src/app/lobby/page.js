import ExitLobbyButton from "@/components/exit_lobby_button";
import ChatBox from "@/components/chat_box";
import LobbyPanel from "@/components/lobby_panel";
import GameStartButton from "@/components/temp_start_button";

export default function Page() {
    return (
        <main className="flex justify-center items-start">
            <ExitLobbyButton/>
            <LobbyPanel/>
            <GameStartButton/>
        </main>
    );
}
