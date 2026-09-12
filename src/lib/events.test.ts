import { describe, expect, it } from "vitest";
import { audiencesFor, formatEventWhen, formatEventWhere } from "./events";

describe("event audience filtering", () => {
  it("includes both-audience events in every filtered view", () => {
    expect(audiencesFor("pet")).toEqual(["pet", "both"]);
    expect(audiencesFor("human")).toEqual(["human", "both"]);
  });

  it("shows every audience when unfiltered", () => {
    expect(audiencesFor("all")).toEqual(["pet", "human", "both"]);
  });

  it("narrows to cross-audience events only when asked for them", () => {
    expect(audiencesFor("both")).toEqual(["both"]);
  });
});

describe("event date formatting", () => {
  it("says so plainly when no date is set rather than inventing one", () => {
    expect(formatEventWhen(null, null)).toBe("Date to be announced");
    expect(formatEventWhen("not-a-date", null)).toBe("Date to be announced");
  });

  it("renders a single day once, not as a range", () => {
    const out = formatEventWhen("2026-10-02T17:00:00Z", "2026-10-02T23:00:00Z");
    expect(out).not.toContain("—");
  });

  it("keeps a UTC calendar day stable when the viewer is east of UTC", () => {
    const out = formatEventWhen("2026-10-02T23:30:00Z", "2026-10-02T23:45:00Z");
    expect(out).not.toContain("—");
  });

  it("renders a multi-day event as a range", () => {
    const out = formatEventWhen("2026-10-02T17:00:00Z", "2026-10-04T23:00:00Z");
    expect(out).toContain("—");
  });

  it("falls back to the start day when the end date is unusable", () => {
    const out = formatEventWhen("2026-10-02T17:00:00Z", "nonsense");
    expect(out).not.toContain("—");
    expect(out).not.toBe("Date to be announced");
  });
});

describe("event location formatting", () => {
  it("marks online events and keeps any area detail", () => {
    expect(formatEventWhere(true, null)).toBe("Online");
    expect(formatEventWhere(true, "Worldwide")).toBe("Online · Worldwide");
  });

  it("does not claim a location it does not have", () => {
    expect(formatEventWhere(false, null)).toBe("Location to be announced");
    expect(formatEventWhere(false, "   ")).toBe("Location to be announced");
  });

  it("uses the service area for physical events", () => {
    expect(formatEventWhere(false, "Legend Valley, OH")).toBe(
      "Legend Valley, OH",
    );
  });
});
