import { SuperwallOptions, LogLevel, LogScope } from '@superwall/react-native-superwall';

export const SUPERWALL_TRIGGERS = {
  ONBOARDING: 'campaign_trigger',
  FEATURE_UNLOCK: 'campaign_trigger',
  // Add more triggers as needed
} as const;

export const createSuperwallConfig = () => {
  const options = new SuperwallOptions();
  
  // Enable debug logging in development
  if (__DEV__) {
    console.log('[Superwall] Running in DEV mode, debug logging enabled');
    options.logging.level = LogLevel.Debug;
    options.logging.scopes = [
      LogScope.PaywallPresentation,
      LogScope.PaywallTransactions,
      LogScope.Network,
    ];
  }

  return options;
}; 