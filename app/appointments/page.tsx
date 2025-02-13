"use client";
import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Star, DollarSign, Activity } from "lucide-react";
import gsap from "gsap";

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

const sampleAppointments: Appointment[] = [
  {
    id: "1",
    doctor: {
      _id: "d1",
      name: "Dr. Sarah Wilson",
      speciality: "Cardiologist",
      fees: 1500,
      availability: "Mon-Fri",
      rating: 4.8,
      image: "doctor1.jpg"
    },
    userId: "u1",
    date: "2025-02-15",
    time: "10:00 AM",
    status: "upcoming"
  },
  {
    id: "2",
    doctor: {
      _id: "d2",
      name: "Dr. Michael Chen",
      speciality: "Neurologist",
      fees: 2000,
      availability: "Tue-Sat",
      rating: 4.9,
      image: "doctor2.jpg"
    },
    userId: "u1",
    date: "2025-02-20",
    time: "2:30 PM",
    status: "upcoming"
  }
];

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
  const [error, setError] = useState<string | null>(null);
  
  const appointmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6
      });
    }

    if (buttonRef.current) {
      gsap.from(buttonRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        delay: 0.2
      });
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      appointmentRefs.current.forEach((element, index) => {
        if (element) {
          gsap.fromTo(
            element,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.5, delay: index * 0.1 }
          );
        }
      });
    }, 100);
  }, [appointments]);

  const loadAppointments = () => {
    try {
      const storedAppointments = localStorage.getItem('appointments');
      if (storedAppointments) {
        const parsedAppointments = JSON.parse(storedAppointments);
        setAppointments(Array.isArray(parsedAppointments) ? parsedAppointments : sampleAppointments);
      } else {
        setAppointments(sampleAppointments);
        localStorage.setItem('appointments', JSON.stringify(sampleAppointments));
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      setError('Failed to load appointments');
      setAppointments(sampleAppointments);
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

  const handleBookAppointment = () => {
    window.location.href = '/appointment';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 bg-blue-400 rounded-full animate-spin"></div>
          <div className="text-xl text-blue-600">Loading appointments...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="relative z-10 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 
          ref={headerRef}
          className="text-4xl font-bold text-center mb-8 text-blue-600"
        >
          My Appointments
        </h1>
        
        <div className="space-y-6">
          {appointments.length > 0 ? (
            <div className="grid gap-6">
              {appointments.map((appointment, index) => (
                <div
                  key={appointment.id}
                  ref={el => { appointmentRefs.current[index] = el; }}
                >
                  <Card className="bg-white shadow-lg border-0">
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
                      <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[{ icon: <Calendar className="w-4 h-4 text-blue-500" />, label: "Date", value: appointment.date },
                          { icon: <Clock className="w-4 h-4 text-blue-500" />, label: "Time", value: appointment.time },
                          { icon: <DollarSign className="w-4 h-4 text-green-500" />, label: "Fees", value: `₹${appointment.doctor.fees}` },
                          { icon: <Star className="w-4 h-4 text-yellow-500" />, label: "Rating", value: `${appointment.doctor.rating}/5` }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {item.icon}
                            <span className="font-medium text-gray-700">{item.label}:</span>
                            <span className="text-gray-900">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-2xl mb-4 text-blue-700">No appointments found</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Button
              ref={buttonRef}
              onClick={handleBookAppointment}
              className="relative z-20 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
            >
              Book New Appointment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
