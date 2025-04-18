// frontend-main/src/utils/mediaQueries.js
import { breakpoints } from './breakpoints';

export const device = {
  // Direct keys (original approach)
  xs: `(max-width: ${breakpoints.xs})`,   // < 480px
  sm: `(max-width: ${breakpoints.sm})`,   // < 768px
  md: `(max-width: ${breakpoints.md})`,   // < 992px
  lg: `(max-width: ${breakpoints.lg})`,   // < 1200px
  xl: `(max-width: ${breakpoints.xl})`,   // < 1400px
  minXs: `(min-width: ${breakpoints.xs})`, // > 480px
  minSm: `(min-width: ${breakpoints.sm})`, // > 768px

  // New helper functions (recommended for consistency)
  down: (size) => `@media (max-width: ${breakpoints[size]})`, // device.down('sm')
  up: (size) => `@media (min-width: ${breakpoints[size]})`,    // device.up('md')
};