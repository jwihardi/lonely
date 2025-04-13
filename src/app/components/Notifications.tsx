"use client";

import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  getDocs, 
  writeBatch,
  DocumentData,
  DocumentSnapshot
} from "firebase/firestore";
import { useSession } from "next-auth/react";

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  timestamp: string;
  sender: string;
  projectId?: string;
}

export default function Notifications() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!session?.user?.name) return;

    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("recipient", "==", session.user.name)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Count unread notifications
      const newUnreadCount = newNotifications.filter(
        (n: any) => !n.read
      ).length;

      setNotifications(newNotifications);
      setUnreadCount(newUnreadCount);

      // Mark notifications as read when the user views them
      newNotifications.forEach(async (notification: any) => {
        if (!notification.read) {
          await updateDoc(doc(db, "notifications", notification.id), {
            read: true,
          });
        }
      });
    });

    return () => unsubscribe();
  }, [session?.user?.name]);

  const markAllAsRead = async () => {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("recipient", "==", session?.user?.name),
      where("read", "==", false)
    );

    const snapshot = await getDocs(q);
    const batch = writeBatch(db);

    snapshot.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();
  };

  return (
    <div className="relative">
      <button
        className={`relative px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors`}
        onClick={markAllAsRead}
      >
        Notifications
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {notifications.length > 0 && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
          <div className="p-2 space-y-2 max-h-96 overflow-y-auto">
            {notifications.map((notification: any) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg ${
                  notification.read
                    ? "bg-gray-700"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-300">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {notification.projectId && (
                    <button
                      className="text-blue-400 text-sm hover:underline"
                      onClick={() => {
                        // Navigate to project page
                        window.location.href = `/Project/${notification.projectId}`;
                      }}
                    >
                      View Project
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
