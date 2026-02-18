// import { auth } from './firebase';
import { User, getAuth } from 'firebase/auth';

type Listener = (user: User | null) => void;

let currentUser: User | null = null;
let listeners: Listener[] = [];
let initialized = false;
const auth = getAuth();



function notify(user: User | null) {
  currentUser = user;
  listeners.forEach((l) => l(user));
}

export function initAuth() {
  if (initialized) return;
  initialized = true;
  auth.onAuthStateChanged((user) => {
    notify(user);
  });
}

export function getCurrentUser() {
  return currentUser;
}

export function subscribe(fn: Listener) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

export async function isAuthenticated(): Promise<boolean> {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
}

const authModule = {
  initAuth,
  getCurrentUser,
  subscribe,
  isAuthenticated,
};

export default authModule;
