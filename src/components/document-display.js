import { useEffect, useState, useRef } from 'react';
import './document-display.css';
import {extractTextAndImageFromPDF} from '../pdf-wrapper_';
import fe_ from '../fetch_';
import {change_setFileHash} from '../general_';
////////////////////////////////////
export default function DocumentDisplay({translation, isLogin}){
  const [fileHash, setFileHash] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const render_container = useRef(null);
////////////////////////////////////
  change_setFileHash(setFileHash);
  useEffect(() => {
    //
    if(fileHash !== undefined) {
      setIsLoading(true);
      const container = render_container.current;
      //clear the container
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      fe_.downloadFile(fileHash, (res)=>{
        if(res.error){
          //
          console.log(res.error);
        }else{
          console.log(res.data);
        }
      })
    }

  }, [fileHash, isLoading]);

  return <div className='document-display'>
    <div ref={render_container} ></div>
  </div>
}