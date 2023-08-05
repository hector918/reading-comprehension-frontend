import { useEffect, useState, useRef } from 'react';
import './document-display.css';
import {extractTextAndImageFromPDF, init} from '../pdf-wrapper_';
import fe_ from '../fetch_';
import {trans} from '../general_';
import {addMessage} from './message-footer';
import LoadingIcon from './loading-icon';
////////////////////////////////////

export default function DocumentDisplay({translation, isLogin, fileHash, setPagesCount}){
  const [isLoading, setIsLoading] = useState(false);
  const render_container = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  init();
  ////////////////////////////////////
  useEffect(() => {
    if(fileHash !== undefined && render_container.current) {
      setIsLoading(trans("Loading file", translation));
      const container = render_container.current;
      //clear the container
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      init(() => {
        processPdfHash(() => setIsLoading(false));
      })
      
    }
    async function processPdfHash(callback){
      try {
        const pdfContent = await extractTextAndImageFromPDF(fe_.pdfLinkPrefix + `/${fileHash}`);
        setIsLoading(trans("Rendering page", translation));
        setTimeout(() => {
          render_pdf_page(pdfContent);
        }, 100);
      } catch (error) {
        console.error(error);
        addMessage(trans("processing PDF"), trans(error.message), "error");
        setErrorMessage(trans(error.message, translation));
      }
      
      function render_pdf_page(pdf_content){
        let elements_list = [];
        let pagesCount = 0;
        pdf_content.forEach((el, idx) => {
          pagesCount++;
          const div = ce({id: `anchor-page-number-${idx + 1}`});
          const p = ce({tagName: "p", innerHTML: `page: ${idx + 1}`,  class: "page-separator"})
          div.append(p);
          elements_list.push(div);
          //rendering images
          for(let img of el.imgs){
            let canvas = ce({tagName: "canvas"});
            div.append(canvas);
            createImageBitmap(img.bitmap).then((ret)=>{
              canvas.width = ret.width;
              canvas.height = ret.height;
              canvas.getContext('2d').drawImage(ret, 0, 0);
            })
          }
          //rendering text
          var page_p = ce({tagName: "p"});
          for(let text of el['text']['items']){
            let span = ce({tagName: "span", innerHTML: text.str + " "});
            page_p.append(span);
            if(text.hasEOL){
              if(/[^\w\s-—]$/.test(text.str.trim())){
                div.append(page_p);
                page_p = ce({tagName: "p"});
              } 
            }
          }
          div.append(page_p);
          
        });
        setPagesCount(pagesCount);
        render_container.current.append(...elements_list);
        callback();
      }
     
      //////helper//////////////////////
      function ce(obj){
        let el = document.createElement(obj.tagName || "div");
        for(let x in obj)switch(x){
          case "tagName": break;
          case "innerText": case "innerHTML": el[x] = obj[x]; break;
          default: el.setAttribute(x, obj[x]);
        }
        return el;
      }
    }
  }, [fileHash, translation, setPagesCount]);
////////////////////////////////////
  function renderContainer(){
    if(errorMessage !== ""){
      return <div className='loging-icon-div'>
        <h1 className='red'> {errorMessage} </h1>
      </div>
    }else if(isLoading){
      return <div className='loging-icon-div'>
        <h1> {isLoading} <LoadingIcon/></h1>
      </div>
    }
  }
////////////////////////////////////
  return <div className='document-display'>
    {renderContainer()}
    <div ref={render_container} ></div>
  </div>
}