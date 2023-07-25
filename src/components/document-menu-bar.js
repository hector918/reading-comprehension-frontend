import { useCallback, useEffect, useRef, useState } from 'react';
import './document-menu-bar.css';
import {createFileHash, trans} from '../general_';
import fe_ from '../fetch_';
import {MessageFooter, addMessage} from '../components/message-footer';

/////////////////////////////////////////////////
export default function DocumentMenuBar({translation, isLogin}) {
  const libraryModal = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState([trans("Click me to upload file...", translation)]);
  const [libraryData, setLibraryData] = useState([]);
  const fileInput = useRef(null);
  ///////////////////////////////////////

  const cardTemplete = (cardData, idx) => {
    return <div 
      className = 'library-content-card' 
      key = {`library-content-div-${idx}`} 
      style = {{backgroundImage:`url(${fe_.pdfThumbnailPrefix}/${cardData.filehash})`}}
      onClick = {onDocumentCardClick}
      filehash = {cardData.filehash}
    >
      {/* <span>{el.filehash}</span> */}
      <div className='card-info-container'>
        <div className='card-title'>
          <span>{cardData.name}</span>
        </div>
      </div>
      <div className='icon-container'>
          <div><i className={`fa-solid fa-trash fa-xl c-hand`}></i></div>
          <div><i className={`fa-solid fa-star fa-xl c-hand ${cardData.is_favorite && "icon-active"}`}></i></div>
          <div><i className={`fa-solid fa-share-nodes fa-xl ${cardData.is_share && "icon-active"} c-hand`}></i></div>
          
      </div>
    </div>
  }

  const readLibrary = useCallback((data) => {
    if(data.error){
      addMessage(
        trans("Reading library", translation),
        trans(data.error, translation),
        'error'
      );
    }else{
      setLibraryData(data);
    } 
  }, [translation])
  ///////////////////////////////////////////////
  useEffect(()=>{
    fe_.getLibrary(readLibrary);
  }, [readLibrary, isLogin]);
  //////////////////////////////////////////////
  const onUploadClick = (evt) => {
    fileInput.current.click();
  }
  const OnUploadInputChange = async(evt) => {
    const file = evt.target.files[0];
    if (file && !isUploading) {
      setIsUploading(true);
      setUploadingStatus([
        trans("Start upload...", translation), 
        trans("File name:", translation) + ` ${file.name}`
      ]);
      const fileHash = await createFileHash(file);
      const fileMeta = await fe_.uploadFileCheckExists(fileHash);
      setUploadingStatus(pv => [...pv, trans("File exists:", translation) + ` ${!fileMeta.error?"true":"false"}`]);
      if(fileMeta.error){
        //if file not exists on the backend
        // console.log("not exists", fileMeta);
        fe_.uploadFile([evt.target.files[0]], (data) => {
          console.log(data)
          if(data.error) addMessage(
            trans("In upload file", translation), 
            trans(data.error, translation), 
            "error"
          );
          console.error("in upload file", data);
        });

      }else{
        console.log("exists", fileMeta);
        //if file exists on the backend
        // addMessage()
      }
      //clear up after upload
      //clear file input value
      setUploadingStatus([trans("Click me to upload file...", translation)]);
      evt.target.value = "";
      setIsUploading(false);

      //hash of the old man and the sea
      //0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef
    }
  }
  const openLibraryClick = (evt) => {
    //
    libraryModal.current.classList.toggle("active");
  }
  function onDocumentCardClick(evt){
    console.log(evt);
  }
  /////////////////////////////////
  return <div className='document-menu-bar'>
    <div 
      className={`popover popover-bottom ${isUploading?"c-not-allowed":"c-hand"}`} 
      onClick={onUploadClick}
    >
      <span><i className="fa-solid fa-upload"></i>{trans("Upload", translation)}</span>
      <input 
        ref={fileInput} 
        type="file" 
        style={{ display: "none" }} 
        onChange={OnUploadInputChange} 
      />
      <div className='icon-place-holder'>{isUploading?<div className="loading"></div>:""}</div>
      {/*  */}
      <div className="popover-container bg-dark">
        <div className="card bg-dark">
          <div className="card-body">
            {uploadingStatus.map((el, idx) => <div key={`document-menu-popover-card-${idx}`}>{el}</div>)}
          </div>
        </div>
      </div>
    </div>
    <div className='popover popover-bottom'>
      <span className='c-hand' onClick={openLibraryClick}><i className="fa-solid fa-list"></i>{trans("Library", translation)}</span>
      {/* // */}
      <div ref={libraryModal} className="modal modal-lg">
        <span href="#close" className="modal-overlay" aria-label="Close"></span>
        <div className="modal-container">
          <div className="modal-header"><span className="btn btn-clear float-right c-hand" href="#modals-sizes" aria-label="Close" onClick={openLibraryClick}><i className="fa-solid fa-xmark close-button"></i></span>
            <div className="modal-title h3">{trans("Library", translation)}</div>
          </div>
          <div className="modal-body">
            <div className="content">
              {libraryData.map(cardTemplete)}
            </div>
          </div>
          <div className="modal-footer">
            ...
          </div>
        </div>
      </div>
      {/* // */}
      <div className="popover-container bg-dark">
        <div className="card bg-dark">
          <div className="card-body">
            "something in here"
          </div>
        </div>
      </div>
    </div>
    
  </div>
}