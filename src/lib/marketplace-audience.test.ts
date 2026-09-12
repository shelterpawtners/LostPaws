import { describe, expect, it } from "vitest";
import {
  audienceFromChannelParam,
  channelParamFromAudience,
} from "./marketplace-audience";

describe("marketplace audience mapping", () => {
  it("reads a recognized channel param as its matching audience", () => {
    expect(audienceFromChannelParam("pet")).toBe("pet");
    expect(audienceFromChannelParam("rave")).toBe("rave");
  });

  it("treats missing or unrecognized channel params as 'all'", () => {
    expect(audienceFromChannelParam(null)).toBe("all");
    expect(audienceFromChannelParam("")).toBe("all");
    expect(audienceFromChannelParam("shared")).toBe("all");
  });

  it("round-trips pet/rave audiences back to the same channel param", () => {
    expect(channelParamFromAudience("pet")).toBe("pet");
    expect(channelParamFromAudience("rave")).toBe("rave");
  });

  it("maps 'all' to no channel filter", () => {
    expect(channelParamFromAudience("all")).toBeNull();
  });
});
