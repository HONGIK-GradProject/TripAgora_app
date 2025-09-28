import { useContext } from 'react';
import { TemplateDetailsContext } from '@/contexts/TemplateDetailsProvider';

/**
 * Provides shared state for template details across related screens.
 * Must be used within a child component of the TemplateDetailsProvider.
 */
export const useTemplateDetails = () => {
  const context = useContext(TemplateDetailsContext);
  if (context === undefined) {
    throw new Error('useTemplateDetails must be used within a TemplateDetailsProvider');
  }
  return context;
};