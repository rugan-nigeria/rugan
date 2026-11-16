import { motion } from 'framer-motion'
import { fadeUp, viewportOnce } from '@/lib/motion'
import RevealText from '@/components/motion/RevealText'

export default function SectionHeader({ title, subtitle, align = 'center', theme = 'dark', className = '' }) {
  const isLight   = theme === 'light'
  const textAlign = align === 'left' ? 'left' : 'center'
  const titleIsText = typeof title === 'string'

  return (
    <motion.div
      className={className}
      style={{ textAlign, marginBottom: 'clamp(2rem, 6vw, 3rem)' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1, delayChildren: titleIsText ? 0.25 : 0.05 } },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <motion.h2
        variants={titleIsText ? undefined : fadeUp}
        className="section-title"
        style={{ color: isLight ? 'white' : '#111827', textAlign }}
      >
        {titleIsText ? <RevealText text={title} /> : title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className="section-subtitle"
          style={{
            color: isLight ? 'rgba(255,255,255,0.82)' : undefined,
            textAlign,
            marginLeft: align === 'left' ? 0 : undefined,
            marginRight: align === 'left' ? 0 : undefined,
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}
