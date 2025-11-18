import { message } from "antd";
import type { AxiosResponse } from "axios";
import { getRiskConfiguration } from "./admin";

// ---------- Types ----------
export interface RiskItem {
  id?: number;
  name?: string;
  [key: string]: any;
}

export interface RiskType {
  id: number;
  riskType: string;
  riskItems?: RiskItem[];
}

export interface RiskCategory {
  riskCategory: string;
  riskTypes: RiskType[];
}

export interface RiskResponse {
  status: number;
  result: RiskCategory[];
}

// ---------- Organized Output ----------
export interface ParsedRiskConfig {
  raw: RiskCategory[];
  customerRisk?: RiskCategory;
  geographicRisk?: RiskCategory;
  businessNature?: RiskType;
  countryOfIncorporation?: RiskType;
  nationality?: RiskType;
  nationalityPartner1?: RiskType;
  profession?: RiskType;
  residenceStatus?: RiskType;
}

// ---------- Main API Function ----------
export const getRiskConfigurationDetails = async (
  entityType: "C" | "I"
): Promise<ParsedRiskConfig | null> => {
  try {
    const response: AxiosResponse<RiskResponse> = await getRiskConfiguration({
      RiskCategory: entityType,
    });

    const { status, result } = response.data;

    if (![200, 201].includes(status) || !Array.isArray(result)) {
      message.warning("No risk configuration data found.");
      return null;
    }

    const customerRisk = result.find((r) => r.riskCategory === "Customer Risk");
    const geographicRisk = result.find((r) => r.riskCategory === "Geographic Risk");

    // Common risk type lookups
    const findRiskType = (riskCategory: RiskCategory | undefined, name: string) =>
      riskCategory?.riskTypes?.find((r) => r.riskType === name);

    const parsed: ParsedRiskConfig = {
      raw: result,
      customerRisk,
      geographicRisk,
      businessNature: findRiskType(customerRisk, "Nature of Business"),
      countryOfIncorporation: findRiskType(geographicRisk, "Country of Incorporation"),
      // nationality: findRiskType(geographicRisk, "Nationality"),
      // nationalityPartner1: findRiskType(geographicRisk, "Nationality Partner 1"),
      profession: findRiskType(customerRisk, "Profession"),
      residenceStatus: findRiskType(customerRisk, "Residence Status"),
    };

    return parsed;
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong while fetching risk configuration.";
    message.error(msg);
    throw error;
  }
};
