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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';
import { Menu, ChevronDown } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { signOut } from "firebase/auth";
import { auth } from '@/lib/firebase';
import { checkAuthUser } from '@/lib/regisauth';



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


 useEffect(() => {
    const checkAuth = async () => {
      try {
        await checkAuthUser();
        setIsAuthUser(true);
      } catch {
        setIsAuthUser(false);
      }
    };
    checkAuth();
  }, []);
  const [, setIsAuthUser] = useState(false);
  return (
    <nav 
      className={`fixed w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between z-50 transition-all duration-300 ${
        isTransparent 
          ? 'bg-transparent' 
          : 'bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/90 border-b border-border/40 shadow-lg shadow-black/5'
      } ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className='flex items-center space-x-3'>
        <Link href="/" className="group transition-transform duration-200 hover:scale-105">
          <div className="flex flex-col items-start">
            <h1 className='text-2xl md:text-3xl font-bold tracking-wider freesekai-gradient group-hover:animate-pulse'>
              FREESEKAI
            </h1>
            <p className='text-center text-xs md:text-sm tracking-normal text-muted-foreground font-medium opacity-80'>
              Anonymous Forum
            </p>
          </div>
        </Link>
      </div>

      <div className='hidden md:flex items-center space-x-2'>
        <div className="flex items-center space-x-1">
          <Button 
            asChild 
            variant="ghost" 
            size="sm"
            className="nav-link-hover hover:bg-accent/50 transition-all duration-200 hover:-translate-y-0.5"
          >
            <a 
              href='https://www.instagram.com/salmanzahi1104/' 
              target='_blank' 
              rel='noopener noreferrer'
              className="flex items-center space-x-1 px-3 py-2"
            >
              <span>Instagram</span>
            </a>
          </Button>

          <Button 
            asChild 
            variant="ghost" 
            size="sm"
            className="nav-link-hover hover:bg-accent/50 transition-all duration-200 hover:-translate-y-0.5"
          >
            <a 
              href='https://github.com/Salmanzahi' 
              target='_blank' 
              rel='noopener noreferrer'
              className="flex items-center space-x-1 px-3 py-2"
            >
              <span>Github</span>
            </a>
          </Button>

          <Button 
            asChild 
            variant="ghost" 
            size="sm"
            className="nav-link-hover hover:bg-accent/50 transition-all duration-200 hover:-translate-y-0.5"
          >
            <a 
              href='https://discord.gg/K27xTT4a' 
              target='_blank' 
              rel='noopener noreferrer'
              className="flex items-center space-x-1 px-3 py-2"
            >
              <span>Discord</span>
            </a>
          </Button>
        </div>

        <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-border/50">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
              variant="outline" 
              size="sm"
              className="px-4 hover:bg-accent/50 transition-colors duration-200 border-border/50"
              >
              Account
              <ChevronDown className="ml-2 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='z-[100] min-w-[140px] shadow-lg' align="end">
              {auth.currentUser ? (
              <>
                <DropdownMenuItem className="cursor-pointer">
                <Link href="/profile" className="w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                className="cursor-pointer"
                onClick={async () => {
                  await signOut(auth);
                  setIsAuthUser(false)

                }}
                >
                Sign Out
                </DropdownMenuItem>
              </>
              ) : (
              <>
                <DropdownMenuItem className="cursor-pointer">
                <Link href="/login" className="w-full">Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                <Link href="/register" className="w-full">Register</Link>
                </DropdownMenuItem>
              </>
              )}
            </DropdownMenuContent>
            </DropdownMenu>
          <ModeToggle />
        </div>
      </div>

      <div className='md:hidden flex items-center space-x-2'>
        <ModeToggle />
        <Drawer>
          <DrawerTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-accent/50 transition-colors duration-200"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className='border-border/50'>
            <DrawerHeader className='text-center space-y-2'>
              <DrawerTitle className='freesekai-gradient text-2xl font-bold tracking-wider'>
                FREESEKAI
              </DrawerTitle>
              <DrawerDescription className="text-muted-foreground">
                Explore our community links
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-6 pb-6 space-y-4">
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                  variant="outline" 
                  className="w-full justify-center hover:bg-accent/50 transition-colors duration-200"
                  >
                  Account
                  <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='z-[100] w-full shadow-lg'>
                  {auth.currentUser ? (
                  <>
                    <DropdownMenuItem className="cursor-pointer">
                    <Link href="/profile" className="w-full">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={async () => {
                      await signOut(auth);
                      setIsAuthUser(false)
                    }}
                    >
                    Sign Out
                    </DropdownMenuItem>
                  </>
                  ) : (
                  <>
                    <DropdownMenuItem className="cursor-pointer">
                    <Link href="/login" className="w-full">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                    <Link href="/register" className="w-full">Register</Link>
                    </DropdownMenuItem>
                  </>
                  )}
                </DropdownMenuContent>
                </DropdownMenu>

              <div className="grid gap-2">
                <Button 
                  asChild 
                  variant="ghost" 
                  className="justify-start hover:bg-accent/50 transition-colors duration-200"
                >
                  <a 
                    href='https://www.instagram.com/salmanzahi1104/' 
                    target='_blank' 
                    rel='noopener noreferrer'
                  >
                    Instagram
                  </a>
                </Button>

                <Button 
                  asChild 
                  variant="ghost" 
                  className="justify-start hover:bg-accent/50 transition-colors duration-200"
                >
                  <a 
                    href='https://github.com/Salmanzahi' 
                    target='_blank' 
                    rel='noopener noreferrer'
                  >
                    Github
                  </a>
                </Button>

                <Button 
                  asChild 
                  variant="ghost" 
                  className="justify-start hover:bg-accent/50 transition-colors duration-200"
                >
                  <a 
                    href='https://discord.gg/K27xTT4a' 
                    target='_blank' 
                    rel='noopener noreferrer'
                  >
                    Discord Server
                  </a>
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
};

export default Nav;