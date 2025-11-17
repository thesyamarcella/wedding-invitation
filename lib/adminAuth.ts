import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const checkAdmin = (): Promise<boolean> =>
  new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(!!user);
    });
  });
