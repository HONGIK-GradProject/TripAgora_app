import { SessionDetailsContext } from '@/contexts/SessionDetailsProvider';
import { useContext } from 'react';

/**
 * Provides shared state for session details across related screens.
 * Must be used within a child component of the SessionDetailsProvider.
 */
export const useSessionDetails = () => {
  const context = useContext(SessionDetailsContext);
  if (context === undefined) {
    throw new Error(
      'useSessionDetails must be used within a SessionDetailsProvider'
    );
  }
  return context;
};
