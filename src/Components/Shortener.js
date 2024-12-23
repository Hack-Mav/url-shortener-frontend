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
      <h2 style={{ color: "#6200ea", marginBottom: "20px" }}>Shorten Your URL</h2>

      <form onSubmit={handleSubmit} style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
        {/* Long URL Input */}
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

        {/* Expiration Date Input */}
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
        <button
          type="submit"
          style={{
            width: "100%",
            height: "50px",
            fontSize: "16px",
            backgroundColor: "#6200ea",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Shorten URL
        </button>
      </form>

      {/* Output Section */}
      {shortUrl && (
        <div
          className="result"
          style={{
            marginTop: "20px",
            padding: "20px",
            backgroundColor: "#f4f4f9",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p style={{ color: "#6200ea", fontWeight: "bold" }}>Shortened URL:</p>
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
              backgroundColor: "#6200ea",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
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
