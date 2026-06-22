export type TicketType = "bus" | "metro" | "route";

export interface RouteSegment {
  mode: "walk" | "bus" | "metro" | "auto";
  from: string;
  to: string;
  time: number;
  cost: number;
  distance: number;
  detail?: string;
}

export interface Ticket {
  id: string;
  type: TicketType;
  // Bus fields
  busNumber: string;
  route: string;
  // Common
  from: string;
  to: string;
  date: string;
  time: string;
  fare: number;
  status: "active" | "used" | "cancelled" | "expired";
  qrCode: string;
  seatNumber?: string;
  boardingTime?: string;
  // Metro fields
  metroCity?: string;
  metroLine?: string;
  metroStops?: number;
  interchange?: string;
  validUntil?: string;
  // Route fields
  routeLabel?: string;
  segments?: RouteSegment[];
  totalTime?: number;
  transfers?: number;
}

class TicketService {
  generateTicket(bookingData: {
    busNumber: string;
    route: string;
    from: string;
    to: string;
    date: string;
    time: string;
    fare: number;
    seatNumber?: string;
  }): Ticket {
    const ticket: Ticket = {
      id: "BUS" + Math.random().toString(36).substr(2, 8).toUpperCase(),
      type: "bus",
      ...bookingData,
      status: "active",
      qrCode: this.generateQRCode(),
    };
    this.saveTicket(ticket);
    return ticket;
  }

  generateMetroTicket(data: {
    from: string;
    to: string;
    fare: number;
    metroCity: string;
    metroLine: string;
    metroStops: number;
    interchange?: string;
    time: number;
  }): Ticket {
    const now = new Date();
    const validUntil = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const ticket: Ticket = {
      id: "MTR" + Math.random().toString(36).substr(2, 8).toUpperCase(),
      type: "metro",
      busNumber: data.metroLine,
      route: `${data.from} → ${data.to}`,
      from: data.from,
      to: data.to,
      date: now.toLocaleDateString("en-IN"),
      time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      fare: data.fare,
      status: "active",
      qrCode: this.generateQRCode(),
      metroCity: data.metroCity,
      metroLine: data.metroLine,
      metroStops: data.metroStops,
      interchange: data.interchange,
      totalTime: data.time,
      validUntil: validUntil.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
    this.saveTicket(ticket);
    return ticket;
  }

  generateRouteTicket(data: {
    from: string;
    to: string;
    fare: number;
    routeLabel: string;
    segments: RouteSegment[];
    totalTime: number;
    transfers: number;
  }): Ticket {
    const now = new Date();
    const ticket: Ticket = {
      id: "RTE" + Math.random().toString(36).substr(2, 8).toUpperCase(),
      type: "route",
      busNumber: data.routeLabel,
      route: `${data.from} → ${data.to}`,
      from: data.from,
      to: data.to,
      date: now.toLocaleDateString("en-IN"),
      time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      fare: data.fare,
      status: "active",
      qrCode: this.generateQRCode(),
      routeLabel: data.routeLabel,
      segments: data.segments,
      totalTime: data.totalTime,
      transfers: data.transfers,
    };
    this.saveTicket(ticket);
    return ticket;
  }

  private generateQRCode(): string {
    return "QR_" + Math.random().toString(36).substr(2, 16).toUpperCase();
  }

  private saveTicket(ticket: Ticket): void {
    const tickets = this.getTickets();
    tickets.unshift(ticket);
    localStorage.setItem("tickets", JSON.stringify(tickets));
  }

  getTickets(): Ticket[] {
    const stored = localStorage.getItem("tickets");
    return stored ? JSON.parse(stored) : [];
  }

  getTicketById(id: string): Ticket | undefined {
    return this.getTickets().find(t => t.id === id);
  }

  getActiveTickets(): Ticket[] {
    return this.getTickets().filter(t => t.status === "active");
  }

  async useTicket(ticketId: string): Promise<Ticket> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const tickets = this.getTickets();
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error("Ticket not found");
    if (ticket.status !== "active") throw new Error("Ticket is not active");
    ticket.status = "used";
    ticket.boardingTime = new Date().toISOString();
    localStorage.setItem("tickets", JSON.stringify(tickets));
    this.addToHistory(ticket);
    return ticket;
  }

  async cancelTicket(ticketId: string): Promise<{ ticket: Ticket; refundAmount: number }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const tickets = this.getTickets();
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error("Ticket not found");
    if (ticket.status !== "active") throw new Error("Cannot cancel this ticket");
    ticket.status = "cancelled";
    localStorage.setItem("tickets", JSON.stringify(tickets));
    this.addToHistory(ticket);
    const refundAmount = ticket.fare * 0.85;
    return { ticket, refundAmount };
  }

  private addToHistory(ticket: Ticket): void {
    const history = this.getTripHistory();
    history.unshift({ ...ticket, completedAt: new Date().toISOString() });
    localStorage.setItem("tripHistory", JSON.stringify(history));
  }

  getTripHistory(): any[] {
    const stored = localStorage.getItem("tripHistory");
    return stored ? JSON.parse(stored) : [];
  }
}

export const ticketService = new TicketService();
