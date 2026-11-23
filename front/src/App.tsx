import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { AdminLayout } from './components/layout/AdminLayout';
import { screenTransition } from './components/ui/motionPresets';
import { TooltipProvider } from './components/ui/Tooltip';
import { adminNav, type AdminRoute } from './config/navigation';
import { ThemeProvider } from './config/ThemeProvider';
import { DashboardScreen } from './screens/admin/DashboardScreen/DashboardScreen';
import { GamesScreen } from './screens/admin/GamesScreen/GamesScreen';

/** Ruta inicial desde el hash (#games) para poder recargar o compartir la pantalla */
function routeFromHash(): AdminRoute {
  const hash = window.location.hash.slice(1);
  const item = adminNav.find((n) => n.id === hash && !n.disabled);
  return item?.id ?? 'dashboard';
}

function AdminApp() {
  const [route, setRoute] = useState<AdminRoute>(routeFromHash);

  useEffect(() => {
    window.history.replaceState(null, '', `#${route}`);
  }, [route]);

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <AdminLayout current={route} onNavigate={setRoute}>
      <AnimatePresence mode="wait">
        <motion.div key={route} {...screenTransition}>
          {route === 'dashboard' && <DashboardScreen onSeeAllGames={() => setRoute('games')} />}
          {route === 'games' && <GamesScreen />}
        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TooltipProvider delay={150}>
        <AdminApp />
      </TooltipProvider>
    </ThemeProvider>
  );
}
