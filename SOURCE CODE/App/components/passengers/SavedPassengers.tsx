import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Users, Plus, Edit, Trash2, User, Phone, Mail, Calendar, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

interface SavedPassenger {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  email?: string;
  phone?: string;
  idType?: string;
  idNumber?: string;
}

export function SavedPassengers() {
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState<SavedPassenger[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SavedPassenger>>({
    name: "",
    age: 0,
    gender: "Male",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("savedPassengers");
    if (stored) {
      setPassengers(JSON.parse(stored));
    }
  }, []);

  const saveToStorage = (data: SavedPassenger[]) => {
    localStorage.setItem("savedPassengers", JSON.stringify(data));
    setPassengers(data);
  };

  const handleSave = () => {
    if (!formData.name || !formData.age || !formData.gender) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingId) {
      const updated = passengers.map((p) =>
        p.id === editingId ? { ...formData, id: editingId } as SavedPassenger : p
      );
      saveToStorage(updated);
      toast.success("Passenger updated successfully");
    } else {
      const newPassenger: SavedPassenger = {
        ...formData,
        id: Date.now().toString(),
      } as SavedPassenger;
      saveToStorage([...passengers, newPassenger]);
      toast.success("Passenger added successfully");
    }

    setFormData({ name: "", age: 0, gender: "Male", email: "", phone: "" });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleEdit = (passenger: SavedPassenger) => {
    setFormData(passenger);
    setEditingId(passenger.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    const updated = passengers.filter((p) => p.id !== id);
    saveToStorage(updated);
    toast.success("Passenger removed");
  };

  const handleCancel = () => {
    setFormData({ name: "", age: 0, gender: "Male", email: "", phone: "" });
    setShowAddForm(false);
    setEditingId(null);
  };

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
          <CardTitle className="flex items-center text-2xl">
            <Users className="w-6 h-6 mr-2" />
            Saved Passengers
          </CardTitle>
          <CardDescription className="text-red-100">
            Save passenger details for quick booking
          </CardDescription>
        </CardHeader>
      </Card>

      {!showAddForm && (
        <Button
          onClick={() => setShowAddForm(true)}
          className="w-full bg-[#1a56db] hover:bg-[#1242b0]"
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New Passenger
        </Button>
      )}

      {showAddForm && (
        <Card className="border-2 border-[#1a56db]">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Passenger" : "Add New Passenger"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  placeholder="Enter age"
                  min="1"
                  max="120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  className="w-full p-2 border rounded-lg"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleCancel} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1 bg-[#1a56db] hover:bg-[#1242b0]">
                {editingId ? "Update" : "Save"} Passenger
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {passengers.length === 0 && !showAddForm && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">No saved passengers yet</p>
            <p className="text-sm text-gray-500">Add passengers to book tickets faster</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {passengers.map((passenger) => (
          <Card key={passenger.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-[#1a56db] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{passenger.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {passenger.gender}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {passenger.age} yrs
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {passenger.phone && (
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Phone className="w-4 h-4" />
                  {passenger.phone}
                </div>
              )}

              {passenger.email && (
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Mail className="w-4 h-4" />
                  {passenger.email}
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(passenger)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Passenger?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove {passenger.name} from saved passengers?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(passenger.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
