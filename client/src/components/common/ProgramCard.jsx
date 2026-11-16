import { motion } from "framer-motion";
import { viewportOnce } from "@/lib/motion";

const rise = {
  hidden: { opacity: 0, y: 48 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay },
  }),
};
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import OptimizedImage from "@/components/common/OptimizedImage";

/**
 * ProgramCard
 * variant:
 *   'plain'   — image top, title, description, Learn More link (Programmes page)
 *   'overlay' — image with dark gradient overlay, title + description on top (Homepage)
 *
 * Props:
 *   image       — image URL
 *   title       — programme name
 *   description — short description
 *   to          — React Router link path
 *   variant     — 'plain' | 'overlay'
 */
export default function ProgramCard({
  image,
  title,
  description,
  to,
  variant = "plain",
  className,
  delay = 0,
}) {
  if (variant === "overlay") {
    return (
      <motion.div
        variants={rise}
        custom={delay}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <Link
          to={to}
          className={cn(
            "relative block rounded-2xl overflow-hidden group aspect-[4/3] transition-shadow duration-500 hover:shadow-[0_18px_40px_-12px_rgba(16,24,40,0.45)]",
            className,
          )}
        >
          <OptimizedImage src={image} alt={title} aspectRatio="4/3" className="zoom-media" />
          {/* Gradient overlay — deepens slightly on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#183014]/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <span
            aria-hidden="true"
            className="absolute right-4 top-4 flex h-10 w-10 -translate-y-2 scale-75 items-center justify-center rounded-full bg-white text-[#4F7B44] opacity-0 shadow-lg transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:scale-100 group-focus-visible:opacity-100"
          >
            <ArrowUpRight size={18} />
          </span>

          <div className="absolute bottom-0 left-0 right-0 p-5 text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5">
            <h3 className="text-heading-sm font-semibold text-white">{title}</h3>
            {description && (
              <p className="text-white/80 text-body-sm mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className={cn("card-hover flex flex-col h-full", className)}>
      <div className="zoom-media aspect-[16/10] overflow-hidden">
        <OptimizedImage src={image} alt={title} aspectRatio="4/3" />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 
        className="text-heading-md font-semibold text-neutral-900 mb-2" 
        >
          {title}
        </h3>
        {description && (
          <p className="text-body-md text-neutral-500 mb-4 flex-1"
            style={{ color: "#474B52" }}
          >
            {description}
          </p>
        )}
        <Link
          to={to}
          className="group/link inline-flex items-center gap-1.5 font-semibold text-sm hover:gap-3 transition-all duration-300"
          style={{ color: "var(--color-primary)" }}
        >
          Learn More <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
