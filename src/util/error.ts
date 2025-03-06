import { isAxiosError } from "axios";

export function handleError(error: unknown): string {
  if (isAxiosError(error)) {
    return error.response?.data.message || "서버 오류가 발생했습니다.";
  }
  return error instanceof Error
    ? error.message
    : "알 수 없는 오류가 발생했습니다.";
}
