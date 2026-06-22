import { BusRoute, BusOperator, Amenity, SeatLayout, Seat } from "../types/bus";

export const mockOperators: BusOperator[] = [
  {
    id: "op1",
    name: "VRL Travels",
    rating: 4.5,
    totalReviews: 2345,
    verified: true,
  },
  {
    id: "op2",
    name: "SRS Travels",
    rating: 4.3,
    totalReviews: 1876,
    verified: true,
  },
  {
    id: "op3",
    name: "Orange Travels",
    rating: 4.7,
    totalReviews: 3421,
    verified: true,
  },
  {
    id: "op4",
    name: "Parveen Travels",
    rating: 4.2,
    totalReviews: 987,
    verified: true,
  },
  {
    id: "op5",
    name: "Greenline Travels",
    rating: 4.6,
    totalReviews: 2156,
    verified: true,
  },
];

const commonAmenities: Amenity[] = [
  { id: "wifi", name: "WiFi", icon: "Wifi", available: true },
  { id: "charging", name: "Charging Point", icon: "BatteryCharging", available: true },
  { id: "blanket", name: "Blanket", icon: "Wind", available: true },
  { id: "water", name: "Water Bottle", icon: "Droplet", available: true },
  { id: "tv", name: "TV", icon: "Tv", available: true },
  { id: "ac", name: "Air Conditioning", icon: "Snowflake", available: true },
  { id: "reading", name: "Reading Light", icon: "Lightbulb", available: true },
  { id: "emergency", name: "Emergency Exit", icon: "DoorOpen", available: true },
];

