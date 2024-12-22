import React, { useState } from "react";
import { shortenURL } from "../api";

const Shortener = () => {
  const [longUrl, setLongUrl] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await shortenURL(longUrl, expirationDate);
      console.log(response)
      setShortUrl(response.data.shortUrl);
    } catch (error) {
      console.error("Error shortening URL:", error);
    }
  };

  return (
    <div className="shortener">
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
        />
        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        />
        <button type="submit">Shorten</button>
      </form>
      {shortUrl && (
        <div className="result">
          <p>Shortened URL: <a href={shortUrl}>{shortUrl}</a></p>
          <button onClick={() => navigator.clipboard.writeText(shortUrl)}>
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default Shortener;
