export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minAmount: number;
  maxDiscount?: number;
  validUntil: string;
  termsAndConditions: string[];
}

export const mockOffers: Offer[] = [
  {
    id: "offer1",
    code: "FIRST15",
    title: "First Booking Offer",
    description: "Get 15% off on your first bus booking",
    discountType: "percentage",
    discountValue: 15,
    minAmount: 20,
    maxDiscount: 100,
    validUntil: "2026-12-31",
    termsAndConditions: [
      "Valid for first time users only",
      "Minimum booking amount ₹20",
      "Maximum discount ₹100",
      "Cannot be combined with other offers",
    ],
  },
  {
    id: "offer2",
    code: "SAVE10",
    title: "Weekend Special",
    description: "Flat 10% off on weekend bookings",
    discountType: "percentage",
    discountValue: 10,
    minAmount: 15,
    maxDiscount: 50,
    validUntil: "2026-12-31",
    termsAndConditions: [
      "Valid for Friday, Saturday, and Sunday bookings",
      "Minimum booking amount ₹15",
      "Maximum discount ₹50",
    ],
  },
  {
    id: "offer3",
    code: "FLAT20",
    title: "Flat ₹20 Off",
    description: "Get flat ₹20 discount on bookings above ₹100",
    discountType: "flat",
    discountValue: 20,
    minAmount: 100,
    validUntil: "2026-12-31",
    termsAndConditions: [
      "Minimum booking amount ₹100",
      "Valid on all routes",
      "One time use per user",
    ],
  },
  {
    id: "offer4",
    code: "EARLYBIRD",
    title: "Early Bird Discount",
    description: "Book 24 hours in advance and get 12% off",
    discountType: "percentage",
    discountValue: 12,
    minAmount: 25,
    maxDiscount: 75,
    validUntil: "2026-12-31",
    termsAndConditions: [
      "Book at least 24 hours before departure",
      "Minimum booking amount ₹25",
      "Maximum discount ₹75",
    ],
  },
];

class OfferService {
  getOffers(): Offer[] {
    return mockOffers;
  }

  validateOffer(code: string, amount: number): { valid: boolean; offer?: Offer; error?: string } {
    const offer = mockOffers.find(o => o.code.toLowerCase() === code.toLowerCase());

    if (!offer) {
      return { valid: false, error: "Invalid coupon code" };
    }

    if (amount < offer.minAmount) {
      return { valid: false, error: `Minimum booking amount is ₹₹{offer.minAmount}` };
    }

    const validUntil = new Date(offer.validUntil);
    if (validUntil < new Date()) {
      return { valid: false, error: "This offer has expired" };
    }

    return { valid: true, offer };
  }

  calculateDiscount(offer: Offer, amount: number): number {
    if (offer.discountType === "percentage") {
      const discount = (amount * offer.discountValue) / 100;
      return offer.maxDiscount ? Math.min(discount, offer.maxDiscount) : discount;
    } else {
      return offer.discountValue;
    }
  }
}

export const offerService = new OfferService();
