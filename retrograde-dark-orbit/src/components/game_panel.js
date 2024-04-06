import ChatBox from "./chat_box";
import UserList from "./user_list";
import ReadyBox from "./ready_box";
import ReadyButton from "./ready_button";
import ReadyStatus from "./ready_status";
import DisplayTimer from "./display_timer";
import RoleInfo from "./role_info_panel";

export default function GamePanel() {
  return (
    <div className="border-4 w-full md:w-1/2 border-blue-400 min-h-[600px] bg-gray-900 md:mx-20 p-4 rounded-xl flex flex-row flex-wrap">
      <div className="md:w-2/3 w-full">
        <ChatBox/>
      </div>
      <div className="flex flex-col w-full md:w-1/3 justify-start p-4 bg-gray-800 rounded-xl">
        <DisplayTimer/>
        <RoleInfo/>
      </div>
    </div>
  )
}
