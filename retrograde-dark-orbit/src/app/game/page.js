'use client'
import DisplayLobbyCode from "@/components/display_lobby_code";
import GamePanel from "@/components/game_panel";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default function Page() {
    return (
        <main className="flex justify-center items-center flex-col ">
            <div className="flex flex-row w-full md:w-2/4">
                <Suspense>
                    <DisplayLobbyCode/>
                </Suspense>
            </div>           
            <GamePanel/>
        </main>
    );
}
