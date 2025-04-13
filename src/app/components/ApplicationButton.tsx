"use client";

import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, updateDoc, arrayUnion, getDoc, onSnapshot, collection, query, where } from "firebase/firestore";
import ChatModal from "./ChatModal";

interface ApplicationButtonProps {
  projectId: string;
  projectTitle: string;
  applicantUsername: string;
  posterUsername: string;
}

export default function ApplicationButton({ 
  projectId,
  projectTitle,
  applicantUsername,
  posterUsername
}: ApplicationButtonProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const checkApplication = async () => {
      setIsLoading(true);
      try {
        const projectRef = doc(db, "projects", projectId);
        const projectDoc = await getDoc(projectRef);
        
        if (projectDoc.exists()) {
          const applications = projectDoc.data().applications || [];
          const userApplication = applications.find(
            (app: any) => app.applicantUsername === applicantUsername
          );
          
          if (userApplication) {
            setHasApplied(true);
            setApplicationStatus(userApplication.status);
          }
        }
      } catch (error) {
        console.error("Error checking application:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkApplication();
  }, [projectId, applicantUsername]);

  // Track unread messages for applicant
  useEffect(() => {
    if (hasApplied) {
      const chatQuery = query(
        collection(db, "chats"),
        where("projectId", "==", projectId),
        where("applicantUsername", "==", applicantUsername)
      );

      const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
        let count = 0;
        snapshot.forEach((doc) => {
          const data = doc.data();
          // Only count messages from the poster to the applicant
          if (!data.read && data.sender === posterUsername) {
            count++;
          }
        });
        setUnreadCount(count);
      });

      return () => unsubscribe();
    }
  }, [projectId, applicantUsername, posterUsername, hasApplied]);

  const handleSubmitApplication = async () => {
    if (!applicationMessage.trim()) return;
    
    setIsSubmitting(true);
    try {
      const projectRef = doc(db, "projects", projectId);
      const projectDoc = await getDoc(projectRef);

      if (!projectDoc.exists()) {
        throw new Error("Project not found");
      }

      // Create the application object
      const newApplication = {
        applicantUsername,
        message: applicationMessage,
        status: "pending",
        timestamp: new Date().toISOString()
      };

      // Update the project document with the new application
      await updateDoc(projectRef, {
        applications: arrayUnion(newApplication)
      });

      setShowApplicationForm(false);
      setApplicationMessage("");
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-8">
        <div className="w-full h-12 bg-gray-800 animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="pt-8">
      {hasApplied ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span 
              className={`px-3 py-1 rounded-full text-sm ${applicationStatus === "accepted"
                ? "bg-green-400/10 text-green-400"
                : "bg-yellow-400/10 text-yellow-400"
              }`}
            >
              {applicationStatus === "accepted" ? "Accepted" : "Pending"}
            </span>
            <button
              onClick={() => setShowChat(true)}
              className="px-4 py-2 border border-green-400 text-green-400 font-medium rounded-lg hover:bg-green-400/10 transition-colors relative"
            >
              {applicationStatus === "accepted" ? "Open Chat" : "View Message"}
              {unreadCount > 0 && applicationStatus === "accepted" && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          {showChat && (
            <ChatModal
              projectId={projectId}
              projectTitle={projectTitle}
              applicantUsername={applicantUsername}
              posterUsername={posterUsername}
              onClose={() => setShowChat(false)}
            />
          )}
        </div>
      ) : showApplicationForm ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-green-400 mb-2">
              Application Message
            </label>
            <textarea
              value={applicationMessage}
              onChange={(e) => setApplicationMessage(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all h-32 resize-none"
              placeholder="Make sure to include contact information..."
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleSubmitApplication}
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-green-400 to-cyan-400 text-gray-900 font-bold rounded-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
            
            <button
              onClick={() => setShowApplicationForm(false)}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-red-400 hover:text-red-300 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowApplicationForm(true)}
          className="w-full py-3 px-6 bg-gradient-to-r from-green-400 to-cyan-400 text-gray-900 font-bold rounded-lg hover:shadow-xl hover:scale-[1.02] transition-all"
        >
          Apply to Join Project
        </button>
      )}
    </div>
  );
}