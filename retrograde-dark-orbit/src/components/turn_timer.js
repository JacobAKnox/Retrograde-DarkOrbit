"use client"

import { useState, useEffect } from "react";
import { set_turn_timer, toggle_turn_timer_countdown } from "./../server/socket.js";
import { getItem, storeItem } from "../server/storage.js";

export default function TurnTimer() {
  const [displayTime, setDisplayTime] = useState("");
  const [phaseText, setPhaseText] = useState("");
  let ms = 0;
  let pause = false;
  let start = Date.now();

  function configureTimer(phase) {
    storeItem("timer", phase);
    const ms_since_start = Date.now() - phase.start;
    ms = phase.length - ms_since_start;
    setDisplayTime(formatDisplayTime());
    setPhaseText(phase.name);
    pause = false;
  }

  function formatDisplayTime() {
    if (ms < 0) {
      return "0:00";
    }

    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    if (secs < 10) {
      return `${mins}:0${secs}`;
    }

    return `${mins}:${secs}`;
  }

  useEffect(() => {
    const old_timer = getItem("timer");
    if (old_timer) {
      configureTimer(old_timer);
    }
    set_turn_timer(configureTimer);
    const interval = setInterval(() => {
      if (pause == false) {
        if (ms <= 0) {
          console.log("time in ms = " + ms);
          pause = true;
        }
        else {
          ms -= 1000;
          let display_string = formatDisplayTime(ms);
          console.log('updated time to ' + ms + ' ms');
          setDisplayTime(display_string);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);
    
  return (
    <div>
      {displayTime} 
      <br/>
      <p>{phaseText}</p>
    </div>
  )
};
