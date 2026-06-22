import { useNavigate } from "react-router";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { authService } from "../../services/auth";
import { Home, AlertCircle } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (authService.isAuthenticated()) {
      navigate("/app");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="py-12 text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-10 h-10 text-yellow-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-xl mb-2">Page Not Found</p>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist.
          </p>
          <Button onClick={handleGoHome} className="w-full">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
