"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

type Doctor = {
  _id: string;
  name: string;
  speciality: string;
  fees: number;
  availability: string;
  rating: number;
  image: string;
};

type Appointment = {
  id: string;
  doctor: Doctor;
  userId: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
};

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = () => {
    try {
      const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      if (Array.isArray(storedAppointments) && storedAppointments.every(isValidAppointment)) {
        setAppointments(storedAppointments);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();

    const handleAppointmentBooked = () => {
      loadAppointments();
    };

    window.addEventListener('appointmentBooked', handleAppointmentBooked);
    return () => {
      window.removeEventListener('appointmentBooked', handleAppointmentBooked);
    };
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading appointments...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">My Appointments</h1>
      {appointments.length > 0 ? (
        <div className="grid gap-6">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="appointment-card">
              <CardHeader className="flex flex-row items-center gap-4">
                <div>
                  <CardTitle>{appointment.doctor.name}</CardTitle>
                  <CardDescription>{appointment.doctor.speciality}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><span className="font-medium">Date:</span> {appointment.date}</p>
                  <p><span className="font-medium">Time:</span> {appointment.time}</p>
                  <p><span className="font-medium">Status:</span> <span className="capitalize">{appointment.status}</span></p>
                  <p><span className="font-medium">Fees:</span> ₹{appointment.doctor.fees}</p>
                  <p><span className="font-medium">Doctor's Availability:</span> {appointment.doctor.availability}</p>
                  <p><span className="font-medium">Rating:</span> {appointment.doctor.rating}/5</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-xl mb-4">No appointments found</p>
          <p className="text-gray-600 mb-8">Book a new appointment to get started</p>
        </div>
      )}
      <div className="mt-8 text-center">
        <Button asChild>
          <Link href="/appointment">Book New Appointment</Link>
        </Button>
      </div>
    </div>
  );
}

function isValidAppointment(appointment: any): appointment is Appointment {
  return (
    typeof appointment.id === "string" &&
    typeof appointment.date === "string" &&
    typeof appointment.time === "string" &&
    typeof appointment.status === "string" &&
    appointment.doctor &&
    typeof appointment.doctor._id === "string" &&
    typeof appointment.doctor.name === "string" &&
    typeof appointment.doctor.speciality === "string" &&
    typeof appointment.doctor.fees === "number" &&
    typeof appointment.doctor.availability === "string" &&
    typeof appointment.doctor.rating === "number" &&
    typeof appointment.doctor.image === "string"
  );
}

// components/notification.tsx
interface NotificationProps {
  message: string;
  onClose: () => void;
}

export function Notification({ message, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
      {message}
    </div>
  );
}
