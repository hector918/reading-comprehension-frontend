import React, { useEffect, useState } from "react";
import './moving-gallery.css';
import fe from '../fetch_';
export default function MovingGallery(){
  const [cards, setCards] = useState({
    popular:{mainSerial:[], repeatSerial:[]}
  });
  useEffect(()=>{
    checkDocumentList();
  }, [])
  
  function checkDocumentList (){
    fe.getDocuments({},(data)=>{
      
      for(let key in data){
        cards[key] = {
          mainSerial: [],
          repeatSerial: []
        }
        data[key].forEach((document) => {
          cards[key].mainSerial.push(document);
          cards[key].repeatSerial.push(document);
        })
        
      }
      setCards({...cards});
      console.log(cards);
      
    });
  }
  ///////////////////////////////////////////////
  function card_templete(json, idx){
    return <div className="carousel__slide carousel__slide_forward" key={idx}>
      <div className="carousel__image" style={{backgroundImage:`url(${fe.pdfThumbnailPrefix}/${json.fileHash})`}}></div>
      {/* <div className="carousel__image" key={idx} style={{backgroundImage:`url(${fe.pdfThumbnailPrefix}/${json.fileHash})`}}></div> */}
    </div>
  }
  ////////////////////////////////////////////////
  return <div className="moving-gallery-div">
    
<section className="">

  <div className="container-fluid px-0">
  <div className="row">
      <div className="col-12">
        <div className="carousel__wrapper carousel_forward">
          {cards.popular?.mainSerial.map(card_templete)}
          {/* <!--#### repeat ####--> */}
          {cards.popular?.repeatSerial.map(card_templete)}
        </div>
      </div>
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