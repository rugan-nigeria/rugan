import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'
import Button from '@/components/ui/Button'

export default function CTABanner({ title, subtitle, buttons = [], variant = 'cta', className = '' }) {
  const sectionClass = variant === 'teal' ? 'section-teal' : 'section-cta'

  return (
    <section className={`${sectionClass} section-padding-sm ${className}`}>
      <motion.div
        className="container-rugan text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.h2
          variants={fadeUp}
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'white', textWrap: 'balance' }}
        >
          {title}
        </motion.h2>

        {subtitle && (
          <motion.p
            variants={fadeUp}
            style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.82)', fontSize: '1rem', maxWidth: '36rem', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.65 }}
          >
            {subtitle}
          </motion.p>
        )}

        {buttons.length > 0 && (
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4"
          >
            {buttons.map((btn, i) => {
              const buttonProps = {
                key: i,
                variant: btn.variant || 'primary',
                size: 'lg',
                className: 'w-auto min-w-[190px]',
              }

              if (btn.to) {
                return (
                  <Button {...buttonProps} as={Link} to={btn.to}>
                    {btn.label}
                  </Button>
                )
              }

              if (btn.href) {
                return (
                  <Button {...buttonProps} as="a" href={btn.href}>
                    {btn.label}
                  </Button>
                )
              }

              return (
                <Button {...buttonProps} onClick={btn.onClick}>
                  {btn.label}
                </Button>
              )
            })}
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
