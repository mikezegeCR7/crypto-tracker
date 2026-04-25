import CoinChart from "./CoinChart";

function CoinRow({ coin, isFavorite, onToggleFavorite, currencySymbol, onCoinClick }) {
  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <>
      <tr onClick={() => onCoinClick(coin.id)} style={{ cursor: "pointer" }}>
        <td>
          <span
            className="star"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(coin.id);
            }}
          >
            {isFavorite ? "⭐" : "☆"}
          </span>
        </td>
        <td>
          <img src={coin.image} alt={coin.name} width={32} height={32} />
        </td>
        <td>
          <div className="coin-name">{coin.name}</div>
          <div className="coin-symbol">{coin.symbol.toUpperCase()}</div>
        </td>
        <td>{coin.symbol.toUpperCase()}</td>
        <td style={{ fontWeight: 600 }}>
          {currencySymbol}{coin.current_price.toLocaleString()}
        </td>
        <td className={isPositive ? "positive" : "negative"}>
          {isPositive ? "▲" : "▼"} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
        </td>
        <td className="hide-mobile">{currencySymbol}{coin.market_cap.toLocaleString()}</td>
        <td className="hide-mobile">{currencySymbol}{coin.total_volume.toLocaleString()}</td>
      </tr>
    </>
  );
}

export default CoinRow;