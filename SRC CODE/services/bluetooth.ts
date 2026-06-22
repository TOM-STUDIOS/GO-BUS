export interface NearbyBus {
  id: string;
  number: string;
  route: string;
  destination: string;
  distance: number;
  arrivalTime: number;
  occupancy: "low" | "medium" | "high";
}

class BluetoothService {
  private scanning = false;

  async startScan(): Promise<NearbyBus[]> {
    // Mock Bluetooth scanning - simulate finding nearby buses
    this.scanning = true;
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockBuses: NearbyBus[] = [
      {
        id: "bus_001",
        number: "42A",
        route: "Downtown Express",
        destination: "Central Station",
        distance: 0.3,
        arrivalTime: 5,
        occupancy: "low",
      },
      {
        id: "bus_002",
        number: "15",
        route: "Airport Shuttle",
        destination: "International Airport",
        distance: 0.8,
        arrivalTime: 12,
        occupancy: "medium",
      },
      {
        id: "bus_003",
        number: "7B",
        route: "University Route",
        destination: "Tech University",
        distance: 1.2,
        arrivalTime: 8,
        occupancy: "high",
      },
    ];

    this.scanning = false;
    return mockBuses;
  }

  stopScan(): void {
    this.scanning = false;
  }

  isScanning(): boolean {
    return this.scanning;
  }

  async checkBusPresence(busId: string): Promise<boolean> {
    // Check if specific bus is nearby (for boarding)
    await new Promise(resolve => setTimeout(resolve, 500));
    return Math.random() > 0.3;
  }
}

export const bluetoothService = new BluetoothService();
