import { render, screen } from "@testing-library/react";
import Home from "../pages/index";
import "@testing-library/jest-dom";

describe("On load of page, ", () => {
  test("No clocks shown", async () => {
    // expect(true).toBeTruthy();
    const home = await render(<Home />);

    const clocks = home.container.querySelector("#clockTile");
    console.log({ clocks });
    expect(clocks).toBeNull();
  });
});

export {};
