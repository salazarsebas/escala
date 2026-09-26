# ESCALA

**Turn your sales into growth.** On-chain performance marketing for micro
businesses, built on Stellar.

Built for the **Stellar Odyssey Peru** hackathon, **Open Build** track.

- **Live app:** https://escala.acachete.xyz
- **On-chain evidence:** [a real escrow transaction on Stellar Testnet](https://stellarview.acachete.xyz/es/testnet/tx/1783def018811b729092fada479b724637d49c117f305a818356239a3a018671),
  viewable on [StellarView](https://stellarview.acachete.xyz)

## The problem

Micro businesses (a small cafe, a local shop) need new customers, but
customer acquisition means spending money up front with no guarantee it
converts, and most of them have no simple way to measure cost per customer
or turn their sales activity into usable data.

## What ESCALA does

ESCALA is an on-chain performance-marketing platform: it connects a
business that needs customers with a promoter who can bring them in, using
programmable money so the reward is only released when a real, verified
conversion happens.

1. The business creates a campaign and sets a reward per conversion.
2. The reward budget is deposited in USDC into an escrow smart contract,
   nothing is paid out yet.
3. The business shares a QR / link with their promoter, who shares it with
   customers.
4. When a customer converts, the promoter records the conversion.
5. The business reviews it and approves the release.
6. The smart contract pays the promoter in USDC, instantly and verifiably
   on Stellar: no invoices, no manual transfers, no trusting a middleman.

Blockchain here isn't decoration: the budget is genuinely locked in a
contract neither side controls unilaterally, and the payout is genuinely
conditional on approval. That's the product.

## How it's built

| Piece | Choice | Why |
|---|---|---|
| Wallets | [Cavos](https://cavos.xyz) social login | Businesses and promoters sign in with Google, no seed phrases. Cavos creates a self-custodial Stellar account per user and exposes `signXdr()`, so it can sign transactions built by any third-party API, not just its own SDK calls. |
| Escrow | [Trustless Work](https://trustlesswork.com) `@trustless-work/escrow@3` | Instead of writing and auditing a custom Soroban escrow contract in a one-day hackathon, ESCALA integrates Trustless Work's audited, already-deployed single-release escrow contracts via their REST/React SDK. Every campaign budget is a real on-chain escrow. |
| Asset | USDC (Stellar Asset Contract) | Rewards and budgets are denominated in USDC so the numbers on screen are real dollars, not a points system. |
| App | Next.js 16 (App Router) + TypeScript + Tailwind | Fast to ship, deploys to Vercel in one command. |

### Escrow lifecycle (one campaign = one Trustless Work escrow)

```
Business creates campaign
        |
        v
useInitializeEscrow()  ->  unsigned XDR  ->  wallet.signXdr()  ->  useSendTransaction()
        |  (roles: approver=business, receiver=promoter, releaseSigner=business)
        v
useFundEscrow()    ->  budget locked in USDC on-chain
        |
        v
Promoter shares /c/[contractId] (QR + link) with a customer
        |
        v
Promoter marks the conversion  ->  useChangeMilestoneStatus() -> "submitted"
        |
        v
Business reviews and approves  ->  useApproveMilestone() -> useReleaseFunds()
        |
        v
USDC lands in the promoter's Cavos wallet, verifiable on StellarView
```

Everything that moves money goes through Trustless Work's build-unsigned-XDR,
sign, submit pattern (`hooks/useEscrowActions.ts`); Cavos's `signXdr()` is
the bridge that lets a social-login wallet sign a transaction it didn't
build itself, including the Soroban auth entries the escrow contract
requires.

## Project structure

```
app/
  page.tsx                 Landing page
  dashboard/page.tsx        Wallet-gated panel: "my campaigns" (business) + "my referrals" (promoter)
  dashboard/nueva/page.tsx  Create a campaign (deploy + fund the escrow)
  c/[contractId]/page.tsx   Public, wallet-free campaign page (QR + share link)
  providers.tsx             Cavos + Trustless Work + React Query providers
hooks/
  useEscrowActions.ts        deploy/fund/submit/approve/release, wired to Cavos signing
lib/
  stellar.ts                 network + USDC constants, StellarView links
components/                  ConnectButton, CampaignForm, CampaignCard, QrShare, StatusBadge
```

## Running it locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

You need two sets of credentials, both free:

1. **Cavos App ID**: create an app at the [Cavos console](https://cavos.xyz),
   enable Stellar, copy the App ID into `NEXT_PUBLIC_CAVOS_APP_ID`.
2. **Trustless Work API key**: generate a testnet key from their
   [dashboard](https://dapp.trustlesswork.com/settings?tab=api-keys) (Testnet
   tab, `ESCROW_MANAGER` role), copy it into `NEXT_PUBLIC_TW_API_KEY`.

Everything else in `.env.example` has a sensible testnet default (network,
USDC issuer).

To try the full flow you need two wallets: sign in once as the business to
create a campaign (you'll paste in a promoter's Stellar address), then sign
in as the promoter (a second browser profile / incognito window works well)
to register the conversion, then switch back to the business to approve
and release the payout. Both accounts need a small amount of testnet XLM
(for reserves) and a testnet USDC trustline, which the app opens
automatically the first time each wallet touches USDC; fund the account
itself from [Friendbot](https://developers.stellar.org/docs/build/smart-contracts/getting-started/create-account#create-account)
first.

## Hackathon submission notes

- **Track:** Open Build. Also crosses into RWA / real-time finance: campaign
  budgets are programmable money released against real-world results.
- **On-chain verification:** every campaign is a real Trustless Work escrow
  contract on Stellar Testnet. The dashboard and the public campaign page
  both link straight to [StellarView](https://stellarview.acachete.xyz) for
  the contract and its transactions.
- **MVP scope:** one campaign, one promoter, one conversion cycle, by
  design, matching the brief's own MVP definition. Multiple promoters per
  campaign, in-app analytics, and the "Financial Activity Passport" (turning
  a business's campaign history into portable, consent-based credit
  evidence) are the next phases, not this weekend's build.
- **Demo video:** recorded, link to be added on submission.

## Roadmap

1. **Now:** single-campaign, single-promoter performance marketing MVP.
2. Multiple campaigns/promoters per business, in-app analytics.
3. Financial Activity Passport: structured, verifiable business activity
   history (consent-based, not automatic credit).
4. E-commerce, POS, and WhatsApp integrations.
5. Partnerships with fintechs, financial institutions, and MYPE programs.

## Deploying

```bash
vercel deploy
```

Set the same environment variables from `.env.example` in the Vercel
project before the first deploy.
