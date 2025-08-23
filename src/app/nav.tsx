import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

const Nav = () => {
  return (
    <nav className=' absolute w-full p-4 flex items-center justify-between z-100'>
      <div className='flex flex-col items-center'>
        <h1 className='text-3xl font-bold tracking-wider freesekai-gradient'>FREESEKAI</h1>
        <p className='text-sm tracking-normal text-gray-500 font-semibold'>Anonymous Forum</p>
      </div>

      <div className='hidden md:flex gap-4 items-center'>
        <Button asChild variant="ghost">
          <a 
            href='https://www.instagram.com/salmanzahi1104/' 
            target='_blank' 
            rel='noopener noreferrer'
          >
            Instagram
          </a>
        </Button>

        <Button asChild variant="ghost">
          <a 
            href='https://github.com/Salmanzahi' 
            target='_blank' 
            rel='noopener noreferrer'
          >
            Github
          </a>
        </Button>
        <Button asChild variant="ghost">
          <a 
            href='https://discord.gg/K27xTT4a' 
            target='_blank' 
            rel='noopener noreferrer'
          >
            Discord Server
          </a>
        </Button>
        <ModeToggle />
      </div>

      <div className='md:hidden'>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className='w-[20rem] z-100'>
            <SheetHeader className='text-center font-semibold'>
              <SheetTitle className='freesekai-gradient text-2xl font-bold tracking-wider'>FREESEKAI</SheetTitle>
              <SheetDescription>
                Which Side do u want to visit?
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-2 mt-4 pt-2 p-8">
              <Button asChild variant="ghost">
                <a 
                  href='https://www.instagram.com/salmanzahi1104/' 
                  target='_blank' 
                  rel='noopener noreferrer'
                >
                  Instagram
                </a>
              </Button>

              <Button asChild variant="ghost">
                <a 
                  href='https://github.com/Salmanzahi' 
                  target='_blank' 
                  rel='noopener noreferrer'
                >
                  Github
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a 
                  href='https://discord.gg/K27xTT4a' 
                  target='_blank' 
                  rel='noopener noreferrer'
                >
                  Discord Server
                </a>
              </Button>
           <div className='flex'>
              <ModeToggle />
           </div>
                
         
            
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Nav;