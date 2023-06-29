import React from "react";
import './landing.css';
import MovingGallery from "../components/moving-gallery";

export default function Landing(){
  return <div className="landing-container">
    <div className="moving-gallery-panel"><MovingGallery/></div>
    <div className="columns">
      <div className="column">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"></div>
          </div>
          <div className="panel-nav">
            <h4>Uses AI read the document</h4>
            <h6>and anwser questions</h6>
          </div>
          <div className="panel-body">
            -- contents --
          </div>
          <div className="panel-footer">
            <button className="btn-style-h-lg">Start</button>
          </div>
        </div>
      </div>
      <div className="column">
        Second column
      </div>
      
    </div>
  </div>
}