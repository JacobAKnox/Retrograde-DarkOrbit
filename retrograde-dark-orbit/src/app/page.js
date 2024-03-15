"use client"

import DisplayNameForm from "./../components/display_name_form";
import JoinPanel from "./../components/join_panel";

export default function Home() {
  

  return (
    <main className="flex justify-center items-start">
      <div className="flex min-h-screen flex-wrap flex-row justify-center p-24">
        <div className="p-1 m-1 h-1/2">
          <h1 className="text-center text-2xl text-blue-300">
            <b>CREATE GAME</b>
          </h1>
          <DisplayNameForm onJoin={() => {}} existingUsernames={[]}/>
        </div>
        <div className="h-1/2 p-1 m-1">
          <h1 className="text-center text-2xl text-blue-300">
            <b>JOIN GAME</b>
          </h1>
          <JoinPanel/>
        </div>
      </div>
    </main>
  );
}
