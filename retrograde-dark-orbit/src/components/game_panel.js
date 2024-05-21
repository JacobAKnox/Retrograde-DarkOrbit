import DisplayTimer from "./display_timer";
import POIPanel from "./poi_panel";
import RoleInfo from "./role_info_panel";
import WideChatBox from "./wide_chat_box";
import InformationBar from "./information_bar";

export default function GamePanel() {
  return (
    <div className="border-4 w-full md:w-2/3 border-blue-400 min-h-[600px] bg-gray-800 md:mx-20 p-4 rounded-xl flex flex-row items-start">
      <div className="flex flex-col w-full md:w-3/4">
        <div className="flex flex-col w-full mb-4">
        </div>
        <div className="flex flex-grow m-2">
          <POIPanel />
        </div>
        <div className="w-full">
          <WideChatBox />
        </div>
      </div>
      <div className="w-full md:w-1/4 p-4 bg-gray-800 rounded-xl ml-4 pt-7">
        <DisplayTimer />
        <RoleInfo />
        <InformationBar />
      </div>
    </div>
  );
}
