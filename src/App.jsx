import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useCrypto } from "./useCrypto";
import CoinTable from "./components/CoinTable";
import CryptoNews from "./components/CryptoNews";
import CoinDetail from "./CoinDetail";
import Login from "./Login";
import "./App.css";

const CURRENCIES = ["usd", "eur", "gbp"];
const CURRENCY_SYMBOLS = { usd: "$", eur: "€", gbp: "£" };

function Dashboard({ user, handleLogout }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [currency, setCurrency] = useState("usd");

  const { coins, loading, error, refetch } = useCrypto(currency);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const filteredCoins = coins
    .filter((coin) => coin.name.toLowerCase().includes(search.toLowerCase()))
    .filter((coin) => (showFavorites ? favorites.includes(coin.id) : true));

  const totalMarketCap = coins.reduce((acc, coin) => acc + coin.market_cap, 0);
  const totalVolume = coins.reduce((acc, coin) => acc + coin.total_volume, 0);
  const symbol = CURRENCY_SYMBOLS[currency];

  if (loading) return <div className="status-message">⏳ Fetching market data...</div>;
  if (error) return <div className="status-message" style={{ color: "var(--negative)" }}>{error}</div>;

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <div className="header">
        <div className="header-left">
          <h1>🪙 CryptoTracker</h1>
          <p>Live prices updated every 60 seconds</p>
        </div>
        <div className="header-right">
          <div className="user-info">
            {user.photoURL && <img src={user.photoURL} alt="avatar" className="user-avatar" />}
            <span className="user-email">{user.email}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-card">
          <p>Total Market Cap</p>
          <h3>{symbol}{(totalMarketCap / 1e12).toFixed(2)}T</h3>
        </div>
        <div className="stat-card">
          <p>24h Volume</p>
          <h3>{symbol}{(totalVolume / 1e9).toFixed(2)}B</h3>
        </div>
        <div className="stat-card">
          <p>Coins Tracked</p>
          <h3>{coins.length}</h3>
        </div>
        <div className="stat-card">
          <p>Favorites</p>
          <h3>{favorites.length}</h3>
        </div>
      </div>

      <div className="controls">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search coin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="currency-group">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              className={`currency-btn ${currency === c ? "active" : ""}`}
              onClick={() => setCurrency(c)}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          className={`action-btn ${showFavorites ? "active" : ""}`}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? "⭐ Favorites" : "☆ Favorites"}
        </button>
        <button className="action-btn" onClick={refetch}>
          🔄 Refresh
        </button>
      </div>

      <div className="table-wrapper">
        <CoinTable
          coins={filteredCoins}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          currencySymbol={symbol}
          onCoinClick={(id) => navigate(`/coin/${id}`)}
        />
      </div>

      <CryptoNews />
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (authLoading) return <div className="status-message">⏳ Loading...</div>;
  if (!user) return <Login onLogin={() => {}} />;

  return (
    <Routes>
      <Route path="/" element={<Dashboard user={user} handleLogout={handleLogout} />} />
      <Route path="/coin/:id" element={<CoinDetail />} />
    </Routes>
  );
}

export default App;