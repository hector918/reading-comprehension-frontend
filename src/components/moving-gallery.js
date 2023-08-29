import React, { useEffect, useState } from "react";
import './moving-gallery.css';
import fe_ from '../fetch_';
import stroage_ from '../stroage_';
import {trans} from '../general_';
import {Link} from "react-router-dom";
import LoadingIcon from "./loading-icon";
//////////////////////////////////////
export default function MovingGallery({translation}){
  const [cards, setCards] = useState({});
  //////////////////////////////////////
  useEffect(()=>{
    stroage_.getDocuments(({data}) => {
      if(!data) return;
      //remove timestamp, timestamp only for storage to check data during.
      delete data.timestamp;
      const ret = {}
      //check key and try to render it
      for(let key in data){
        ret[key] = {
          mainSerial: [],
          repeatSerial: []
        }
        data[key].forEach((document) => {
          ret[key].mainSerial.push(document);
          ret[key].repeatSerial.push(document);
        })
      }
      setCards({...ret});
    });
  }, [])
  ///////////////////////////////////////////////
  function card_templete(json, idx){
    return <Link 
      className = "carousel__slide carousel__slide_forward" 
      key = {`carousel-slide-${idx}`} 
      to={`/reading/${json.fileHash}`}
      filehash = {json.fileHash}
    >
      <div><LoadingIcon size={'fa-2xl'}/></div>
      <img 
        className = "carousel__image is-not-visable-h" 
        src = {`${fe_.pdfThumbnailPrefix}/${json.fileHash}`}
        onLoad = {backgroundImageOnLoad}
        alt = {json.meta.name}
        title = {json.meta.name}
      />
    </Link>
  }
  
  ////////////////////////////////////////////////
  const backgroundImageOnLoad = (evt) => {
    const displayNone = 'is-not-visable-h';
    evt.currentTarget.previousElementSibling.classList.add(displayNone)
    evt.currentTarget.classList.remove(displayNone);
  }
  ////////////////////////////////////////////////
  return <div className="moving-gallery-div">
    <section className="">
      <div className="container-fluid px-0">
        {/* {renderCardSubContainer(cards)} */}
        <div className="gap-h">
          <span>{trans("Random", translation)} &darr;</span>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="carousel__wrapper carousel_forward">
              {cards["Random"]?.mainSerial?.map(card_templete)}
              {/* <!--#### repeat ####--> */}
              {cards["Random"]?.repeatSerial?.map(card_templete)}
            </div>
          </div>
        </div>

        <div className="gap-h">
          <span>{trans("Classic", translation)} &darr;</span>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="carousel__wrapper carousel_backward">
              {cards["Classic"]?.mainSerial?.map(card_templete)}
              {/* <!--#### repeat ####--> */}
              {cards["Classic"]?.repeatSerial?.map(card_templete)}
            </div>
          </div>
        </div>

        <div className="gap-h">
          <span>{trans("History and Romance", translation)} &darr;</span>
        </div>
        <div className="row third-row">
          <div className="col-12">
            <div className="carousel__wrapper carousel_forward">
              {cards['History and Romance']?.mainSerial?.map(card_templete)}
              {/* <!--#### repeat ####--> */}
              {cards['History and Romance']?.repeatSerial?.map(card_templete)}
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
}