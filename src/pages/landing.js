import React from "react";
import './landing.css';
import MovingGallery from "../components/moving-gallery";
import {trans} from '../general_';
import { useNavigate } from "react-router-dom";

export default function Landing({translation}) {
  const navigate = useNavigate();
  //////////////////////////////////////////
  const startButtonOnClick = (evt) => {
    navigate("/reading");
  }
  //////////////////////////////////////////
  return <div className="landing-container">
    <div className="moving-gallery-panel"><MovingGallery /></div>
    <div className="floating-panel">
      <div>
      </div>
      <div>
        <span className="title-h">{trans("Uses AI", translation)}</span>
      </div>
      <div>
        <span className="title-h">{trans("read the document", translation)}</span>
      </div>
      <div>
        <span className="title-h">{trans("and anwser", translation)}</span>
      </div>
      <div>
        <span className="title-h">{trans("questions.", translation)}</span>
      </div>


      <div>
        <span className="subtitle-h">{trans("Discover the full story", translation)}</span>
      </div>
      <div>
        <span className="subtitle-h">{trans("let AI guide you through every page.", translation)}</span>
      </div>
      <div>
        <span className="under-construction">{trans("Under construction", translation)}</span>
        
      </div>
      <div style={{justifyContent:"center"}}>
        <span className="major-button"><span onClick={startButtonOnClick}>{trans("Start>", translation)}</span></span>
        
      </div>
      <div>
        <span className="title-h">{trans("", translation)}</span>
      </div>
      <div>
        
      </div>
    </div>
    
  </div>
}