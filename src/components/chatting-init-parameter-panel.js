import './chatting-init-parameter-panel.css';
import React, {useRef} from 'react';

export default function ChattingInitParameterPanel(){
  const newPromptModal = useRef(null);

  /////////////////////////////////////////////////
  function renderCard(title = "", prompt = ""){
    //create a regular card
    return <div className='prompt-card'>{prompt}</div>
  }
  ////event handler/////////////////////////////////////
  const onNewPromptModalToggle = () => {
    newPromptModal.current.classList.toggle("active");
  }
  /////////////////////////////////////////////////
  return <div className='chatting-init-parameter-panel'>
    <div>
      <div>
      <div className="form-group">
        <label className="form-radio form-inline c-hand">
          <input type="radio" name="gender"/><i className="form-icon"></i> chatGPT 3.5 - 16K
        </label>
        <label className="form-radio form-inline c-hand">
          <input type="radio" name="gender"/><i className="form-icon"></i> GPT 4.0
        </label>
      </div>
      </div>
    </div>
    <div>
      <div>
        <div 
          className='c-hand new-prompt-div' 
          onClick={onNewPromptModalToggle}
        >
          <span>new Prompt </span> 
          <i className="fa-solid fa-file-circle-plus"></i>
        </div>
      </div>
      <form>
        <div className='prompt-container'>
          {renderCard()}
        </div>
      </form>
    </div>
    <div ref={newPromptModal} className="modal active">
      <span onClick={onNewPromptModalToggle} className="modal-overlay" aria-label="Close"></span>
      <div className="modal-container">
        <div className="modal-header">
          <span className="btn btn-clear float-right c-hand"  aria-label="Close" onClick={onNewPromptModalToggle}><i className="fa-solid fa-xmark close-button"></i></span>
          <div className="modal-title h5">New Prompt</div>
        </div>
        <div className="modal-body">
          <div className="content">
            <div className="form-group">
              <label className="form-label" htmlFor="input-example-1">Type</label>
              <input className="form-input" type="text" id="input-example-1" placeholder="Name"/>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="input-example-3">Prompt</label>
              <textarea className="form-input" id="input-example-3" placeholder="Textarea" rows="5"></textarea>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          ...
        </div>
      </div>
    </div>
  </div>
}