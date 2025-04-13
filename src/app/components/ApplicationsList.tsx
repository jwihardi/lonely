"use client";

import { useState, useEffect } from "react";
import { doc, updateDoc, arrayRemove, arrayUnion, onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import ChatModal from "./ChatModal";

interface Application {
  applicantUsername: string;
  message: string;
  status: string;
  timestamp: string;
}

interface ApplicationsListProps {
  applications?: Application[];
  projectId: string;
  projectTitle: string;
  posterUsername: string;
}

export default function ApplicationsList({ 
  applications: initialApplications,
  projectId,
  projectTitle,
  posterUsername
}: ApplicationsListProps) {
  const [applications, setApplications] = useState(initialApplications || []);
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<{[key: string]: number}>({});

  // Listen for real-time updates to applications
  useEffect(() => {
    const projectRef = doc(db, "projects", projectId);
    const unsubscribe = onSnapshot(projectRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.applications) {
          setApplications(data.applications);
        }
      }
    });

    return () => unsubscribe();
  }, [projectId]);

  // Track unread messages for each chat
  useEffect(() => {
    const unsubscribes = applications.map(app => {
      const chatQuery = query(
        collection(db, "chats"),
        where("projectId", "==", projectId),
        where("applicantUsername", "==", app.applicantUsername)
      );

      return onSnapshot(chatQuery, (snapshot) => {
        let unreadCount = 0;
        snapshot.forEach((doc) => {
          const data = doc.data();
          const isCurrentUserPoster = posterUsername === sessionStorage.getItem('username');
          const isMessageFromOtherPerson = isCurrentUserPoster ? 
            data.sender === app.applicantUsername : 
            data.sender === posterUsername;

          if (!data.read && isMessageFromOtherPerson) {
            unreadCount++;
          }
        });
        setUnreadCounts(prev => ({
          ...prev,
          [app.applicantUsername]: unreadCount
        }));
      });
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, [applications, projectId, posterUsername]);
  if (!applications || applications.length === 0) {
    return (
      <div className="pt-8">
        <h2 className="text-2xl font-semibold text-green-400 mb-4">Applications</h2>
        <p className="text-gray-400">No applications yet.</p>
      </div>
    );
  }

  return (
    <div className="pt-8">
      <h2 className="text-2xl font-semibold text-green-400 mb-6">Applications ({applications.length})</h2>
      <div className="space-y-6">
        {applications.map((application, index) => (
          <div 
            key={index}
            className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-green-400/30 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <a
                  href={`https://github.com/${application.applicantUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 transition-colors font-medium"
                >
                  @{application.applicantUsername}
                </a>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(application.timestamp).toLocaleDateString()} at{" "}
                  {new Date(application.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <span 
                className={`px-3 py-1 rounded-full text-sm ${
                  application.status === "pending"
                    ? "bg-yellow-400/10 text-yellow-400"
                    : application.status === "accepted"
                    ? "bg-green-400/10 text-green-400"
                    : "bg-red-400/10 text-red-400"
                }`}
              >
                {application.status}
              </span>
            </div>
            <p className="text-gray-300 whitespace-pre-wrap">{application.message}</p>
            
            {/* Action Buttons */}
            <div className="mt-4 flex gap-3">
              {application.status === "pending" && (
                <button
                  onClick={async () => {
                    const projectRef = doc(db, "projects", projectId);
                    const updatedApplication = {
                      ...application,
                      status: "accepted"
                    };
                    
                    try {
                      await updateDoc(projectRef, {
                        applications: arrayRemove(application)
                      });
                      await updateDoc(projectRef, {
                        applications: arrayUnion(updatedApplication)
                      });

                      // Update local state
                      setApplications(prevApplications => 
                        prevApplications.map(app => 
                          app.applicantUsername === application.applicantUsername &&
                          app.timestamp === application.timestamp
                            ? updatedApplication
                            : app
                        )
                      );
                    } catch (error) {
                      console.error("Error accepting application:", error);
                      alert("Error accepting application. Please try again.");
                    }
                  }}
                  className="px-4 py-2 bg-green-400 text-gray-900 font-medium rounded-lg hover:bg-green-300 transition-colors"
                >
                  Accept
                </button>
              )}
              <button
                onClick={() => setSelectedApplicant(application.applicantUsername)}
                className={`px-4 py-2 border font-medium rounded-lg transition-colors relative ${application.status === "accepted" 
                  ? "border-green-400 text-green-400 hover:bg-green-400/10"
                  : "border-gray-600 text-gray-400 hover:bg-gray-800"}`}
              >
                {application.status === "accepted" ? "Open Chat" : "View Message"}
                {unreadCounts[application.applicantUsername] > 0 && application.status === "accepted" && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCounts[application.applicantUsername]}
                  </span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Modal */}
      {selectedApplicant && (
        <ChatModal
          projectId={projectId}
          projectTitle={projectTitle}
          applicantUsername={selectedApplicant}
          posterUsername={posterUsername}
          onClose={() => setSelectedApplicant(null)}
        />
      )}
    </div>
  );
}
