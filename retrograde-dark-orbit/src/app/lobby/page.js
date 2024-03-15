'use client'
import ExitLobbyButton from "@/components/exit_lobby_button";
import LobbyPanel from "@/components/lobby_panel";
import DisplayLobbyCode from "@/components/display_lobby_code";
import { useSearchParams } from 'next/navigation'

export default function Page() {
    const searchParams = useSearchParams()
    const search = searchParams.get("code")
    
    return (
        <main className="flex justify-center items-center flex-col ">
            <div className="flex flex-row w-full md:w-1/2">
                <ExitLobbyButton/>
                <DisplayLobbyCode LobbyCode={search}/>
            </div>
            <LobbyPanel/>
        </main>
    );
}
