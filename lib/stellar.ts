// Network + asset constants shared across the app. ESCALA runs on Stellar
// Testnet for the hackathon; flipping NEXT_PUBLIC_STELLAR_NETWORK to
// "mainnet" (plus real mainnet USDC + API keys) is the only change needed
// to go live.

export const STELLAR_NETWORK =
  (process.env.NEXT_PUBLIC_STELLAR_NETWORK as "testnet" | "mainnet") ||
  "testnet";

// Circle's canonical USDC issuer on each network. Escrows are denominated in
// this asset so campaign budgets and rewards are real stablecoin, not a
// synthetic in-app credit.
export const USDC_ISSUER =
  process.env.NEXT_PUBLIC_USDC_ISSUER ||
  (STELLAR_NETWORK === "mainnet"
    ? "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN"
    : "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5");

export const USDC_ASSET = { code: "USDC", issuer: USDC_ISSUER };

// StellarView (stellarview.acachete.xyz), not Stellar Expert: same explorer
// job, our own branding.
export const EXPLORER_BASE = `https://stellarview.acachete.xyz/es/${STELLAR_NETWORK}`;

export function explorerTxUrl(hash: string) {
  return `${EXPLORER_BASE}/tx/${hash}`;
}

export function explorerAccountUrl(address: string) {
  return `${EXPLORER_BASE}/account/${address}`;
}

export function explorerContractUrl(contractId: string) {
  return `${EXPLORER_BASE}/contract/${contractId}`;
}

export function shortAddress(address: string, size = 4) {
  if (!address) return "";
  return `${address.slice(0, size)}...${address.slice(-size)}`;
}

/**
 * Tops up a testnet account with test XLM via Stellar's public Friendbot.
 * Works on brand-new (creates it) and already-deployed accounts (refunds
 * it), which is exactly what a lazily-deployed Cavos wallet needs before it
 * can afford a trustline's reserve. Best-effort: a faucet hiccup should
 * never block the rest of the flow, so failures are swallowed.
 */
export async function fundWithFriendbot(address: string): Promise<void> {
  if (STELLAR_NETWORK !== "testnet") return;
  try {
    await fetch(`https://friendbot.stellar.org/?addr=${encodeURIComponent(address)}`);
  } catch {
    // Faucet unreachable/rate-limited: proceed with whatever balance exists.
  }
}

/**
 * Circle's public testnet USDC faucet, prefilled with the account and
 * network so getting real testnet USDC into a wallet is a couple of clicks
 * instead of a manual copy-paste. There's no public no-auth API for this
 * (Circle's /v1/faucet/drips needs an authenticated, upgraded account), so
 * this is the honest automation ceiling for a hackathon MVP.
 */
export function circleUsdcFaucetUrl(address: string) {
  const params = new URLSearchParams({ address, chain: "STELLAR" });
  return `https://faucet.circle.com/?${params.toString()}`;
}
