import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Header from "./Components/layout/Header";
import Footer from "./Components/layout/Footer";
import ErrorBoundary from "./Components/ui/ErrorBoundary";

// Lazy load components for code splitting
const Shortener = React.lazy(() => import("./Components/ui/Shortener"));
const BulkShortener = React.lazy(() => import("./Components/ui/BulkShortener"));
const History = React.lazy(() => import("./Components/ui/History"));
const HistoryInfinite = React.lazy(() => import("./Components/ui/HistoryInfinite"));

/**
 * Loading spinner component displayed during lazy loading
 * @returns {JSX.Element} Loading spinner with centered layout
 */
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50" role="status" aria-live="polite">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" aria-hidden="true"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

/**
 * Main application component that sets up routing, error boundaries, and global layout
 * @returns {JSX.Element} The complete application structure with routing
 */
const App: React.FC = () => (
  <Router>
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl" role="main" id="main-content">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Shortener />} />
                <Route path="/bulk" element={<BulkShortener />} />
                <Route path="/history" element={<History />} />
                <Route path="/history-infinite" element={<HistoryInfinite />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>

        <Footer />
      </div>
      <Toaster 
        position="top-right" 
        toastOptions={{
          ariaProps: {
            role: 'status',
            'aria-live': 'polite'
          }
        }}
      />
    </ErrorBoundary>
  </Router>
);

export default App;
