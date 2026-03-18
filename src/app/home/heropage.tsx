
'use client'
import React from 'react'
import Image from 'next/image'
import takopi from './takopidark.png'
import devdesk from './devdesk.jpg'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
// import SecHero from  './secHero'
// import CardLoad from './cardload'

export default function HeroPage() {
  const handleScrollToDive = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  return (
    <div className="relative">
      <div className="animate__animated animate__fadeIn">
        
        <Image
          src={devdesk}
          alt="hero"
          width={1000}
          className='absolute h-[100vh] w-full object-cover z-[-1] opacity-50'
          height={1000}
          priority
        />
        <div className='absolute h-[100vh] w-full bg-gradient-to-t from-[#121212] to-transparent z-[-1]'></div>
        <div className='h-[100vh] flex flex-col items-center justify-center text-center px-4 relative'>
          <h1 className="text-5xl md:text-6xl font-bold freesekai-gradient mb-4 emu-lg-emu animate__animated animate__fadeInUp animate__delay-1s">SOCIOSEKAI</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate__animated animate__fadeInUp animate__delay-2s">- Socios n their Freedom -</p>
        
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate__animated animate__fadeInUp animate__delay-3s">
            <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full animate-bounce hover:bg-neutral-800/50 text-gray-300 hover:text-white transition-all w-12 h-12" 
                onClick={handleScrollToDive} 
                aria-label="Scroll to dive"
            >
              <ChevronDown className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

