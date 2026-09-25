"use client";

import { useCallback } from "react";
import {
  useApproveMilestones,
  useChangeMilestoneStatus,
  useDeployEscrow,
  useFundEscrow,
  useReleaseFunds,
  useSendTransaction,
  type DeploySingleReleaseEscrowPayload,
} from "@trustless-work/escrow";
import { useCavos } from "@cavos/kit/react";
import { USDC_ASSET, usdcContractId } from "@/lib/stellar";

// ESCALA's on-chain unit of work: one campaign == one Trustless Work
// single-release escrow with exactly one milestone ("a verified
// conversion"). The business is the approver / release signer / platform
// admin; the promoter they recruited is the receiver / service provider.
// This mirrors the MVP scope in the project brief: one campaign, one
// promoter, one conversion cycle, fully verifiable on Stellar testnet.

export const CONVERSION_MILESTONE_INDEX = 0;

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
  const { deployEscrow } = useDeployEscrow();
  const { fundEscrow } = useFundEscrow();
  const { changeMilestoneStatus } = useChangeMilestoneStatus();
  const { approveMilestones } = useApproveMilestones();
  const { releaseFunds } = useReleaseFunds();
  const { sendTransaction } = useSendTransaction();

  const requireStellarWallet = useCallback(() => {
    if (!wallet || wallet.chain !== "stellar") {
      throw new Error("Conecta tu wallet de ESCALA (Cavos) antes de continuar.");
    }
    return wallet;
  }, [wallet]);

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
   * until its first `execute()`. Both addTrustline and anything Trustless
   * Work builds (which needs a real sequence number) require the account to
   * exist first, so every action routes through this before touching USDC
   * or signing an escrow transaction.
   */
  const ensureDeployedAndUsdcTrustline = useCallback(async () => {
    const stellarWallet = requireStellarWallet();
    if (!stellarWallet.isDeployed) {
      // Sponsored self-payment of 1 stroop: the smallest possible transfer,
      // used purely to trigger lazy account creation (0 XLM cost to the user).
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

      const payload: DeploySingleReleaseEscrowPayload = {
        signer: businessAddress,
        engagementId: `escala-${Date.now().toString(36)}`,
        title,
        description,
        amount: rewardAmount,
        platformFee: 0,
        roles: {
          approvers: [businessAddress],
          serviceProviders: [promoterAddress],
          platform: businessAddress,
          releaseSigners: [businessAddress],
          disputeResolvers: [businessAddress],
          receiver: promoterAddress,
          admin: businessAddress,
        },
        milestones: [
          {
            description: "Conversion de cliente verificada",
            approvalsTarget: 1,
          },
        ],
        trustline: { contractId: await usdcContractId(), symbol: USDC_ASSET.code },
      };

      const deployResult = await deployEscrow(payload, "single-release", {
        platformId: "escala",
      });
      await signAndSend(deployResult.unsignedXdr);

      const fundResult = await fundEscrow(
        { contractId: deployResult.contractId, amount: rewardAmount, signer: businessAddress },
        "single-release"
      );
      await signAndSend(fundResult.unsignedXdr);

      return deployResult.contractId;
    },
    [deployEscrow, ensureDeployedAndUsdcTrustline, fundEscrow, signAndSend]
  );

  /** Step 2: the promoter marks a real-world conversion as delivered. */
  const submitConversion = useCallback(
    async (contractId: string, promoterAddress: string, evidence: string) => {
      await ensureDeployedAndUsdcTrustline();
      const result = await changeMilestoneStatus(
        {
          contractId,
          serviceProvider: promoterAddress,
          updates: [
            {
              index: CONVERSION_MILESTONE_INDEX,
              newStatus: "submitted",
              newEvidence: evidence,
            },
          ],
        },
        "single-release"
      );
      return signAndSend(result.unsignedXdr);
    },
    [changeMilestoneStatus, ensureDeployedAndUsdcTrustline, signAndSend]
  );

  /** Step 3: the business approves the milestone, then releases USDC to the promoter. */
  const approveAndRelease = useCallback(
    async (contractId: string, businessAddress: string) => {
      const approveResult = await approveMilestones(
        {
          contractId,
          approver: businessAddress,
          milestoneIndexes: [CONVERSION_MILESTONE_INDEX],
        },
        "single-release"
      );
      await signAndSend(approveResult.unsignedXdr);

      const releaseResult = await releaseFunds(
        { contractId, releaseSigner: businessAddress },
        "single-release"
      );
      return signAndSend(releaseResult.unsignedXdr);
    },
    [approveMilestones, releaseFunds, signAndSend]
  );

  return { createCampaign, submitConversion, approveAndRelease, ensureDeployedAndUsdcTrustline };
}
