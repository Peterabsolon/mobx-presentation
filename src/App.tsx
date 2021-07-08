import { createContext, useContext, useState, useCallback, memo } from "react";

import { formatCurrency, formatPrice, NumberInput, Table } from "./utils";
import { TCurrency, TCurrencies, IOrder } from "./types";
import { getInitialCurrencies, getInitialOrders } from "./data";

const CurrencyContext = createContext<TCurrencies>({} as TCurrencies);

const App = () => {
  const [currencies, setCurrencies] = useState<TCurrencies>(getInitialCurrencies);
  const [orders, setOrders] = useState<IOrder[]>(getInitialOrders);

  const onCurrencyChange = useCallback((currency: TCurrency, rate: number) => {
    setCurrencies((currencies) => ({
      ...currencies,
      [currency]: rate,
    }));
  }, []);

  const onPriceChange = useCallback((orderId: number, price: number) => {
    setOrders((orders) =>
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              price,
            }
          : order
      )
    );
  }, []);

  const onCurrencySelect = useCallback((orderId: number, currency: TCurrency) => {
    setOrders((orders) =>
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              currency,
            }
          : order
      )
    );
  }, []);

  return (
    <CurrencyContext.Provider value={currencies}>
      <h1>Orders</h1>
      <Orders orders={orders} onPriceChange={onPriceChange} onCurrencySelect={onCurrencySelect} />
      <OrderTotal orders={orders} />

      <h1>Currencies</h1>
      <Currencies currencies={currencies} onCurrencyChange={onCurrencyChange} />
    </CurrencyContext.Provider>
  );
};

// ====================================================
// Orders
// ====================================================
interface IOrdersProps {
  orders: IOrder[];
  onPriceChange: (orderId: number, price: number) => void;
  onCurrencySelect: (orderId: number, currency: TCurrency) => void;
}

const Orders = memo(({ orders, onPriceChange, onCurrencySelect }: IOrdersProps) => {
  const currencies = useContext(CurrencyContext);

  return (
    <Table columns={["Title", "Price", "Currency", "Price"]}>
      {orders.map((order) => (
        <OrderRow
          key={order.id}
          order={order}
          onPriceChange={onPriceChange}
          onCurrencySelect={onCurrencySelect}
          currencies={currencies}
        />
      ))}
    </Table>
  );
});

// ====================================================
// OrderRow
// ====================================================
interface IOrderRowProps {
  order: IOrder;
  currencies: TCurrencies;
  onPriceChange: (orderId: number, price: number) => void;
  onCurrencySelect: (orderId: number, currency: TCurrency) => void;
}

const OrderRow = memo(
  ({ currencies, order, onPriceChange, onCurrencySelect }: IOrderRowProps) => {
    return (
      <tr key={order.id}>
        <td>{order.title}</td>
        <td>
          <NumberInput value={order.price} onChange={(price: number) => onPriceChange(order.id, price)} />
        </td>
        <td>
          <CurrencySelect value={order.currency} onChange={(currency) => onCurrencySelect(order.id, currency)} />
        </td>
        <td>{formatPrice(order.price * currencies[order.currency])}</td>
      </tr>
    );
  },
  (prev, next) =>
    prev.order === next.order &&
    (prev.currencies === next.currencies ||
      prev.currencies[prev.order.currency] === next.currencies[next.order.currency])
);

// ====================================================
// Currencies
// ====================================================
interface ICurrenciesProps {
  currencies: TCurrencies;
  onCurrencyChange: (currency: TCurrency, rate: number) => void;
}

const Currencies = memo(({ currencies, onCurrencyChange }: ICurrenciesProps) => (
  <Table columns={["Currency", "Rate"]}>
    {Object.entries(currencies).map(([currency, rate]) => (
      <tr key={currency}>
        <td>{currency}</td>
        <td>
          <NumberInput value={rate} onChange={(rate: number) => onCurrencyChange(currency as TCurrency, rate)} />
        </td>
      </tr>
    ))}
  </Table>
));

// ====================================================
// Currency select
// ====================================================
interface ICurrencySelectProps {
  value: TCurrency;
  onChange: (currency: TCurrency) => void;
}

const CurrencySelect = memo(({ value, onChange }: ICurrencySelectProps) => {
  const currencies = useContext(CurrencyContext);

  return (
    <select onChange={(e) => onChange(e.target.value as TCurrency)} value={value}>
      {Object.keys(currencies).map((c) => (
        <option key={c} value={c}>
          {formatCurrency(c)}
        </option>
      ))}
    </select>
  );
});

// ====================================================
// OrderTotal
// ====================================================
interface IOrderTotalProps {
  orders: IOrder[];
}

const OrderTotal = memo(({ orders }: IOrderTotalProps) => {
  const currencies = useContext(CurrencyContext);
  const total = orders.reduce((acc, order) => (acc += order.price * currencies[order.currency]), 0);

  return <div className="total">{formatPrice(total)}</div>;
});

export default App;
