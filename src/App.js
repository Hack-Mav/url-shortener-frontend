import React from "react";
import Shortener from "./Components/Shortener";
import History from "./Components/History";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css"; // Add your custom styles here

const App = () => (
  <Router>
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>URL Shortener Service</h1>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/history">History</Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Shortener />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} URL Shortener Service</p>
      </footer>
    </div>
  </Router>
);

export default App;
