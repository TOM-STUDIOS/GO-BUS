import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { Login } from "./components/auth/Login";
import { SignUp } from "./components/auth/SignUp";
import { Dashboard } from "./components/dashboard/Dashboard";
import { AdvancedSearch } from "./components/booking/AdvancedSearch";
import { SeatSelection } from "./components/booking/SeatSelection";
import { BookingDetails } from "./components/booking/BookingDetails";
import { PaymentGateway } from "./components/payment/PaymentGateway";
import { PaymentSuccess } from "./components/payment/PaymentSuccess";
import { PaymentFailure } from "./components/payment/PaymentFailure";
import { MyTickets } from "./components/tickets/MyTickets";
import { TicketDetail } from "./components/tickets/TicketDetail";
import { BoardingConfirmation } from "./components/tickets/BoardingConfirmation";
import { TripHistory } from "./components/history/TripHistory";
import { Profile } from "./components/profile/Profile";
import { Wallet } from "./components/wallet/Wallet";
import { Refunds } from "./components/refunds/Refunds";
import { OffersPage } from "./components/offers/OffersPage";
import { LiveTracking } from "./components/tracking/LiveTracking";
import { BusReviews } from "./components/reviews/BusReviews";
import { SavedPassengers } from "./components/passengers/SavedPassengers";
import { ReferEarn } from "./components/rewards/ReferEarn";
import { NotificationsCenter } from "./components/notifications/NotificationsCenter";
import { HelpSupport } from "./components/support/HelpSupport";
import { Settings } from "./components/settings/Settings";
import { ChangePassword } from "./components/settings/ChangePassword";
import { TermsConditions } from "./components/legal/TermsConditions";
import { PrivacyPolicy } from "./components/legal/PrivacyPolicy";
import { MetroPlanner } from "./components/metro/MetroPlanner";
import { SmartRoutePlanner } from "./components/routes/SmartRoutePlanner";
import { SplashScreen } from "./components/common/SplashScreen";
import { NotFound } from "./components/common/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SplashScreen,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/app",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "search", Component: AdvancedSearch },
      { path: "bus/:busId", Component: SeatSelection },
      { path: "booking-details", Component: BookingDetails },
      { path: "payment", Component: PaymentGateway },
      { path: "payment/success", Component: PaymentSuccess },
      { path: "payment/failure", Component: PaymentFailure },
      { path: "tickets", Component: MyTickets },
      { path: "tickets/:ticketId", Component: TicketDetail },
      { path: "boarding/:ticketId", Component: BoardingConfirmation },
      { path: "tracking/:ticketId", Component: LiveTracking },
      { path: "history", Component: TripHistory },
      { path: "profile", Component: Profile },
      { path: "wallet", Component: Wallet },
      { path: "refunds", Component: Refunds },
      { path: "offers", Component: OffersPage },
      { path: "reviews/:busId", Component: BusReviews },
      { path: "passengers", Component: SavedPassengers },
      { path: "refer", Component: ReferEarn },
      { path: "notifications", Component: NotificationsCenter },
      { path: "help", Component: HelpSupport },
      { path: "settings", Component: Settings },
      { path: "change-password", Component: ChangePassword },
      { path: "metro", Component: MetroPlanner },
      { path: "smart-routes", Component: SmartRoutePlanner },
      { path: "terms", Component: TermsConditions },
      { path: "privacy", Component: PrivacyPolicy },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
