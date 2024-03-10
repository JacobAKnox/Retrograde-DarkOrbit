import ExitLobbyButton from "@/components/exit_lobby_button";
import ChatBox from "@/components/chat_box";
import LobbyPanel from "@/components/lobby_panel";
import GameStartButton from "@/components/temp_start_button";
import DisplayLobbyCode from "@/components/display_lobby_code";
import DisplayTimer from "@/components/display_timer";
export default function Page() {
    return (
        <main className="flex justify-center items-center flex-col flex-wrap min-w-full">
            <div>
                <DisplayTimer/>
                <GameStartButton/>
            </div>
            <div className="flex flex-row w-1/2 md:justify-start items-center justify-center">
                <ExitLobbyButton/>
                <DisplayLobbyCode/>
            </div>
            <LobbyPanel/>
        </main>
    );
}
