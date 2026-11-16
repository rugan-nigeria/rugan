import { useEffect, useLayoutEffect, useRef } from "react";
import { MotionConfig, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router";
import { preloadBlogResources } from "@/lib/blogCache";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLenisScroll } from "@/hooks/useLenisScroll";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!("scrollRestoration" in window.history)) {
      return undefined;
    }

    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    const lenis = window.lenis;

    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        if (lenis) {
          lenis.scrollTo(element, { force: true });
        } else {
          element.scrollIntoView({ block: "start" });
        }
        return;
      }
    }

    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.scrollingElement?.scrollTo?.({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, hash]);

  return null;
}

export default function RootLayout() {
  useLenisScroll();
  const { pathname } = useLocation();
  // Skip the route fade on first paint so the landing page shows instantly.
  const isFirstRender = useRef(true);
  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  useEffect(() => {
    const schedule =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback.bind(window)
        : (callback) => window.setTimeout(callback, 1200);

    const cancel =
      typeof window.cancelIdleCallback === "function"
        ? window.cancelIdleCallback.bind(window)
        : window.clearTimeout.bind(window);

    const handle = schedule(() => {
      preloadBlogResources();
    });

    return () => {
      cancel(handle);
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#111827]"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <AnalyticsTracker />
      <Navbar />
      <main id="main-content">
        <motion.div
          key={pathname}
          initial={isFirstRender.current ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
    </MotionConfig>
  );
}