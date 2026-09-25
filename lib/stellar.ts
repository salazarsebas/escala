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

export const EXPLORER_BASE =
  STELLAR_NETWORK === "mainnet"
    ? "https://stellar.expert/explorer/public"
    : "https://stellar.expert/explorer/testnet";

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
