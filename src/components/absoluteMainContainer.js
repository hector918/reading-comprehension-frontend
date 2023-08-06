import React from "react";
import './absoluteMainContainer.css';
export default function AbsoluteMainContainer({userProfileContainer}){
  return <div className="absolute-main-container" ref={userProfileContainer}>
    123

    <button className="absolute-main-container-close-button">
      click me to close
    </button>
  </div>
}