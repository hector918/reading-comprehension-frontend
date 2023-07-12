import React, { useEffect, useRef, useState } from "react";
import './moving-gallery.css';
import fe from '../fetch_';
export default function MovingGallery(){
  const [cards, setCards] = useState({
    popular:{mainSerial:[], repeatSerial:[]}
  });
  const cardsRef = useRef(cards);
  useEffect(()=>{
    checkDocumentList();
    function checkDocumentList (){
      fe.getDocuments({},(data)=>{
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
    }
  }, [])
  
  ///////////////////////////////////////////////
  function card_templete(json, idx){
    return <div className="carousel__slide carousel__slide_forward" key={idx} onClick={cardOnClick}>
      <div className="carousel__image" style={{backgroundImage:`url(${fe.pdfThumbnailPrefix}/${json.fileHash})`}}></div>
    </div>
  }
  ////////////////////////////////////////////////
  const cardOnClick = (evt) => {
    console.log(evt.currentTarget)
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