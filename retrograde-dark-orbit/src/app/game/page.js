'use client'
import DisplayLobbyCode from "@/components/display_lobby_code";
import { useSearchParams } from 'next/navigation'
import GamePanel from "@/components/game_panel";

export default function Page() {
    const searchParams = useSearchParams()
    const search = searchParams.get("code")
    
    return (
        <main className="flex justify-center items-center flex-col ">
            <div className="flex flex-row w-full md:w-1/2">
                <DisplayLobbyCode LobbyCode={search}/>
            </div>
            <GamePanel/>
        </main>
    );
}
