import type {
  ApplicationConfig,
  VbenAdminProAppConfigRaw,
} from '@vben/types/global';

/**
 * 由 vite-inject-app-config 注入的全局配置
 */
export function useAppConfig(
  env: Record<string, any>,
  isProduction: boolean,
): ApplicationConfig {
  // 生产环境下，直接使用 window._VBEN_ADMIN_PRO_APP_CONF_ 全局变量
  const config = isProduction
    ? window._VBEN_ADMIN_PRO_APP_CONF_
    : (env as VbenAdminProAppConfigRaw);

  const { VITE_GLOB_API_URL } = config;

  return {
    apiURL: VITE_GLOB_API_URL,
  };
}

export function isTenantEnable(): boolean {
  return import.meta.env.VITE_APP_TENANT_ENABLE === 'true';
}

export function isCaptchaEnable(): boolean {
  return import.meta.env.VITE_APP_CAPTCHA_ENABLE === 'true';
}

export function isDocAlertEnable(): boolean {
  return import.meta.env.VITE_APP_DOCALERT_ENABLE !== 'false';
}
