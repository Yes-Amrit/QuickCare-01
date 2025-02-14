"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Star, DollarSign, Activity, MessageCircle, CheckCircle, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "upcoming":
      return "bg-blue-500";
    case "completed":
      return "bg-green-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  useEffect(() => {
    const loadAppointments = () => {
      try {
        const storedAppointments = localStorage.getItem("appointments");
        if (storedAppointments) {
          setAppointments(JSON.parse(storedAppointments));
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error("Error loading appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();

    const handleAppointmentBooked = () => {
      loadAppointments();
    };

    window.addEventListener("appointmentBooked", handleAppointmentBooked);
    return () => {
      window.removeEventListener("appointmentBooked", handleAppointmentBooked);
    };
  }, []);

  const handleChatWithDoctor = () => {
    window.open("https://1095.3cx.cloud/prasunsingh", "_blank");
  };

  const handleCompleteAppointment = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setShowCompleteDialog(true);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setShowCancelDialog(true);
  };

  const confirmComplete = () => {
    if (selectedAppointmentId) {
      const updatedAppointments = appointments.filter(app => app.id !== selectedAppointmentId);
      setAppointments(updatedAppointments);
      localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
      setShowCompleteDialog(false);
    }
  };

  const confirmCancel = () => {
    if (selectedAppointmentId) {
      const updatedAppointments = appointments.filter(app => app.id !== selectedAppointmentId);
      setAppointments(updatedAppointments);
      localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
      setShowCancelDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-xl text-blue-600">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="relative z-10 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
          My Appointments
        </h1>

        <div className="space-y-6">
          {appointments.length > 0 ? (
            <div className="grid gap-6">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="bg-white shadow-lg border-0 transform transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-blue-700">
                        {appointment.doctor.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-gray-600">
                        <Activity className="w-4 h-4" />
                        {appointment.doctor.speciality}
                      </CardDescription>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-gray-700">Date:</span>
                        <span className="text-gray-900">{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-gray-700">Time:</span>
                        <span className="text-gray-900">{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-medium text-gray-700">Fees:</span>
                        <span className="text-gray-900">₹{appointment.doctor.fees}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium text-gray-700">Rating:</span>
                        <span className="text-gray-900">{appointment.doctor.rating}/5</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        onClick={handleChatWithDoctor}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:-translate-y-1"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Chat with Doctor
                      </Button>
                      {appointment.status === "upcoming" && (
                        <>
                          <Button
                            onClick={() => handleCompleteAppointment(appointment.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:-translate-y-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Visit completed
                          </Button>
                          <Button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:-translate-y-1"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel Appointment
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-2xl mb-4 text-blue-700">No appointments found</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Button
              onClick={() => (window.location.href = "/appointment")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 hover:-translate-y-1"
            >
              Book New Appointment
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-blue-700">Thank You for Your Visit!</AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-gray-600">
              We hope you had a great experience with our medical service. Your health is our priority! Would you like to mark this appointment as completed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
              Go back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmComplete}
              className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
            >
              Yes, mark as completed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-red-600">Cancel Appointment?</AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-gray-600">
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
              No, keep appointment
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
            >
              Yes, cancel appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}