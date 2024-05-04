'use client'
import DisplayLobbyCode from "@/components/display_lobby_code";
import ExitToLobbyButton from "@/components/exit_to_lobby_button";
import GameOverPanel from "@/components/game_over_panel";
import { navigate } from "@/components/navigation";
import { getItem } from "@/server/storage";
import { Suspense, useEffect } from "react";

export const dynamic = 'force-dynamic';

export default function Page() {
    useEffect(() => {
        const code = getItem("code");
        setTimeout(() => {
          navigate(`/lobby?code=${code}`);
        }, getItem("time"));
    }, [])

    return (
        <main className="flex justify-center items-center flex-col ">
            <div className="flex flex-row w-full md:w-1/2">
                <ExitToLobbyButton/>
                <Suspense>
                    <DisplayLobbyCode/>
                </Suspense>
            </div>
            <GameOverPanel/>
        </main>
    );
}
