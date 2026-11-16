import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];
const CURTAIN_EASE = [0.76, 0, 0.24, 1];

/**
 * RevealImage — a brand-green curtain wipes away to uncover the photo,
 * which settles from a slight zoom. While scrolling, the photo drifts
 * gently inside its frame for depth.
 *
 * `className` styles the frame (size, radius, border, shadow).
 * `from` is the edge the curtain retreats to: "top" | "bottom" | "left" | "right".
 */
export default function RevealImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  from = "top",
  parallax = true,
}) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  const horizontal = from === "left" || from === "right";
  const viewport = { once: true, amount: 0.25 };

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <motion.div
        className="absolute inset-x-0 -inset-y-[6%]"
        style={{ y: parallax && !reduceMotion ? drift : 0 }}
      >
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover ${imgClassName}`}
          initial={{ scale: 1.25 }}
          whileInView={{ scale: 1 }}
          viewport={viewport}
          transition={{ duration: 1.6, ease: EASE, delay: 0.15 }}
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-[1]"
        style={{ background: "var(--color-primary)", transformOrigin: from }}
        initial={horizontal ? { scaleX: 1 } : { scaleY: 1 }}
        whileInView={horizontal ? { scaleX: 0 } : { scaleY: 0 }}
        viewport={viewport}
        transition={{ duration: 1.1, ease: CURTAIN_EASE, delay: 0.1 }}
      />
    </motion.div>
  );
}
