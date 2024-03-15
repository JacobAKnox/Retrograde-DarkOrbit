export default function DisplayLobbyCode(props) {
    // Access the code prop
    const { LobbyCode } = props;
    return (
      <div className="bg-slate-900 min-w-[250px] text-xl text-white m-1 py-2 px-10 rounded-xl disabled:bg-slate-950 disabled:text-gray-700">
        Lobby Code: {LobbyCode}
      </div>
    );
  }
  