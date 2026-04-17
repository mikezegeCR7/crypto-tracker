import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

function CoinChart({ sparkline, isPositive }) {
  const data = sparkline.map((price, index) => ({ index, price }));

  return (
    <ResponsiveContainer width="100%" height={80}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="price"
          stroke={isPositive ? "#3fb950" : "#f85149"}
          dot={false}
          strokeWidth={2}
        />
        <Tooltip
          formatter={(value) => [`$${value.toLocaleString()}`, "Price"]}
          contentStyle={{
            background: "#161b22",
            border: "1px solid #30363d",
            borderRadius: "8px",
            color: "#e6edf3",
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default CoinChart;