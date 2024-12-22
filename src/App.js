import React from "react";
import Shortener from "./Components/Shortener";
import History from "./Components/History";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => (
  <Router>
    <div className="app">
      <h1>URL Shortener Service</h1>
      <Routes>
        <Route path="/" element={<Shortener />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </div>
  </Router>
);

export default App;
