import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './pages/landing';
import ReadingPage from './pages/reading-page';
import NavBar from './components/navbar';
import { useEffect, useRef, useState } from 'react';
import fe_ from './fetch_';
import {throttle} from './general_';
import {MessageFooter, addMessage} from './components/message-footer';
import MobileLandingPage from './pages/mobile-landing-page';
import MobileNavbar from './mobile-only-components/mobile-navbar';
import Chatting from './pages/chatting.js';
const mobileDesttopScreenSizeTrigger = 750;
/////////////////////
function App() {
  let [translation, setTranslation] = useState({});
  let [language, setLanguage] = useState({availableList: [],currentLanguage: "english.json"});
  let [userInfo, setUserInfo] = useState({});
  let [screenWidthMatch, setScreenWidthMatch] = useState(!window.matchMedia(`(max-width: ${mobileDesttopScreenSizeTrigger}px)`).matches);
  const signInUpButton = useRef(null);
  //////////////////////////////////////////
  //check screen size, for keeping the cpu usage low, build a throttle to limit the Frequent.
  const throttleMoveFn = throttle(() => {
    const ret = !window.matchMedia(`(max-width: ${mobileDesttopScreenSizeTrigger}px)`).matches;
    if(screenWidthMatch !== ret) setScreenWidthMatch(ret);
  }, 100);
  window.addEventListener("resize", (evt) => {
    throttleMoveFn();
  })
  //////////////////////////////////////////
  useEffect(()=>{
    try {
      fe_.getLanguages(({availableList, currentLanguage, translation}) => {
        if(availableList && currentLanguage) setLanguage({availableList, currentLanguage});
        if(translation) setTranslation(translation);
      });
    } catch (error) {
      
    }
    
    fe_.checkLoginStatus((data)=>{
      setUserInfo(data.data);
    });
    
  }, [])
  //////////////////////////////////////////
  const isLogin = () => {
    try {
      return userInfo.username ? true : false;
    } catch (error) {
      return false;
    }
  }
  //////////////////////////////////////////
  return (
    <div className="App">
      <link rel="stylesheet" href="https://unpkg.com/transition-style"></link>
      {screenWidthMatch 
        ?//desktop version
        <Router>
          <NavBar 
            language = {language} 
            setLanguage = {setLanguage} 
            setTranslation = {setTranslation} 
            translation = {translation}
            addMessage = {addMessage}
            userInfo = {userInfo}
            setUserInfo = {setUserInfo}
            isLogin = {isLogin}
            signInUpButton = {signInUpButton}
          />
          <MessageFooter translation={translation}/>
          <main>
            <Routes>
              <Route path="/reading/:filehash" element={<ReadingPage 
                translation = {translation} 
                isLogin = {isLogin}
              />} />
              <Route path="/reading" element={<ReadingPage 
                translation = {translation} 
                isLogin = {isLogin}
              />} />
              <Route path="/chatting" element={<Chatting 
                translation = {translation} 
                isLogin = {isLogin}
              />} />
              <Route path="/" element={<Landing 
                translation = {translation}
                isLogin = {isLogin}
                signInUpButton = {signInUpButton}
              />} />
            </Routes>
          </main>
        </Router>
        ://mobile version
        <Router>
          <MobileNavbar
            language = {language} 
            setLanguage = {setLanguage} 
            setTranslation = {setTranslation} 
            translation = {translation}
            addMessage = {addMessage}
            userInfo = {userInfo}
            setUserInfo = {setUserInfo}
            isLogin = {isLogin}
          />
          <main>
            <Routes>
              <Route path='*' element={
                <MobileLandingPage />
              }></Route>
            </Routes>
          </main>
        </Router>
      }
    </div>
  );
}

export default App;
