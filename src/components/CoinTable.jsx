import CoinRow from "./CoinRow";

function CoinTable({ coins, favorites, onToggleFavorite, currencySymbol }) {
  return (
    <table>
      <thead>
        <tr>
          <th>⭐</th>
          <th>Logo</th>
          <th>Name</th>
          <th>Symbol</th>
          <th>Price</th>
          <th>24h %</th>
          <th>Market Cap</th>
          <th>Volume</th>
        </tr>
      </thead>
      <tbody>
        {coins.map((coin) => (
          <CoinRow
            key={coin.id}
            coin={coin}
            isFavorite={favorites.includes(coin.id)}
            onToggleFavorite={onToggleFavorite}
            currencySymbol={currencySymbol}
          />
        ))}
      </tbody>
    </table>
  );
}

export default CoinTable;