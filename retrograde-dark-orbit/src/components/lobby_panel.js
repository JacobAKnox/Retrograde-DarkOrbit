import ChatBox from "./chat_box";
import ReadyBox from "./ready_box";
import ReadyButton from "./ready_button";
import ReadyStatus from "./ready_status";

export default function LobbyPanel() {
  return (
    <div className="border-4 border-blue-400 min-w-[1000px] min-h-[600px] bg-gray-900 m-20 p-4 rounded-xl flex flex-row">
      <ChatBox/>
      <div className="flex flex-col min-w-[400px] justify-end ml-4 p-4 bg-gray-800 rounded-xl">
        <ReadyBox/>
      </div>
    </div>
  )
}
