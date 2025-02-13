"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface UserData {
  height: number
  weight: number
  age: number
  gender: string
  activityLevel: string
  goalWeight: number
  goal: "lose" | "gain"
  sugarLevel: number
}

interface NutritionPlan {
  calories: number
  protein: number
  carbs: number
  fats: number
  sugarLimit: number
  vitamins: {
    a: number
    c: number
    d: number
    e: number
    b12: number
  }
  minerals: {
    zinc: number
    iron: number
    calcium: number
  }
}

export default function DietPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<UserData>({
    height: 0,
    weight: 0,
    age: 0,
    gender: "",
    activityLevel: "moderate",
    goalWeight: 0,
    goal: "lose",
    sugarLevel: 0,
  })
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const dnaRef = useRef<HTMLDivElement>(null)
  const moleculesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create floating medical symbols background
    const container = containerRef.current
    if (!container) return

    const createMedicalSymbol = () => {
      const symbol = document.createElement("div")
      symbol.className = "absolute text-blue-100/20 text-4xl select-none pointer-events-none"
      symbol.style.left = `${Math.random() * 100}vw`
      symbol.style.top = `${Math.random() * 100}vh`
      symbol.innerHTML = ["⚕", "+", "🔬", "💊", "🧬"][Math.floor(Math.random() * 5)]
      return symbol
    }

    // Add multiple medical symbols
    const symbols = Array.from({ length: 20 }, createMedicalSymbol)
    symbols.forEach((symbol) => container.appendChild(symbol))

    // Animate medical symbols
    symbols.forEach((symbol) => {
      gsap.to(symbol, {
        y: `${Math.random() * 200 - 100}px`,
        x: `${Math.random() * 200 - 100}px`,
        rotation: Math.random() * 360,
        duration: 10 + Math.random() * 10,
        repeat: -1,
        yoyo: true,
        ease: "none",
      })
    })

    // DNA Helix Animation
    const dnaContainer = dnaRef.current
    if (dnaContainer) {
      const strands = 20
      for (let i = 0; i < strands; i++) {
        const strand = document.createElement("div")
        strand.className = "absolute w-2 h-2 rounded-full bg-blue-200/20"
        dnaContainer.appendChild(strand)

        gsap.to(strand, {
          y: Math.sin(i / 2) * 100,
          x: i * 20,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.1,
        })
      }
    }

    // Molecule Animation
    const moleculesContainer = moleculesRef.current
    if (moleculesContainer) {
      const molecules = 15
      for (let i = 0; i < molecules; i++) {
        const molecule = document.createElement("div")
        molecule.className = "absolute w-4 h-4 rounded-full bg-green-200/20"
        moleculesContainer.appendChild(molecule)

        gsap.to(molecule, {
          x: `random(-100, 100, 5)`,
          y: `random(-100, 100, 5)`,
          rotation: 360,
          duration: "random(3, 8)",
          repeat: -1,
          ease: "none",
          delay: i * 0.2,
        })
      }
    }

    // Cleanup
    return () => {
      symbols.forEach((symbol) => symbol.remove())
      gsap.killTweensOf("*")
    }
  }, [])

  useEffect(() => {
    // Animate step transitions
    if (loading) {
      gsap.to(".form-container", {
        scale: 0.95,
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      })
    } else {
      gsap.fromTo(
        ".form-container",
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" },
      )
    }
  }, [loading])

  const calculateNutrition = (data: UserData): NutritionPlan => {
    // Enhanced calculation including sugar limits
    const bmr =
      data.gender === "male"
        ? 88.362 + 13.397 * data.weight + 4.799 * data.height - 5.677 * data.age
        : 447.593 + 9.247 * data.weight + 3.098 * data.height - 4.33 * data.age

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    }

    const tdee = bmr * activityMultipliers[data.activityLevel as keyof typeof activityMultipliers]
    const goalCalories = data.goal === "lose" ? tdee - 500 : tdee + 500

    // Adjust sugar limit based on blood sugar level
    const baseSugarLimit = 25 // grams
    const sugarLimit =
      data.sugarLevel > 100
        ? baseSugarLimit * 0.7 // Reduce sugar for high blood sugar
        : baseSugarLimit

    return {
      calories: Math.round(goalCalories),
      protein: Math.round((goalCalories * 0.3) / 4),
      carbs: Math.round((goalCalories * 0.45) / 4),
      fats: Math.round((goalCalories * 0.25) / 9),
      sugarLimit: Math.round(sugarLimit),
      vitamins: {
        a: 900,
        c: 90,
        d: 15,
        e: 15,
        b12: 2.4,
      },
      minerals: {
        zinc: 11,
        iron: 18,
        calcium: 1000,
      },
    }
  }

  const handleNext = async () => {
    setLoading(true)

    // Enhanced loading animation
    gsap.to(".loading-overlay", {
      opacity: 1,
      duration: 0.5,
      ease: "power2.inOut",
    })

    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (step === 3) {
      const plan = calculateNutrition(userData)
      setNutritionPlan(plan)
    }

    setLoading(false)
    setStep((prev) => prev + 1)

    gsap.to(".loading-overlay", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
    })
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden"
      ref={containerRef}
    >
      {/* Medical Background Textures */}
      <div className="fixed inset-0 pointer-events-none">
        <div ref={dnaRef} className="absolute inset-0" />
        <div ref={moleculesRef} className="absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      </div>

      {/* Loading Overlay */}
      <div className="loading-overlay fixed inset-0 bg-white/80 opacity-0 pointer-events-none z-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-xl font-medium text-blue-800">
            {step === 3 ? "Preparing your personalized diet chart..." : "Processing..."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative">
        <div className="form-container">
          {step === 1 && (
            <Card className="max-w-lg mx-auto p-8 backdrop-blur-md bg-white/90 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Let's start your health journey</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={userData.height || ""}
                      onChange={(e) => setUserData((prev) => ({ ...prev, height: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={userData.weight || ""}
                      onChange={(e) => setUserData((prev) => ({ ...prev, weight: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={userData.age || ""}
                      onChange={(e) => setUserData((prev) => ({ ...prev, age: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      className="w-full p-2 border rounded-md"
                      value={userData.gender}
                      onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="activity">Activity Level</Label>
                  <select
                    id="activity"
                    className="w-full p-2 border rounded-md"
                    value={userData.activityLevel}
                    onChange={(e) => setUserData((prev) => ({ ...prev, activityLevel: e.target.value }))}
                  >
                    <option value="sedentary">Sedentary (little or no exercise)</option>
                    <option value="light">Light (exercise 1-3 times/week)</option>
                    <option value="moderate">Moderate (exercise 3-5 times/week)</option>
                    <option value="active">Active (exercise 6-7 times/week)</option>
                    <option value="veryActive">Very Active (hard exercise daily)</option>
                  </select>
                </div>
                <Button
                  className="w-full"
                  onClick={handleNext}
                  disabled={loading || !userData.height || !userData.weight || !userData.age || !userData.gender}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Next"}
                </Button>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card className="max-w-lg mx-auto p-8 backdrop-blur-md bg-white/90 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">What's your goal?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Button
                    variant={userData.goal === "lose" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setUserData((prev) => ({ ...prev, goal: "lose" }))}
                  >
                    Lose Weight
                  </Button>
                  <Button
                    variant={userData.goal === "gain" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setUserData((prev) => ({ ...prev, goal: "gain" }))}
                  >
                    Gain Weight
                  </Button>
                </div>
                <div>
                  <Label htmlFor="goalWeight">Target Weight (kg)</Label>
                  <Input
                    id="goalWeight"
                    type="number"
                    value={userData.goalWeight || ""}
                    onChange={(e) => setUserData((prev) => ({ ...prev, goalWeight: Number(e.target.value) }))}
                  />
                </div>
                <Button className="w-full" onClick={handleNext} disabled={loading || !userData.goalWeight}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Preparing your diet chart...
                    </>
                  ) : (
                    "Get My Diet Plan"
                  )}
                </Button>
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card className="max-w-lg mx-auto p-8 backdrop-blur-md bg-white/90 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">One Last Step</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="sugarLevel">Blood Sugar Level (mg/dL)</Label>
                  <Input
                    id="sugarLevel"
                    type="number"
                    placeholder="Enter your blood sugar level"
                    value={userData.sugarLevel || ""}
                    onChange={(e) => setUserData((prev) => ({ ...prev, sugarLevel: Number(e.target.value) }))}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Normal fasting blood sugar level is between 70-100 mg/dL
                  </p>
                </div>
                <Button className="w-full" onClick={handleNext} disabled={loading || !userData.sugarLevel}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing blood sugar levels...
                    </>
                  ) : (
                    "Generate Diet Plan"
                  )}
                </Button>
              </div>
            </Card>
          )}

          {step === 4 && nutritionPlan && (
            <Card className="max-w-4xl mx-auto p-8 backdrop-blur-md bg-white/90 shadow-xl">
              <div className="results-container">
                {/* Enhanced results display with GSAP animations */}
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Personalized Nutrition Plan</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Macronutrients Section */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Daily Macronutrients</h3>
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-inner">
                      <div className="text-center mb-4">
                        <div className="text-sm text-blue-600">Daily Calories</div>
                        <div className="text-4xl font-bold text-blue-800">{nutritionPlan.calories}</div>
                        <div className="text-sm text-blue-600">kcal</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <div className="text-sm text-green-600">Protein</div>
                          <div className="text-xl font-bold text-green-800">{nutritionPlan.protein}g</div>
                        </div>
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <div className="text-sm text-yellow-600">Carbs</div>
                          <div className="text-xl font-bold text-yellow-800">{nutritionPlan.carbs}g</div>
                        </div>
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <div className="text-sm text-red-600">Fats</div>
                          <div className="text-xl font-bold text-red-800">{nutritionPlan.fats}g</div>
                        </div>
                      </div>
                    </div>

                    {/* Sugar Section */}
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-inner">
                      <h4 className="text-lg font-semibold mb-3">Sugar Intake</h4>
                      <div className="text-center">
                        <div className="text-sm text-purple-600">Daily Sugar Limit</div>
                        <div className="text-3xl font-bold text-purple-800">{nutritionPlan.sugarLimit}g</div>
                        <p className="text-sm text-purple-600 mt-2">
                          Based on your blood sugar level: {userData.sugarLevel} mg/dL
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Micronutrients Section */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Daily Micronutrients</h3>
                    <div className="space-y-4">
                      <div className="p-6 bg-gradient-to-br from-teal-50 to-green-50 rounded-xl shadow-inner">
                        <h4 className="text-lg font-semibold mb-3">Vitamins</h4>
                        <div className="grid gap-3">
                          {Object.entries(nutritionPlan.vitamins).map(([vitamin, amount]) => (
                            <div key={vitamin} className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
                              <span className="text-sm font-medium">Vitamin {vitamin.toUpperCase()}</span>
                              <span className="font-bold">{amount} mcg</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl shadow-inner">
                        <h4 className="text-lg font-semibold mb-3">Minerals</h4>
                        <div className="grid gap-3">
                          {Object.entries(nutritionPlan.minerals).map(([mineral, amount]) => (
                            <div key={mineral} className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
                              <span className="text-sm font-medium capitalize">{mineral}</span>
                              <span className="font-bold">{amount} mg</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}