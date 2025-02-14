"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Syringe,
  Pill,
  Stethoscope,
  Thermometer,
  Microscope,
  AmbulanceIcon as FirstAid,
  BugIcon as Bacteria,
  Activity,
} from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

interface FormData {
  name: string
  age: string
  bloodGroup: string
  sex: string
  mobile: string
  address: string
  landmark: string
  date: string
  time: string
  alternativeTime: string
  healthIssues: string
  medications: string
  allergies: string
  selectedTests: string[]
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

const labTests = {
  "Blood Tests": [
    "Complete Blood Count (CBC)",
    "Lipid Profile",
    "Blood Sugar (Glucose)",
    "Thyroid Function",
    "Liver Function",
    "Kidney Function",
  ],
  "Diabetes Tests": ["HbA1c", "Fasting Blood Sugar", "Post Prandial Blood Sugar", "Glucose Tolerance Test"],
  "Urine Tests": ["Routine Urine Analysis", "Microalbumin", "Culture and Sensitivity"],
  "Cardiac Tests": ["ECG", "Cardiac Markers", "Cholesterol Profile"],
  "Imaging Tests": ["X-Ray", "Ultrasound", "CT Scan", "MRI"],
}

const MedicalIcon = ({ icon: Icon, className = "" }: { icon: any; className?: string }) => (
  <div className={`medical-icon ${className}`}>
    <Icon className="w-6 h-6" />
  </div>
)

export default function LabTestBooking() {
  const [step, setStep] = useState(1)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    bloodGroup: "",
    sex: "",
    mobile: "",
    address: "",
    landmark: "",
    date: "",
    time: "",
    alternativeTime: "",
    healthIssues: "",
    medications: "",
    allergies: "",
    selectedTests: [],
  })

  const formRef = useRef<HTMLFormElement>(null)
  const iconsRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Floating medical icons animation
    const icons = gsap.utils.toArray(".medical-icon")
    icons.forEach((icon: any) => {
      gsap.to(icon, {
        y: "random(-50, 50)",
        x: "random(-50, 50)",
        rotation: "random(-45, 45)",
        duration: "random(3, 6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    })

    // Medical background pattern animation
    gsap.to(".medical-pattern", {
      backgroundPosition: "100% 100%",
      duration: 20,
      repeat: -1,
      ease: "none",
    })

    // Form card entrance animation
    gsap.from(cardRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })

    // Heartbeat animation for the activity monitor
    gsap.to(".heartbeat-line", {
      scaleY: 1.5,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    })

    // DNA helix rotation
    gsap.to(".dna-strand", {
      rotationY: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
    })

    // Medical symbols float animation
    const symbols = gsap.utils.toArray(".medical-symbol")
    symbols.forEach((symbol: any) => {
      gsap.to(symbol, {
        y: "random(-20, 20)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    })

    // Form field highlight animation
    gsap.to(".form-field", {
      boxShadow: "0 0 10px rgba(52, 152, 219, 0.3)",
      duration: 1,
      repeat: -1,
      yoyo: true,
    })

    // Cleanup
    return () => {
      gsap.killTweensOf(".medical-icon")
      gsap.killTweensOf(".medical-pattern")
      gsap.killTweensOf(".heartbeat-line")
      gsap.killTweensOf(".dna-strand")
      gsap.killTweensOf(".medical-symbol")
      gsap.killTweensOf(".form-field")
    }
  }, [])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTestSelection = (test: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTests: prev.selectedTests.includes(test)
        ? prev.selectedTests.filter((t) => t !== test)
        : [...prev.selectedTests, test],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 3) {
      setShowConfirmation(true)
    }
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isStepValid()) {
      gsap.to(cardRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setStep(step + 1)
          gsap.to(cardRef.current, {
            scale: 1,
            opacity: 1,
            duration: 0.3,
          })
        },
      })
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          formData.name && formData.age && formData.bloodGroup && formData.sex && formData.mobile && formData.address
        )
      case 2:
        return formData.selectedTests.length > 0 && formData.date && formData.time && formData.alternativeTime
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-white p-6 relative overflow-hidden">
      {/* Medical Background Pattern */}
      <div
        className="absolute inset-0 medical-pattern opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Floating Medical Icons */}
      <div ref={iconsRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        <MedicalIcon icon={Syringe} className="absolute top-1/4 left-1/4" />
        <MedicalIcon icon={Pill} className="absolute top-1/3 right-1/4" />
        <MedicalIcon icon={Stethoscope} className="absolute bottom-1/4 left-1/3" />
        <MedicalIcon icon={Thermometer} className="absolute top-1/2 right-1/3" />
        <MedicalIcon icon={Microscope} className="absolute bottom-1/3 right-1/4" />
        <MedicalIcon icon={FirstAid} className="absolute top-1/4 right-1/3" />
        <MedicalIcon icon={Bacteria} className="absolute bottom-1/4 left-1/4" />
      </div>

      {/* Activity Monitor Line */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black/5">
        <div className="heartbeat-line h-full w-1 bg-green-500 transform-origin-center"></div>
      </div>

      <h1 className="text-4xl font-bold text-center mb-8 relative z-10 text-blue-600">
        Lab Test Booking
        <Activity className="inline-block ml-2 text-green-500 animate-pulse" />
      </h1>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Step Indicators */}
        <div className="mb-8 flex justify-center gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all
                ${step === i ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50" : "bg-gray-200"}
              `}
            >
              {i}
            </div>
          ))}
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          <div ref={cardRef}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <Card className="form-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FirstAid className="text-blue-500" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Please provide your basic details for the lab test</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 hover:shadow-lg transition-shadow duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Form fields with animations */}
                    <div className="form-field space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        className="focus:ring-2 ring-blue-500/50"
                      />
                    </div>
                    <div className="form-field space-y-2 hover:shadow-lg transition-shadow duration-300">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        required
                        className="focus:ring-2 ring-blue-500/50"
                      />
                    </div>
                    <div className="form-field space-y-2 hover:shadow-lg transition-shadow duration-300">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select
                        value={formData.bloodGroup}
                        onValueChange={(value) => handleInputChange("bloodGroup", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodGroups.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="form-field space-y-2 hover:shadow-lg transition-shadow duration-300">
                      <Label>Sex</Label>
                      <RadioGroup
                        value={formData.sex}
                        onValueChange={(value) => handleInputChange("sex", value)}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="form-field space-y-2 hover:shadow-lg transition-shadow duration-300">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange("mobile", e.target.value)}
                        required
                        className="focus:ring-2 ring-blue-500/50"
                      />
                    </div>
                    <div className="form-field space-y-2 hover:shadow-lg transition-shadow duration-300">
                      <Label htmlFor="landmark">Landmark</Label>
                      <Input
                        id="landmark"
                        value={formData.landmark}
                        onChange={(e) => handleInputChange("landmark", e.target.value)}
                        className="focus:ring-2 ring-blue-500/50"
                      />
                    </div>
                  </div>
                  <div className="form-field space-y-2 hover:shadow-lg transition-shadow duration-300">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      required
                      className="focus:ring-2 ring-blue-500/50"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Select Lab Tests */}
            {step === 2 && (
              <Card className="form-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Microscope className="text-blue-500" />
                    Select Lab Tests
                  </CardTitle>
                  <CardDescription>Choose the tests you want to book</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(labTests).map(([category, tests]) => (
                    <div key={category} className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Bacteria className="text-blue-500" />
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tests.map((test) => (
                          <div
                            key={test}
                            className="test-card flex items-center space-x-2 p-4 border rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <Checkbox
                              id={test}
                              checked={formData.selectedTests.includes(test)}
                              onCheckedChange={() => handleTestSelection(test)}
                            />
                            <Label htmlFor={test}>{test}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="form-field space-y-2 hover:shadow-lg transition-shadow duration-300">
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        required
                        className="focus:ring-2 ring-blue-500/50"
                      />
                    </div>
                    <div className="form-field space-y-2 hover:shadow-lg transition-shadow duration-300">
                      <Label htmlFor="time">Preferred Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleInputChange("time", e.target.value)}
                        required
                        className="focus:ring-2 ring-blue-500/50"
                      />
                    </div>
                    <div className="form-field space-y-2 hover:shadow-lg transition-shadow duration-300">
                      <Label htmlFor="alternativeTime">Alternative Time</Label>
                      <Input
                        id="alternativeTime"
                        type="time"
                        value={formData.alternativeTime}
                        onChange={(e) => handleInputChange("alternativeTime", e.target.value)}
                        required
                        className="focus:ring-2 ring-blue-500/50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Health Information */}
            {step === 3 && (
              <Card className="form-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="text-blue-500" />
                    Health Information
                  </CardTitle>
                  <CardDescription>Please provide your health details to ensure accurate testing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="form-field space-y-2">
                    <Label htmlFor="healthIssues">Existing Health Issues</Label>
                    <Textarea
                      id="healthIssues"
                      placeholder="e.g., Diabetes, Hypertension"
                      value={formData.healthIssues}
                      onChange={(e) => handleInputChange("healthIssues", e.target.value)}
                      className="focus:ring-2 ring-blue-500/50"
                    />
                  </div>
                  <div className="form-field space-y-2">
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea
                      id="medications"
                      placeholder="List any medications you're currently taking"
                      value={formData.medications}
                      onChange={(e) => handleInputChange("medications", e.target.value)}
                      className="focus:ring-2 ring-blue-500/50"
                    />
                  </div>
                  <div className="form-field space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea
                      id="allergies"
                      placeholder="e.g., latex, antiseptics"
                      value={formData.allergies}
                      onChange={(e) => handleInputChange("allergies", e.target.value)}
                      className="focus:ring-2 ring-blue-500/50"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="hover:bg-blue-50">
                Previous
              </Button>
            )}
            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={!isStepValid()} className="bg-blue-500 hover:bg-blue-600">
                Confirm Booking
              </Button>
            )}
          </div>
        </form>

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <FirstAid className="text-green-500" />
                Booking Confirmed!
              </AlertDialogTitle>
              <AlertDialogDescription>
                We will be on the way to your place at your given time. Our team will contact you shortly with further
                details.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Button onClick={() => setShowConfirmation(false)}>Close</Button>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}