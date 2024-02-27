import ChatBox from "./chat_box";
import ReadyButton from "./ready_button";

export default function LobbyPanel() {
  return (
    <div className="border-4 border-blue-400 min-w-[848px] min-h-[600px] bg-gray-900 m-20 p-4 rounded-xl flex flex-row">
      <ChatBox/>
    <div className="flex flex-col justify-end ml-4 pl-1 pr-1 pb-2 pt-2 bg-gray-800 rounded-xl">
      <ReadyButton/>
    </div>
    </div>
  )
}
