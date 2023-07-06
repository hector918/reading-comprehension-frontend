// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './pages/landing';
import NavBar from './components/navbar';
import { useEffect, useState } from 'react';
import fe_ from './fetch_';
import {MessageFooter, addMessage} from './components/message-footer';
/////////////////////

function App() {
  let [translation, setTranslation] = useState({});
  let [language, setLanguage] = useState({availableList: [],currentLanguage: "english.json"});
  // document.title = "Reading Comprehension - v0.02";
  //////////////////////////////////////////
  useEffect(()=>{
    fe_.getLanguages(({availableList, currentLanguage, translation}) => {
      if(availableList && currentLanguage) setLanguage({availableList, currentLanguage});
      if(translation) setTranslation(translation);
    });
  }, [])
  
  //////////////////////////////////////////
  return (
    <div className="App">
      {/* <link rel="stylesheet" href="./bulma@0.9.4.min.css"></link>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css"></link> */}
      <link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre.min.css"/>
      <link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre-exp.min.css"/>
      <link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre-icons.min.css"></link>
      <Router>
        <NavBar 
          language={language} 
          setLanguage={setLanguage} 
          setTranslation={setTranslation} 
          translation={translation}
          addMessage={addMessage}
        />
        <MessageFooter translation={translation}/>
        <main>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            {/* <Route path="/welcome" element={<Welcome />} /> */}
            {/* <Route path="/about" element={<About />} /> */}
            {/* <Route path="/login" element={<Navigation />} /> */}
            {/* <Route path="/assistance" element={<ReadingAssistance />} /> */}
            {/* <Route path="/comprehension" element={<ReadingComprehension />} /> */}
            {/* <Route path="/framework-testing" element={<AllInOneFramework />} /> */}
            <Route path="/" element={<Landing translation={translation}/>} />
            {/* <Route path="/testing_fetch" element={<TestOnly />} /> */}
            {/* <Route path="/userwalkthrough" element={<UserGuide />} /> */}
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
