/**
 * Lightweight client-side router matching pathways to views.
 */

export type AppView =
  | 'portal'
  | 'governance'
  | 'optimization'
  | 'patterns'
  | 'agentic'
  | 'debug'
  | 'quantization';

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

  if (path.startsWith('/ai_patterns') || path.startsWith('/patterns') || path.startsWith('/mini_patterns')) {
    return 'patterns';
  }

  if (path.startsWith('/agentic_debug') || path.startsWith('/debug')) {
    return 'debug';
  }

  if (path.startsWith('/agentic_types') || path.startsWith('/agentic')) {
    return 'agentic';
  }

  if (
    path.startsWith('/ai_quantization') ||
    path.startsWith('/quantization') ||
    path.startsWith('/quant')
  ) {
    return 'quantization';
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
    case 'patterns':
      return '/ai_patterns';
    case 'agentic':
      return '/agentic_types';
    case 'debug':
      return '/agentic_debug';
    case 'quantization':
      return '/ai_quantization';
    case 'portal':
    default:
      return '/';
  }
};
