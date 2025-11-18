import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.REACT_APP_SERVER_URL': JSON.stringify(env.REACT_APP_SERVER_URL),
      'process.env.CARE_EMAIL': JSON.stringify(env.CARE_EMAIL),
      'process.env.REACT_APP_SENTRY_DSN': JSON.stringify(env.REACT_APP_SENTRY_DSN),
      'process.env.SENTRY_ENABLED': JSON.stringify(env.SENTRY_ENABLED),
      'process.env.REACT_APP_TRACE_PROPAGATION_TARGETS': JSON.stringify(env.REACT_APP_TRACE_PROPAGATION_TARGETS),
      'process.env.KYC_PLATFORM_FEE_PERCENT': JSON.stringify(env.KYC_PLATFORM_FEE_PERCENT),
      'process.env.KYC_PLATFORM_FEE_FIXED': JSON.stringify(env.KYC_PLATFORM_FEE_FIXED),
      'process.env.KYB_PLATFORM_FEE_PERCENT': JSON.stringify(env.KYB_PLATFORM_FEE_PERCENT),
      'process.env.KYB_PLATFORM_FEE_FIXED': JSON.stringify(env.KYB_PLATFORM_FEE_FIXED),
      'process.env.COUNTRY_VAT': JSON.stringify(env.COUNTRY_VAT),
      'process.env.MINIMUM_INVOICE_AMOUNT': JSON.stringify(env.MINIMUM_INVOICE_AMOUNT),
      'process.env.MAX_CUSTOM_ATTACHMENTS': JSON.stringify(env.MAX_CUSTOM_ATTACHMENTS),
      'process.env.ENABLE_ESCROW_ADVISOR': JSON.stringify(env.ENABLE_ESCROW_ADVISOR),
      'process.env.ENABLE_MANAGER_CHEQUE': JSON.stringify(env.ENABLE_MANAGER_CHEQUE),
      'process.env.MAX_MILESTONE_COUNT': JSON.stringify(env.MAX_MILESTONE_COUNT),
      'process.env.UAEPGS_POSTING_URL': JSON.stringify(env.UAEPGS_POSTING_URL),
      'process.env.UAEPGS_PLATFORM_FEE': JSON.stringify(env.UAEPGS_PLATFORM_FEE),
      'process.env.ENABLE_UAEPGS_CORPORATE_FLOW': JSON.stringify(env.ENABLE_UAEPGS_CORPORATE_FLOW),
      'process.env.SPECIAL_TNC_LINK': JSON.stringify(env.SPECIAL_TNC_LINK),
      'process.env.SPECIAL_USER_ALIASES': JSON.stringify(env.SPECIAL_USER_ALIASES),
      'process.env.ENABLE_OTP_VERIFICATION': JSON.stringify(env.ENABLE_OTP_VERIFICATION),
      'process.env.ENABLE_USD_CURRENCY': JSON.stringify(env.ENABLE_USD_CURRENCY),
      'process.env.TRUSTIN_CRESET_MASTER_DOC_LINK': JSON.stringify(env.TRUSTIN_CRESET_MASTER_DOC_LINK),
      'process.env.CRESET_USERS': JSON.stringify(env.CRESET_USERS),
    },
    plugins: [react()],
    assetsInclude: ['**/*.docx'],
  }
})