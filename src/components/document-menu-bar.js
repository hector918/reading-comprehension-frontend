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
  const cardTemplete = (json) => {
    return <div className=''>

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
      console.log(data);
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
  /////////////////////////////////
  return <div className='document-menu-bar'>
    <div 
      className={`popover popover-bottom ${isUploading?"c-not-allowed":"c-hand"}`} 
      onClick={onUploadClick}
    >
      <span><i className="icon icon-upload"></i>{trans("Upload", translation)}</span>
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
      <span className='c-hand' onClick={openLibraryClick}><i className="icon icon-apps"></i>{trans("Library", translation)}</span>
      {/* // */}
      <div ref={libraryModal} className="modal modal-lg">
        <span href="#close" className="modal-overlay" aria-label="Close"></span>
        <div className="modal-container">
          <div className="modal-header"><span className="btn btn-clear float-right" href="#modals-sizes" aria-label="Close" onClick={openLibraryClick}></span>
            <div className="modal-title h3">{trans("Library", translation)}</div>
          </div>
          <div className="modal-body">
            <div className="content">
              {libraryData.map((el, idx) => <div className='library-content-card' key={`library-content-div-${idx}`} style={{backgroundImage:`url(${fe_.pdfThumbnailPrefix}/${el.filehash})`}}>
                {/* <span>{el.filehash}</span> */}
                <div>
                  <span>{el.name}</span>
                </div>
                
                <div>
                  <div>bookmark</div>
                  <div>delete</div>
                </div>
                
                
              </div>)}
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