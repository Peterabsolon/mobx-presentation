import { TCurrency } from "./types";

export const getInitialOrders = () => [
  { id: 1, title: "Foo", price: 100, currency: "eur" as TCurrency },
  { id: 2, title: "Bar", price: 15, currency: "usd" as TCurrency },
  { id: 3, title: "Baz", price: 300, currency: "usd" as TCurrency },
  { id: 4, title: "Qux", price: 200, currency: "can" as TCurrency },
];

export const getInitialCurrencies = () => ({
  eur: 1.12,
  usd: 1.33,
  rup: 97.45,
  aus: 1.75,
  can: 1.75,
});
