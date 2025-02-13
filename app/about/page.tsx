"use client"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Linkedin } from "lucide-react"

interface Developer {
  name: string
  role: string
  image: string
  github: string
  linkedin: string
}

const styles = `
.particles-container .particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(104, 171, 237, 0.1);
  border-radius: 50%;
  pointer-events: none;
  animation: float linear infinite;
}

@keyframes float {
  0% {
    transform: translate(calc(var(--x) - 50%), calc(var(--y) - 50%));
  }
  100% {
    transform: translate(calc(var(--x) + 50%), calc(var(--y) + 50%));
  }
}

.perspective {
  perspective: 1000px;
}

.about-card, .developer-card {
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
}

.about-card:hover, .developer-card:hover {
  transform: translateY(-5px);
}

.medical-icon {
  position: absolute;
  opacity: 0.1;
  pointer-events: none;
  fill: rgb(104, 171, 237);
}

.dna-helix {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.1;
}

.pulse-ring {
  position: absolute;
  border-radius: 50%;
  animation: pulse 3s ease-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.floating-cross {
  position: absolute;
  animation: float-around 20s linear infinite;
}

@keyframes float-around {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(100px, 50px) rotate(180deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

.heartbeat-line {
  position: absolute;
  bottom: 50px;
  left: 0;
  width: 100%;
  height: 50px;
  opacity: 0.1;
}

.medical-pill {
  position: absolute;
  animation: float-pill 15s linear infinite;
}

@keyframes float-pill {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(-50px, 100px) rotate(180deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

.stethoscope {
  position: absolute;
  animation: float-stethoscope 25s linear infinite;
}

@keyframes float-stethoscope {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  50% {
    transform: translate(150px, -50px) rotate(-180deg) scale(1.2);
  }
  100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
}

.morphing-bg {
  background-blend-mode: overlay;
}
`

