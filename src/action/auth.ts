"use server";

import { cookies } from "next/headers";
import { signinFormSchmea, SigninFormType } from "@/service/auth.schema";
import { login, refreshAccessToken } from "@/service/auth.service";
import { User } from "@/service/auth.type";
import { Session } from "@/types/auth";
import { handleError } from "@/util/error";

type AuthActionResult = {
  success: boolean;
  message: string;
};

const ACCESS_TOKEN_EXPIRE = 60 * 60; // 60분 (테스트용으로 짧게)

export async function loginAction(
  formData: SigninFormType
): Promise<AuthActionResult> {
  const result = signinFormSchmea.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      message: "양식을 확인해주세요",
    };
  }

  try {
    const { accessToken, refreshToken, user } = await login(formData);
    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: ACCESS_TOKEN_EXPIRE,
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    cookieStore.set("user", JSON.stringify(user), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return {
      success: true,
      message: "로그인에 성공했습니다.",
    };
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
}

export async function logoutAction(): Promise<AuthActionResult> {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("user");

  return {
    success: true,
    message: "로그아웃 성공",
  };
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || null;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const stringifiedUser = cookieStore.get("user")?.value;
  const user: Partial<User> = stringifiedUser
    ? JSON.parse(stringifiedUser)
    : null;

  if (!accessToken && !refreshToken) {
    return null;
  }

  if (!accessToken && refreshToken) {
    try {
      const { accessToken } = await refreshAccessToken(refreshToken);
      cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });

      return {
        accessToken,
        user,
      };
    } catch {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      cookieStore.delete("user");

      return null;
    }
  }

  return {
    accessToken: accessToken!, //그냥 return하면 undefined일수도 있다고 타입오류뜸
    user,
  };
}

export async function refreshTokenAction(): Promise<AuthActionResult> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return {
      success: false,
      message: "리프레시토큰이 없습니다.",
    };
  }

  try {
    const { accessToken } = await refreshAccessToken(refreshToken);
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return {
      success: true,
      message: "토큰 재발급 성공",
    };
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
}
