import ExitLobbyButton from "@/components/exit_lobby_button";
import ChatBox from "@/components/chat_box";

export default function Page() {
    return (
        <main className="flex justify-center items-start">
            <ExitLobbyButton/>
            <ChatBox/>
        </main>
    );
}