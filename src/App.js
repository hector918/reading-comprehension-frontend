import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './pages/landing';
import ReadingPage from './pages/reading-page';
import NavBar from './components/navbar';
import { useEffect, useState } from 'react';
import fe_ from './fetch_';
import {MessageFooter, addMessage} from './components/message-footer';
/////////////////////
function App() {
  let [translation, setTranslation] = useState({});
  let [language, setLanguage] = useState({availableList: [],currentLanguage: "english.json"});
  let [userInfo, setUserInfo] = useState({});
  // document.title = "Reading Comprehension - v0.02";
  //////////////////////////////////////////
  useEffect(()=>{
    fe_.getLanguages(({availableList, currentLanguage, translation}) => {
      if(availableList && currentLanguage) setLanguage({availableList, currentLanguage});
      if(translation) setTranslation(translation);
    });
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
            <Route path="/" element={<Landing 
              translation = {translation}
              isLogin = {isLogin}
            />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
