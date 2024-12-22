import React from "react";

const History = () => {
  // For now, static history. Replace with API or local storage logic if needed.
  const history = [
    { longUrl: "https://example.com/long", shortUrl: "https://short.ly/abc" },
    { longUrl: "https://anotherexample.com", shortUrl: "https://short.ly/xyz" },
  ];

  return (
    <div className="history">
      <h2>Shortened URL History</h2>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            <p>Long URL: <a href={entry.longUrl}>{entry.longUrl}</a></p>
            <p>Shortened URL: <a href={entry.shortUrl}>{entry.shortUrl}</a></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
