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
import { useRouter } from 'next/navigation';

// ─── Nav link definitions ─────────────────────────────────
// "external" links open in a new tab; "internal" links use Next.js client-side routing.
type NavLink = {
  label: string;
  href: string;
  external?: boolean; // true → <a target="_blank">, false/undefined → <Link>
};

const navLinks: NavLink[] = [
  { label: 'Instagram', href: 'https://www.instagram.com/salmanzahi1104/', external: true },
  { label: 'Github', href: 'https://github.com/Salmanzahi', external: true },
  { label: 'Discord', href: 'https://discord.gg/K27xTT4a', external: true },
  { label: 'Create Post', href: '/create' },
];

// ─── Reusable account dropdown ─────────────────────────────
function AccountDropdown({
  mobile = false,
  onSignOut,
}: {
  mobile?: boolean;
  onSignOut: () => Promise<void>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={mobile ? "default" : "sm"}
          className={`${mobile ? "w-full justify-center" : "px-4"} hover:bg-accent/50 transition-colors duration-200 border-border/50`}
        >
          Account
          <ChevronDown className="ml-2 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`z-[100] ${mobile ? "w-full" : "min-w-[140px]"} shadow-lg`} align="end">
        {auth.currentUser ? (
          <>
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/profile" className="w-full">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={onSignOut}>
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
  );
}

const Nav = () => {
  const router = useRouter();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isTransparent, setIsTransparent] = useState(true);
  const [, setIsAuthUser] = useState(false);

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

  const handleSignOut = async () => {
    await signOut(auth);
    setIsAuthUser(false);
    router.push("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/90 border-b border-border/40 shadow-lg shadow-black/5'
      } ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* ── Logo ── */}
      <div className="flex items-center space-x-3">
        <Link href="/" className="group transition-transform duration-200 hover:scale-105">
        <div className='rounded-lg flex flex-row items-center justify-center '>
           <div className="flex flex-col items-start">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wider freesekai-gradient group-hover:animate-pulse">
              FREESEKAI
            </h1>
            <p className="text-center text-xs md:text-sm tracking-normal text-muted-foreground font-medium opacity-80">
              Anonymous Forum
            </p>
          </div>
        </div>
         
        </Link>
      </div>

      {/* ── Desktop nav ── */}
      <div className="hidden md:flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              size="sm"
              className="nav-link-hover hover:bg-accent/50 transition-all duration-200 hover:-translate-y-0.5"
            >
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 px-3 py-2"
                >
                  <span>{link.label}</span>
                </a>
              ) : (
                <Link href={link.href} className="flex items-center space-x-1 px-3 py-2">
                  <span>{link.label}</span>
                </Link>
              )}
            </Button>
          ))}
        </div>

        <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-border/50">
          <AccountDropdown onSignOut={handleSignOut} />
          <ModeToggle />
        </div>
      </div>

      {/* ── Mobile nav ── */}
      <div className="md:hidden flex items-center space-x-2">
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
          <DrawerContent className="border-border/50">
            <DrawerHeader className="text-center space-y-2">
              <DrawerTitle className="freesekai-gradient text-2xl font-bold tracking-wider">
                FREESEKAI
              </DrawerTitle>
              <DrawerDescription className="text-muted-foreground">
                Explore our community links
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-6 pb-6 space-y-4">
              <AccountDropdown mobile onSignOut={handleSignOut} />

              <div className="grid gap-2">
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    asChild
                    variant="ghost"
                    className="justify-start hover:bg-accent/50 transition-colors duration-200"
                  >
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href}>
                        {link.label}
                      </Link>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
};

export default Nav;
