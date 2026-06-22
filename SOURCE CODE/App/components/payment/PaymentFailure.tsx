import { useLocation, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { XCircle, RotateCcw, Home } from "lucide-react";

export function PaymentFailure() {
  const navigate = useNavigate();
  const location = useLocation();
  const { message, transactionId } = location.state || {};

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
          <CardDescription>Your payment could not be processed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Error Message</p>
            <p className="text-red-600">{message || "An unknown error occurred. Please try again."}</p>
            {transactionId && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">Transaction ID</p>
                <p className="font-mono text-sm">{transactionId}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button onClick={() => navigate(-2)} className="w-full">
              <RotateCcw className="h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate("/app")} className="w-full">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>Need help? Contact support with your transaction ID</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
