import ExitLobbyButton from "@/components/exit_lobby_button";
import ChatBox from "@/components/chat_box";
import LobbyPanel from "@/components/lobby_panel";
import GameStartButton from "@/components/temp_start_button";
import DisplayLobbyCode from "@/components/display_lobby_code";

export default function Page() {
    return (
        <main className="flex justify-center items-start">
            <ExitLobbyButton/>
            <DisplayLobbyCode/>
            <LobbyPanel/>
            <GameStartButton/>
        </main>
    );
}
