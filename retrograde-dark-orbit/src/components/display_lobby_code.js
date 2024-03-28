import { useSearchParams } from "next/navigation";

export default function DisplayLobbyCode() {
    return (
      <div className="bg-slate-900 text-xl text-white m-1 py-2 px-10 rounded-xl">
        Lobby Code: {useSearchParams().get("code")}
      </div>
    );
  }
  