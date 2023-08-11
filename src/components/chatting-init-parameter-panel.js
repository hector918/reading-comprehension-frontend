import './chatting-init-parameter-panel.css';
import React, {useEffect, useRef, useState} from 'react';
import fetch_ from "../fetch_";
import {addMessage} from '../components/message-footer';
import { trans } from '../general_';
////////////////////////////////////////
let gerneralIndex = 0;
export default function ChattingInitParameterPanel({translation, isLogin, initParameter}){
  const [modelList] = useState([
    {index: "01", name: "chatGPT 3.5 - 16K"},
    {index: "02", name: "GPT 4.0"}
  ]);
  const [promptsList, setPromptsList] = useState([]);
  const newPromptModal = useRef(null);
  const modalTypeInput = useRef(null);
  const modalTitleInput = useRef(null);
  const modalTypeTextarea = useRef(null);
  const initForm = useRef(null);
  /////////////////////////////////////////////////
  useEffect(()=>{
    fetch_.readPrompts((res) => {
      //
      console.log(res);
      if(res.error){
        //on error
        console.error(res.error);
      }else if(res.data){
        //on data
        if(res.data.length > 0) setPromptsList(res.data);
      }
    })
  }, [])
  
  ////event handler/////////////////////////////////////
  const onNewPromptModalToggle = () => {
    newPromptModal.current.classList.toggle("active");
  }
  const onSavePromptClick = () => {
    let type = modalTypeInput.current.value;
    let prompt = modalTypeTextarea.current.value;
    let title = modalTitleInput.current.value;
    fetch_.insertNewPrompt(type, title, prompt, (res) => {
      //
      if(res.error){
        addMessage(
          trans("On save prompt", translation),
          trans(res.error, translation),
          "error"
        );
        //on error
      }else if(res.data){
        //on success
        setPromptsList(pv => [...pv, res.data]);
        //need to reflash the prompt card container
        //close modal, clean up data
        newPromptModal.current.classList.remove("active");
        modalTypeInput.current.value = "";
        modalTypeTextarea.current.value = "";
      }
    });
  }
  /////////////////////////////////////////////////
  function renderModelSelector(el, idx){
    return <label 
      key = {`model-selector-${gerneralIndex++}`} 
      className = "form-radio form-inline c-hand"
      onClick = {()=>{initParameter.model = el.index}}
    >
    <input 
      type = "radio" 
      name = "model" 
      defaultChecked
    />
    <i className="form-icon"></i> {el.name}
  </label>
  }
  function renderCard({type, title, content}){
    //create a regular card
    return <label 
      key = {`prompt-card-${gerneralIndex++}`} 
      className = 'prompt-card' 
      onClick = {() => initParameter.prompt = content}
    >
      
      <div className='type-and-function-div'>
        <div>
          <span><input type="radio" name="prompt"/> </span>
          <span> {type}</span> - <span>{title}</span>
        </div>
        <div><i className="fa-solid fa-trash"></i></div>
      </div>
      <div>{content}</div>
    </label>
  }
  /////////////////////////////////////////////////
  return <div className='chatting-init-parameter-panel'>
    <div>
      <div>
        <div className="form-group">
          {modelList.map(renderModelSelector)}
        </div>
      </div>
    </div>
    <div>
      <div className='prompt-function-div'>
        <div 
          className='c-hand new-prompt-div' 
          onClick={onNewPromptModalToggle}
        >
          <span>new Prompt </span>
          <i className="fa-solid fa-file-circle-plus"></i>
        </div>
      </div>
      <form ref={initForm}>
        <div className='prompt-container'>
          {promptsList.map(renderCard)}
        </div>
      </form>
    </div>
    <div ref={newPromptModal} className="modal">
      <span onClick={onNewPromptModalToggle} className="modal-overlay" aria-label="Close"></span>
      <div className="modal-container">
        <div className="modal-header">
          <span className="btn btn-clear float-right c-hand"  aria-label="Close" onClick={onNewPromptModalToggle}><i className="fa-solid fa-xmark close-button"></i></span>
          <div className="modal-title h5">New Prompt</div>
        </div>
        <div className="modal-body">
          <div className="content">
            <div className="form-group">
              <label className="form-label">
                <span>Type</span>
                <input 
                  ref = {modalTypeInput} 
                  className = "form-input" 
                  type = "text" 
                  placeholder = "Type"
                />
              </label>
            </div>
            <div className="form-group">
              <label className="form-label">
                <span>Title</span>
                <input 
                  ref = {modalTitleInput} 
                  className = "form-input" 
                  type = "text" 
                  placeholder = "Title"
                />
              </label>
            </div>
            <div className="form-group">
              <label className="form-label" >
                <span>Prompt</span>
                <textarea 
                  ref = {modalTypeTextarea} 
                  className = "form-input"  
                  placeholder = "Textarea" 
                ></textarea>
              </label>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <div>
            <button>cancel</button>
            <button onClick={onSavePromptClick}>save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
}