import './chatting-history-interaction-panel.scss'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { trans, createElement, createHashFromStr } from '../general_';
import LoadingIcon from './loading-icon';
import fetch_ from '../fetch_';
import lc_ from '../stroage_';
import ChattingInitParameterPanel from "./chatting-init-parameter-panel";
import { addMessage } from './message-footer';

// for control the history page scrolling
let continueScroll = true;
///////////////////////////////////////////
export default function ChattingHistoryInteractionPanel({ translation, isLogin, topicHash, setTopichash, setThreadList }) {
  const [isLoading, setIsLoading] = useState(false);
  const chattingDisplay = useRef(null);
  const userInputTextarea = useRef(null);
  const inputCounter = useRef(null);
  let initParameter = { model: 1, temperature: 1 };
  ///////////////////////////////////////
  useEffect(() => {
    chattingDisplay.current.innerHTML = "";
    if (topicHash !== undefined) {
      const threadHistory = lc_.readThread(topicHash);
      for (let el of threadHistory) {
        chattingDisplay.current.append(renderChattingCard(el));
      }
    }
  }, [topicHash])
  //
  function renderChattingCard(threadRow) {
    const { card, answerDisplay, blinkingCursor } = createChattingCard({ q: threadRow.question });
    answerDisplay.innerHTML = threadRow.response;
    blinkingCursor.parentElement.removeChild(blinkingCursor);
    return card;
  }
  function renderChattingDisplay() {
    return <div className='chatting-display-container'>
      {(!topicHash && !isLoading) && <ChattingInitParameterPanel
        translation={translation}
        isLogin={isLogin}
        initParameter={initParameter}
      />}
      <div
        ref={chattingDisplay}
        className='chatting-history-display'
        onTouchMove={onHistoryPanelScroll}
        onKeyDown={onHistoryPanelScroll}
        onMouseDown={onHistoryPanelScroll}
        onWheel={onHistoryPanelScroll}
      >
      </div>
    </div>
  }
  //////////////////////////////////////////
  const createChattingCard = ({ q }) => {
    const answerDisplay = createElement({ tagname_: "pre", class: "anwser-display" });
    const blinkingCursor = createElement({
      tagname_: "i",
      class: "fa-solid fa-terminal fa-sm fa-fade",
      style: "padding-bottom: 10vh;"
    });
    const card = createElement({
      class: "chatting-card animate-box animate-new-box",
      childs_: [
        {
          class: "question-div", childs_: [
            { tagname_: "span", class: "title", innerHTML: `${trans("Question", translation)}: ` },
            { tagname_: "span", innerText: q }
          ]
        },
        {
          class: "anwser-div", childs_: [
            { tagname_: "span", class: "title", innerText: `${trans('Anwser', translation)}: ` },
            answerDisplay,
            blinkingCursor
          ]
        },
      ]
    })
    return { card, answerDisplay, blinkingCursor };
  }

  //////////////////////////////////////////
  const onTextareaChange = (evt) => {
    inputCounter.current.innerText = evt.target.value.length;
  }
  const onHistoryPanelScroll = (evt) => {
    continueScroll = false;
  }
  const onSubmitClick = (evt) => {
    if (!isLoading && userInputTextarea.current.value.length > 4) {
      ///put a timeout count down to avoid freeze of the app, check the freeze time every second
      let timeoutCountDown = new Date().getTime();
      const controller = new AbortController();
      const { signal } = controller;
      const countDown = setInterval(() => {
        //if the app freeze by 5 seconds, clean up the mess and set loading to false to ready another request
        if (timeoutCountDown + 5000 < new Date().getTime()) {
          controller.abort();
          setIsLoading(false);
          clearInterval(countDown);
        }
      }, 1000);

      //count down function finish
      setIsLoading(true);
      //preparing data
      //const = markdownResponse = "; Provide your response in a markdown code block.";
      const history = lc_.readThread(topicHash);
      let messages, prompt, model, temperature, title, type;

      if (Array.isArray(history)) {
        //old chat
        messages = history[history.length - 1].messages;
        model = history[history.length - 1].model;
        temperature = history[history.length - 1].temperature;
        type = history[history.length - 1].type;
        title = history[history.length - 1].title;
      } else {
        //new chat
        prompt = initParameter.prompt;
        model = initParameter.model;
        temperature = initParameter.temperature;
        type = initParameter.type;
        title = initParameter.title;
      }

      if (messages !== undefined) {
        //if continue chat
        messages.push({
          role: "user",
          content: userInputTextarea.current.value
        })
      } else {
        //if new chat
        messages = [
          {
            role: "system",
            content: `${prompt || ""}`
          },
          {
            role: "user",
            content: userInputTextarea.current.value
          }
        ];
      }

      var fullContent = "";
      //preparing html elements
      const { card, answerDisplay, blinkingCursor } = createChattingCard({ q: userInputTextarea.current.value });
      chattingDisplay.current.append(card);
      //reset panel scroll, if user scroll in the process, it will stop scrolling
      chattingDisplay.current.scrollTop = chattingDisplay.current.scrollHeight;
      continueScroll = true;
      //fetch init

      fetch_.chatting_to_openai({ messages, model, temperature }, onData, signal);

      ////helper on data
      function onData(res) {

        try {
          //for timeout count time
          timeoutCountDown = new Date().getTime();
          for (let item of res) {
            const json = JSON.parse(item);
            if (json.onEnd) {
              // on end 
              blinkingCursor.parentElement.removeChild(blinkingCursor);
              setIsLoading(false);
              clearInterval(countDown);
              //call the end before clear the user input
              requestOnEnd(model, temperature, messages, fullContent);

              userInputTextarea.current.value = "";
            } else if (json.error) {
              //on error
              throw new Error(json.error);
            } else if (json.data.content) {
              //on data
              fullContent += json.data.content;
              answerDisplay.innerHTML += json.data.content;
              if (continueScroll) {
                chattingDisplay.current.scrollTop = chattingDisplay.current.scrollHeight;
              }
            }
          }
        } catch (error) {
          if (blinkingCursor.parentElement) blinkingCursor.parentElement.removeChild(blinkingCursor);
          console.log("error", res, error);
          card.append(createElement({
            class: "error",
            innerHTML: `${trans('error', translation)}: ${error.message}`
          }));
          addMessage(
            trans("Chatting Page"),
            error.message,
            "error"
          );
          setIsLoading(false);
          clearInterval(countDown);
          controller.abort();
        }

      }
      function requestOnEnd(model, temperature, messages, fullContent) {
        if (topicHash === undefined) {
          //new topic
          const textValue = userInputTextarea.current.value;
          topicHash = createHashFromStr(textValue + new Date().toLocaleString());
          setTopichash(topicHash);
          lc_.saveChat(topicHash, { model, temperature, question: textValue, messages, response: fullContent, type, title });
          setThreadList(lc_.readThreadsAsArray());
        } else {
          //old topic
          const textValue = userInputTextarea.current.value;
          lc_.saveChat(topicHash, { model, temperature, question: textValue, messages, response: fullContent, type, title });
        }
      }
    }
  }
  //////////////////////////////////////////
  return <div className='chatting-history-content-panel'>
    <div></div>
    {renderChattingDisplay()}
    <div className='chatting-question-input-panel'>
      <div className='input'>
        <textarea
          placeholder={trans('type in you question in here.', translation)}
          readOnly={isLoading}
          disabled={isLoading}
          ref={userInputTextarea}
          maxLength={10000}
          onChange={onTextareaChange}
        />
      </div>
      <div className='submit-button'>
        <span><span ref={inputCounter}>0</span>/10000</span>
        <button className='c-hand btn' onClick={onSubmitClick}>
          {isLoading ? <LoadingIcon /> : trans("Send", translation)}
        </button>
      </div>
    </div>
    <div></div>
  </div>
}