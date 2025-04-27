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

    superwallService.initialize();
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const status = await superwallService.getSubscriptionStatus();
      console.log('[Superwall] CheckSubscription: Status:', JSON.stringify(status));
      setIsSubscribed(status === SubscriptionStatus.ACTIVE);
    } catch (error) {
      console.error('[Superwall] Hook subscription check failed:', error);
    } finally {
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