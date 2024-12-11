import { render, screen } from "@testing-library/react";
import { act } from "react";
import App from "./App";

test("renders Create Product heading", () => {
  act(() => {
    render(<App />);
  });
  const headingElement = screen.getByText(/Créer un produit/i);
  expect(headingElement).toBeInTheDocument();
});
