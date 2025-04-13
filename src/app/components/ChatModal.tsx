"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "../firebaseConfig";
import { collection, query, orderBy, addDoc, onSnapshot, where, updateDoc, doc, writeBatch, getDocs } from "firebase/firestore";
interface Message {
  sender: string;
  content: string;
  timestamp: string;
  read?: boolean;
}
interface ChatModalProps {
  projectId: string;
  projectTitle: string;
  applicantUsername: string;
  posterUsername: string;
  onClose: () => void;
}
const ScrollToBottom = ({ children }: { children: React.ReactNode }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.scrollTop = elementRef.current.scrollHeight;
    }
  });
  return (
    <div ref={elementRef} className="flex-1 overflow-y-auto custom-scrollbar">
      {children}
    </div>
  );
};
export default function ChatModal({
  projectId,
  projectTitle,
  applicantUsername,
  posterUsername,
  onClose
}: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [sending, setSending] = useState(false);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [currentUsername, setCurrentUsername] = useState<string>(() => {
    const storedUsername = sessionStorage.getItem('username');
    return storedUsername || '';
  });
  
  // Force focus on the textarea
  const forceFocus = () => {
    // Use a timeout to ensure this runs after React's state updates
    setTimeout(() => {
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    }, 0);
  };
  // Focus the input field when the modal opens and set an interval to maintain focus
  useEffect(() => {
    // Initial focus
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
    
    // Set up an interval to continuously check focus and restore if needed
    const focusInterval = setInterval(() => {
      if (document.activeElement !== messageInputRef.current && messageInputRef.current) {
        messageInputRef.current.focus();
      }
    }, 100);
    
    return () => clearInterval(focusInterval);
  }, []);

  // Handle escape key to close the modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);
  useEffect(() => {
    const getCurrentUser = async () => {
      if (!currentUsername) {
        const response = await fetch("/api/auth/session");
        const session = await response.json();
        const username = session?.user?.name || "";
        setCurrentUsername(username);
        sessionStorage.setItem('username', username);
      }
    };
    getCurrentUser();
    const chatQuery = query(
      collection(db, "chats"),
      where("projectId", "==", projectId),
      where("applicantUsername", "==", applicantUsername),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
      const newMessages: Message[] = [];
      let newUnreadCount = 0;
      const updatePromises: Promise<void>[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const message = {
          sender: data.sender,
          content: data.content,
          timestamp: data.timestamp,
          read: data.read || false
        };
        const isFromOtherPerson = data.sender !== sessionStorage.getItem('username');
        if (!message.read && isFromOtherPerson) {
          message.read = true;
          updatePromises.push(
            updateDoc(doc(db, "chats", docSnapshot.id), { read: true })
          );
        }
        newMessages.push(message);
      });
      Promise.all(updatePromises).catch(error => {
        console.error("Error updating message read status:", error);
      });
      setMessages(newMessages);
      setUnreadCount(newUnreadCount);
    });
    return () => unsubscribe();
  }, [projectId, applicantUsername, currentUsername]);
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission to keep focus
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) {
      // If empty message, ensure focus remains and exit
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
      return;
    }
    
    setSending(true);
    
    try {
      const timestamp = new Date().toISOString();
      const messageData = {
        projectId,
        projectTitle,
        applicantUsername,
        posterUsername,
        sender: currentUsername,
        content: trimmedMessage,
        timestamp,
        read: false
      };
      
      // Update UI first
      setMessages(prev => [...prev, {
        sender: currentUsername,
        content: trimmedMessage,
        timestamp,
        read: false
      }]);
      
      // Clear message but don't lose focus
      setNewMessage("");
      
      // Critical: Force focus to remain on input using multiple strategies
      if (messageInputRef.current) {
        messageInputRef.current.focus();
        
        // Use multiple timeouts at different delays to ensure focus is maintained
        // This handles different browser timing issues
        setTimeout(() => messageInputRef.current?.focus(), 0);
        setTimeout(() => messageInputRef.current?.focus(), 10);
        setTimeout(() => messageInputRef.current?.focus(), 50);
        setTimeout(() => messageInputRef.current?.focus(), 100);
        
        // Also use requestAnimationFrame for good measure
        requestAnimationFrame(() => messageInputRef.current?.focus());
      }
      
      // Then handle the async database operations
      await addDoc(collection(db, "chats"), messageData);
      const recipient = currentUsername === posterUsername ? applicantUsername : posterUsername;
      await addDoc(collection(db, "notifications"), {
        type: "message",
        message: `${currentUsername} sent you a message`,
        read: false,
        timestamp,
        sender: currentUsername,
        recipient,
        projectId
      });
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message. Please try again.");
    } finally {
      setSending(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl h-[600px] flex flex-col">
        {}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-green-400">
            Chat with @{currentUsername === posterUsername ? applicantUsername : posterUsername}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            &times;
          </button>
        </div>
        {}
        <ScrollToBottom>
          <div className="p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  message.sender === currentUsername ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === currentUsername
                      ? "bg-green-400/10 text-green-400"
                      : "bg-gray-800 text-gray-300"
                  }`}
                >
                  <p className="text-sm font-medium mb-1">@{message.sender}</p>
                  {message.content && <p className="whitespace-pre-wrap break-words">{message.content}</p>}
                  <p className="text-xs opacity-50 mt-1">
                    {new Date(message.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollToBottom>
        {}
        <div className="p-4 border-t border-gray-800">
          <form ref={formRef} onSubmit={sendMessage} className="flex space-x-4" onClick={() => messageInputRef.current?.focus()}>
            <textarea
              ref={messageInputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  // Store the input element reference
                  const inputElement = messageInputRef.current;
                  
                  // Focus the element directly using DOM APIs
                  if (inputElement) {
                    // Create a function to focus using multiple methods
                    const focusAggressively = () => {
                      inputElement.focus();
                      // Some browsers need a slight delay
                      setTimeout(() => inputElement.focus(), 10);
                      setTimeout(() => inputElement.focus(), 50);
                    };
                    
                    // Call immediate focus
                    focusAggressively();
                    
                    // Then send the message
                    sendMessage(e);
                    
                    // Focus again after sending
                    requestAnimationFrame(focusAggressively);
                  }
                }
              }}
              onBlur={(e) => {
                // Aggressively refocus unless clicking elsewhere
                setTimeout(() => {
                  if (messageInputRef.current && document.activeElement !== messageInputRef.current) {
                    messageInputRef.current.focus();
                  }
                }, 10);
              }}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400/30 resize-none"
              rows={1}
              autoFocus
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className={`px-6 py-2 rounded-lg ${
                sending || !newMessage.trim()
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-green-400 hover:bg-green-500 transition-colors"
              }`}
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(74, 222, 128, 0.3);
          border-radius: 4px;
          transition: all 0.2s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(74, 222, 128, 0.5);
        }
      `}</style>
    </div>
  );
}