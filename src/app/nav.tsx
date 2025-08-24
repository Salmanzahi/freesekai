"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';
import { Menu, ChevronDown } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

const Nav = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isTransparent, setIsTransparent] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
      setIsTransparent(currentScrollPos < 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <nav 
      className={`fixed w-full p-4 flex items-center justify-between z-100 transition-transform duration-300 ${isTransparent ? 'bg-transparent' : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'} ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
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
        <Button asChild className='px-5'>
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="w-[150px]">
      Account
      <ChevronDown className="ml-2 h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className='z-[2000]'>
    <DropdownMenuItem>
      <Link href="/login">Login</Link>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Link href="/register">Register</Link>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
        </Button>
        <ModeToggle />
      </div>

      <div className='md:hidden'>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className='border-[#504e4e]'>
            <DrawerHeader className='text-center font-semibold'>
              <DrawerTitle className='freesekai-gradient text-2xl font-bold tracking-wider'>FREESEKAI</DrawerTitle>
              <DrawerDescription>
                Which Side do u want to visit?
              </DrawerDescription>
              
            </DrawerHeader>
               <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="w-[50%] mx-auto flex items-center justify-center">
      Account
      <ChevronDown className="ml-2 h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className='z-[2000]'>
    <DropdownMenuItem className="flex justify-center">
      <Link href="/login">Login</Link>
    </DropdownMenuItem>
    <DropdownMenuItem className="flex justify-center">
      <Link href="/register">Register</Link>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
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
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
};

export default Nav;