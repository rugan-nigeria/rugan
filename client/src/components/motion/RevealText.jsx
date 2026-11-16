import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

const wordVariants = {
  hidden: { y: "110%", rotate: 4 },
  visible: {
    y: "0%",
    rotate: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

/**
 * RevealText — masked, word-by-word text reveal.
 *
 * Each word slides up from behind a clipping mask, staggered. Screen readers
 * get the plain sentence; the animated copy is aria-hidden.
 *
 * Props:
 *   text     — a plain string (wraps naturally)
 *   lines    — array of strings rendered as forced lines (alternative to text)
 *   trigger  — "inView" (default) or "mount"
 *   delay    — seconds before the first word moves
 *   stagger  — seconds between words
 */
export default function RevealText({
  text,
  lines,
  as = "span",
  className,
  style,
  delay = 0,
  stagger = 0.055,
  trigger = "inView",
}) {
  const Tag = motion[as] ?? motion.span;
  const rows = lines ?? [String(text ?? "")];
  const label = rows.join(" ");

  const triggerProps =
    trigger === "mount"
      ? { initial: "hidden", animate: "visible" }
      : {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true, amount: 0.6 },
        };

  return (
    <Tag
      className={className}
      style={style}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
      {...triggerProps}
    >
      <span className="sr-only">{label}</span>
      {rows.map((row, r) => {
        const words = row.split(" ").filter(Boolean);
        return (
          <span
            key={r}
            aria-hidden="true"
            style={{ display: lines ? "block" : "inline" }}
          >
            {words.map((word, i) => (
              <span key={i}>
                <span
                  style={{
                    display: "inline-block",
                    overflow: "hidden",
                    verticalAlign: "top",
                    paddingBottom: "0.14em",
                    marginBottom: "-0.14em",
                  }}
                >
                  <motion.span
                    variants={wordVariants}
                    style={{ display: "inline-block", transformOrigin: "0% 100%" }}
                  >
                    {word}
                  </motion.span>
                </span>
                {i < words.length - 1 ? " " : null}
              </span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
