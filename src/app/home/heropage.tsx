
import React from 'react'
import Image from 'next/image'
import takopi from './takopidark.png'
// import SecHero from  './secHero'
// import CardLoad from './cardload'
export default function HeroPage() {
  return (
    <div >
    <div className="animate__animated animate__fadeIn ">
      
      <Image
        src={takopi}
        alt="hero"
        width={1000}
        className='absolute h-[100vh] w-full object-cover z-[-1] opacity-50'
        height={1000}
      />
      <div className='absolute h-[100vh] w-full bg-gradient-to-t from-[#121212] to-transparent z-[-1]'></div>
      <div className='h-[100vh] flex flex-col items-center justify-center text-center px-4'>
        <h1 className="text-5xl md:text-6xl font-bold freesekai-gradient mb-4 emu-lg-emu animate__animated animate__fadeInUp animate__delay-1s">FREESEKAI</h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate__animated animate__fadeInUp animate__delay-2s">Vast of Secret Ready to be discussed </p>
      
      </div>
    </div>

    </div>
   
  )
}

