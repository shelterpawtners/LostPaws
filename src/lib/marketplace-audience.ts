export type MarketplaceAudience = "pet" | "rave" | "all";

export const MARKETPLACE_AUDIENCE_STORAGE_KEY = "sp_marketplace_audience";

export function audienceFromChannelParam(
  value: string | null,
): MarketplaceAudience {
  if (value === "pet" || value === "rave") return value;
  return "all";
}

/**
 * "all" means no filter (both the ?channel= URL param and the
 * public_active_offers p_channel RPC argument treat null/absent the same
 * way: show every published offer regardless of channel).
 */
export function channelParamFromAudience(
  audience: MarketplaceAudience,
): "pet" | "rave" | null {
  return audience === "all" ? null : audience;
}
