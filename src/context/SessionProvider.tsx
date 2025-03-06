"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getSession } from "@/action/auth";
import { Session } from "@/types/auth";

interface AuthContextProps {
  session: Session | null;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("auth context는 auth provider 내부에서 사용해주세요");
  }
  return ctx;
};

export default function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    (async function () {
      const session = await getSession();
      setSession(session);
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
}
