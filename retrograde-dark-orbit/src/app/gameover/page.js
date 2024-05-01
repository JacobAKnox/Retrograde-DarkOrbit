'use client'
import DisplayLobbyCode from "@/components/display_lobby_code";
import ExitLobbyButton from "@/components/exit_lobby_button";
import GameOverPanel from "@/components/game_over_panel";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default function Page() {
    return (
        <main className="flex justify-center items-center flex-col ">
            <div className="flex flex-row w-full md:w-1/2">
                <ExitLobbyButton/>
                <Suspense>
                    <DisplayLobbyCode/>
                </Suspense>
            </div>
            <GameOverPanel/>
        </main>
    );
}
