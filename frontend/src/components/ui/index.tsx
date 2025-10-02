/**
 * UK Commission Admin Panel - UI Components Index
 * Центральный экспорт всех UI компонентов
 */

// Utility functions
export { cn } from '../../utils/cn';

// Base components
export { Button } from './Button';
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from './Card';
export { DataTable } from './DataTable';

// Animated components
export { AnimatedButton } from './AnimatedButton';
export {
  AnimatedCard,
  CardHeader as AnimatedCardHeader,
  CardTitle as AnimatedCardTitle,
  CardDescription as AnimatedCardDescription,
  CardContent as AnimatedCardContent,
  CardFooter as AnimatedCardFooter
} from './AnimatedCard';

// Modal and overlay components
export {
  AnimatedModal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from './AnimatedModal';

// Form components
export { AnimatedInput, AnimatedTextarea } from './AnimatedForm';

// Notification components
export { AnimatedToast, AnimatedNotification } from './AnimatedToast';

// Navigation components
export {
  AnimatedNavigation,
  MobileNavigation
} from './AnimatedNavigation';

// Data display components
export {
  AnimatedDataTable,
  tableActions
} from './AnimatedDataTable';

// Chart and dashboard components
export {
  AnimatedStatsCard,
  AnimatedProgressBar,
  AnimatedCircularProgress,
  AnimatedMetricTrend,
  AnimatedDashboardGrid
} from './AnimatedCharts';

// Dropdown and select components
export {
  AnimatedDropdown,
  DropdownItem,
  DropdownSeparator,
  AnimatedSelect,
  AnimatedMultiSelect
} from './AnimatedDropdown';

// Control components
export {
  AnimatedToggle,
  AnimatedSlider,
  AnimatedRadioGroup,
  AnimatedCheckbox
} from './AnimatedControls';

// Additional utility components
export { LoadingSpinner } from './LoadingSpinner';
export { ErrorBoundary } from './ErrorBoundary';
export { NotificationBell } from './NotificationBell';
export { LiveActivityFeed } from './LiveActivityFeed';
