import './interactionMenuBar.css';
import React, { useEffect, useState } from "react";
// import {MessageFooter, addMessage} from '../components/message-footer';
import {trans, createHashFromStr} from '../general_';
import lc_ from '../stroage_';
export default function InteractionMenuBar({translation, isLogin, fileHash, historyPanel}){
  const [questionsHistory, setQuestionHistory] = useState([]);
  ////////////////////////////////////////////
  useEffect(() => {
    const history = lc_.getAllHistoryOrderByUnifyTime(fileHash);
    setQuestionHistory(history);
  }, [fileHash])
  ////////////////////////////////////////////
  const onQuestionCardClick = (questionJson) => {
    //because question may have some space, and space can not be id, so hash it use for id
    const questionId = `reading-comprehension-question-id-` + createHashFromStr(`${questionJson.q}-${questionJson.level}`);
    const targetQuestion = historyPanel.current.querySelector(`#${questionId}`);
    targetQuestion.scrollIntoView({ behavior: 'smooth' });
  }
  ////////////////////////////////////////////
  return <div className='interaction-menu-bar'>
    <div className={`popover popover-bottom c-hand`} >
      <span>
      <i className = "fa-solid fa-list"></i>
      {trans("Questions history", translation)}
      </span>
          
      <div className="popover-container bg-dark popover-container-for-questions-history">
        {questionsHistory.length === 0 
        ? <div>{trans("Your have no question history yet.", translation)}</div>
        :questionsHistory.map((el, idx) => <div 
          className = 'question-history-card' 
          key = {`question-history-card-id-${idx}`}
          onClick = {() => onQuestionCardClick(el)}
        >
          <div><span>{trans("Q", translation)}: </span>{el.q}</div>
        </div>)}
      </div>
    </div>
  </div>
}