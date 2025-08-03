import React from 'react';

const Nav = () => {
  return (
    <nav className='border-b-2 bg-[#0d1117] border-gray-700 p-4 flex'>
      <div>
      <h1 className='text-3xl font-bold text-center'>FREESEKAI</h1>
      <p className='text-sm text-center'> Under Maintenance !</p>
      </div>

      <div className='ml-auto gap-4 flex items-center'>
        <a 
          href='https://www.instagram.com/salmanzahi1104/' 
          target='_blank' 
          rel='noopener noreferrer'
          className='hover:text-pink-500 transition-colors duration-200'
        >
         Instagram
        </a>
        <a 
          href='https://github.com/Salmanzahi' 
          target='_blank' 
          rel='noopener noreferrer'
          className='hover:text-gray-400 transition-colors duration-200'
        >
          Github
        </a>
        <a 
          href='https://discord.gg/K27xTT4a' 
          target='_blank' 
          rel='noopener noreferrer'
          className='hover:text-indigo-400 transition-colors duration-200'
        >
          Discord Server
        </a>
      </div>
    </nav>
  );
};

export default Nav;