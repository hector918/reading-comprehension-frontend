import React, {useRef} from "react";
import './message-footer.css';
import {createElement, trans} from '../general_';
let addMessage = null;
const autoCollapseTime = 5000;
function MessageFooter({translation}){
  const messageBoard = useRef(null);
  ///////////////////////////////////////////////////////
  function createMessage(title, content = "", type = "dark"){
    let bgColor;
    switch(type){
      case "success": bgColor = "toast-success"; break;
      case "warning": bgColor = "toast-warning"; break;
      case "error": bgColor = "toast-error"; break;
      default: bgColor = ""; 
    }
    //creating element
    const element = createElement({class: `toast ${bgColor}`, childs_:[
      
      {tagname_: "i", class: "fa-solid fa-xmark p-absolute c-hand close-button", event_:{"click": onRemove}},
      {tagname_: "p", class:` toast-title`, innerText: trans(title, translation)},
      {tagname_: "p", class:"", innerText: trans(content, translation)}
    ]});
    messageBoard.current.append(element);
    //remove message from board when animation end
    element.addEventListener("animationend", (evt)=>{
      if(evt.animationName === "toastOut"){
        element.parentNode.removeChild(element);
      }
    });
    //auto close
    setTimeout(() => {
      onRemove();
    }, autoCollapseTime);
    ///active animation
    function onRemove(){
      element.classList.add("on-remove");
    }
  }
  addMessage = createMessage;
  ///////////////////////////////////////////////////////
  return <div ref={messageBoard} className="message-footer-h p-absolute">
    
  </div>
}

export {MessageFooter, addMessage}