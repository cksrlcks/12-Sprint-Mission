import axios from "axios";
import { cache } from "react";
import { Session } from "@/types/auth";
import { getSession, logoutAction, refreshTokenAction } from "@/action/auth";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let cachedClientAccessToken: string | null = null;
let clientGetSessionPromise: Promise<Session | null> | null = null;

const getAccessTokenAtServer = cache(async () => {
  const session = await getSession();
  return session ? session.accessToken : null;
});

const getAccessTokenAtClient = async () => {
  // 캐시된 토큰이 있으면 반환
  if (cachedClientAccessToken) return cachedClientAccessToken;

  // 토큰을 가져오는 promise가 없을때에만 getSession호출 (중복호출방지)
  // 처음 랜더링시 여러 컴포넌트에서 동시 다발적으로 getSession axios요청이 갈때, 중복 호출 최적화
  if (!clientGetSessionPromise) {
    clientGetSessionPromise = getSession();
  }

  const session = await clientGetSessionPromise;
  const token = session?.accessToken ?? null;
  cachedClientAccessToken = token;
  clientGetSessionPromise = null;

  return token;
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken =
      typeof window === "undefined"
        ? await getAccessTokenAtServer()
        : await getAccessTokenAtClient();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error.response?.status === 401 && !error.config._retry) {
      cachedClientAccessToken = null;

      try {
        error.config._retry = true;

        //서버액션으로 토큰 재발급해서 쿠키 등록
        const result = await refreshTokenAction();
        if (!result.success) {
          throw new Error("refresh error");
        }

        // 토큰 재조회
        const accessToken =
          typeof window === "undefined"
            ? await getAccessTokenAtServer()
            : await getAccessTokenAtClient();

        error.config.headers.Authorization = `Bearer ${accessToken}`;

        return axiosInstance(error.config);
      } catch (error) {
        logoutAction();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
