import { ToastProvider } from './components/ui/Toasts';
import { ThemeProvider } from './config/ThemeProvider';
import { AdminDashboardScreen } from './screens/AdminDashboard/AdminDashboardScreen';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AdminDashboardScreen />
      </ToastProvider>
    </ThemeProvider>
  );
}
