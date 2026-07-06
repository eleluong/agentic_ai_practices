/**
 * Lightweight client-side router matching pathways to views.
 */

export type AppView = 'portal' | 'governance' | 'optimization';

/**
 * Resolves the pathname to one of the application views.
 */
export const getPathView = (pathname: string): AppView => {
  const path = pathname.toLowerCase();
  
  if (path.startsWith('/ai_governance') || path.startsWith('/ai_governace') || path.startsWith('/governance')) {
    return 'governance';
  }
  
  if (path.startsWith('/ai_optimization') || path.startsWith('/optimization')) {
    return 'optimization';
  }
  
  return 'portal';
};

/**
 * Returns the path associated with an AppView.
 */
export const getViewPath = (view: AppView): string => {
  switch (view) {
    case 'governance':
      return '/ai_governance';
    case 'optimization':
      return '/ai_optimization';
    case 'portal':
    default:
      return '/';
  }
};
