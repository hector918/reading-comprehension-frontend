import { useRef, useState } from 'react';
import './document-menu-bar.css';
import {createFileHash, trans} from '../general_';
import fe_ from '../fetch_';
import {MessageFooter, addMessage} from '../components/message-footer';

/////////////////////////////////////////////////
export default function DocumentMenuBar({translation}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState([trans("Click me to upload file...", translation)]);
  const fileInput = useRef(null);
  const onUploadClick = (evt) => {
    fileInput.current.click();
  }
  const OnUploadInputChange = async(evt) => {
    const file = evt.target.files[0];
    if (file && !isUploading) {
      setIsUploading(true);
      setUploadingStatus([trans("Start upload...", translation)]);
      setUploadingStatus(pv => [...pv, trans("File name:", translation) + ` ${file.name}`]);

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
    <div><span><i className="icon icon-apps"></i>Library</span></div>

  </div>
}