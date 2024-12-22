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
      console.log(response);
      setShortUrl(response.data.short_url);
    } catch (error) {
      console.error("Error shortening URL:", error);
    }
  };

  return (
    <div className="shortener" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <form onSubmit={handleSubmit}>
        {/* Long URL input */}
        <input
          type="url"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
          style={{
            width: "100%",
            height: "50px",
            fontSize: "16px",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        {/* Expiration Date input */}
        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          style={{
            width: "100%",
            height: "50px",
            fontSize: "16px",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        {/* Submit Button */}
        <button type="submit" style={{ width: "100%", height: "50px", fontSize: "16px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px" }}>
          Shorten
        </button>
      </form>

      {/* Output Section */}
      {shortUrl && (
        <div className="result" style={{ marginTop: "20px" }}>
          <p>Shortened URL:</p>
          <input
            type="text"
            readOnly
            value={shortUrl}
            style={{
              width: "100%",
              height: "50px",
              fontSize: "16px",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={() => navigator.clipboard.writeText(shortUrl)}
            style={{
              width: "100%",
              height: "50px",
              fontSize: "16px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default Shortener;
