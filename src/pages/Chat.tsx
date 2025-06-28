import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Send, Phone, Video, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock contacts data
const mockContacts = [
  {
    id: 1,
    name: "Maria Nguyen",
    title: "Store Manager - Thien Huong Sandwiches",
    avatar: "/api/placeholder/40/40",
    lastMessage: "You: Dạ em cám ơn chị",
    time: "2:30 PM",
    unread: false,
    preferredLanguage: "vi"
  },
  {
    id: 2,
    name: "Sarah Chen",
    title: "Engineering Manager - Primera",
    avatar: "/api/placeholder/40/40",
    lastMessage: "Sarah: When can you start?",
    time: "1:15 PM",
    unread: true,
    preferredLanguage: "en"
  },
  {
    id: 3,
    name: "David Kim",
    title: "Restaurant Manager - The Garden Restaurant",
    avatar: "/api/placeholder/40/40",
    lastMessage: "You: I'm available for the night shift",
    time: "Yesterday",
    unread: false,
    preferredLanguage: "en"
  }
];

// Mock messages data
const mockMessages = [
  {
    id: 1,
    sender: "Maria Nguyen",
    content: "Hello! I saw your application for the cashier position. Are you available for an interview this week?",
    time: "2:15 PM",
    isOwn: false,
    originalLanguage: "en",
    translatedContent: "" // To store translated content
  },
  {
    id: 2,
    sender: "You",
    content: "Yes, I'm available. What time works best for you?",
    time: "2:20 PM",
    isOwn: true,
    originalLanguage: "en",
    translatedContent: ""
  },
  {
    id: 3,
    sender: "Maria Nguyen",
    content: "How about tomorrow at 3 PM? We're located at 123 Main Street.",
    time: "2:25 PM",
    isOwn: false,
    originalLanguage: "en",
    translatedContent: ""
  },
  {
    id: 4,
    sender: "You",
    content: "Dạ em cám ơn chị",
    time: "2:30 PM",
    isOwn: true,
    originalLanguage: "vi",
    translatedContent: ""
  }
];

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  isOwn: boolean;
  originalLanguage: string;
  translatedContent: string;
}

interface Contact {
  id: number;
  name: string;
  title: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  preferredLanguage: string;
}

