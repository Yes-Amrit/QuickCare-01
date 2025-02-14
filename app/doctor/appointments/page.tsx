"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { gsap } from "gsap";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  symptoms: string[];
  history: string;
  medications: string[];
  notes: string;
  lastVisit: string;
}

interface Appointment {
  id: number;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  symptoms?: string[];
  condition?: string;
  status: "pending" | "confirmed" | "cancelled";
  patientDetails?: Patient;
}

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDoctor, setIsDoctor] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('../api/appointment');
        const data = await response.json();
        setIsDoctor(data.isDoctor);
        if (!data.isDoctor) {
          router.push('/login');
        }
      } catch (err) {
        console.error('Auth error:', err);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('../api');
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const data = await response.json();
       
        // Fetch patient details for each appointment
        const appointmentsWithDetails = await Promise.all(
          data.map(async (appointment: Appointment) => {
            try {
              const patientResponse = await fetch(`/api/patient/${appointment.patientId}`);
              if (patientResponse.ok) {
                const patientData = await patientResponse.json();
                return { ...appointment, patientDetails: patientData };
              }
              return appointment;
            } catch (err) {
              console.error(`Error fetching patient details for ${appointment.patientId}:`, err);
              return appointment;
            }
          })
        );

        setAppointments(appointmentsWithDetails);
      } catch (err) {
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    if (isDoctor) {
      fetchAppointments();
    }
  }, [isDoctor]);

  useEffect(() => {
    if (appointments.length > 0) {
      gsap.from(".appointment-card", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });
    }
  }, [appointments]);

  const handlePatientSelect = (patientId: string) => {
    const appointment = appointments.find(app => app.patientId === patientId);
    if (appointment?.patientDetails) {
      setSelectedPatient(appointment.patientDetails);
    }
  };

  if (loading) return <div className="text-center py-8">Loading appointments...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!isDoctor) return null;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appointments List */}
        <div>
          <h1 className="text-3xl font-bold mb-8">Your Appointments</h1>
          {appointments.length === 0 ? (
            <p className="text-center text-gray-500">No appointments scheduled</p>
          ) : (
            <div className="grid gap-6">
              {appointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="appointment-card cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => handlePatientSelect(appointment.patientId)}
                >
                  <CardHeader>
                    <CardTitle>{appointment.patientName}</CardTitle>
                    <CardDescription>
                      Status: <span className={`capitalize ${
                        appointment.status === 'confirmed' ? 'text-green-500' :
                        appointment.status === 'cancelled' ? 'text-red-500' :
                        'text-yellow-500'
                      }`}>{appointment.status}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><span className="font-semibold">Date:</span> {appointment.date}</p>
                      <p><span className="font-semibold">Time:</span> {appointment.time}</p>
                      {appointment.condition && (
                        <p><span className="font-semibold">Condition:</span> {appointment.condition}</p>
                      )}
                      {appointment.symptoms && appointment.symptoms.length > 0 && (
                        <div>
                          <span className="font-semibold">Symptoms:</span>
                          <ul className="list-disc list-inside ml-4">
                            {appointment.symptoms.map((symptom, index) => (
                              <li key={index}>{symptom}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Patient Details */}
        {selectedPatient && (
          <div className="lg:sticky lg:top-8">
            <h2 className="text-2xl font-bold mb-6">Patient Details</h2>
            <div className="grid gap-6">
              <Card className="detail-card">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <p className="font-semibold">Name:</p>
                      <p>{selectedPatient.name}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Age:</p>
                      <p>{selectedPatient.age}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="detail-card">
                <CardHeader>
                  <CardTitle>Medical Condition</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">Current Condition:</p>
                  <p>{selectedPatient.condition}</p>
                  <p className="font-semibold mt-4">Symptoms:</p>
                  <ul className="list-disc list-inside">
                    {selectedPatient.symptoms.map((symptom, index) => (
                      <li key={index}>{symptom}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="detail-card">
                <CardHeader>
                  <CardTitle>Medical History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{selectedPatient.history}</p>
                </CardContent>
              </Card>

              <Card className="detail-card">
                <CardHeader>
                  <CardTitle>Current Medications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside">
                    {selectedPatient.medications.map((medication, index) => (
                      <li key={index}>{medication}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="detail-card">
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{selectedPatient.notes}</p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Last visit: {new Date(selectedPatient.lastVisit).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}