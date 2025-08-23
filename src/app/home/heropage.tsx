
import React from 'react'
import Image from 'next/image'
import takopi from './takopi.png'
import takopidark from './takopidark.png'

export default function HeroPage() {
  return (
    <div >
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-[#121212]/70 to-[#121212] h-[100vh]'></div>
      <Image
        src={takopidark}
        alt="hero"
        width={1000}
        className='mix-blend-multiply w-screen h-screen object-cover mask-image-gradient'
        height={1000}
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
        }}
      />
      <div className='absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10'>
        <h1 className='text-5xl font-bold tracking-wider freesekai-gradient'>FREESEKAI</h1>
        <p className='text-gray-300 text-sm '>Vast of Secret Ready to be discussed </p>

      </div>
    </div>
  )
}

