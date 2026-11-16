import { Link } from "react-router";
import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/motion";
import {
  Facebook,
  Youtube,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";

const QUICK_LINKS = [
  { label: "About Us", to: "/about" },
  { label: "Our Impact", to: "/impact" },
  { label: "Our Team", to: "/team" },
  { label: "Blog", to: "/blog" },
  { label: "FAQ", to: "/volunteers#faq" },
];

const PROGRAMS = [
  {
    label: "RUGAN IDGC School Tours",
    to: "/programmes/rugan-idgc-school-tours",
  },
  {
    label: "RUGAN Healthy Period Project",
    to: "/programmes/rugan-healthy-period-project",
  },
  { label: "The RISE Project", to: "/programmes/the-rise-project" },
  {
    label: "Excellence Award Project",
    to: "/programmes/excellence-award-project",
  },
  {
    label: "Rural to Global Programme",
    to: "/programmes/rural-to-global-programme",
  },
];

const SOCIALS = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/share/1E1x2wHhog/?mibextid=wwXIfr",
    label: "Facebook",
  },
  {
    icon: Youtube,
    href: "https://www.youtube.com/@therugannigeria",
    label: "YouTube",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/theruralgirladvancementnetwork/",
    label: "Instagram",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/company/theruralgirlchildadvancementnetwork/",
    label: "LinkedIn",
  },
];

const EASE = [0.16, 1, 0.3, 1];

const columns = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } },
};

const linkList = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const linkItem = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

const headingClass =
  "mb-4 text-sm font-semibold uppercase tracking-wide text-white";
const linkClass =
  "footer-link link-underline text-sm text-white/70 transition-colors duration-200 hover:text-white";

function WhatsAppIcon({ size = 15 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      style={{ flexShrink: 0 }}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function LinkColumn({ title, label, links, className }) {
  return (
    <motion.div variants={fadeUp} className={className}>
      <h2 className={headingClass}>{title}</h2>
      <nav aria-label={label}>
        <motion.ul className="flex flex-col gap-2.5" variants={linkList}>
          {links.map((link) => (
            <motion.li key={link.to} variants={linkItem}>
              <Link to={link.to} className={linkClass}>
                {link.label}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </nav>
    </motion.div>
  );
}

export default function Footer() {
  return (
    <footer className="section-footer relative overflow-hidden">
      {/* Orange rule that draws across the top edge as the footer arrives */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] origin-left"
        style={{
          background:
            "linear-gradient(90deg, var(--color-btn-orange), rgba(214,103,15,0.15))",
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
      />

      <div className="container-rugan py-14 lg:py-16">
        <motion.div
          className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-12 md:gap-10"
          variants={columns}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeUp} className="col-span-2 md:col-span-4">
            <Link
              to="/"
              className="mb-4 inline-flex items-center gap-2"
              aria-label="RUGAN home"
            >
              <img
                src="/icons/rugan-logo.jpg"
                alt=""
                className="h-10 w-auto"
                style={{ borderRadius: "9px" }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <span className="text-lg font-bold tracking-tight text-white">
                RUGAN
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-[1.65] text-white/70">
              Empowering girl-children through education, mentorship, and
              advocacy to build a more equitable future for all.
            </p>
          </motion.div>

          <LinkColumn
            title="Quick Links"
            label="Footer quick links"
            links={QUICK_LINKS}
            className="col-span-1 md:col-span-2"
          />

          <LinkColumn
            title="Programmes"
            label="Footer programmes"
            links={PROGRAMS}
            className="col-span-1 md:col-span-3"
          />

          <motion.div variants={fadeUp} className="col-span-2 md:col-span-3">
            <h2 className={headingClass}>Contact Us</h2>
            <ul className="mb-6 flex flex-col gap-3">
              <li>
                <a
                  href="mailto:info@rugan.org"
                  className="group/contact inline-flex items-center gap-2.5 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <Mail
                    size={15}
                    className="shrink-0 text-[#9CC890] transition-transform duration-300 group-hover/contact:-rotate-12"
                    aria-hidden="true"
                  />
                  <span className="link-underline">info@rugan.org</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/2348143158700"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/contact inline-flex items-center gap-2.5 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <span className="text-[#9CC890] transition-transform duration-300 group-hover/contact:-rotate-12">
                    <WhatsAppIcon size={15} />
                  </span>
                  <span className="link-underline">+234 814 315 8700</span>
                </a>
              </li>
            </ul>

            <ul className="flex items-center gap-2" aria-label="Social profiles">
              {SOCIALS.map(({ icon: Icon, href, label }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 18,
                    delay: 0.5 + i * 0.07,
                  }}
                >
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={label}
                    className="social-chip"
                  >
                    <Icon size={15} />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      <div className="border-t border-white/[0.08]">
        <div className="container-rugan flex flex-col items-center justify-between gap-4 py-5 text-xs text-white/55 sm:flex-row">
          <p className="text-white/55">
            &copy; {new Date().getFullYear()} RUGAN. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            <Link
              to="/privacy"
              className="link-underline transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="link-underline transition-colors hover:text-white"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
