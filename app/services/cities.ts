// Indian district capitals for search
export const indianCities = [
  // Major metros
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad",

  // State capitals and major cities
  "Thiruvananthapuram", "Jaipur", "Lucknow", "Chandigarh", "Bhopal", "Patna", "Ranchi",
  "Gandhinagar", "Shimla", "Srinagar", "Jammu", "Dehradun", "Raipur", "Bhubaneswar",
  "Panaji", "Gangtok", "Itanagar", "Dispur", "Imphal", "Agartala", "Aizawl", "Kohima",
  "Shillong", "Port Blair",

  // Maharashtra
  "Nagpur", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Sangli",
  "Akola", "Dhule", "Jalgaon", "Latur", "Nanded", "Parbhani", "Satara", "Ratnagiri",

  // Karnataka
  "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davangere", "Bellary",
  "Bijapur", "Shimoga", "Tumkur", "Raichur", "Bidar", "Chitradurga", "Udupi",

  // Tamil Nadu
  "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode",
  "Vellore", "Thoothukudi", "Thanjavur", "Dindigul", "Kanchipuram", "Tiruppur",
  "Cuddalore", "Karur", "Ramanathapuram", "Sivaganga",

  // Andhra Pradesh & Telangana
  "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry",
  "Kakinada", "Tirupati", "Warangal", "Nizamabad", "Karimnagar", "Khammam",

  // Kerala
  "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur",
  "Kottayam", "Malappuram", "Kasaragod", "Pathanamthitta",

  // Rajasthan
  "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bharatpur", "Alwar",
  "Sikar", "Pali", "Bhilwara", "Ganganagar", "Tonk", "Jhunjhunu",

  // Uttar Pradesh
  "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Allahabad", "Bareilly",
  "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Noida", "Firozabad",
  "Mathura", "Jhansi", "Rampur", "Shahjahanpur", "Farrukhabad", "Muzaffarnagar",

  // Gujarat
  "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Nadiad",
  "Anand", "Mehsana", "Surendranagar", "Valsad", "Bharuch", "Navsari",

  // Madhya Pradesh
  "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Dewas", "Ratlam",
  "Rewa", "Katni", "Singrauli", "Burhanpur", "Khandwa", "Morena", "Bhind",

  // West Bengal
  "Howrah", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Malda",
  "Baharampur", "Kharagpur", "Haldia", "Raiganj", "Jalpaiguri",

  // Bihar
  "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Arrah",
  "Begusarai", "Katihar", "Munger", "Chhapra", "Saharsa",

  // Punjab
  "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali",
  "Hoshiarpur", "Pathankot", "Moga", "Abohar", "Firozpur",

  // Haryana
  "Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak",
  "Hisar", "Karnal", "Sonipat", "Panchkula", "Bhiwani",

  // Odisha
  "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore",
  "Bhadrak", "Baripada", "Jharsuguda",

  // Assam
  "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia",
  "Tezpur", "Bongaigaon",

  // Jharkhand
  "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih",
  "Ramgarh", "Dumka",

  // Uttarakhand
  "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh",

  // Chhattisgarh
  "Bilaspur", "Korba", "Durg", "Bhilai", "Rajnandgaon", "Jagdalpur",

  // Goa
  "Margao", "Vasco da Gama", "Mapusa", "Ponda",

  // Himachal Pradesh
  "Dharamshala", "Solan", "Mandi", "Palampur", "Kullu", "Hamirpur",
];

export function searchCities(query: string): string[] {
  if (!query) return indianCities.slice(0, 10);

  const lowerQuery = query.toLowerCase();
  return indianCities
    .filter(city => city.toLowerCase().includes(lowerQuery))
    .slice(0, 10);
}
