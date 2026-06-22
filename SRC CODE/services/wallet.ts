import { authService } from "./auth";

export interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

class WalletService {
  async getBalance(): Promise<number> {
    const user = authService.getCurrentUser();
    return user?.walletBalance || 0;
  }

  async addMoney(amount: number): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const user = authService.getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const newBalance = user.walletBalance + amount;
    authService.updateUser({ walletBalance: newBalance });

    const transaction: Transaction = {
      id: "TXN" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      type: "credit",
      amount,
      description: "Wallet top-up",
      timestamp: new Date().toISOString(),
      status: "completed",
    };

    this.saveTransaction(transaction);
    return transaction;
  }

  async deductMoney(amount: number, description: string): Promise<Transaction> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    if (user.walletBalance < amount) throw new Error("Insufficient balance");

    const newBalance = user.walletBalance - amount;
    authService.updateUser({ walletBalance: newBalance });

    const transaction: Transaction = {
      id: "TXN" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      type: "debit",
      amount,
      description,
      timestamp: new Date().toISOString(),
      status: "completed",
    };

    this.saveTransaction(transaction);
    return transaction;
  }

  async refund(amount: number, description: string): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = authService.getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const newBalance = user.walletBalance + amount;
    authService.updateUser({ walletBalance: newBalance });

    const transaction: Transaction = {
      id: "TXN" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      type: "credit",
      amount,
      description: description || "Refund",
      timestamp: new Date().toISOString(),
      status: "completed",
    };

    this.saveTransaction(transaction);
    return transaction;
  }

  private saveTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    transactions.unshift(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }

  getTransactions(): Transaction[] {
    const stored = localStorage.getItem("transactions");
    return stored ? JSON.parse(stored) : [];
  }
}

export const walletService = new WalletService();
