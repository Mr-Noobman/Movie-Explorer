import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Header from './Header';

const Layout = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-950' : 'bg-gray-50'
    }`}>
      <Header />
      <main className="relative">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;