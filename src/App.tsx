import { observer } from "mobx-react";

import { formatCurrency, formatPrice, NumberInput, Table } from "./utils";
import { TCurrency } from "./types";
import { OrderModel, useStore } from "./App.store";

const App = () => {
  return (
    <>
      <h1>Orders</h1>
      <Orders />
      <OrderTotal />

      <h1>Currencies</h1>
      <Currencies />
    </>
  );
};

const Orders = observer(() => {
  const store = useStore();

  return (
    <Table columns={["Title", "Price", "Currency", "Price"]}>
      {store.orders.map((order) => (
        <OrderRow key={order.id} order={order} />
      ))}
    </Table>
  );
});

interface IOrderRowProps {
  order: OrderModel;
}

const OrderRow = observer(({ order }: IOrderRowProps) => {
  return (
    <tr key={order.id}>
      <td>{order.title}</td>
      <td>
        <NumberInput value={order.price} onChange={order.setPrice} />
      </td>
      <td>
        <CurrencySelect value={order.currency} onChange={order.setCurrency} />
      </td>
      <td>{formatPrice(order.total)}</td>
    </tr>
  );
});

const Currencies = observer(() => {
  const store = useStore();

  return (
    <Table columns={["Currency", "Rate"]}>
      {Object.entries(store.currencies).map(([currency, rate]) => (
        <tr key={currency}>
          <td>{currency}</td>
          <td>
            <NumberInput value={rate} onChange={(rate: number) => store.setCurrency(currency as TCurrency, rate)} />
          </td>
        </tr>
      ))}
    </Table>
  );
});

interface ICurrencySelectProps {
  value: TCurrency;
  onChange: (currency: TCurrency) => void;
}

const CurrencySelect = observer(({ value, onChange }: ICurrencySelectProps) => {
  const { currencies } = useStore();

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

const OrderTotal = observer(() => {
  const { total } = useStore();

  return <div className="total">{formatPrice(total)}</div>;
});

export default App;
