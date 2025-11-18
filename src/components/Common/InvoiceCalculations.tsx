import { PLATFORM_CHARGE_TYPE } from "./Constants";

export const CalculateTransactionFee = ({invoiceAmount,transactionAmount, plateformFees ,platformChargeType, vatCharges, buyerPercent, sellerPercent, hasAdvisor, escrowCommission, buyerCommissionPercent, sellerCommissionPercent, minimumPlatformCharge, entityType}: any) => {
    let platformFee: any = 0;
    let vatFee: any = 0;
    let buyerTransactionFee: any = 0;
    let sellerTransactionFee: any = 0;
    let totalAmount: any = 0;
    let buyerAmount: any = 0;
    let buyerAdvisorFee: any = 0;
    let sellerAdvisorFee: any = 0;
    let buyerTotalFee: any = 0;
    let sellerTotalFee: any = 0;
    let sellerAmount: any = 0;
    let milestonePercent: any = 0;
    let platformPercent: any = 0;
    let totalTransactionAmount: any = 0;

    if(!!invoiceAmount && !!transactionAmount) {
        milestonePercent = ((Number(transactionAmount) / Number(invoiceAmount)) * 100)
    }
    vatCharges = vatCharges || process.env.COUNTRY_VAT
    if(platformChargeType === null || platformChargeType === PLATFORM_CHARGE_TYPE.PERCENT) {
        plateformFees = plateformFees || (entityType === "INDIVIDUAL" ? process.env.KYC_PLATFORM_FEE_PERCENT : process.env.KYB_PLATFORM_FEE_PERCENT);
        minimumPlatformCharge = minimumPlatformCharge || (entityType === "INDIVIDUAL" ? process.env.KYC_PLATFORM_FEE_FIXED : process.env.KYB_PLATFORM_FEE_FIXED);
        const totalPlatformFee = ((Number(invoiceAmount) * Number(plateformFees)) / 100)
        platformFee = ((Number(transactionAmount) * Number(plateformFees)) / 100)
        platformPercent = plateformFees + "%";
        if(Number(totalPlatformFee) < Number(minimumPlatformCharge)) {
            // in case of milestone
            if(Number(transactionAmount) < Number(invoiceAmount)) {
                platformFee = (Number(minimumPlatformCharge) * milestonePercent) / 100
            } else {
                platformFee = Number(minimumPlatformCharge)
            }
            platformPercent = minimumPlatformCharge
        }
        vatFee = ((Number(platformFee) * Number(vatCharges)) / 100)
    } else if(platformChargeType === PLATFORM_CHARGE_TYPE.FIXED) { 
        plateformFees = plateformFees ?? (entityType === "INDIVIDUAL" ? process.env.KYC_PLATFORM_FEE_FIXED : process.env.KYB_PLATFORM_FEE_FIXED);
         // incase of milestone
         if(Number(transactionAmount) < Number(invoiceAmount)) {
            platformFee = ((Number(plateformFees) * Number(milestonePercent)) / 100)
        } else {
            platformFee = Number(plateformFees)
        }
        platformPercent=plateformFees
        vatFee =  ((Number(platformFee) * Number(vatCharges)) / 100)
    }  
    platformFee = Number(platformFee).toFixed(2); 
    vatFee = Number(vatFee).toFixed(2);
    buyerTransactionFee = Number(buyerPercent) > 0 ?(((Number(platformFee) + Number(vatFee)) * Number(buyerPercent)) / 100) : 0;
    sellerTransactionFee = Number(sellerPercent) > 0 ? (((Number(platformFee) + Number(vatFee)) * Number(sellerPercent)) / 100) : 0;
    buyerTotalFee = Number(buyerTransactionFee);
    sellerTotalFee = Number(sellerTransactionFee);
    totalTransactionAmount = (Number(platformFee) + Number(vatFee)).toFixed(2);
    totalAmount = (Number(transactionAmount) + Number(totalTransactionAmount)) - Number(sellerTotalFee || 0);
    if(hasAdvisor) {
        if(Number(transactionAmount) < Number(invoiceAmount)) {
            const escrowAdvisorCommission = ((Number(escrowCommission) * Number(milestonePercent)) / 100)
            buyerAdvisorFee = Number(buyerCommissionPercent) > 0 ? ((Number(escrowAdvisorCommission) * Number(buyerCommissionPercent)) / 100) : 0;
            sellerAdvisorFee = Number(sellerCommissionPercent) > 0 ? ((Number(escrowAdvisorCommission) * Number(sellerCommissionPercent)) / 100) : 0;
        } else {
            buyerAdvisorFee = Number(buyerCommissionPercent) > 0 ? ((Number(escrowCommission) * Number(buyerCommissionPercent)) / 100) : 0
            sellerAdvisorFee = Number(sellerCommissionPercent) > 0 ? ((Number(escrowCommission) * Number(sellerCommissionPercent)) / 100) : 0
        }
        buyerTotalFee = Number(buyerTransactionFee) + Number(buyerAdvisorFee)
        sellerTotalFee = Number(sellerTransactionFee) + Number(sellerAdvisorFee);
        totalAmount = (Number(totalAmount) + Number(escrowCommission)) - Number(sellerAdvisorFee || 0);
    }
    buyerAmount = (Number(transactionAmount) + Number(buyerTotalFee)).toFixed(2)
    buyerTransactionFee = Number(buyerTransactionFee).toFixed(2);
    sellerTransactionFee =Number(sellerTransactionFee).toFixed(2);
    sellerAmount = (Number(transactionAmount) - Number(sellerTotalFee)).toFixed(2)
    totalAmount = Number(totalAmount).toFixed(2);
    buyerTotalFee = Number(buyerTotalFee).toFixed(2);
    sellerTotalFee =Number(sellerTotalFee).toFixed(2);
    buyerAdvisorFee = Number(buyerAdvisorFee).toFixed(2);
    sellerAdvisorFee =Number(sellerAdvisorFee).toFixed(2);
    milestonePercent =Number(milestonePercent).toFixed(2);
    return {
        platformFee,
        platformPercent,
        minimumPlatformCharge,
        vatFee,
        buyerTransactionFee,
        sellerTransactionFee,
        buyerAdvisorFee,
        sellerAdvisorFee,
        buyerTotalFee,
        sellerTotalFee,
        buyerAmount,
        sellerAmount,
        totalAmount,
        milestonePercent
    }
}

export interface PlatformFee {
  platformChargeType: "FIXED" | "PERCENT";
  platformFees: number;
}

export function calculateUserPlatformFee(
  fee: PlatformFee | undefined,
  invoiceAmount: number
): number {
  if (!fee) return 0;

  if (fee?.platformChargeType === PLATFORM_CHARGE_TYPE.FIXED) {
    return Number(fee.platformFees) || 0;
  }

  if (fee?.platformChargeType === PLATFORM_CHARGE_TYPE.PERCENT) {
    return ((Number(fee.platformFees) || 0) / 100) * invoiceAmount;
  }

  return 0;
}


