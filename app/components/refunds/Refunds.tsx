import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { walletService, Transaction } from "../../services/wallet";
import { DollarSign, ArrowUpCircle, ChevronLeft } from "lucide-react";

export function Refunds() {
  const navigate = useNavigate();
  const [refunds, setRefunds] = useState<Transaction[]>([]);

  useEffect(() => {
    const transactions = walletService.getTransactions();
    const refundTransactions = transactions.filter(
      (t) => t.type === "credit" && t.description.toLowerCase().includes("refund")
    );
    setRefunds(refundTransactions);
  }, []);

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5" />
            Refunds
          </CardTitle>
          <CardDescription>View your refund history</CardDescription>
        </CardHeader>
      </Card>

      {refunds.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No refunds yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {refunds.map((refund) => (
            <Card key={refund.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 rounded-full">
                      <ArrowUpCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{refund.description}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(refund.timestamp).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Transaction ID: {refund.id}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      +₹{(refund.amount * 80).toFixed(0)}
                    </p>
                    <Badge className="bg-green-500 text-white">
                      {refund.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
