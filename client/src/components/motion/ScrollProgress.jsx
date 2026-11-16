import { motion, useScroll, useSpring } from "framer-motion";

/** A thin orange bar along the bottom of the header that fills as the page is read. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left"
      style={{ scaleX, background: "var(--color-btn-orange)" }}
    />
  );
}
