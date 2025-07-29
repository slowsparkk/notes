"use client";

import React, { useState, useEffect, useCallback } from 'react';

interface BadNotificationState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  id: number;
}

let currentNotifications: BadNotificationState[] = [];
let setNotificationsCallback: React.Dispatch<React.SetStateAction<BadNotificationState[]>> | null = null;

export const showBadNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  const newNotification: BadNotificationState = {
    message,
    type,
    id: Date.now() + Math.random(), // Unique ID for key
  };
  currentNotifications = [...currentNotifications, newNotification];
  if (setNotificationsCallback) {
    setNotificationsCallback(currentNotifications);
  }
};

export const BadNotification = () => {
  const [notifications, setNotifications] = useState<BadNotificationState[]>([]);

  useEffect(() => {
    setNotificationsCallback = setNotifications;
    return () => {
      setNotificationsCallback = null;
    };
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1)); // Remove the oldest notification
        currentNotifications = currentNotifications.slice(1);
      }, 2500); // Notifications disappear quickly and without warning

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const getNotificationClasses = (type: BadNotificationState['type']) => {
    switch (type) {
      case 'success':
        return "bg-lime-400 text-fuchsia-700 border-4 border-cyan-300";
      case 'error':
        return "bg-red-500 text-white border-4 border-black";
      case 'warning':
        return "bg-yellow-600 text-purple-500 border-4 border-lime-400";
      case 'info':
      default:
        return "bg-indigo-900 text-pink-300 border-4 border-emerald-600";
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999] space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg transform rotate-3 scale-105 transition-all duration-300 ease-in-out ${getNotificationClasses(notification.type)}`}
          style={{ animation: 'shake 0.5s infinite' }} // Add a shaking animation
        >
          <p className="font-bold text-lg">{notification.message}</p>
        </div>
      ))}
      <style jsx global>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
      `}</style>
    </div>
  );
};