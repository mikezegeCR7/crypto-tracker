import { useState, useEffect } from "react";
import axios from "axios";

function NewsCard({ article }) {
  const date = new Date(article.pubDate).toLocaleDateString();

  return (
    <div className="news-card" onClick={() => window.open(article.link, "_blank")}>
      {article.image_url && (
        <img src={article.image_url} alt={article.title} className="news-image" onError={(e) => { e.target.style.display = "none"; }} />
      )}
      <div className="news-content">
        <p className="news-source">{article.source_id}</p>
        <h3 className="news-headline">{article.title}</h3>
        <p className="news-body">{article.description ? article.description.slice(0, 100) + "..." : ""}</p>
        <p className="news-date">{date}</p>
      </div>
    </div>
  );
}

function CryptoNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://newsdata.io/api/1/news?apikey=pub_fdfe3c91d1cc477fa02296e1f9890662&q=crypto&language=en&category=business")
      .then((res) => {
        setNews(res.data.results.slice(0, 12));
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load news right now.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ color: "var(--text-secondary)", padding: "20px" }}>Loading news...</p>;
  if (error) return <p style={{ color: "var(--text-secondary)", padding: "20px" }}>{error}</p>;
  if (news.length === 0) return <p style={{ color: "var(--text-secondary)", padding: "20px" }}>No news available.</p>;

  return (
    <div className="news-section">
      <h2 className="news-title">📰 Latest Crypto News</h2>
      <div className="news-grid">
        {news.map((article, index) => (
          <NewsCard key={index} article={article} />
        ))}
      </div>
    </div>
  );
}

export default CryptoNews;