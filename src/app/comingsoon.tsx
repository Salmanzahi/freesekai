import Image from "next/image";


export default function ComingSoon() {
  return (
    <div>
              <h1 className="text-5xl mb-4"> New Gen of FREESEKAI</h1>
      <h2 className="text-4xl mb-4">
           Oops.... :(
      </h2>
      <h2 className="text-4xl mb-4">
            This Website is Under Maintenance !
      </h2>
      <p className="text-sm">
    we are going to planned migrate our tech system to a better and faster one and refactor web codebase (the old web kinda cranky and not secure enough)
      </p>  
 <div className="max-w-sm mx-auto mt-8 shadow-md flex gap-3 items-center justify-center"> 
        <Image
          src="/css-icon.svg"
          alt="freesekai"
          width={60}
          height={60}
        />
        <Image
          src="/js-icon.svg"
          alt="freesekai"
          width={60}
          height={60}
        />
        <Image
          src="/html-icon.svg"
          alt="freesekai"
          width={60}
          height={60}
        />
      </div>
      <div className="mt-8 flex justify-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-12 w-12" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </div>
      <div className=" mx-auto mt-8 shadow-md flex gap-3 items-center justify-center">
         <Image
          src="/reactjs-icon.svg"
          alt="freesekai"
          width={80}
          height={80}
        />
        <Image
          src="/nextjs-icon.svg"
          alt="freesekai"
          width={80}
          height={80}
        />
         </div>
         <div className="bg-gray-800 rounded mt-8 p-2 inline-block text-sm mr-4">
            <a href='https://labs.unicraft.fun'> Go To My Portofolio</a>
         </div>
                  <div className="bg-gray-800 rounded mt-4 p-2 inline-block text-sm">
            <a href='https://imagine.unicraft.fun'> Imagine It</a>
         </div>
         <a href="https://www.instagram.com/salmanzahi1104/" className="text-sm block mt-12">
            @salmanzahi 2025
         </a>
    </div>
  );
}