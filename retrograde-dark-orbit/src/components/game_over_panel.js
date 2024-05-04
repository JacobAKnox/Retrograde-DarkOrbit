import DisplayTimer from "./display_timer";
import WideChatBox from "./wide_chat_box";
import WinnerPanel from "./winners_panel";

export default function GameOverPanel() {
  return (
    <div className="border-4 w-full md:w-1/2 border-blue-400 min-h-[600px] bg-gray-800 md:mx-20 p-4 rounded-xl flex flex-col items-end flex-wrap">
      <div className="flex flex-row w-full">
        <div className="flex flex-grow m-2">
          <WinnerPanel/>
        </div>
        <div className="flex flex-col w-full md:w-1/3 p-4 bg-gray-800 rounded-xl">
          <DisplayTimer/>
        </div>
      </div>
      <div className="w-full">
        <WideChatBox/>
      </div>
    </div>
  )
}
