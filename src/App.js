// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './pages/landing';
import NavBar from './components/navbar';
/////////////////////

function App() {
  document.title = "Reading Comprehension - v0.02";
  return (
    <div className="App">
      {/* <link rel="stylesheet" href="./bulma@0.9.4.min.css"></link>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css"></link> */}
      <link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre.min.css"/>
      <link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre-exp.min.css"/>
      <link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre-icons.min.css"></link>
      <Router>
        <NavBar />

        <main>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            {/* <Route path="/welcome" element={<Welcome />} /> */}
            {/* <Route path="/about" element={<About />} /> */}
            {/* <Route path="/login" element={<Navigation />} /> */}
            {/* <Route path="/assistance" element={<ReadingAssistance />} /> */}
            {/* <Route path="/comprehension" element={<ReadingComprehension />} /> */}
            {/* <Route path="/framework-testing" element={<AllInOneFramework />} /> */}
            <Route path="/" element={<Landing />} />
            {/* <Route path="/testing_fetch" element={<TestOnly />} /> */}
            {/* <Route path="/userwalkthrough" element={<UserGuide />} /> */}
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
