import { SessionItineraryEditorContext } from '@/contexts/SessionItineraryEditorProvider';
import { useContext } from 'react';

export const useSessionItineraryEditor = () => {
  const context = useContext(SessionItineraryEditorContext);
  if (context === undefined) {
    throw new Error(
      'useSessionItineraryEditor must be used within a SessionItineraryEditorProvider'
    );
  }
  return context;
};

