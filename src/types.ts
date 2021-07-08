// ====================================================
// Model
// ====================================================
export type TCurrency = "eur" | "usd" | "rup" | "aus" | "can";

export type TCurrencies = { [key in TCurrency]: number };

export interface IOrder {
  id: number;
  title: string;
  price: number;
  currency: TCurrency;
}
