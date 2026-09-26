"use client";

import { useCallback } from "react";
import {
  useApproveMilestone,
  useChangeMilestoneStatus,
  useFundEscrow,
  useInitializeEscrow,
  useReleaseFunds,
  useSendTransaction,
  type EscrowRequestResponse,
  type InitializeSingleReleaseEscrowPayload,
  type InitializeSingleReleaseEscrowResponse,
} from "@trustless-work/escrow";
import { useCavos } from "@cavos/kit/react";
import { STELLAR_NETWORK, USDC_ASSET, fundWithFriendbot } from "@/lib/stellar";

// ESCALA's on-chain unit of work: one campaign == one Trustless Work
// single-release escrow with exactly one milestone ("a verified
// conversión"). The business is the approver / release signer / platform
// admin; the promoter they recruited is the receiver / service provider.
// This mirrors the MVP scope in the project brief: one campaign, one
// promoter, one conversión cycle, fully verifiable on Stellar testnet.

export const CONVERSION_MILESTONE_INDEX = "0";

type DeployCampaignInput = {
  title: string;
  description: string;
  rewardAmount: number;
  businessAddress: string;
  promoterAddress: string;
};

/**
 * Wraps the Trustless Work "build unsigned XDR -> sign with wallet -> submit"
 * pattern behind a small set of ESCALA-shaped actions, signing every
 * transaction with the connected Cavos Stellar wallet (`wallet.signXdr`).
 */
export function useEscrowActions() {
  const { wallet } = useCavos();
  const { deployEscrow } = useInitializeEscrow();
  const { fundEscrow } = useFundEscrow();
  const { changeMilestoneStatus } = useChangeMilestoneStatus();
  const { approveMilestone } = useApproveMilestone();
  const { releaseFunds } = useReleaseFunds();
  const { sendTransaction } = useSendTransaction();

  const requireStellarWallet = useCallback(() => {
    if (!wallet || wallet.chain !== "stellar") {
      throw new Error("Conecta tu wallet de ESCALA (Cavos) antes de continuar.");
    }
    return wallet;
  }, [wallet]);

  const requireUnsignedXdr = (result: EscrowRequestResponse) => {
    if (!result.unsignedTransaction) {
      throw new Error("Trustless Work no devolvió una transacción para firmar.");
    }
    return result.unsignedTransaction;
  };

  const signAndSend = useCallback(
    async (unsignedXdr: string) => {
      const stellarWallet = requireStellarWallet();
      const signedXdr = await stellarWallet.signXdr(unsignedXdr);
      return sendTransaction(signedXdr);
    },
    [requireStellarWallet, sendTransaction]
  );

  /**
   * Cavos wallets are lazily deployed: the account doesn't exist on-chain
   * until its first `execute()`, and even once deployed it starts with
   * essentially no spendable XLM (the sponsored creation covers only the
   * bare minimum), which isn't enough to cover a trustline's reserve.
   *
   * On testnet, Friendbot solves both problems in one call: it creates
   * the account if missing and tops it up with real test XLM either way,
   * so we skip Cavos's own lazy-deploy path entirely there and just let
   * the account pay for its own reserves. Mainnet has no faucet, so it
   * still goes through Cavos's sponsored deploy.
   */
  const ensureDeployedAndUsdcTrustline = useCallback(async () => {
    const stellarWallet = requireStellarWallet();

    if (STELLAR_NETWORK === "testnet") {
      // Creates the account on-chain (if missing) and tops it up with real
      // test XLM, covering the reserve a trustline needs that Cavos's own
      // sponsored creation alone wouldn't leave room for.
      await fundWithFriendbot(stellarWallet.address);
    }

    if (!stellarWallet.isDeployed) {
      // Friendbot only touches the network, not Cavos's own account model:
      // the wallet's status stays "undeployed" until Cavos itself registers
      // the control key on-chain, which is what addTrustline() gates on.
      // execute() does that idempotently (it detects the account already
      // exists and just writes the control-key entry instead of
      // re-creating it), flipping isDeployed to true. Sponsored self-payment
      // of 1 stroop, 0 XLM cost to the user either way.
      await stellarWallet.execute(BigInt(1), stellarWallet.address);
    }

    const balance = await stellarWallet.tokenBalance(USDC_ASSET);
    if (balance === "0") {
      // tokenBalance() also returns "0" when the trustline doesn't exist yet;
      // addTrustline is a no-op-safe call either way for a first-time signer.
      await stellarWallet.addTrustline(USDC_ASSET);
    }
  }, [requireStellarWallet]);

  /** Step 1: deploy + fund the campaign escrow. Returns the new contractId. */
  const createCampaign = useCallback(
    async ({
      title,
      description,
      rewardAmount,
      businessAddress,
      promoterAddress,
    }: DeployCampaignInput) => {
      await ensureDeployedAndUsdcTrustline();

      const payload: InitializeSingleReleaseEscrowPayload = {
        signer: businessAddress,
        engagementId: `escala-${Date.now().toString(36)}`,
        title,
        description,
        amount: rewardAmount,
        platformFee: 0,
        roles: {
          approver: businessAddress,
          serviceProvider: promoterAddress,
          platformAddress: businessAddress,
          releaseSigner: businessAddress,
          disputeResolver: businessAddress,
          receiver: promoterAddress,
        },
        milestones: [{ description: "Conversión de cliente verificada" }],
        trustline: { address: USDC_ASSET.issuer, symbol: USDC_ASSET.code },
      };

      const deployResult = await deployEscrow(payload, "single-release");
      const deploySend = (await signAndSend(
        requireUnsignedXdr(deployResult)
      )) as InitializeSingleReleaseEscrowResponse;
      const contractId = deploySend.contractId;

      const fundResult = await fundEscrow(
        { contractId, amount: rewardAmount, signer: businessAddress },
        "single-release"
      );
      await signAndSend(requireUnsignedXdr(fundResult));

      return contractId;
    },
    [deployEscrow, ensureDeployedAndUsdcTrustline, fundEscrow, signAndSend]
  );

  /** Step 2: the promoter marks a real-world conversión as delivered. */
  const submitConversion = useCallback(
    async (contractId: string, promoterAddress: string, evidence: string) => {
      await ensureDeployedAndUsdcTrustline();
      const result = await changeMilestoneStatus(
        {
          contractId,
          milestoneIndex: CONVERSION_MILESTONE_INDEX,
          newStatus: "submitted",
          newEvidence: evidence,
          serviceProvider: promoterAddress,
        },
        "single-release"
      );
      return signAndSend(requireUnsignedXdr(result));
    },
    [changeMilestoneStatus, ensureDeployedAndUsdcTrustline, signAndSend]
  );

  /** Step 3: the business approves the milestone, then releases USDC to the promoter. */
  const approveAndRelease = useCallback(
    async (contractId: string, businessAddress: string) => {
      const approveResult = await approveMilestone(
        {
          contractId,
          milestoneIndex: CONVERSION_MILESTONE_INDEX,
          approver: businessAddress,
        },
        "single-release"
      );
      await signAndSend(requireUnsignedXdr(approveResult));

      const releaseResult = await releaseFunds(
        { contractId, releaseSigner: businessAddress },
        "single-release"
      );
      return signAndSend(requireUnsignedXdr(releaseResult));
    },
    [approveMilestone, releaseFunds, signAndSend]
  );

  return { createCampaign, submitConversion, approveAndRelease, ensureDeployedAndUsdcTrustline };
}