export const mockBusRoutes: BusRoute[] = [
  {
    id: "route_1",
    operator: mockOperators[0],
    busNumber: "VRL-42A",
    busType: "AC",
    from: "Mumbai",
    to: "Pune",
    departureTime: "06:00 AM",
    arrivalTime: "09:30 AM",
    duration: "3h 30m",
    distance: 180,
    baseFare: 25,
    seatsAvailable: 23,
    totalSeats: 40,
    amenities: commonAmenities.filter(a => ["wifi", "charging", "water", "ac", "emergency"].includes(a.id)),
    boardingPoints: [
      { id: "bp1", name: "Downtown Terminal", address: "123 Main St", landmark: "Near City Mall", time: "06:00 AM" },
      { id: "bp2", name: "West Gate", address: "456 West Ave", landmark: "Opposite Park", time: "06:15 AM" },
      { id: "bp3", name: "Highway Junction", address: "789 Highway Rd", landmark: "Near Gas Station", time: "06:30 AM" },
    ],
    droppingPoints: [
      { id: "dp1", name: "Central Station East", address: "321 Station Rd", landmark: "Main Entrance", time: "09:30 AM" },
      { id: "dp2", name: "Central Station West", address: "654 Station Ave", landmark: "West Exit", time: "09:40 AM" },
    ],
    restStops: [
      { name: "Green Valley Rest Stop", duration: 15, time: "07:45 AM" },
    ],
    cancellationPolicy: [
      { hoursBeforeDeparture: 48, refundPercentage: 90 },
      { hoursBeforeDeparture: 24, refundPercentage: 75 },
      { hoursBeforeDeparture: 12, refundPercentage: 50 },
      { hoursBeforeDeparture: 6, refundPercentage: 25 },
    ],
    rating: 4.5,
    reviews: 234,
    liveTracking: true,
    windowSeats: 12,
  },
  {
    id: "route_2",
    operator: mockOperators[2],
    busNumber: "ORG-15",
    busType: "Sleeper",
    from: "Bangalore",
    to: "Chennai",
    departureTime: "08:30 AM",
    arrivalTime: "12:00 PM",
    duration: "3h 30m",
    distance: 195,
    baseFare: 35,
    seatsAvailable: 18,
    totalSeats: 36,
    amenities: commonAmenities.filter(a => ["wifi", "charging", "blanket", "water", "ac", "reading", "emergency"].includes(a.id)),
    boardingPoints: [
      { id: "bp4", name: "Downtown Hub", address: "111 Center St", landmark: "City Center", time: "08:30 AM" },
      { id: "bp5", name: "East Terminal", address: "222 East Blvd", landmark: "Metro Station", time: "08:50 AM" },
    ],
    droppingPoints: [
      { id: "dp3", name: "Airport Terminal 1", address: "Airport Rd", landmark: "International", time: "12:00 PM" },
      { id: "dp4", name: "Airport Terminal 2", address: "Airport Rd", landmark: "Domestic", time: "12:10 PM" },
    ],
    restStops: [
      { name: "Highway Plaza", duration: 20, time: "10:15 AM" },
    ],
    cancellationPolicy: [
      { hoursBeforeDeparture: 48, refundPercentage: 85 },
      { hoursBeforeDeparture: 24, refundPercentage: 70 },
      { hoursBeforeDeparture: 12, refundPercentage: 45 },
      { hoursBeforeDeparture: 6, refundPercentage: 20 },
    ],
    rating: 4.7,
    reviews: 456,
    liveTracking: true,
    windowSeats: 10,
    discount: { percentage: 15, code: "FIRST15" },
  },
  {
    id: "route_3",
    operator: mockOperators[4],
    busNumber: "GRN-7B",
    busType: "Volvo",
    from: "Delhi",
    to: "Jaipur",
    departureTime: "10:00 AM",
    arrivalTime: "01:15 PM",
    duration: "3h 15m",
    distance: 165,
    baseFare: 30,
    seatsAvailable: 15,
    totalSeats: 45,
    amenities: commonAmenities,
    boardingPoints: [
      { id: "bp6", name: "City Terminal", address: "333 Main Plaza", landmark: "Central Square", time: "10:00 AM" },
      { id: "bp7", name: "North Gate", address: "444 North St", landmark: "Shopping Mall", time: "10:20 AM" },
    ],
    droppingPoints: [
      { id: "dp5", name: "University Main Gate", address: "555 Campus Dr", landmark: "Library", time: "01:15 PM" },
      { id: "dp6", name: "University Hostel", address: "666 Hostel Rd", landmark: "Hostel Block A", time: "01:25 PM" },
    ],
    restStops: [
      { name: "Mountain View Stop", duration: 15, time: "11:30 AM" },
    ],
    cancellationPolicy: [
      { hoursBeforeDeparture: 48, refundPercentage: 90 },
      { hoursBeforeDeparture: 24, refundPercentage: 75 },
      { hoursBeforeDeparture: 12, refundPercentage: 50 },
      { hoursBeforeDeparture: 6, refundPercentage: 25 },
    ],
    rating: 4.6,
    reviews: 321,
    liveTracking: true,
    windowSeats: 14,
  },
  {
    id: "route_4",
    operator: mockOperators[1],
    busNumber: "SRS-22",
    busType: "Semi-Sleeper",
    from: "Hyderabad",
    to: "Vijayawada",
    departureTime: "11:30 AM",
    arrivalTime: "03:00 PM",
    duration: "3h 30m",
    distance: 180,
    baseFare: 28,
    seatsAvailable: 20,
    totalSeats: 42,
    amenities: commonAmenities.filter(a => ["wifi", "charging", "water", "ac", "reading", "emergency"].includes(a.id)),
    boardingPoints: [
      { id: "bp8", name: "Downtown Bus Stand", address: "777 Station Rd", landmark: "Railway Station", time: "11:30 AM" },
      { id: "bp9", name: "South Point", address: "888 South Ave", landmark: "Hospital", time: "11:50 AM" },
    ],
    droppingPoints: [
      { id: "dp7", name: "Central Hub", address: "999 Central Rd", landmark: "Bus Station", time: "03:00 PM" },
      { id: "dp8", name: "Market Area", address: "1010 Market St", landmark: "Main Market", time: "03:15 PM" },
    ],
    restStops: [
      { name: "Lakeside Cafe", duration: 20, time: "01:00 PM" },
    ],
    cancellationPolicy: [
      { hoursBeforeDeparture: 48, refundPercentage: 85 },
      { hoursBeforeDeparture: 24, refundPercentage: 70 },
      { hoursBeforeDeparture: 12, refundPercentage: 45 },
      { hoursBeforeDeparture: 6, refundPercentage: 20 },
    ],
    rating: 4.3,
    reviews: 187,
    liveTracking: false,
    windowSeats: 13,
    discount: { percentage: 10, code: "SAVE10" },
  },
  {
    id: "route_5",
    operator: mockOperators[3],
    busNumber: "PRV-88",
    busType: "AC",
    from: "Kolkata",
    to: "Siliguri",
    departureTime: "02:00 PM",
    arrivalTime: "05:30 PM",
    duration: "3h 30m",
    distance: 195,
    baseFare: 32,
    seatsAvailable: 12,
    totalSeats: 40,
    amenities: commonAmenities.filter(a => ["wifi", "charging", "water", "ac", "tv", "emergency"].includes(a.id)),
    boardingPoints: [
      { id: "bp10", name: "Central Bus Station", address: "1111 Bus Stand Rd", landmark: "City Center", time: "02:00 PM" },
      { id: "bp11", name: "Tech Park", address: "1212 Tech Ave", landmark: "IT Park", time: "02:20 PM" },
    ],
    droppingPoints: [
      { id: "dp9", name: "Airport Gate 1", address: "Airport Main Rd", landmark: "Arrival", time: "05:30 PM" },
      { id: "dp10", name: "Airport Gate 2", address: "Airport Side Rd", landmark: "Departure", time: "05:40 PM" },
    ],
    restStops: [
      { name: "Express Diner", duration: 15, time: "03:45 PM" },
    ],
    cancellationPolicy: [
      { hoursBeforeDeparture: 48, refundPercentage: 90 },
      { hoursBeforeDeparture: 24, refundPercentage: 75 },
      { hoursBeforeDeparture: 12, refundPercentage: 50 },
      { hoursBeforeDeparture: 6, refundPercentage: 25 },
    ],
    rating: 4.2,
    reviews: 145,
    liveTracking: true,
    windowSeats: 11,
  },
];

