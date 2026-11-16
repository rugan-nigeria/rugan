import { Link } from 'react-router'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { fadeUp, viewportOnce } from '@/lib/motion'
import Button from '@/components/ui/Button'
import RevealText from '@/components/motion/RevealText'
import Magnetic from '@/components/motion/Magnetic'

export default function CTABanner({ title, subtitle, buttons = [], variant = 'cta', className = '' }) {
  const sectionClass = variant === 'teal' ? 'section-teal' : 'section-cta'

  // A soft pool of light follows the cursor across the banner.
  const mouseX = useMotionValue(50)
  const mouseY = useMotionValue(50)
  const lightX = useSpring(mouseX, { stiffness: 80, damping: 20 })
  const lightY = useSpring(mouseY, { stiffness: 80, damping: 20 })
  const glow = useMotionTemplate`radial-gradient(520px circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.13), transparent 70%)`

  const handleMove = (event) => {
    if (event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    mouseX.set(((event.clientX - rect.left) / rect.width) * 100)
    mouseY.set(((event.clientY - rect.top) / rect.height) * 100)
  }

  const titleIsText = typeof title === 'string'

  return (
    <section
      className={`${sectionClass} section-padding-sm relative overflow-hidden ${className}`}
      onPointerMove={handleMove}
    >
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: glow }} />

      <motion.div
        className="container-rugan relative text-center"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12, delayChildren: titleIsText ? 0.3 : 0.05 } },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.h2
          variants={titleIsText ? undefined : fadeUp}
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'white', textWrap: 'balance' }}
        >
          {titleIsText ? <RevealText text={title} /> : title}
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
                variant: btn.variant || 'primary',
                size: 'lg',
                className: 'w-auto min-w-[190px]',
              }

              let button
              if (btn.to) {
                button = <Button {...buttonProps} as={Link} to={btn.to}>{btn.label}</Button>
              } else if (btn.href) {
                button = <Button {...buttonProps} as="a" href={btn.href}>{btn.label}</Button>
              } else {
                button = <Button {...buttonProps} onClick={btn.onClick}>{btn.label}</Button>
              }

              return <Magnetic key={i}>{button}</Magnetic>
            })}
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
