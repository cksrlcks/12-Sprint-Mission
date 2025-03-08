import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Avatar } from "./Avatar";

jest.mock("@assets/img/icon/icon_avatar.svg", () => "mocked-avatar-path.svg");

describe("Avatar 컴포넌트 테스트", () => {
  it("render 테스트", () => {
    render(<Avatar nickname="Test name" />);

    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      expect.stringContaining("mocked-avatar-path")
    );
    expect(screen.getByRole("img")).toHaveAttribute("alt", "Test name");
  });

  it("아바타 이미지 주소를 받으면 제대로 렌더링하는지", () => {
    render(<Avatar nickname="Jane Doe" img="/custom-avatar.jpg" />);

    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      expect.stringContaining("custom-avatar.jpg")
    );
  });

  it("이미지 로딩 실패 시 기본 아바타로 교체되는지", () => {
    render(<Avatar nickname="Broken Image" img="/broken-avatar.jpg" />);

    const img = screen.getByRole("img");
    fireEvent.error(img);

    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("mocked-avatar-path")
    );
  });

  it("hover 상태가 적용되는지", () => {
    render(<Avatar nickname="Hover Test" hover />);

    expect(screen.getByRole("img").closest("figure")).toHaveClass("hover");
  });
});
