import { auth } from './firebase';

type Listener = (user: any) => void;

let currentUser: any = null;
let listeners: Listener[] = [];
let initialized = false;

function notify(user: any) {
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

export default {
  initAuth,
  getCurrentUser,
  subscribe,
  isAuthenticated,
};
