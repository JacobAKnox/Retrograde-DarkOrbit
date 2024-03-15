"use client"

import DisplayNameForm from "./../components/display_name_form";
import JoinPanel from "./../components/join_panel";

export default function Home() {
  

  return (
    <main className="flex justify-center items-start">
      <div className="flex w-1/2 min-h-screen flex-wrap flex-row items-center justify-center p-24">
        <div className="w-1/2">
          <h1 className="text-center text-2xl text-blue-300">
            <b>JOIN GAME</b>
          </h1>
          <JoinPanel/>
        </div>
        <div className="w-1/2">
          <h1 className="text-center text-2xl text-blue-300">
            <b>CREATE GAME</b>
          </h1>
          <DisplayNameForm onJoin={() => {}} existingUsernames={[]}/>
        </div>
      </div>
    </main>
  );
}
