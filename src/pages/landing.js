import React from "react";
import './landing.css';
import MovingGallery from "../components/moving-gallery";
import {trans} from '../general_';

export default function Landing({translation}) {
  //////////////////////////////////////////
  const startButtonOnClick = (evt) => {
    console.log(evt)
  }
  //////////////////////////////////////////
  return <div className="landing-container">
    <div className="moving-gallery-panel"><MovingGallery /></div>
    <div className="floating-panel">
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title"></div>
        </div>
        <div className="panel-nav">
          <p>{trans("Uses AI read the document", translation)}</p>
          <p>{trans("and anwser questions", translation)}</p>
        </div>
        <div className="panel-body">
          <p>{trans("Discover the full story - let AI guide you through every page.", translation)}</p>
          
        </div>
        <div className="panel-body">
          <button className="btn-style-h-lg" onClick={startButtonOnClick}>Start</button>
        </div>
        <div className="panel-footer">
          
        </div>
      </div>
    </div>
    
  </div>
}