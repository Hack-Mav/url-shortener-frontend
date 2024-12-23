import React from "react";

const History = () => {
  // For now, static history. Replace with API or local storage logic if needed.
  const history = [
    { longUrl: "https://example.com/long", shortUrl: "https://short.ly/abc" },
    { longUrl: "https://anotherexample.com", shortUrl: "https://short.ly/xyz" },
  ];

  return (
    <div className="history" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <h2 style={{ color: "#6200ea", marginBottom: "20px" }}>Shortened URL History</h2>
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
                  href={entry.longUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#4CAF50",
                    textDecoration: "none",
                  }}
                >
                  {entry.longUrl}
                </a>
              </p>
              <p>
                <strong style={{ color: "#6200ea" }}>Shortened URL:</strong>{" "}
                <a
                  href={entry.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#4CAF50",
                    textDecoration: "none",
                  }}
                >
                  {entry.shortUrl}
                </a>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "#666", fontSize: "16px" }}>No history available.</p>
      )}
    </div>
  );
};

export default History;
