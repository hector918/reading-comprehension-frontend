import { useRef } from 'react';
import './document-menu-bar.css';
import sha256 from 'crypto-js/sha256';

export default function DocumentMenuBar(){
  const fileInput = useRef(null);
  const onUploadClick = (evt) => {
    fileInput.current.click();
  }
  const OnUploadInputChange = (evt) => {
    console.log(evt);
    if (evt.target.files[0]) {
      var reader = new FileReader();
      reader.onload = function (event) {
         var data = event.target.result;
         var encrypted = sha256(data).toString();
         console.log(encrypted)
      };
      reader.readAsArrayBuffer(evt.target.files[0]);
      
      // setIsLoading(true); //start animation loading

      // lc.uploadFile(evt.target, (data) => {
      //   evt.target.value = "";
      //   // setIsLoading(false);
      //   if (data === false) return;
      //   update_recents();
      //   // pop_frame(1);

      //   if (data.fileHash) setCurrentFileHash(data.fileHash);
      // });
    }
  }
  /////////////////////////////////
  return <div className='document-menu-bar'>
    <div onClick={onUploadClick}>
      <span><i class="icon icon-upload"></i>Upload</span>
      <input ref={fileInput} type="file" style={{ display: "none" }} onChange={OnUploadInputChange} />
    </div>
    <div><span><i class="icon icon-apps"></i>Library</span></div>

  </div>
}