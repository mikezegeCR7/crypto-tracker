import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const cache = {};

function CoinDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(7);
  const retryTimeout = useRef(null);

  useEffect(() => {
    const fetchCoin = async (retryCount = 0) => {
      try {
        setLoading(true);
        setError(null);

        const cacheKey = `${id}-${days}`;

        if (cache[cacheKey]) {
          setCoin(cache[cacheKey].coin);
          setChartData(cache[cacheKey].chartData);
          setLoading(false);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const [coinRes, chartRes] = await Promise.all([
          axios.get(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`),
          axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`)
        ]);

        const formatted = chartRes.data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price: parseFloat(price.toFixed(2))
        }));

        cache[cacheKey] = { coin: coinRes.data, chartData: formatted };

        setCoin(coinRes.data);
        setChartData(formatted);
        setError(null);
      } catch (err) {
        if (retryCount < 3) {
          retryTimeout.current = setTimeout(() => {
            fetchCoin(retryCount + 1);
          }, 3000);
        } else {
          setError("Failed to load coin details. Please wait a moment and try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCoin();

    return () => {
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
    };
  }, [id, days]);

  if (loading) return (
    <div className="status-message">
      <p>⏳ Loading coin details...</p>
      <p style={{ fontSize: "0.8rem", marginTop: "8px", color: "var(--text-secondary)" }}>This may take a few seconds</p>
    </div>
  );

  if (error) return (
    <div className="status-message">
      <p style={{ color: "var(--negative)", marginBottom: "16px" }}>{error}</p>
      <button className="back-btn" onClick={() => { setError(null); setLoading(true); window.location.reload(); }}>
        🔄 Try Again
      </button>
      <button className="back-btn" style={{ marginLeft: "10px" }} onClick={() => navigate(-1)}>
        ← Go Back
      </button>
    </div>
  );

  if (!coin) return null;

  const isPositive = coin.market_data.price_change_percentage_24h >= 0;

  return (
    <div className="coin-detail-wrapper">

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="coin-detail-header">
        <img src={coin.image.large} alt={coin.name} width={56} height={56} />
        <div>
          <h1 className="coin-detail-name">{coin.name}
            <span className="coin-detail-symbol">{coin.symbol.toUpperCase()}</span>
          </h1>
          <p className="coin-detail-rank">Rank #{coin.market_cap_rank}</p>
        </div>
        <div className="coin-detail-price-block">
          <h2 className="coin-detail-price">
            ${coin.market_data.current_price.usd.toLocaleString()}
          </h2>
          <span className={isPositive ? "positive" : "negative"}>
            {isPositive ? "▲" : "▼"} {Math.abs(coin.market_data.price_change_percentage_24h).toFixed(2)}% (24h)
          </span>
        </div>
      </div>

      <div className="coin-stats-grid">
        <div className="coin-stat-card">
          <p>Market Cap</p>
          <h3>${coin.market_data.market_cap.usd.toLocaleString()}</h3>
        </div>
        <div className="coin-stat-card">
          <p>24h Volume</p>
          <h3>${coin.market_data.total_volume.usd.toLocaleString()}</h3>
        </div>
        <div className="coin-stat-card">
          <p>Circulating Supply</p>
          <h3>{coin.market_data.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}</h3>
        </div>
        <div className="coin-stat-card">
          <p>All Time High</p>
          <h3 style={{ color: "var(--positive)" }}>${coin.market_data.ath.usd.toLocaleString()}</h3>
        </div>
        <div className="coin-stat-card">
          <p>All Time Low</p>
          <h3 style={{ color: "var(--negative)" }}>${coin.market_data.atl.usd.toLocaleString()}</h3>
        </div>
        <div className="coin-stat-card">
          <p>Total Supply</p>
          <h3>{coin.market_data.total_supply ? coin.market_data.total_supply.toLocaleString() : "∞"}</h3>
        </div>
      </div>

      <div className="coin-chart-section">
        <div className="coin-chart-header">
          <h3>Price Chart</h3>
          <div className="chart-days">
            {[7, 14, 30, 90].map((d) => (
              <button
                key={d}
                className={`chart-day-btn ${days === d ? "active" : ""}`}
                onClick={() => setDays(d)}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text-secondary)" }} interval={Math.floor(chartData.length / 6)} />
            <YAxis tick={{ fontSize: 10, fill: "var(--text-secondary)" }} domain={["auto", "auto"]} width={80} tickFormatter={(v) => `$${v.toLocaleString()}`} />
            <Tooltip
              formatter={(value) => [`$${value.toLocaleString()}`, "Price"]}
              contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-primary)" }}
            />
            <Line type="monotone" dataKey="price" stroke={isPositive ? "var(--positive)" : "var(--negative)"} dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {coin.description.en && (
        <div className="coin-description">
          <h3>About {coin.name}</h3>
          <p dangerouslySetInnerHTML={{ __html: coin.description.en.split(". ").slice(0, 5).join(". ") + "." }} />
        </div>
      )}

      <div className="coin-links">
        {coin.links.homepage[0] && (
          <a href={coin.links.homepage[0]} target="_blank" rel="noreferrer" className="coin-link-btn">
            🌐 Website
          </a>
        )}
        {coin.links.subreddit_url && (
          <a href={coin.links.subreddit_url} target="_blank" rel="noreferrer" className="coin-link-btn">
            💬 Reddit
          </a>
        )}
        {coin.links.blockchain_site[0] && (
          <a href={coin.links.blockchain_site[0]} target="_blank" rel="noreferrer" className="coin-link-btn">
            🔗 Explorer
          </a>
        )}
      </div>

    </div>
  );
}

export default CoinDetail;