import './interaction-panel.css';
import React, { useState, useRef, useEffect } from "react";
import { trans, createHashFromStr } from '../general_';
import LoadingIcon from './loading-icon';
import lc_ from '../stroage_';
import { addMessage } from './message-footer';
///main compoment///////////////////////////////////////
export default function InteractionDisplay({ translation, isLogin, fileHash, historyPanel, isLoading, setIsLoading }) {
  const [historyList, setHistoryList] = useState([]);
  const inputBox = useRef(null);
  ///////////////////////////////////////////////////////
  useEffect(() => {

    if (isLoading === false) {
      //when res callback, the data from server were storaged in the local storage, getAllHistoryOrderByUnifyTime is reading from local stroage
      const historyFromUpdatedLocalStorage = lc_.getAllHistoryOrderByUnifyTime(fileHash);
      setHistoryList(historyFromUpdatedLocalStorage);
    }
  }, [isLoading, fileHash])
  useEffect(() => {
    setIsLoading(true);
    //read all history about this hash
    if (fileHash !== undefined) lc_.getAllHistoryFromFileHash(fileHash, (res) => {

      setIsLoading(false);
    })
  }, [fileHash, setIsLoading]);

  useEffect(() => {
    //scroll to the bottom
    const lastChildElement = historyPanel.current?.lastElementChild;
    if (lastChildElement) lastChildElement.scrollIntoView({ behavior: 'smooth' });

  }, [historyList, historyPanel])
  ///////////////////////////////////////////////////////
  const onHistoryShareButtonClick = (evt, jsonItem) => {
    if (isLogin()) {
      const currentTarget = evt.currentTarget;
      jsonItem.is_share = !jsonItem.is_share;
      jsonItem.fileHash = fileHash;
      switch (jsonItem.type) {
        case "textToComprehension":
          lc_.userToggleReadingComprehensionShare(jsonItem, (res) => {
            if (res.data) {
              currentTarget.classList.toggle('active');
            }
          });
          break;
        case "textToExplanation":
          lc_.userToggleTextToExplainationShare(jsonItem, (res) => {
            if (res.data) {
              currentTarget.classList.toggle('active');
            }
          })
          break;
        default:
      }
    }
  }
  const onSendButtonClick = (evt) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      let q = inputBox.current.value.trim();
      if (fileHash === undefined) return;
      lc_.questionToReadingComprehension(fileHash, q, "2", (res) => {
        //if failed
        if (res.error) addMessage(
          trans("Reading comperhension", translation),
          trans(res.error, translation),
          "error"
        )
        //if successed
        if (res.data) {
          inputBox.current.value = "";
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }
  ///////////////////////////////////////////////////////
  const renderHistoryCard = (el, idx) => {
    ////////////////
    function returnTypeIcon(type) {
      switch (type) {
        case "textToComprehension":
          return <div className='tooltip tooltip-left' data-tooltip={trans(`reading comprehension.`, translation)}>
            <i className="fa-brands fa-readme"></i>
          </div>
        case "textToExplanation":
          return <div className='tooltip tooltip-left' data-tooltip={trans(`text to explaination.`, translation)}>
            <i className="fa-solid fa-quote-left"></i>
          </div>
        default: return <></>
      }
    }
    /////////////////////////////////////////////////////
    return <div
      key={"history-card-div-" + idx}
      className={`history-card-div ${el.type}`}
    >
      {/* because question may have some space, and space can not be id, so hash it use for id */}
      <div
        className='question'
        id={`reading-comprehension-question-id-${createHashFromStr(`${el.q}-${el.level}`)}`}
      >
        <div>{trans("question", translation)}:
          <div className='function-panel'>
            {returnTypeIcon(el.type)}
            <div
              className={`tooltip tooltip-left c-hand ${el.is_share && "active"}`}

              data-tooltip={`switch me on to share answer to others.`}
              onClick={(evt) => { onHistoryShareButtonClick(evt, el) }}
            >
              <i className="fa-solid fa-comment " ></i>
            </div>
            <div className='popover popover-bottom'>
              <i className="fa-solid fa-circle-info c-hand"></i>
              <div className="popover-container bg-dark">
                <div className="card bg-dark">
                  <div className="card-body">
                    <div>{trans("nerd data", translation)}</div>
                    <div>{trans("timestamp", translation)}: {new Date(el.timestamp).toLocaleTimeString()}</div>
                    <div>{trans("Token usage", translation)}: {el.usage}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span>{el.q}</span>

      </div>
      <div className='anwser'>
        <span>{trans("answer", translation)}: </span>
        <span>{el.anwser}</span>
      </div>
    </div>
  }

  return <div className='interaction-Display'>
    <div ref={historyPanel} className='history-panel'>
      {historyList.length === 0
        ? <div><h3>{trans("no question history yet.", translation)}</h3></div>
        : historyList.map(renderHistoryCard)
      }
    </div>
    <div className='input-panel'>
      <div>
        <textarea
          readOnly={isLoading}
          ref={inputBox}
          className=''
        ></textarea>
        <button onClick={onSendButtonClick}>{isLoading ? <LoadingIcon /> : trans("Send", translation)}</button>
      </div>
    </div>
  </div>
}