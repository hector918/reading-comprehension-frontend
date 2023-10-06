import React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import './document-menu-bar.css';
import { createFileHash, trans, setFileHash } from '../general_';
import fe_ from '../fetch_';
import lc_ from '../stroage_';
import { addMessage } from '../components/message-footer';
/////////////////////////////////////////////////
export default function DocumentMenuBar({ translation, isLogin, pagesCount, pageNumberInput }) {
  const libraryModal = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState([]);
  const [libraryData, setLibraryData] = useState([]);
  const [recentsData, setRecentsData] = useState([]);
  const fileInput = useRef(null);
  //////////////////////////////////////
  setTimeout(() => {
    setUploadingStatus(defaultUploadTips());
  }, 1000);
  function defaultUploadTips() {
    if (isLogin()) {
      return [trans("Click me to upload file...", translation)];
    } else {
      return [trans("You need to login first.", translation)];
    }
  }
  ///////////////////////////////////////
  const cardTemplete = (cardData, idx) => {
    return <div
      className='library-content-card'
      key={`library-content-div-${idx}`}
      style={{ backgroundImage: `url(${fe_.pdfThumbnailPrefix}/${cardData.filehash})` }}
      onClick={onDocumentCardClick}
      filehash={cardData.filehash}
    >
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

  const readLibrary = useCallback((res) => {
    if (res.error) {
      addMessage(
        trans("Reading library", translation),
        trans(res.error, translation),
        'error'
      );
      // if return error remove state
      setLibraryData([]);
    } else if (res.data) {
      //if return data plug in to state
      setLibraryData(res.data);
      setRecentsData(res.data.slice(-5));
      ////little bit hack here, if recent more than 5 move the container to the center////////
      const recentsContainer = document.querySelector(".popover-container-for-recents");
      if (res.data.length > 4) {
        recentsContainer.classList.add('more-than-five-hack');
      } else {
        recentsContainer.classList.remove('more-than-five-hack');
      }
    }
  }, [translation])
  ///////////////////////////////////////////////
  useEffect(() => {
    if (isLogin()) lc_.getLibrary(readLibrary);
  }, [readLibrary, isLogin]);
  //////////////////////////////////////////////
  const onUploadClick = (evt) => {
    if (isLogin()) fileInput.current.click();
  }
  const OnUploadInputChange = async (evt) => {
    const file = evt.target.files[0];
    if (file && !isUploading) {
      setIsUploading(true);
      setUploadingStatus([
        trans("Start upload...", translation),
        trans("File name:", translation) + ` ${file.name}`
      ]);
      const fileHash = await createFileHash(file);
      const fileMeta = await fe_.uploadFileCheckExists(fileHash);
      setUploadingStatus(pv => [...pv, trans("File exists:", translation) + ` ${!fileMeta.error ? "true" : "false"}`]);
      if (fileMeta.error) {
        //if file not exists on the backend, upload init
        lc_.uploadPDF([evt.target.files[0]], (res) => {
          console.log(res);
          lc_.getLibrary(readLibrary);
          if (res.error) addMessage(
            trans("In upload file", translation),
            trans(res.error, translation),
            "error"
          );
        });

      } else {
        //if file exists on the backend
        ///add document to user library
        lc_.addDocumentToUser(fileHash, (res) => {
          lc_.getLibrary(readLibrary);
        })
        // addMessage()
      }
      //clear up after upload
      //clear file input value
      setUploadingStatus(defaultUploadTips());
      evt.target.value = "";
      setIsUploading(false);

      //hash of the old man and the sea
      //0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef
    }
  }

  const libraryModalClose = (evt) => {
    libraryModal.current.classList.remove("active");
  }
  const libraryModalPopup = (evt) => {
    libraryModal.current.classList.add("active");
  }
  function onDocumentCardClick(evt) {
    //stop event bubbling
    evt.stopPropagation();
    const fileHash = evt.currentTarget.getAttribute("filehash");
    setFileHash(fileHash);
    libraryModalClose();
  }
  const onDocPageControlConfirm = (evt) => {
    const page = evt.currentTarget.value;
    const element = document.querySelector(`#anchor-page-number-${page}`);
    if (element) element.scrollIntoView({ behavior: 'smooth' });

    //for replace the value update from scolling
    setTimeout(() => {
      pageNumberInput.current.value = page;
    }, 100);
  }
  /////////////////////////////////
  return <div className='document-menu-bar'>
    <div
      className={`popover popover-bottom ${isUploading ? "c-not-allowed" : "c-hand"}`}
      onClick={onUploadClick}
    >
      <span><i className="fa-solid fa-upload"></i>{trans("Upload", translation)}</span>
      <input
        ref={fileInput}
        type="file"
        style={{ display: "none" }}
        onChange={OnUploadInputChange}
        accept=".pdf"
      />
      <div className='icon-place-holder'>{isUploading ? <div className="loading"></div> : ""}</div>
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
      <span className='c-hand' onClick={libraryModalPopup}><i className="fa-solid fa-list"></i>{trans("Library", translation)}</span>
      {/* // */}
      <div ref={libraryModal} className="modal modal-lg">
        <span href="#close" className="modal-overlay" aria-label="Close"></span>
        <div className="modal-container">
          <div className="modal-header"><span className="btn btn-clear float-right c-hand" href="#modals-sizes" aria-label="Close" onClick={libraryModalClose}><i className="fa-solid fa-xmark close-button"></i></span>
            <div className="modal-title h3">{trans("Library", translation)}</div>
          </div>
          <div className="modal-body">
            <div className="content">
              {libraryData.map && libraryData.map(cardTemplete)}
            </div>
          </div>
          <div className="modal-footer">
            ...
          </div>
        </div>
      </div>
      <div className="popover-container bg-dark popover-container-for-recents">
        <div>{trans('Click again to open the Library.', translation)}</div>
        <hr></hr>
        <div>{trans('Recents', translation)}</div>
        <div className='popover-subcontainer-for-recents'>
          <div className='user-recents-documents-container'>
            {recentsData.length === 0
              ? <div>{trans('Your have no document.', translation)}</div>
              : recentsData.map(cardTemplete)
            }
          </div>
        </div>
      </div>
    </div>
    <div className='document-page-control tooltip tooltip-bottom' data-tooltip={trans('Edit this number and loses your mouse focus on the edit to go page.', translation)}>
      <span>
        <i className="fa-brands fa-golang fa-lg"></i>
        {trans('Page', translation)}:
      </span>
      <input
        type='number'
        min={1}
        max={pagesCount}
        onBlur={onDocPageControlConfirm}
        defaultValue={1}
        ref={pageNumberInput}
      />
    </div>
  </div>
}