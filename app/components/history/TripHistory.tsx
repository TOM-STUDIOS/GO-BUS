import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ticketService } from "../../services/tickets";
import { History, MapPin, Calendar, Search, Star } from "lucide-react";
import { toast } from "sonner";

export function TripHistory() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<any[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    const history = ticketService.getTripHistory();
    setTrips(history);
    setFilteredTrips(history);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = trips.filter(trip =>
        trip.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.to.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTrips(filtered);
    } else {
      setFilteredTrips(trips);
    }
  }, [searchQuery, trips]);

  const handleOpenRatingDialog = (trip: any) => {
    setSelectedTrip(trip);
    setRating(trip.rating || 0);
    setReview(trip.review || "");
    setRatingDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    // Update trip with rating and review
    const updatedTrips = trips.map(trip =>
      trip.id === selectedTrip?.id
        ? { ...trip, rating, review, reviewed: true }
        : trip
    );

    setTrips(updatedTrips);
    setFilteredTrips(updatedTrips);

    // Update localStorage
    localStorage.setItem("tripHistory", JSON.stringify(updatedTrips));

    toast.success("Thank you for your feedback!");
    setRatingDialogOpen(false);
    setRating(0);
    setReview("");
    setSelectedTrip(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="w-5 h-5" />
            Trip History
          </CardTitle>
          <CardDescription>View your past journeys</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {filteredTrips.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <History className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">
              {searchQuery ? "No trips found matching your search" : "No trip history yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTrips.map((trip) => (
            <Card key={trip.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xl font-bold">Bus {trip.busNumber}</p>
                    <p className="text-sm text-gray-600">{trip.route}</p>
                  </div>
                  <Badge className="bg-blue-500 text-white">Completed</Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{trip.from} → {trip.to}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{trip.date} at {trip.time}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-sm text-gray-600">
                    {trip.completedAt && `Completed: ${new Date(trip.completedAt).toLocaleDateString()}`}
                  </span>
                  <span className="font-bold text-[#1a56db]">₹{(trip.fare * 80).toFixed(0)}</span>
                </div>

                {trip.reviewed ? (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-semibold text-green-700 mr-2">Your Rating:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= trip.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    {trip.review && (
                      <p className="text-sm text-gray-700 italic">"{trip.review}"</p>
                    )}
                  </div>
                ) : (
                  <Button
                    onClick={() => handleOpenRatingDialog(trip)}
                    variant="outline"
                    className="w-full mt-4"
                    size="sm"
                  >
                    <Star className="w-4 h-4" />
                    Rate This Trip
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Trip</DialogTitle>
            <DialogDescription>
              Share your experience with us
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedTrip && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold">Bus {selectedTrip.busNumber}</p>
                <p className="text-sm text-gray-600">{selectedTrip.from} → {selectedTrip.to}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-gray-600">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="review">Your Review (Optional)</Label>
              <Textarea
                id="review"
                placeholder="Tell us about your experience..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setRatingDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                className="flex-1 bg-[#1a56db] hover:bg-[#1242b0]"
              >
                Submit Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
