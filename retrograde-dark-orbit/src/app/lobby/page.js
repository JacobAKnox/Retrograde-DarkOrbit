import ExitLobbyButton from "@/components/exit_lobby_button";
import LobbyPanel from "@/components/lobby_panel";
import DisplayLobbyCode from "@/components/display_lobby_code";
import DisplayTimer from "@/components/display_timer";
export default function Page() {
    return (
        <main className="flex justify-center items-center flex-col flex-wrap min-w-full">
            <div>
                <DisplayTimer/>
            </div>
            <div className="flex flex-row w-1/2 md:justify-start items-center justify-center">
                <ExitLobbyButton/>
                <DisplayLobbyCode/>
            </div>
            <LobbyPanel/>
        </main>
    );
}
