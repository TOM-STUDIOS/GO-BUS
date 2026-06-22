export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  walletBalance: number;
  membershipTier?: "silver" | "gold" | "platinum";
  totalTrips?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface PhoneLoginData {
  phone: string;
  otp: string;
}

class AuthService {
  private currentUser: User | null = null;
  private otpStore: Map<string, string> = new Map();

  async login(credentials: LoginCredentials): Promise<User> {
    // Mock login - simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    if (credentials.email && credentials.password) {
      this.currentUser = {
        id: "usr_" + Math.random().toString(36).substr(2, 9),
        name: "Karthi",
        email: credentials.email,
        phone: "+91 9876543210",
        walletBalance: 250.00,
        membershipTier: "gold",
        totalTrips: 24,
      };
      localStorage.setItem("user", JSON.stringify(this.currentUser));
      return this.currentUser;
    }
    throw new Error("Invalid credentials");
  }

  async signUp(data: SignUpData): Promise<User> {
    // Mock sign up - simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.currentUser = {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      phone: data.phone,
      walletBalance: 100.00,
      membershipTier: "silver",
      totalTrips: 0,
    };
    localStorage.setItem("user", JSON.stringify(this.currentUser));
    return this.currentUser;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem("user");
    localStorage.removeItem("tickets");
    localStorage.removeItem("tripHistory");
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;

    const stored = localStorage.getItem("user");
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  updateUser(updates: Partial<User>): void {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates };
      localStorage.setItem("user", JSON.stringify(this.currentUser));
    }
  }

  async loginWithGoogle(): Promise<User> {
    // Mock Google login - simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.currentUser = {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      name: "Karthi",
      email: "karthi@gmail.com",
      phone: "+91 9876543210",
      walletBalance: 250.00,
      membershipTier: "gold",
      totalTrips: 24,
    };
    localStorage.setItem("user", JSON.stringify(this.currentUser));
    return this.currentUser;
  }

  async sendOTP(phone: string): Promise<{ success: boolean; otp?: string }> {
    // Mock OTP sending - simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!phone || phone.length < 10) {
      throw new Error("Invalid phone number");
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpStore.set(phone, otp);

    // In real implementation, this would be sent via SMS
    // For demo, we'll return it
    return { success: true, otp };
  }

  async loginWithPhone(data: PhoneLoginData): Promise<User> {
    // Mock phone login - simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const storedOTP = this.otpStore.get(data.phone);

    if (!storedOTP || storedOTP !== data.otp) {
      throw new Error("Invalid OTP");
    }

    this.currentUser = {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      name: "Karthi",
      email: "",
      phone: data.phone,
      walletBalance: 250.00,
      membershipTier: "gold",
      totalTrips: 24,
    };

    this.otpStore.delete(data.phone);
    localStorage.setItem("user", JSON.stringify(this.currentUser));
    return this.currentUser;
  }
}

export const authService = new AuthService();
