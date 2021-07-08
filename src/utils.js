import { useMemo } from "react";

export const Table = ({ children, columns }) => {
  const columnNames = useMemo(() => columns.map((column, index) => <th key={index}>{column}</th>), [columns]);

  return (
    <table>
      <thead>
        <tr>{columnNames}</tr>
      </thead>

      <tbody>{children}</tbody>
    </table>
  );
};

export const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

const flags = {
  eur: "🇪🇺",
  usd: "🇺🇸",
  rup: "🇮🇳",
  aus: "🇦🇺",
  can: "🇨🇦",
};

export const formatCurrency = (currency) => {
  return flags[currency] || currency;
};

export const NumberInput = ({ value, onChange }) => {
  return <input value={value} type="number" step={0.1} min={0} max={1000} onChange={(e) => onChange(e.target.value)} />;
};
