import { motion } from 'framer-motion'
import { fadeUp, viewportOnce } from '@/lib/motion'
import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

// Plain items animate when their parent list (a motion container) reveals.
const slideIn = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const iconPop = {
  hidden: { scale: 0, rotate: -90 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 420, damping: 16, delay: 0.12 },
  },
}

/**
 * ChecklistItem
 * variant: 'card' | 'plain'
 */
export default function ChecklistItem({
  text,
  variant = 'card',
  className,
  iconColor = 'var(--color-primary)',
  iconFill = 'none',
  iconWrapperBg,
}) {
  const isPlain = variant === 'plain'
  const icon = (
    <motion.span
      variants={isPlain ? iconPop : undefined}
      style={{
        flexShrink: 0,
        marginTop: isPlain ? 0 : '1px',
        width: '1.625rem',
        height: '1.625rem',
        borderRadius: '9999px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: iconWrapperBg || 'transparent',
      }}
    >
      <CheckCircle
        size={18}
        color={iconColor}
        fill={iconFill}
        strokeWidth={2}
      />
    </motion.span>
  )

  if (isPlain) {
    return (
      <motion.li
        variants={slideIn}
        className={cn('flex items-center gap-2.5', className)}
        style={{ fontSize: '0.875rem', color: '#374151' }}
      >
        {icon}
        <span>{text}</span>
      </motion.li>
    )
  }

  return (
    <motion.div
      variants={fadeUp}
      initial='hidden'
      whileInView='visible'
      viewport={viewportOnce}
      className={cn('flex items-start gap-3 p-4 rounded-xl bg-white', className)}
      style={{
        border: '1px solid #E5E7EB',
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
        cursor: 'default',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-primary)'
        e.currentTarget.style.boxShadow   = '0 2px 10px rgba(79,123,68,0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#E5E7EB'
        e.currentTarget.style.boxShadow   = 'none'
      }}
    >
      {icon}
      <span style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>{text}</span>
    </motion.div>
  )
}
