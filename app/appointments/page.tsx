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
  
  const backgroundElements = useRef<(HTMLDivElement | null)[]>([]);
  const appointmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Animate background elements
    backgroundElements.current.forEach((element, index) => {
      if (element) {
        gsap.to(element, {
          scale: index === 0 ? 1.2 : index === 1 ? 1 : 1.1,
          x: index === 0 ? 30 : index === 1 ? -30 : 20,
          y: index === 0 ? -30 : index === 1 ? 30 : 20,
          duration: 20 - index * 2,
          repeat: -1,
          yoyo: true,
          ease: "none"
        });
      }
    });

    // Animate header
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6
      });
    }

    // Animate appointments
    appointmentRefs.current.forEach((element, index) => {
      if (element) {
        gsap.from(element, {
          opacity: 0,
          x: -20,
          duration: 0.4,
          delay: index * 0.1
        });
      }
    });

    // Animate button
    if (buttonRef.current) {
      gsap.from(buttonRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        delay: 0.2
      });
    }
  }, [appointments]);

  const loadAppointments = () => {
    try {
      const storedAppointments = localStorage.getItem('appointments');
      if (storedAppointments) {
        const parsedAppointments = JSON.parse(storedAppointments);
        if (Array.isArray(parsedAppointments) && parsedAppointments.length > 0) {
          setAppointments(parsedAppointments);
        } else {
          setAppointments(sampleAppointments);
          localStorage.setItem('appointments', JSON.stringify(sampleAppointments));
        }
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

  const handleCardHover = (element: HTMLDivElement) => {
    gsap.to(element, {
      scale: 1.02,
      duration: 0.3
    });
  };

  const handleCardLeave = (element: HTMLDivElement) => {
    gsap.to(element, {
      scale: 1,
      duration: 0.3
    });
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="absolute inset-0 overflow-hidden">
        <div 
          ref={el => { backgroundElements.current[0] = el; }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        />
        <div 
          ref={el => { backgroundElements.current[1] = el; }}
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        />
        <div 
          ref={el => { backgroundElements.current[2] = el; }}
          className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        />
      </div>

      <div className="relative max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 
          ref={headerRef}
          className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
        >
          My Appointments
        </h1>
        
        <div>
          {appointments.length > 0 ? (
            <div className="grid gap-6">
              {appointments.map((appointment, index) => (
                <div
                  key={appointment.id}
                  ref={el => { appointmentRefs.current[index] = el; }}
                  onMouseEnter={(e) => handleCardHover(e.currentTarget)}
                  onMouseLeave={(e) => handleCardLeave(e.currentTarget)}
                  className="transform transition-all duration-300"
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-none hover:bg-white/90">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-blue-700 group-hover:text-blue-800 transition-colors">
                          {appointment.doctor.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          {appointment.doctor.speciality}
                        </CardDescription>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { icon: <Calendar className="w-4 h-4 text-blue-500" />, label: "Date", value: appointment.date },
                          { icon: <Clock className="w-4 h-4 text-blue-500" />, label: "Time", value: appointment.time },
                          { icon: <DollarSign className="w-4 h-4 text-green-500" />, label: "Fees", value: `₹${appointment.doctor.fees}` },
                          { icon: <Star className="w-4 h-4 text-yellow-500" />, label: "Rating", value: `${appointment.doctor.rating}/5` }
                        ].map((item, index) => (
                          <div 
                            key={index}
                            className="flex items-center gap-2 hover:translate-x-1 transition-transform duration-200"
                          >
                            {item.icon}
                            <span className="font-medium">{item.label}:</span> {item.value}
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
              <p className="text-gray-600 mb-8">Book a new appointment to get started</p>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <button
              ref={buttonRef}
              onClick={handleBookAppointment}
              className="relative overflow-hidden px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              <span className="relative z-10">Book New Appointment</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Notification({ message, onClose }: { message: string; onClose: () => void }) {
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (notificationRef.current) {
      gsap.from(notificationRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.4
      });
    }

    const timer = setTimeout(() => {
      if (notificationRef.current) {
        gsap.to(notificationRef.current, {
          opacity: 0,
          y: 50,
          duration: 0.4,
          onComplete: onClose
        });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      ref={notificationRef}
      className="fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      {message}
    </div>
  );
}