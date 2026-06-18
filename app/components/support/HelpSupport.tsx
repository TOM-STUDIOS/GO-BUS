import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { HelpCircle, MessageCircle, Phone, Mail, Send, Search, Clock, CheckCircle, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export function HelpSupport() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { from: "bot", text: "Hi! How can I help you today?", time: "10:00 AM" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTicket, setActiveTicket] = useState<any>(null);

  const faqs = [
    {
      category: "Booking",
      questions: [
        {
          q: "How do I book a bus ticket?",
          a: "To book a ticket: 1) Search for buses by entering source and destination 2) Select your preferred bus 3) Choose seats 4) Enter passenger details 5) Make payment",
        },
        {
          q: "Can I book tickets for someone else?",
          a: "Yes, you can book tickets for anyone. Just enter their details during the booking process. You can also save frequently traveling passengers in your account.",
        },
        {
          q: "What payment methods are accepted?",
          a: "We accept Wallet, Credit/Debit Cards, UPI, Net Banking, and various digital wallets. Your payment is 100% secure.",
        },
      ],
    },
    {
      category: "Cancellation & Refund",
      questions: [
        {
          q: "How do I cancel my ticket?",
          a: "Go to 'My Tickets', select the ticket you want to cancel, and click 'Cancel Ticket'. Refund will be processed based on the cancellation policy.",
        },
        {
          q: "When will I get my refund?",
          a: "Refunds are processed within 5-7 business days to your original payment method. The amount depends on when you cancel before departure.",
        },
        {
          q: "What is the cancellation policy?",
          a: "Cancellation charges vary by operator: 48hrs before - 10% charge, 24hrs - 25% charge, 12hrs - 50% charge, 6hrs - 75% charge.",
        },
      ],
    },
    {
      category: "Boarding & Travel",
      questions: [
        {
          q: "What documents do I need while boarding?",
          a: "You need either: 1) Ticket QR code (available in app) 2) Ticket ID 3) Valid government ID proof. Show any one to the driver.",
        },
        {
          q: "Can I change my boarding point?",
          a: "Boarding point changes depend on the operator. Contact customer support at least 6 hours before departure for assistance.",
        },
        {
          q: "What if I miss my bus?",
          a: "If you miss your bus, the ticket cannot be used for another bus. You may be eligible for partial refund based on the operator's policy.",
        },
      ],
    },
  ];

  const supportTickets = [
    { id: "TKT001", subject: "Refund not received", status: "in-progress", date: "2026-05-05" },
    { id: "TKT002", subject: "Seat not confirmed", status: "resolved", date: "2026-05-01" },
  ];

  const filteredFaqs = searchQuery
    ? faqs.map(cat => ({
        ...cat,
        questions: cat.questions.filter(
          q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
               q.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(cat => cat.questions.length > 0)
    : faqs;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    setChatMessages([
      ...chatMessages,
      { from: "user", text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { from: "bot", text: "Thanks for reaching out! Our support team will respond shortly.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
    }, 1000);

    setNewMessage("");
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
            <HelpCircle className="w-6 h-6 mr-2" />
            Help & Support
          </CardTitle>
          <CardDescription className="text-red-100">
            We're here to help you 24/7
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-8 h-8 text-[#1a56db]" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Call Us</h3>
            <p className="text-sm text-gray-600 mb-3">Available 24/7</p>
            <Button variant="outline" className="w-full">
              1800-123-4567
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-3">Instant support</p>
            <Button variant="outline" className="w-full">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Email Us</h3>
            <p className="text-sm text-gray-600 mb-3">Response in 24hrs</p>
            <Button variant="outline" className="w-full">
              support@gobus.in
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Live Chat Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-64 border rounded-lg p-4 overflow-y-auto bg-gray-50">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.from === "user"
                        ? "bg-[#1a56db] text-white"
                        : "bg-white border text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.from === "user" ? "text-red-100" : "text-gray-500"}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} className="bg-[#1a56db] hover:bg-[#1242b0]">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Your Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {supportTickets.map((ticket) => (
              <div key={ticket.id} className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{ticket.subject}</p>
                  <p className="text-sm text-gray-600">Ticket #{ticket.id}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(ticket.date).toLocaleDateString()}</p>
                </div>
                <Badge className={ticket.status === "resolved" ? "bg-green-600" : "bg-orange-500"}>
                  {ticket.status === "resolved" ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                  {ticket.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFaqs.map((category, catIndex) => (
            <div key={catIndex} className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">{category.category}</h3>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, qIndex) => (
                  <AccordionItem key={qIndex} value={`item-${catIndex}-${qIndex}`}>
                    <AccordionTrigger className="text-left">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No results found for "{searchQuery}"</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
