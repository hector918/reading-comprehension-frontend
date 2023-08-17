import './chatting-init-parameter-panel.css';
import React, {useEffect, useRef, useState} from 'react';
import fetch_ from "../fetch_";
import {addMessage} from '../components/message-footer';
import { trans, createElement } from '../general_';
////////////////////////////////////////
let gerneralIndex = 0;
const promptLetterLimit = 2000;
////////////////////////////////////////
export default function ChattingInitParameterPanel({translation, isLogin, initParameter}){
  const [modelList] = useState([
    {index: "01", name: "chatGPT 3.5 - 16K"},
    {index: "02", name: "GPT 4.0"}
  ]);
  const [promptsList, setPromptsList] = useState([]);
  const [modalPromptTextareaWordCount, setModalPromptTextareaWordCount] = useState(0);
  const newPromptModal = useRef(null);
  const modalTypeInput = useRef(null);
  const modalTitleInput = useRef(null);
  const modalTypeTextarea = useRef(null);
  const initForm = useRef(null);
  const formExtraField = useRef(null);
  const modalPromptForm = useRef(null);
  const modalPromptTextareaWarning = useRef(null);
  const [searchInput, setSearchInput] = useState('');
  let promptListToDisplay = promptsList;
  // if searchInput is truthy (not empty string)
  // reassign dataToDisplay with the filtered data
  if (searchInput) {
    // we only reach this code if the user has typed something
    promptListToDisplay = promptsList.filter((prompt) => {
      const { type, title } = prompt;
      const searchingTarget = `${type} ${title}`.toLowerCase();
      return searchingTarget.includes(searchInput.toLowerCase());
    });
  }
  /////////////////////////////////////////////////
  useEffect(() => {
    fetch_.readPrompts((res) => {
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
    modalTypeInput.current.focus();
  }
  const onSavePromptClick = () => {
    let type = modalTypeInput.current.value;
    let prompt = modalTypeTextarea.current.value;
    let title = modalTitleInput.current.value;
    let form = modalPromptForm.current.elements;
    let linksList = [];
    if(form['link-name']){
      linksList.push([
        form['link-name'].value, 
        form['link-url'].value
      ])
    }
    else if(form['link-name']?.length){
      for(let i = 0; i < form['link-name'].length; i++){
        if(form['link-name'][i].value.trim() === "") continue;
        linksList.push([
          form['link-name'][i].value,
          form['link-url'][i].value
        ]);
      }
    }
    /////////////////////////////////////
    if(prompt.trim().length < 5) {
      modalPromptTextareaWarning.current.classList.remove("display-none");
      return;
    };
    fetch_.insertNewPrompt(type, title, prompt, linksList, (res) => {
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
        //needs to reflash the prompt card container
        //close modal, clean up data
        modalFormReset();
        newPromptModal.current.classList.remove("active");
        initParameter.prompt = "";
      }
    });
  }
  const onDeletePromptClick = (prompt_id) => {
    fetch_.deletePrompt(prompt_id, (res) => {
      if(res.error){
        //on error
        addMessage(
          trans("On delete prompt", translation),
          trans(res.error, translation),
          "error"
        );
      }else if(res.data){
        //on data
        setPromptsList(pv => pv.filter(el => el.id !== prompt_id));
        initParameter.prompt = "";
      }
    })
  }
  const onResetClick = (evt) => {
    // console.log(initForm.current.prompt)
  }
  const onPromptInputChange = ({content, json}) => {
    initParameter.prompt = content;
    initParameter.links = json.links;
  }
  const onModalAddField = (type = "link") => {
    const container = formExtraField.current;
    if(container){
      container.append(returnFormGroup());
    }
    function returnFormGroup(){
      return createElement({
        class: 'input-group',
        childs_: [
          {tagname_: "input", class: "form-input", type: "text", placeholder: trans("This row would'nt save, when this is empty.", translation), name: `${type}-name`},
          {tagname_: "input", class: "form-input", type: "url", placeholder: trans("This row would'nt save, when this is empty.", translation), name: `${type}-url`}
        ]
      })
    }
  }
  /////////////////////////////////////////////////
  function renderModelSelector(el, idx){
    const defaultCheck = idx === 0 ;
    return <label 
      key = {`model-selector-${gerneralIndex++}`} 
      className = "form-radio form-inline c-hand"
      onClick = {()=>{initParameter.model = el.index}}
    >
      <input 
        type = "radio" 
        name = "model"
        defaultChecked = {defaultCheck} 
      />
      <i className="form-icon"></i> {el.name}
    </label>
  }
  function renderCard({id, type, title, content, json}){
    //create a regular prompt card
    return <label 
      key = {`prompt-card-${gerneralIndex++}`} 
      className = 'prompt-card' 
    >
      <input 
        type = "radio" 
        name = "prompt" 
        onChange = {() => {onPromptInputChange({content, json})}}
      />
      <div className='type-and-function-div'>
        <div>
          <span></span>
          <span>{type}</span> - <span>{title}</span>
        </div>
        <div onClick={() => onDeletePromptClick(id)}>
          <i className="fa-solid fa-trash"></i>
        </div>
      </div>
      <div className='prompt-card-prompt-content'> 
        <p>{content}</p>
        {json?.links?.map(([el1, el2]) => <li key={`card-prompt-links-${gerneralIndex}`}>
          <span>{el1}</span>: <sub>{el2}</sub>
        </li>)}
      </div>
    </label>
  }
  function modalFormReset(){
    modalTypeInput.current.value = "";
    modalTypeTextarea.current.value = "";
    modalTitleInput.current.value = "";
    formExtraField.current.innerHTML = "";
    modalPromptTextareaWarning.current.classList.add("display-none");
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
    <div  className='prompt-panel'>
      <div className='prompt-function-div'>
        <div 
          className = 'c-hand new-prompt-div' 
          onClick = {onNewPromptModalToggle}
        >
          <span>{trans("Create new Prompt", translation)}</span>
          <i className="fa-solid fa-file-circle-plus"></i>
        </div>
        <div className='filter-prompt-div'>
          <label className='c-hand'>
            <span>{trans("Filter", translation)}</span>
            <i className="fa-solid fa-filter"></i>
            <input 
              type = 'text' 
              onChange = {(evt)=>setSearchInput(evt.target.value)} 
              value = {searchInput} 
            />
          </label>
        </div>
        <div onClick={onResetClick}></div>
      </div>
      <form ref={initForm}>
        <div className='prompt-container'>
          {promptListToDisplay.map(renderCard)}
        </div>
      </form>
    </div>

    <div ref={newPromptModal} className="modal modal-lg">
      <span onClick={onNewPromptModalToggle} className="modal-overlay" aria-label="Close"></span>
      <div className="modal-container">
        <div className="modal-header">
          <span className="btn btn-clear float-right c-hand"  aria-label="Close" onClick={onNewPromptModalToggle}><i className="fa-solid fa-xmark close-button"></i></span>
          <div className="modal-title h5">{trans("New Prompt", translation)}</div>
        </div>
        <div className="modal-body">
          <form className="content" ref={modalPromptForm}>
            <div className="form-group">
              <label className="form-label">
                <span>{trans("Type", translation)}</span>
                <input 
                  ref = {modalTypeInput} 
                  className = "form-input" 
                  type = "text" 
                  placeholder = {trans("Type", translation)}
                  maxLength = {100}
                />
              </label>
            </div>
            <div className="form-group">
              <label className="form-label">
                <span>{trans("Title", translation)}</span>
                <input 
                  ref = {modalTitleInput} 
                  className = "form-input" 
                  type = "text" 
                  placeholder = {trans("Title", translation)}
                  maxLength = {100}
                />
              </label>
            </div>
            <div className="form-group">
              <label className="form-label" >
                <span>{trans("Prompt", translation)}</span>
                <textarea 
                  ref = {modalTypeTextarea} 
                  className = "form-input"  
                  placeholder = {trans("Prompt", translation)}
                  onChange = {(e) => {setModalPromptTextareaWordCount(e.target.value.length)}}
                  maxLength={promptLetterLimit}
                >
                </textarea>
                <span className='floating-work-counter'><span>{modalPromptTextareaWordCount}</span>/{promptLetterLimit}</span>
              </label>
            </div>
            <div className='form-group'>
              {/* disable the link button */}
              <button disabled onClick={(e) => {
                e.preventDefault();
                onModalAddField();
              }}>{trans("Add link", translation)}</button>
            </div>
            <div ref={formExtraField}>
              
            </div>
            <div>
              <p 
                ref = {modalPromptTextareaWarning} 
                className = 'red display-none'
              >prompt letter count must between 5 - 2000</p>
            </div>
          </form>
          
        </div>
        <div className="modal-footer">
          <div className='button-group'>
            <button 
              className = 'btn btn-theme-border' 
              onClick = {modalFormReset}
            >{trans("Reset", translation)}</button>
            <button className='btn btn-theme-border'>{trans("Cancel", translation)}</button>
            <button 
              className = 'btn btn-theme-border' 
              onClick ={(e) => {
                e.preventDefault();
                onSavePromptClick();
              }}
            >{trans("Save", translation)}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
}