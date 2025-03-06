import { User } from "@/service/auth.type";

export type Session = {
  accessToken: string | null;
  user: Partial<User>;
};
