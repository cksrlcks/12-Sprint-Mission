import { act, renderHook } from "@testing-library/react";
import useResponsive from "./useResponsive";
import { getDeviceType } from "@/util/breakpoints";

jest.mock("@/util/breakpoints", () => ({
  getDeviceType: jest.fn(),
}));

jest.mock("@/util/debounce", () => ({
  debounce: (fn: unknown) => fn,
}));

describe("useResponsive", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hook 기본값 체크", () => {
    (getDeviceType as jest.Mock).mockReturnValue("mobile");

    const { result } = renderHook(() => useResponsive());

    expect(result.current).toBe(4);
  });

  it("윈도우 크기 조정 시 값이 업데이트되어야 한다", () => {
    (getDeviceType as jest.Mock).mockReturnValue("tablet");

    const { result } = renderHook(() => useResponsive());

    act(() => {
      window.innerWidth = 1024;
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(6);
  });

  it("여러 번 리사이즈 이벤트가 디바운스 되어야 한다", () => {
    (getDeviceType as jest.Mock).mockReturnValue("pc");

    const { result } = renderHook(() => useResponsive());

    act(() => {
      window.innerWidth = 1920;
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(10);

    act(() => {
      window.innerWidth = 1280;
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(10);
  });
});
