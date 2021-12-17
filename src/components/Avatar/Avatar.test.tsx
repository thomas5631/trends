import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Avatar } from "./";

const src = "my-src.png";
const alt = "My Avatar";

test("renders an image with the provided src", () => {
  render(<Avatar src={src} alt={alt} />);
  const imageElement = screen.getByAltText(alt);
  expect(imageElement).toHaveAttribute("src", src);
});

test("renders an image with a fallback src if one is not provided", () => {
  render(<Avatar alt={alt} />);
  const imageElement = screen.getByAltText(alt);
  expect(imageElement).toHaveAttribute("src", "missing_avatar.png");
});

test("renders an image with a fallback src if an error occurs", () => {
  render(<Avatar alt={alt} src={src} />);
  const imageElement = screen.getByAltText(alt);
  fireEvent.error(imageElement);
  expect(imageElement).toHaveAttribute("src", "missing_avatar.png");
});

test("renders an image with a fallback alt if one is not provided", () => {
  render(<Avatar />);
  screen.getByAltText('Avatar');
});