const ChatInterface = ({ selectedContact, userLanguage }: { selectedContact: Contact; userLanguage: string }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // Placeholder for your IBM Granite 3.3 translation logic
  const translateMessage = useCallback(async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
    // === START IBM GRANITE 3.3 / HUGGING FACE MODEL INTEGRATION AREA ===
    // This is where you would implement the actual API call to your backend
    // which then communicates with IBM Granite 3.3 or a Hugging Face model.

    // Example of what an API call to your backend might look like:
    // try {
    //   const response = await fetch('/api/translate', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ text, sourceLang, targetLang }),
    //   });
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }
    //   const data = await response.json();
    //   return data.translatedText;
    // } catch (error) {
    //   console.error("Translation error:", error);
    //   // Fallback to original text or an error message
    //   return `[Translation Failed for "${text}"]: ${error.message}`;
    // }

    // For now, retaining the simple mock translation for demonstration:
    if (sourceLang === targetLang) {
      return text;
    }
    if (sourceLang === "en" && targetLang === "vi") {
      if (text.includes("Hello!")) return "Xin chào! Tôi thấy đơn ứng tuyển của bạn cho vị trí thu ngân. Bạn có thể phỏng vấn trong tuần này không?";
      if (text.includes("How about tomorrow at 3 PM?")) return "Ngày mai lúc 3 giờ chiều thì sao? Chúng tôi ở 123 Main Street.";
    } else if (sourceLang === "vi" && targetLang === "en") {
      if (text.includes("Dạ em cám ơn chị")) return "Yes, thank you.";
    }
    return `[Translated to ${targetLang}]: ${text}`;
    // === END IBM GRANITE 3.3 / HUGGING FACE MODEL INTEGRATION AREA ===
  }, []);

  useEffect(() => {
    const loadMessagesAndTranslate = async () => {
      const translatedMessages = await Promise.all(
        mockMessages.map(async (message) => {
          const targetLang = message.isOwn ? userLanguage : selectedContact.preferredLanguage; // Translate incoming messages to userLanguage, outgoing to recipient's language
          const translatedContent = await translateMessage(message.content, message.originalLanguage, targetLang);
          return { ...message, translatedContent };
        })
      );
      setMessages(translatedMessages);
    };

    loadMessagesAndTranslate();
  }, [selectedContact, userLanguage, translateMessage]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const originalMessageContent = newMessage;
      setNewMessage("");

      // 1. Add own message to local state, translated for self (optional, could just be original)
      const translatedForSelf = await translateMessage(originalMessageContent, userLanguage, userLanguage); // Translate own message to own language for display
      const newOwnMessage: Message = {
        id: messages.length + 1,
        sender: "You",
        content: originalMessageContent, // Store original content
        translatedContent: translatedForSelf, // Store translated content for display
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        originalLanguage: userLanguage,
      };
      setMessages((prevMessages) => [...prevMessages, newOwnMessage]);

      // 2. Simulate sending the message to a backend for translation and then to the recipient
      // This part would involve an actual API call to your backend, passing originalMessageContent, userLanguage, and selectedContact.preferredLanguage
      // The backend would then call IBM Granite/Hugging Face and send the translated message to the recipient (e.g., via websockets)
      const translatedForRecipient = await translateMessage(originalMessageContent, userLanguage, selectedContact.preferredLanguage);
      console.log(`Sending message: "${originalMessageContent}" (translated for recipient as "${translatedForRecipient}")`);


      // 3. Simulate a response from the recipient, which your backend would also translate and send back to your frontend
      const recipientOriginalResponse = "Chào bạn! Tôi thấy hồ sơ của bạn rất thú vị. Bạn có rảnh để phỏng vấn không?"; // Example response from recipient in their original language
      const translatedRecipientResponse = await translateMessage(recipientOriginalResponse, selectedContact.preferredLanguage, userLanguage); // Translate recipient's original response to current user's language
      const newRecipientMessage: Message = {
        id: messages.length + 2,
        sender: selectedContact.name,
        content: recipientOriginalResponse, // Store original content
        translatedContent: translatedRecipientResponse, // Store translated content for display
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false,
        originalLanguage: selectedContact.preferredLanguage,
      };
      setMessages((prevMessages) => [...prevMessages, newRecipientMessage]);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={selectedContact.avatar} />
            <AvatarFallback>{selectedContact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">{selectedContact.name}</h3>
            <p className="text-sm text-gray-600">{selectedContact.title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isOwn
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-900'
              }`}>
              {/* Display the translated content */}
              <p className="text-sm">{message.translatedContent}</p>
              <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const Chat = () => {
  const [selectedContact, setSelectedContact] = useState<Contact>(mockContacts[0]);
  const [userLanguage, setUserLanguage] = useState("en"); // State for current user's language

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Jobs</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">JB</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-200px)]">
          {/* Left Side - Contact List */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Conversations</h2>
                </div>
                <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                  {mockContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedContact.id === contact.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                            <span className="text-xs text-gray-500">{contact.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate mb-1">{contact.title}</p>
                          <p className={`text-sm truncate ${contact.unread ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                            {contact.lastMessage}
                          </p>
                        </div>
                        {contact.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Chat Interface */}
          <div className="lg:col-span-3">
            <ChatInterface selectedContact={selectedContact} userLanguage={userLanguage} />
            {/* Language selection for current user */}
            <div className="p-4 flex justify-end">
              <Select onValueChange={setUserLanguage} defaultValue={userLanguage}>
                <SelectTrigger className="w-[100px] text-sm">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;