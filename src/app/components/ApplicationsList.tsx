"use client";

import { useState, useEffect } from "react";
import { doc, updateDoc, arrayRemove, arrayUnion, onSnapshot, collection, query, where, getDoc } from "firebase/firestore";
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
      <h2 className="text-2xl font-semibold text-green-400 mb-6">
        Applications ({applications.length})
      </h2>
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

            <div className="space-y-4">
              <p className="text-gray-300 whitespace-pre-wrap">
                {application.message}
              </p>
              <div className="flex gap-2">
                {application.status === "pending" && (
                  <>
                    <button
                      onClick={async () => {
                        try {
                          const projectRef = doc(db, "projects", projectId);
                          
                          // First, get the current applications
                          const projectDoc = await getDoc(projectRef);
                          if (!projectDoc.exists()) {
                            throw new Error("Project not found");
                          }
                          
                          const currentApps = projectDoc.data().applications || [];
                          
                          // Create the updated applications array
                          const updatedApps = currentApps.map((app: Application) => {
                            if (app.applicantUsername === application.applicantUsername && 
                                app.timestamp === application.timestamp) {
                              return { ...app, status: "accepted" };
                            }
                            return app;
                          });
                          
                          // Update with the new array
                          await updateDoc(projectRef, { applications: updatedApps });
                          
                        } catch (error) {
                          console.error("Error accepting application:", error);
                          alert("Error accepting application. Please try again.");
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-green-400/20 text-green-400 hover:bg-green-400/30 transition-all"
                    >
                      Accept
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const projectRef = doc(db, "projects", projectId);
                          
                          // First, get the current applications
                          const projectDoc = await getDoc(projectRef);
                          if (!projectDoc.exists()) {
                            throw new Error("Project not found");
                          }
                          
                          const currentApps = projectDoc.data().applications || [];
                          
                          // Create the updated applications array
                          const updatedApps = currentApps.map((app: Application) => {
                            if (app.applicantUsername === application.applicantUsername && 
                                app.timestamp === application.timestamp) {
                              return { ...app, status: "rejected" };
                            }
                            return app;
                          });
                          
                          // Update with the new array
                          await updateDoc(projectRef, { applications: updatedApps });
                          
                        } catch (error) {
                          console.error("Error rejecting application:", error);
                          alert("Error rejecting application. Please try again.");
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-red-400/20 text-red-400 hover:bg-red-400/30 transition-all"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedApplicant(application.applicantUsername)}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
                >
                  {unreadCounts[application.applicantUsername] > 0 && (
                    <span className="text-red-400 mr-1">
                      {unreadCounts[application.applicantUsername]}
                    </span>
                  )}
                  Chat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
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