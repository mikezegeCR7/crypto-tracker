import { useState, useEffect } from "react";
import axios from "axios";

export function useCrypto(currency = "usd") {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCoins = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=true`
      );
      setCoins(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch crypto data. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCoins();
    }, 500);

    const interval = setInterval(fetchCoins, 60000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [currency]);

  return { coins, loading, error, refetch: fetchCoins };
}