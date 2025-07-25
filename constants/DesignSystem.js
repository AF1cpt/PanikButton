// Worcester Watch Design System
// Based on Norman-Ive Fusion Principles & Advanced Color Theory

// Color Palette - Accessibility & Psychology Focused
export const COLORS = {
  // Primary Brand Colors
  primary: '#1E40AF',       // Trust blue - main brand
  primaryLight: '#3B82F6',  // Lighter blue for hover states
  primaryDark: '#1E3A8A',   // Darker blue for emphasis
  
  // Emergency Colors
  emergency: '#DC2626',     // True red - immediate attention
  emergencyLight: '#EF4444', // Lighter red - less alarming
  emergencyDark: '#B91C1C',  // Darker red - authority
  
  // Success & Safety
  success: '#059669',       // Green - safety, success
  successLight: '#10B981',  // Light green - confirmation
  warning: '#D97706',       // Orange - caution
  
  // Neutral Colors
  neutral: '#1F2937',       // Dark gray - primary text
  neutralLight: '#6B7280',  // Medium gray - secondary text
  neutralLighter: '#9CA3AF', // Light gray - tertiary text
  neutralLightest: '#F3F4F6', // Very light gray - backgrounds
  
  // Background Colors
  background: '#FFFFFF',    // Pure black - main background
  backgroundLight: '#111827', // Dark gray - card backgrounds
  surface: '#FFFFFF',       // Pure white - surface elements
  
  // Accessibility Colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Semantic Colors
  text: {
    primary: '#FFFFFF',     // White text on dark backgrounds
    secondary: '#E5E7EB',   // Light gray text
    tertiary: '#9CA3AF',    // Muted text
    inverse: '#1F2937',     // Dark text on light backgrounds
  },
  
  // Status Colors
  status: {
    active: '#DC2626',      // Red for active alerts
    resolved: '#059669',    // Green for resolved
    pending: '#D97706',     // Orange for pending
  }
};

// Typography Scale - Based on Golden Ratio & Accessibility
export const TYPOGRAPHY = {
  // Font Sizes
  xs: 12,      // Caption text
  sm: 14,      // Small body text
  base: 16,    // Body text
  lg: 18,      // Large body text
  xl: 20,      // Subtitle
  '2xl': 24,   // Title
  '3xl': 32,   // Large title
  '4xl': 48,   // Hero title
  
  // Font Weights
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  
  // Line Heights
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  
  // Letter Spacing
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
};

// Spacing System - 8pt Grid
export const SPACING = {
  xs: 4,       // 4px - minimal spacing
  sm: 8,       // 8px - small spacing
  md: 16,      // 16px - medium spacing
  lg: 24,      // 24px - large spacing
  xl: 32,      // 32px - extra large spacing
  '2xl': 48,   // 48px - hero spacing
  '3xl': 64,   // 64px - section spacing
  '4xl': 96,   // 96px - page spacing
};

// Border Radius System
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,       // Small radius
  md: 8,       // Medium radius
  lg: 12,      // Large radius
  xl: 16,      // Extra large radius
  '2xl': 24,   // Hero radius
  full: 999,   // Full circle
};

// Shadow System
export const SHADOWS = {
  sm: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
  },
};

// Component Styles
export const COMPONENTS = {
  // Button Styles
  button: {
    primary: {
      backgroundColor: COLORS.primary,
      borderRadius: BORDER_RADIUS.lg,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,
      ...SHADOWS.md,
    },
    emergency: {
      backgroundColor: COLORS.emergency,
      borderRadius: BORDER_RADIUS.full,
      paddingVertical: SPACING.lg,
      paddingHorizontal: SPACING.xl,
      ...SHADOWS.lg,
    },
    secondary: {
      backgroundColor: COLORS.backgroundLight,
      borderRadius: BORDER_RADIUS.lg,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,
      borderWidth: 1,
      borderColor: COLORS.neutralLighter,
    },
  },
  
  // Card Styles
  card: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  
  // Input Styles
  input: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.neutralLighter,
    fontSize: TYPOGRAPHY.base,
    color: COLORS.text.primary,
  },
  
  // Header Styles
  header: {
    backgroundColor: COLORS.emergency,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
};

// Layout Constants
export const LAYOUT = {
  // Screen Dimensions
  screenPadding: SPACING.lg,
  contentMaxWidth: 400,
  
  // Navigation
  tabBarHeight: 80,
  headerHeight: 60,
  
  // Panic Button
  panicButtonSize: 240,
  panicButtonGlowSize: 280,
};

// Animation Constants
export const ANIMATIONS = {
  // Timing
  fast: 150,
  normal: 300,
  slow: 500,
  
  // Easing
  easeInOut: 'ease-in-out',
  easeOut: 'ease-out',
  easeIn: 'ease-in',
};

// Accessibility
export const ACCESSIBILITY = {
  // Minimum touch targets
  minTouchTarget: 44,
  
  // Contrast ratios
  minContrastRatio: 4.5,
  
  // Font sizes for readability
  minFontSize: TYPOGRAPHY.sm,
}; 