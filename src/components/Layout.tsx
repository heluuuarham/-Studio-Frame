import { type ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FreeShippingBanner from './FreeShippingBanner';
import ToastStack from './ToastStack';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <FreeShippingBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ToastStack />
    </div>
  );
}
