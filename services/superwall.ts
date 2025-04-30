import { Platform } from 'react-native';
import Superwall, { SubscriptionStatus, PaywallPresentationHandler } from '@superwall/react-native-superwall';
import { createSuperwallConfig } from '@/config/superwall';

class SuperwallService {
  private static instance: SuperwallService;
  private initialized = false;
  private handler: PaywallPresentationHandler | null = null;

  private constructor() {}

  static getInstance(): SuperwallService {
    if (!SuperwallService.instance) {
      SuperwallService.instance = new SuperwallService();
    }
    return SuperwallService.instance;
  }

  initialize() {
    if (this.initialized) return;

    const apiKey = Platform.select({
      ios: process.env.EXPO_PUBLIC_SUPERWALL_API_KEY_IOS,
      android: process.env.EXPO_PUBLIC_SUPERWALL_API_KEY_ANDROID,
      default: undefined,
    });
    console.log('[Superwall] API Key:', apiKey ? 'Present' : 'Missing');

    this.handler = new PaywallPresentationHandler();
    this.handler.onPresent((paywallInfo) => {
      console.log('[Superwall] Paywall presented:', paywallInfo);
    });
    this.handler.onDismiss((paywallInfo, paywallResult) => {
      console.log('[Superwall] Paywall dismissed:', { paywallInfo, paywallResult });
    });
    this.handler.onError((error) => {
      console.error('[Superwall] Paywall error:', error.message, error.stack);
    });

    if (!apiKey) {
      console.warn('[Superwall] No API key found for platform:', Platform.OS);
      return;
    }

    try {
      const options = createSuperwallConfig();
      console.log('[Superwall] Configuration options:', {
        loggingLevel: options.logging.level,
        loggingScopes: options.logging.scopes,
      });
      console.log('[Superwall] Configuring with API key:', apiKey);
      Superwall.configure({apiKey, options});
      this.initialized = true;
      console.log('[Superwall] Initialized successfully');
      console.log('[Superwall] Native module available:', !!Superwall.shared);
    } catch (error) {
      console.error('[Superwall] Initialization failed:', error.message, error.stack);
    }
  }

  async presentPaywall(triggerId: string): Promise<void> {
    try {
      if (!this.handler) {
        throw new Error('[Superwall] Handler not initialized');
      }
      console.log('[Superwall] Registering paywall with trigger:', triggerId);
      await Superwall.shared.register({
        placement: triggerId,
        handler: this.handler,
      });
      console.log('[Superwall] Paywall registration successful');
    } catch (error) {
      console.error('[Superwall] Paywall registration failed:', error.message, error.stack);
      throw error;
    }
  }

  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const status = await Superwall.shared.getSubscriptionStatus();
      console.log('[Superwall] Subscription status:', status);
      return status;
    } catch (error) {
      console.error('[Superwall] Failed to get subscription status:', error);
      throw error;
    }
  }
}

export const superwallService = SuperwallService.getInstance(); 