export default function AboutUsPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const developerCardsRef = useRef<HTMLDivElement>(null)
  const medicalIconsRef = useRef<HTMLDivElement>(null)

  const developers: Developer[] = [
    {
      name: "John Doe",
      role: "Lead Developer",
      image: "/api/placeholder/150/150",
      github: "https://github.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe"
    },
    {
      name: "Jane Smith",
      role: "Frontend Developer",
      image: "/api/placeholder/150/150",
      github: "https://github.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith"
    },
    {
      name: "Mike Johnson",
      role: "Backend Developer",
      image: "/api/placeholder/150/150",
      github: "https://github.com/mikejohnson",
      linkedin: "https://linkedin.com/in/mikejohnson"
    },
    {
      name: "Sarah Wilson",
      role: "UI/UX Developer",
      image: "/api/placeholder/150/150",
      github: "https://github.com/sarahwilson",
      linkedin: "https://linkedin.com/in/sarahwilson"
    }
  ]

  useEffect(() => {
    // Add styles to document
    const styleSheet = document.createElement("style")
    styleSheet.textContent = styles
    document.head.appendChild(styleSheet)

    gsap.registerPlugin(ScrollTrigger)
    
    // Create floating particles
    if (particlesRef.current) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div')
        particle.className = 'particle'
        particle.style.setProperty('--x', `${Math.random() * 100}%`)
        particle.style.setProperty('--y', `${Math.random() * 100}%`)
        particle.style.setProperty('--duration', `${Math.random() * 30 + 15}s`)
        particle.style.setProperty('--delay', `-${Math.random() * 30}s`)
        particlesRef.current.appendChild(particle)
      }
    }

    // Add medical background elements
    if (medicalIconsRef.current) {
      // DNA Helix
      const dnaHelix = document.createElement('div')
      dnaHelix.className = 'dna-helix'
      dnaHelix.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 200 1000" preserveAspectRatio="none">
          <path d="M50,0 Q100,25 150,50 T50,100 T150,150 T50,200 T150,250" 
                stroke="rgba(104, 171, 237, 0.1)" 
                stroke-width="2" 
                fill="none" />
          <path d="M150,0 Q100,25 50,50 T150,100 T50,150 T150,200 T50,250" 
                stroke="rgba(104, 171, 237, 0.1)" 
                stroke-width="2" 
                fill="none" />
        </svg>
      `
      medicalIconsRef.current.appendChild(dnaHelix)

      // Animate DNA
      gsap.to(dnaHelix.querySelector('svg'), {
        y: -500,
        duration: 20,
        repeat: -1,
        ease: 'none'
      })

      // Add floating crosses
      for (let i = 0; i < 10; i++) {
        const cross = document.createElement('div')
        cross.className = 'floating-cross'
        cross.innerHTML = `
          <svg width="30" height="30" viewBox="0 0 30 30">
            <path d="M12,0 h6 v12 h12 v6 h-12 v12 h-6 v-12 h-12 v-6 h12 z" 
                  fill="rgba(104, 171, 237, 0.1)"/>
          </svg>
        `
        cross.style.left = `${Math.random() * 100}%`
        cross.style.top = `${Math.random() * 100}%`
        cross.style.animationDelay = `-${Math.random() * 20}s`
        medicalIconsRef.current.appendChild(cross)
      }

      // Add pulse rings
      for (let i = 0; i < 5; i++) {
        const ring = document.createElement('div')
        ring.className = 'pulse-ring'
        ring.style.width = '100px'
        ring.style.height = '100px'
        ring.style.border = '2px solid rgba(104, 171, 237, 0.1)'
        ring.style.left = `${Math.random() * 100}%`
        ring.style.top = `${Math.random() * 100}%`
        ring.style.animationDelay = `-${Math.random() * 3}s`
        medicalIconsRef.current.appendChild(ring)
      }

      // Add heartbeat line
      const heartbeat = document.createElement('div')
      heartbeat.className = 'heartbeat-line'
      heartbeat.innerHTML = `
        <svg width="200" height="50" viewBox="0 0 200 50">
          <path d="M0,25 L20,25 L25,10 L35,40 L45,10 L50,40 L55,25 L200,25" 
                stroke="rgba(104, 171, 237, 0.1)" 
                stroke-width="2" 
                fill="none"/>
        </svg>
      `
      medicalIconsRef.current.appendChild(heartbeat)

      // Animate heartbeat
      gsap.to(heartbeat.querySelector('path'), {
        strokeDashoffset: 1000,
        strokeDasharray: 1000,
        duration: 3,
        repeat: -1,
        ease: 'none'
      })

      // Add medical pills
      for (let i = 0; i < 6; i++) {
        const pill = document.createElement('div')
        pill.className = 'medical-pill'
        pill.innerHTML = `
          <svg width="40" height="20" viewBox="0 0 40 20">
            <path d="M10,0 h20 a10,10 0 0 1 0,20 h-20 a10,10 0 0 1 0,-20 z" 
                  fill="rgba(104, 171, 237, 0.1)"/>
          </svg>
        `
        pill.style.left = `${Math.random() * 100}%`
        pill.style.top = `${Math.random() * 100}%`
        pill.style.animationDelay = `-${Math.random() * 15}s`
        medicalIconsRef.current.appendChild(pill)
      }

      // Add stethoscopes
      for (let i = 0; i < 4; i++) {
        const stethoscope = document.createElement('div')
        stethoscope.className = 'stethoscope'
        stethoscope.innerHTML = `
          <svg width="50" height="50" viewBox="0 0 50 50">
            <path d="M25,0 C15,0 10,10 10,20 Q10,30 20,35 T25,45 T30,35 Q40,30 40,20 C40,10 35,0 25,0" 
                  fill="none"
                  stroke="rgba(104, 171, 237, 0.1)"
                  stroke-width="2"/>
          </svg>
        `
        stethoscope.style.left = `${Math.random() * 100}%`
        stethoscope.style.top = `${Math.random() * 100}%`
        stethoscope.style.animationDelay = `-${Math.random() * 25}s`
        medicalIconsRef.current.appendChild(stethoscope)
      }
    }

    // Header text animation
    const heading = document.querySelector('.about-heading')
    if (heading && heading.textContent) {
      const text = heading.textContent
      heading.textContent = ''
      text.split('').forEach((char, i) => {
        const span = document.createElement('span')
        span.textContent = char === ' ' ? '\u00A0' : char
        span.style.opacity = '0'
        span.style.display = 'inline-block'
        heading.appendChild(span)
        
        gsap.to(span, {
          opacity: 1,
          rotateY: 360,
          duration: 1.2,
          delay: i * 0.05,
          ease: "power4.out"
        })
      })
    }

    // Card animations
    const cards = document.querySelectorAll(".about-card, .developer-card")
    cards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=100",
          end: "top center+=100",
          scrub: 1.5,
        },
        opacity: 0,
        y: 100,
        scale: 0.95,
        duration: 1.5,
        ease: "power2.out"
      })

      let currentRotation = { x: 0, y: 0 }
      let rafId: number

      const lerp = (start: number, end: number, factor: number) => {
        return start + (end - start) * factor
      }

      const animateCard = (targetRotation: { x: number, y: number }) => {
        const animate = () => {
          currentRotation.x = lerp(currentRotation.x, targetRotation.x, 0.1)
          currentRotation.y = lerp(currentRotation.y, targetRotation.y, 0.1)

          gsap.set(card, {
            rotateX: currentRotation.x,
            rotateY: currentRotation.y,
            transformPerspective: 1000,
            transformOrigin: "center"
          })

          if (Math.abs(targetRotation.x - currentRotation.x) > 0.01 ||
              Math.abs(targetRotation.y - currentRotation.y) > 0.01) {
            rafId = requestAnimationFrame(animate)
          }
        }
        
        cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(animate)
      }

      card.addEventListener('mousemove', (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const rect = (card as HTMLElement).getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        
        const rotateX = ((y - centerY) / centerY) * 5
        const rotateY = ((x - centerX) / centerX) * 5

        animateCard({ x: -rotateX, y: rotateY })
      })

      card.addEventListener('mouseleave', () => {
        animateCard({ x: 0, y: 0 })
      })
    })

    // Morphing background animation
    const bg = document.querySelector('.morphing-bg')
    if (bg) {
      gsap.to(bg, {
        background: 'radial-gradient(circle at 30% 70%, rgba(104, 171, 237, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(104, 171, 237, 0.1) 0%, transparent 50%)',
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "none"
      })

      // Add mousemove parallax effect to medical icons
      if (medicalIconsRef.current) {
        window.addEventListener('mousemove', (e) => {
          const mouseX = e.clientX / window.innerWidth
          const mouseY = e.clientY / window.innerHeight

          const icons = medicalIconsRef.current?.children
          if (icons) {
            Array.from(icons).forEach((icon, index) => {
              const depth = 1 + (index % 3) * 0.2 // Different depths for parallax effect
              gsap.to(icon, {
                x: (mouseX - 0.5) * 50 * depth,
                y: (mouseY - 0.5) * 50 * depth,
                duration: 1,
                ease: "power2.out"
              })
            })
          }
        })
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background elements */}
      <div ref={particlesRef} className="particles-container absolute inset-0" />
      <div ref={medicalIconsRef} className="absolute inset-0 pointer-events-none" />
      <div className="morphing-bg absolute inset-0" />

      {/* Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="about-heading text-4xl md:text-6xl font-bold text-gray-900 dark:text-white whitespace-nowrap overflow-hidden">
            Seamless Care, Anytime 
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We're a team of dedicated professionals working at the intersection of healthcare and technology
          </p>
        </div>

        {/* Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="about-card perspective">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Vision</h2>
              <p className="text-gray-600 dark:text-gray-300">
                To revolutionize healthcare by integrating cutting-edge technology with compassionate care, ensuring better outcomes for patients worldwide.
              </p>
            </CardContent>
          </Card>
          <Card className="about-card perspective">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Commitment</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We are committed to delivering innovative solutions that empower healthcare providers and improve patient experiences.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Medical Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Our Medical Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Dr. Emily Carter", role: "Chief Medical Officer" },
              { name: "Dr. Michael Lee", role: "Head of Research" },
              { name: "Dr. Sarah Johnson", role: "Clinical Director" }
            ].map((member, index) => (
              <Card key={index} className="about-card perspective">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Developers Section */}
        <div ref={cardsRef}>
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Our Developers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {developers.map((dev, index) => (
              <Card key={index} className="developer-card perspective">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="relative mb-4">
                    <img 
                      src={dev.image} 
                      alt={dev.name}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                    <div className="absolute inset-0 rounded-full ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">
                    {dev.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{dev.role}</p>
                  <div className="flex gap-4">
                    <a 
                      href={dev.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                      <Github className="w-6 h-6" />
                    </a>
                    <a 
                      href={dev.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}