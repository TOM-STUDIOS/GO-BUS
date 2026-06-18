import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { walletService, Transaction } from "../../services/wallet";
import { authService } from "../../services/auth";
import { Wallet as WalletIcon, Plus, ArrowUpCircle, ArrowDownCircle, Loader2, CreditCard, Smartphone } from "lucide-react";
import { toast } from "sonner";

export function Wallet() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("upi");

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    const currentBalance = await walletService.getBalance();
    const txns = walletService.getTransactions();
    setBalance(currentBalance);
    setTransactions(txns);
  };

  const handleAddMoneyClick = () => {
    const addAmount = parseFloat(amount);
    if (isNaN(addAmount) || addAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setShowPaymentDialog(true);
  };

  const handlePayment = async () => {
    const addAmount = parseFloat(amount);
    setLoading(true);
    try {
      await walletService.addMoney(addAmount / 80); // Convert rupees to internal dollars
      toast.success(`₹${addAmount.toFixed(0)} added to wallet via ${paymentMethod === "card" ? "Card" : "UPI"}`);
      setAmount("");
      setShowPaymentDialog(false);
      await loadWalletData();
    } catch (error) {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">

      <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <WalletIcon className="w-5 h-5" />
            My Wallet
          </CardTitle>
          <CardDescription>Manage your wallet balance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 md:p-6 bg-[#1a56db] rounded-lg text-white shadow-lg">
            <p className="text-sm text-red-100 mb-2">Available Balance</p>
            <div className="flex items-baseline overflow-hidden">
              <span className="text-xl md:text-2xl font-semibold mr-1 md:mr-2 flex-shrink-0">₹</span>
              <p className="text-3xl md:text-5xl font-bold truncate">{(balance * 80).toFixed(0)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="amount">Add Money</Label>
            <div className="flex space-x-3">
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="1"
              />
              <Button onClick={handleAddMoneyClick} className="bg-[#1a56db] hover:bg-[#1242b0] flex-shrink-0">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[800, 2000, 4000, 8000].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(preset.toString())}
                  className="text-xs"
                >
                  ₹{preset}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View your recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-600">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 md:p-4 border rounded-lg gap-3"
                >
                  <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                    <div
                      className={`p-2 rounded-full flex-shrink-0 ${
                        transaction.type === "credit"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowUpCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                      ) : (
                        <ArrowDownCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm md:text-base truncate">{transaction.description}</p>
                      <p className="text-xs md:text-sm text-gray-600 truncate">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right min-w-0">
                    <p
                      className={`font-bold text-sm md:text-base truncate ${
                        transaction.type === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}₹
                      {(transaction.amount * 80).toFixed(0)}
                    </p>
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>

      {/* Payment Method Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Add ₹{amount ? parseFloat(amount).toFixed(0) : 0} to your wallet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
              <div className="space-y-3">
                <label
                  htmlFor="upi"
                  className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "upi" ? "border-[#1a56db] bg-red-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <RadioGroupItem value="upi" id="upi" />
                  <div className="flex items-center flex-1">
                    <Smartphone className="w-6 h-6 text-[#1a56db] mr-3" />
                    <div>
                      <p className="font-semibold">UPI</p>
                      <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</p>
                    </div>
                  </div>
                </label>

                <label
                  htmlFor="card"
                  className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "card" ? "border-[#1a56db] bg-red-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <RadioGroupItem value="card" id="card" />
                  <div className="flex items-center flex-1">
                    <CreditCard className="w-6 h-6 text-[#1a56db] mr-3" />
                    <div>
                      <p className="font-semibold">Card</p>
                      <p className="text-sm text-gray-500">Debit / Credit Card</p>
                    </div>
                  </div>
                </label>
              </div>
            </RadioGroup>

            {paymentMethod === "upi" && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">You will be redirected to complete the UPI payment</p>
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" type="password" maxLength={3} />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handlePayment} disabled={loading} className="flex-1 bg-[#1a56db] hover:bg-[#1242b0]">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  `Pay ₹${amount ? parseFloat(amount).toFixed(0) : 0}`
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
