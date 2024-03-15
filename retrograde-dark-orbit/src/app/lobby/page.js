'use client'
import ExitLobbyButton from "@/components/exit_lobby_button";
import ChatBox from "@/components/chat_box";
import LobbyPanel from "@/components/lobby_panel";
import GameStartButton from "@/components/temp_start_button";
import DisplayLobbyCode from "@/components/display_lobby_code";
import DisplayTimer from "@/components/display_timer";
import { useSearchParams } from 'next/navigation'
export default function Page() {
    const searchParams = useSearchParams()
    const search = searchParams.get("code")
    
    return (
        <main className="flex justify-center items-start">
            <div>
                <ExitLobbyButton/>
                <DisplayLobbyCode LobbyCode={search}/>
                <DisplayTimer/>
            </div>
            <LobbyPanel/>
            <GameStartButton/>
        </main>
    );
}
