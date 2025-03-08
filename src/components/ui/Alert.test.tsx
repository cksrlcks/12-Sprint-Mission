import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Alert } from "./Alert";

describe("Alert 컴포넌트", () => {
  it("render 테스트", () => {
    render(<Alert>Test alert</Alert>);
    expect(screen.getByText("Test alert")).toBeInTheDocument();
  });

  it("mode를 명시하지 않았을때, 기본값 error mode가 적용되는지", () => {
    render(<Alert>Default error alert</Alert>);

    expect(screen.getByText("Default error alert")).toHaveClass("error");
    expect(screen.getByAltText("에러")).toBeInTheDocument();
  });

  it("mode가 error일 때 적절한 클래스명과 아이콘이 적용되는지", () => {
    render(<Alert mode="error">Error mode alert</Alert>);

    expect(screen.getByText("Error mode alert")).toHaveClass("error");
    expect(screen.getByAltText("에러")).toBeInTheDocument();
  });

  it("mode가 warn일 때 적절한 클래스명과 아이콘이 적용되는지", () => {
    render(<Alert mode="warn">Warn mode alert</Alert>);

    expect(screen.getByText("Warn mode alert")).toHaveClass("warn");
    expect(screen.getByAltText("경고")).toBeInTheDocument();
  });
});
