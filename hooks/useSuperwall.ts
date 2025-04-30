import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { SubscriptionStatus } from '@superwall/react-native-superwall';
import { superwallService } from '@/services/superwall';

export function useSuperwall() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setIsLoading(false);
      return;
    }
  
    const initializeAndCheck = async () => {
      console.log('[Superwall] Initializing superwallService');
      try {
        await superwallService.initialize();
        console.log('[Superwall] Initialization complete, calling checkSubscription');
        await checkSubscription();
      } catch (error) {
        console.error('[Superwall] Initialization failed:', error);
        setIsLoading(false);
      }
    };
  
    initializeAndCheck();
  }, []);

  const checkSubscription = async () => {
    console.log('[Superwall] Starting subscription check');
    try {
      const status = await superwallService.getSubscriptionStatus();
      setIsSubscribed(status === SubscriptionStatus.Active);
    } catch (error) {
      console.error('[Superwall] Hook subscription check failed:', error);
    } finally {
      console.log('[Superwall] Setting isLoading to false');
      setIsLoading(false);
    }
  };

  const showPaywall = async (triggerId: string) => {
    if (isLoading || Platform.OS === 'web') return;

    try {
      console.log('[Superwall] Presenting paywall from hook for trigger:', triggerId);
      await superwallService.presentPaywall(triggerId);
      await checkSubscription();
    } catch (error) {
      console.error('[Superwall] Hook failed to show paywall:', error);
    }
  };

  return {
    isSubscribed,
    isLoading,
    showPaywall,
    checkSubscription,
  };
}