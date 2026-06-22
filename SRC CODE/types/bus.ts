export interface BusOperator {
  id: string;
  name: string;
  logo?: string;
  rating: number;
  totalReviews: number;
  verified: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  available: boolean;
}

export interface BoardingPoint {
  id: string;
  name: string;
  address: string;
  landmark: string;
  time: string;
  contactNumber?: string;
}

export interface DroppingPoint {
  id: string;
  name: string;
  address: string;
  landmark: string;
  time: string;
}

export interface RestStop {
  name: string;
  duration: number;
  time: string;
}

export interface Seat {
  id: string;
  number: string;
  type: "seater" | "sleeper";
  deck: "lower" | "upper";
  status: "available" | "booked" | "blocked" | "ladies";
  price: number;
  position: { row: number; col: number };
}

export interface CancellationPolicy {
  hoursBeforeDeparture: number;
  refundPercentage: number;
}

export interface BusRoute {
  id: string;
  operator: BusOperator;
  busNumber: string;
  busType: "AC" | "Non-AC" | "Sleeper" | "Semi-Sleeper" | "Volvo" | "Multi-Axle";
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  distance: number;
  baseFare: number;
  seatsAvailable: number;
  totalSeats: number;
  amenities: Amenity[];
  boardingPoints: BoardingPoint[];
  droppingPoints: DroppingPoint[];
  restStops: RestStop[];
  cancellationPolicy: CancellationPolicy[];
  rating: number;
  reviews: number;
  liveTracking: boolean;
  photos?: string[];
  windowSeats: number;
  discount?: {
    percentage: number;
    code: string;
  };
}

export interface SeatLayout {
  lowerDeck: Seat[][];
  upperDeck?: Seat[][];
  config: {
    rows: number;
    cols: number;
  };
}
