import { IObservableArray, makeAutoObservable, set } from "mobx";
import { createContext, useContext } from "react";

import { getInitialCurrencies, getInitialOrders } from "./data";
import { IOrder, TCurrencies, TCurrency } from "./types";

// ====================================================
// OrderModel
// ====================================================
export class OrderModel implements IOrder {
  id: number;
  title: string;
  price: number;
  currency: TCurrency;

  constructor(data: IOrder, readonly currencies: TCurrencies) {
    makeAutoObservable(this);
    set(this, data);
  }

  get total() {
    return this.price * this.currencies[this.currency];
  }

  setPrice(price: number) {
    this.price = price;
  }

  setCurrency(currency: TCurrency) {
    this.currency = currency;
  }
}

// ====================================================
// AppStore
// ====================================================
class AppStore {
  orders: IObservableArray<OrderModel>;
  currencies: TCurrencies;

  constructor(data: { orders: IOrder[]; currencies: TCurrencies }) {
    makeAutoObservable(this);
    set(this, data);

    this.orders.replace(data.orders.map((order) => new OrderModel(order, this.currencies)));
  }

  get total() {
    return this.orders.reduce((total, order) => (total += order.price * this.currencies[order.currency]), 0);
  }

  setCurrency = (currency: TCurrency, rate: number) => {
    this.currencies[currency] = rate;
  };
}

const store = new AppStore({
  orders: getInitialOrders(),
  currencies: getInitialCurrencies(),
});

const storeContext = createContext(store);

export const useStore = () => useContext(storeContext);
