"use client"

import { useState, useEffect } from "react";

// Just an infinitely looping 1min 30sec timer for now

export default function TurnTimer() {
  const init_time = new Date();
  init_time.setMinutes(1);
  init_time.setSeconds(30);
  let current_time = init_time;
  
  function startTimer() {
    const setup_time = new Date();
    setup_time.setMinutes(1);
    setup_time.setSeconds(30);
    current_time = setup_time;
  }

  const [displayTime, setDisplayTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      if (current_time.getMinutes() == 0 && current_time.getSeconds() == 0) {
        startTimer();
      }
      else {
        const secs = current_time.getSeconds()-1;
        current_time.setSeconds(secs);
        let display_string = "";
        if (secs < 10) {
        display_string = 
            `${current_time.getMinutes()}:0${current_time.getSeconds()}`;
        } else {
        display_string = 
            `${current_time.getMinutes()}:${current_time.getSeconds()}`;
        }

        setDisplayTime (display_string);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);
    
  return (
    <div>
      {displayTime}
    </div>
  )
};
