import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Star, ThumbsUp, MessageSquare, TrendingUp, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
  aspects: {
    punctuality: number;
    staff: number;
    cleanliness: number;
    comfort: number;
  };
}

const mockReviews: Review[] = [
  {
    id: "rev1",
    userName: "Rajesh Kumar",
    rating: 5,
    date: "2026-05-01",
    title: "Excellent service, highly recommended!",
    comment: "The bus was on time, staff was very courteous, and the seats were comfortable. AC was working perfectly throughout the journey. Will definitely book again.",
    helpful: 24,
    verified: true,
    aspects: { punctuality: 5, staff: 5, cleanliness: 4, comfort: 5 }
  },
  {
    id: "rev2",
    userName: "Priya Sharma",
    rating: 4,
    date: "2026-04-28",
    title: "Good experience overall",
    comment: "Journey was smooth and comfortable. Only minor delay of 15 minutes at the start. Bus was clean and well-maintained. Staff could be more friendly.",
    helpful: 18,
    verified: true,
    aspects: { punctuality: 4, staff: 3, cleanliness: 5, comfort: 4 }
  },
  {
    id: "rev3",
    userName: "Amit Patel",
    rating: 5,
    date: "2026-04-25",
    title: "Best bus service I've used",
    comment: "Punctual departure and arrival. The sleeper berths were very comfortable. Charging points worked well. Driver was experienced and drove safely.",
    helpful: 31,
    verified: true,
    aspects: { punctuality: 5, staff: 5, cleanliness: 5, comfort: 5 }
  },
  {
    id: "rev4",
    userName: "Sneha Reddy",
    rating: 3,
    date: "2026-04-20",
    title: "Average experience",
    comment: "Bus was okay but AC wasn't cooling properly. Staff response was slow. However, reached on time which was good.",
    helpful: 9,
    verified: false,
    aspects: { punctuality: 5, staff: 3, cleanliness: 3, comfort: 2 }
  },
];

export function BusReviews() {
  const navigate = useNavigate();
  const location = useLocation();
  const { busId } = useParams();
  const route = location.state?.route;

  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: "", comment: "" });

  const averageRating = route?.rating || 4.5;
  const totalReviews = route?.reviews || 234;

  const ratingDistribution = [
    { stars: 5, count: 156, percentage: 67 },
    { stars: 4, count: 48, percentage: 20 },
    { stars: 3, count: 18, percentage: 8 },
    { stars: 2, count: 8, percentage: 3 },
    { stars: 1, count: 4, percentage: 2 },
  ];

  const aspectRatings = [
    { name: "Punctuality", rating: 4.6 },
    { name: "Staff Behavior", rating: 4.3 },
    { name: "Cleanliness", rating: 4.5 },
    { name: "Comfort", rating: 4.4 },
  ];

  const handleSubmitReview = () => {
    if (!newReview.title || !newReview.comment) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.success("Thank you for your review!");
    setShowWriteReview(false);
    setNewReview({ rating: 5, title: "", comment: "" });
  };

  const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) => {
    const starSize = size === "lg" ? "w-6 h-6" : "w-4 h-4";
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-[#1a56db] text-white">
          <CardTitle className="text-2xl">Reviews & Ratings</CardTitle>
          <CardDescription className="text-red-100">
            See what passengers are saying
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-800 mb-2">{averageRating}</div>
              <StarRating rating={Math.round(averageRating)} size="lg" />
              <p className="text-sm text-gray-600 mt-2">{totalReviews} ratings</p>
            </div>

            <div className="mt-6 space-y-2">
              {ratingDistribution.map((dist) => (
                <div key={dist.stars} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{dist.stars}★</span>
                  <Progress value={dist.percentage} className="flex-1 h-2" />
                  <span className="text-sm text-gray-600 w-12 text-right">{dist.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-0 shadow-md">
          <CardHeader>
            <CardTitle>Rating Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aspectRatings.map((aspect) => (
              <div key={aspect.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">{aspect.name}</span>
                  <span className="text-sm font-semibold text-[#1a56db]">{aspect.rating}/5</span>
                </div>
                <Progress value={(aspect.rating / 5) * 100} className="h-2" />
              </div>
            ))}

            <Button
              onClick={() => setShowWriteReview(!showWriteReview)}
              className="w-full mt-4 bg-[#1a56db] hover:bg-[#1242b0]"
            >
              <MessageSquare className="h-4 w-4" />
              Write a Review
            </Button>
          </CardContent>
        </Card>
      </div>

      {showWriteReview && (
        <Card className="border-2 border-[#1a56db]">
          <CardHeader>
            <CardTitle>Share Your Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Your Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 cursor-pointer transition-colors ${
                      star <= newReview.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Review Title</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                placeholder="Summarize your experience"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Your Review</label>
              <Textarea
                placeholder="Tell us about your journey..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowWriteReview(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmitReview} className="flex-1 bg-[#1a56db] hover:bg-[#1242b0]">
                Submit Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Customer Reviews</h3>

        {reviews.map((review) => (
          <Card key={review.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-12 h-12 bg-[#1a56db]">
                    <AvatarFallback className="text-white font-bold">
                      {review.userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-gray-800">{review.userName}</p>
                      {review.verified && (
                        <Badge className="bg-green-600 text-white text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="font-semibold text-gray-800 mb-2">{review.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{review.comment}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="text-xs">
                  Punctuality: {review.aspects.punctuality}/5
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Staff: {review.aspects.staff}/5
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Cleanliness: {review.aspects.cleanliness}/5
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Comfort: {review.aspects.comfort}/5
                </Badge>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <button className="flex items-center space-x-1 hover:text-[#1a56db]">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={() => navigate(-1)} className="w-full">
        Back to Booking
      </Button>
    </div>
  );
}
