import { useRef } from "react";
import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { fadeUp, fadeIn } from "@/lib/motion";
import RevealText from "@/components/motion/RevealText";

export default function PageHeroBanner({
  title,
  subtitle,
  backgroundImage,
  backLink,
  breadcrumbs = [],
  children,
  centerText = false,
  darkOverlay = false,
  className = "",
  imagePriority = true,
}) {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // As the hero scrolls away, the photo sinks slower than the page and the
  // copy lifts and fades, giving the banner a sense of depth.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const titleIsText = typeof title === "string";

  return (
    <section
      ref={sectionRef}
      className={`page-hero relative overflow-hidden ${className}`}
      style={!backgroundImage ? { backgroundColor: "#17311a" } : undefined}
    >
      {backgroundImage ? (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ y: reduceMotion ? 0 : imageY }}
        >
          <motion.img
            src={backgroundImage}
            alt=""
            className="h-full w-full object-cover"
            loading={imagePriority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={imagePriority ? "high" : "auto"}
            initial={{ scale: 1.18 }}
            animate={{ scale: 1.04 }}
            transition={{ duration: 2.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      ) : null}

      <div
        className="page-hero-overlay"
        style={darkOverlay ? { backgroundColor: "rgba(10, 25, 10, 0.84)" } : undefined}
      />

      <motion.div
        className="page-hero-content container-rugan relative z-10"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.12,
              // let the word-by-word title land before the copy follows
              delayChildren: titleIsText ? 0.45 : 0.05,
            },
          },
        }}
        initial="hidden"
        animate="visible"
        style={
          reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }
        }
      >
        {backLink ? (
          <motion.div variants={fadeIn}>
            <Link
              to={backLink.to}
              className="group mb-4 inline-flex items-center gap-1 text-sm text-white/75 transition-colors hover:text-white"
            >
              <ChevronLeft
                size={16}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              {backLink.label}
            </Link>
          </motion.div>
        ) : null}

        <motion.h1
          variants={titleIsText ? undefined : fadeUp}
          style={{
            fontSize: "clamp(1.625rem, 7vw, 2.5rem)",
            fontWeight: 900,
            color: "white",
            maxWidth: "48rem",
            textWrap: "balance",
            lineHeight: 1.2,
            textAlign: centerText ? "center" : "left",
            margin: centerText ? "0 auto" : undefined,
          }}
        >
          {titleIsText ? (
            <RevealText text={title} trigger="mount" delay={0.15} />
          ) : (
            title
          )}
        </motion.h1>

        {subtitle ? (
          <motion.p
            variants={fadeUp}
            style={{
              marginTop: "0.75rem",
              color: "rgba(255,255,255,0.82)",
              fontSize: "clamp(0.9375rem, 4vw, 1rem)",
              maxWidth: "40rem",
              lineHeight: 1.65,
              textAlign: centerText ? "center" : "left",
              marginLeft: centerText ? "auto" : undefined,
              marginRight: centerText ? "auto" : undefined,
            }}
          >
            {subtitle}
          </motion.p>
        ) : null}

        {children ? (
          <motion.div variants={fadeUp} style={{ marginTop: "1.25rem" }}>
            {children}
          </motion.div>
        ) : null}
      </motion.div>
    </section>
  );
}
