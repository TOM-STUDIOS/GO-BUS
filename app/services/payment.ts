import { walletService } from "./wallet";

export interface PaymentRequest {
  amount: number;
  description: string;
  method: "wallet" | "card" | "upi";
  cardDetails?: {
    number: string;
    expiry: string;
    cvv: string;
  };
  upiId?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
  timestamp: string;
}

class PaymentService {
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      if (request.method === "wallet") {
        await walletService.deductMoney(request.amount, request.description);
      } else {
        // Mock payment for card/UPI
        const success = Math.random() > 0.1; // 90% success rate
        if (!success) {
          throw new Error("Payment failed. Please try again.");
        }
      }

      return {
        success: true,
        transactionId: "PAY" + Math.random().toString(36).substr(2, 12).toUpperCase(),
        message: "Payment successful",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        transactionId: "PAY" + Math.random().toString(36).substr(2, 12).toUpperCase(),
        message: error instanceof Error ? error.message : "Payment failed",
        timestamp: new Date().toISOString(),
      };
    }
  }

  async validatePayment(transactionId: string): Promise<boolean> {
    // Mock validation
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }
}

export const paymentService = new PaymentService();
