import React, { useEffect, useRef, useState } from "react";
import './moving-gallery.css';
import fe_ from '../fetch_';
import stroage_ from '../stroage_';
import {setFileHash, trans} from '../general_';
import { useNavigate } from "react-router-dom";
import {addMessage} from './message-footer';

export default function MovingGallery(){
  const [cards, setCards] = useState({
    popular:{mainSerial:[], repeatSerial:[]}
  });
  const cardsRef = useRef(cards);
  const navigation = useNavigate();
  //////////////////////////////////////
  useEffect(()=>{
    stroage_.getDocuments(({data}) => {
      if(!data) return;
      //remove timestamp, timestamp only for storage to check data during.
      delete data.timestamp;
      //check key and try to render it
      for(let key in data){
        cardsRef.current[key] = {
          mainSerial: [],
          repeatSerial: []
        }
        data[key].forEach((document) => {
          cardsRef.current[key].mainSerial.push(document);
          cardsRef.current[key].repeatSerial.push(document);
        })
      }
      setCards({...cardsRef.current});
    });
  }, [])
  
  ///////////////////////////////////////////////
  function card_templete(json, idx){
    return <div 
      className = "carousel__slide carousel__slide_forward" 
      key = {`carousel-slide-${idx}`} 
      onClick = {cardOnClick}
      filehash = {json.fileHash}
    >
      <div className="carousel__image" style={{backgroundImage:`url(${fe_.pdfThumbnailPrefix}/${json.fileHash})`}}></div>
    </div>
  }
  ////////////////////////////////////////////////
  const cardOnClick = (evt) => {
    const fileHash = evt.currentTarget.getAttribute("filehash");
    // setFileHash(fileHash);
    navigation(`/reading/${fileHash}`);
  }
  ////////////////////////////////////////////////
  return <div className="moving-gallery-div">
        
    <section className="">

      <div className="container-fluid px-0">
        <div className="gap-h">
          <span>Shared documents &darr;</span>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="carousel__wrapper carousel_forward">
              {cards.popular?.mainSerial.map(card_templete)}
              {/* <!--#### repeat ####--> */}
              {cards.popular?.repeatSerial.map(card_templete)}
            </div>
          </div>
        </div>
        <div className="gap-h">
          <span>Chat history &darr;</span>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="carousel__wrapper carousel_backward">
              {cards.collection?.mainSerial.map(card_templete)}
              {/* <!--#### repeat ####--> */}
              {cards.collection?.repeatSerial.map(card_templete)}
            </div>
          </div>
        </div>
        <div className="gap-h">
          <span>Random &darr;</span>

        </div>

        <div className="row third-row">
          <div className="col-12">
            <div className="carousel__wrapper carousel_forward">
              {cards.favorite?.mainSerial.map(card_templete)}
              {/* <!--#### repeat ####--> */}
              {cards.favorite?.repeatSerial.map(card_templete)}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
}