export function generateSeatLayout(totalSeats: number, busType: string): SeatLayout {
  const seats: Seat[][] = [];
  const seatsPerRow = busType === "Sleeper" ? 3 : 4;
  const rows = Math.ceil(totalSeats / seatsPerRow);

  let seatCounter = 1;

  for (let row = 0; row < rows; row++) {
    const rowSeats: Seat[] = [];
    for (let col = 0; col < seatsPerRow; col++) {
      if (seatCounter <= totalSeats) {
        const isWindow = col === 0 || col === seatsPerRow - 1;
        const randomStatus = Math.random();
        let status: "available" | "booked" | "blocked" | "ladies" = "available";

        if (randomStatus < 0.3) status = "booked";
        else if (randomStatus < 0.35) status = "ladies";
        else if (randomStatus < 0.38) status = "blocked";

        rowSeats.push({
          id: `seat_${seatCounter}`,
          number: `${seatCounter}`,
          type: busType === "Sleeper" ? "sleeper" : "seater",
          deck: "lower",
          status,
          price: isWindow ? 30 : 25,
          position: { row, col },
        });
        seatCounter++;
      }
    }
    if (rowSeats.length > 0) {
      seats.push(rowSeats);
    }
  }

  return {
    lowerDeck: seats,
    config: { rows, cols: seatsPerRow },
  };
}

export function getBusRoutes(filters?: {
  busType?: string[];
  departureTime?: string[];
  priceRange?: { min: number; max: number };
  minRating?: number;
  amenities?: string[];
  sortBy?: "price" | "duration" | "rating" | "departure";
}): BusRoute[] {
  let routes = [...mockBusRoutes];

  if (filters) {
    if (filters.busType && filters.busType.length > 0) {
      routes = routes.filter(r => filters.busType!.includes(r.busType));
    }

    if (filters.departureTime && filters.departureTime.length > 0) {
      routes = routes.filter(r => {
        const hour = parseInt(r.departureTime.split(":")[0]);
        const isPM = r.departureTime.includes("PM");
        const hour24 = isPM && hour !== 12 ? hour + 12 : hour;

        return filters.departureTime!.some(range => {
          if (range === "morning") return hour24 >= 6 && hour24 < 12;
          if (range === "afternoon") return hour24 >= 12 && hour24 < 18;
          if (range === "evening") return hour24 >= 18 && hour24 < 22;
          if (range === "night") return hour24 >= 22 || hour24 < 6;
          return false;
        });
      });
    }

    if (filters.priceRange) {
      routes = routes.filter(r =>
        r.baseFare >= filters.priceRange!.min &&
        r.baseFare <= filters.priceRange!.max
      );
    }

    if (filters.minRating) {
      routes = routes.filter(r => r.rating >= filters.minRating!);
    }

    if (filters.amenities && filters.amenities.length > 0) {
      routes = routes.filter(r =>
        filters.amenities!.every(amenity =>
          r.amenities.some(a => a.id === amenity && a.available)
        )
      );
    }

    if (filters.sortBy) {
      routes.sort((a, b) => {
        switch (filters.sortBy) {
          case "price":
            return a.baseFare - b.baseFare;
          case "duration":
            return parseInt(a.duration) - parseInt(b.duration);
          case "rating":
            return b.rating - a.rating;
          case "departure":
            const aHour = parseInt(a.departureTime.split(":")[0]);
            const bHour = parseInt(b.departureTime.split(":")[0]);
            return aHour - bHour;
          default:
            return 0;
        }
      });
    }
  }

  return routes;
}
