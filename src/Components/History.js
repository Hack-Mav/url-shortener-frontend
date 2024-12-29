import React, { useState, useEffect } from "react";
import { shortenURLHistory } from "../api";

const History = () => {
  // State to hold the fetched history
  const [history, setHistory] = useState([]);

  // State to handle loading and errors (optional but recommended)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the history when the component mounts
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);

        // Make sure to replace '/api/history' with your actual endpoint
        const response = await shortenURLHistory();

        if (response.status !== 200) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = response.data;

        console.log('data', data);
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div
      className="history"
      style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}
    >
      <h2 style={{ color: "#6200ea", marginBottom: "20px" }}>
        Shortened URL History
      </h2>

      {loading && <p>Loading history...</p>}

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          {history.length > 0 ? (
            <ul
              style={{
                listStyleType: "none",
                padding: "0",
                margin: "0",
              }}
            >
              {history.map((entry, index) => (
                <li
                  key={index}
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "15px",
                    marginBottom: "10px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    textAlign: "left",
                  }}
                >
                  <p>
                    <strong style={{ color: "#6200ea" }}>Long URL:</strong>{" "}
                    <a
                      href={entry.LongURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#4CAF50",
                        textDecoration: "none",
                      }}
                    >
                      {entry.LongURL}
                    </a>
                  </p>
                  <p>
                    <strong style={{ color: "#6200ea" }}>Shortened URL:</strong>{" "}
                    <a
                      href={`${process.env.REACT_APP_BASE_URL_FOR_URL_SHORTENER}/` +  entry.ShortID}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#4CAF50",
                        textDecoration: "none",
                      }}
                    >
                      {`${process.env.REACT_APP_BASE_URL_FOR_URL_SHORTENER}/` +  entry.ShortID}
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#666", fontSize: "16px" }}>
              No history available.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default History;
