import { describe, expect, it } from "vitest";
import { defaultRaveEventId } from "./offers";

describe("defaultRaveEventId", () => {
  const events = [
    { id: "summer", title: "Summer Gathering" },
    { id: "lost-lands", title: "Lost Lands 2026" },
  ];

  it("preselects the active Lost Lands event for a blank RAVE offer", () => {
    expect(defaultRaveEventId(events, "")).toBe("lost-lands");
  });

  it("preserves a manually chosen event", () => {
    expect(defaultRaveEventId(events, "summer")).toBe("summer");
  });

  it("leaves the event blank when Lost Lands is unavailable", () => {
    expect(
      defaultRaveEventId([{ id: "summer", title: "Summer Gathering" }], ""),
    ).toBe("");
  });
});
