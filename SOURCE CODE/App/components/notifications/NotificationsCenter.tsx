import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Bell, CheckCheck, Trash2, AlertCircle, Info, Gift, MapPin, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "booking" | "offer" | "alert" | "info";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export function NotificationsCenter() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n1",
      type: "booking",
      title: "Booking Confirmed",
      message: "Your ticket for VRL-42A (Downtown to Central) on May 8 has been confirmed. Seat: 12A",
      timestamp: "2026-05-07T10:30:00",
      read: false,
    },
    {
      id: "n2",
      type: "offer",
      title: "New Offer Available!",
      message: "Get 15% off on your next booking with code WEEKEND15. Valid till May 10.",
      timestamp: "2026-05-07T09:00:00",
      read: false,
    },
    {
      id: "n3",
      type: "alert",
      title: "Bus Running Late",
      message: "Your bus VRL-42A is running 15 minutes late. New ETA: 9:45 AM",
      timestamp: "2026-05-06T08:30:00",
      read: true,
    },
    {
      id: "n4",
      type: "info",
      title: "Wallet Recharged",
      message: "₹500 has been successfully added to your wallet. Current balance: ₹750",
      timestamp: "2026-05-05T14:20:00",
      read: true,
    },
    {
      id: "n5",
      type: "offer",
      title: "Refer & Earn",
      message: "Your friend Amit Kumar completed their first trip. You've earned ₹40 reward!",
      timestamp: "2026-05-04T11:15:00",
      read: true,
    },
    {
      id: "n6",
      type: "info",
      title: "Rating Request",
      message: "How was your journey on May 3? Rate your experience and help others.",
      timestamp: "2026-05-03T16:45:00",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "booking": return <MapPin className="w-5 h-5 text-blue-600" />;
      case "offer": return <Gift className="w-5 h-5 text-orange-600" />;
      case "alert": return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success("Notification deleted");
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <Card className={`border-0 shadow-md ${!notification.read ? "bg-red-50 border-l-4 border-l-[#1a56db]" : ""}`}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="mt-1">{getIcon(notification.type)}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <p className="font-semibold text-gray-800">{notification.title}</p>
                {!notification.read && (
                  <div className="w-2 h-2 bg-[#1a56db] rounded-full"></div>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
              <p className="text-xs text-gray-500">{formatTime(notification.timestamp)}</p>
            </div>
          </div>
          <div className="flex space-x-2 ml-4">
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkAsRead(notification.id)}
                title="Mark as read"
              >
                <CheckCheck className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(notification.id)}
              className="text-red-600 hover:text-red-700"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-[#1a56db] text-white">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center text-2xl">
                <Bell className="w-6 h-6 mr-2" />
                Notifications
              </CardTitle>
              <CardDescription className="text-red-100">
                Stay updated with your bookings and offers
              </CardDescription>
            </div>
            {unreadCount > 0 && (
              <Badge className="bg-white text-[#1a56db] font-bold">
                {unreadCount} New
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {notifications.length > 0 && (
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Clear all
          </Button>
        </div>
      )}

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="bookings">
            Bookings
          </TabsTrigger>
          <TabsTrigger value="offers">
            Offers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No notifications yet</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4 mt-6">
          {notifications.filter(n => !n.read).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCheck className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">All caught up!</p>
              </CardContent>
            </Card>
          ) : (
            notifications
              .filter(n => !n.read)
              .map(notification => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
          )}
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4 mt-6">
          {notifications
            .filter(n => n.type === "booking" || n.type === "alert")
            .map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
        </TabsContent>

        <TabsContent value="offers" className="space-y-4 mt-6">
          {notifications
            .filter(n => n.type === "offer")
            .map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
