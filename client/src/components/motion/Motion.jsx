import { motion, useReducedMotion } from 'framer-motion'

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export const FadeIn = ({ children, className = '', ...props }) => (
  <motion.div className={className} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} {...props}>
    {children}
  </motion.div>
)

export const StaggerContainer = ({ children, className = '', ...props }) => (
  <motion.div className={className} variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} {...props}>
    {children}
  </motion.div>
)

export const StaggerItem = ({ children, className = '', ...props }) => (
  <motion.div className={className} variants={reveal} {...props}>
    {children}
  </motion.div>
)

export const Float = ({ children, className = '', ...props }) => (
  <FloatMotion className={className} {...props}>{children}</FloatMotion>
)

const FloatMotion = ({ children, className, ...props }) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      animate={shouldReduceMotion ? { y: 0 } : { y: [0, -10] }}
      transition={shouldReduceMotion ? { duration: 0 } : {
        y: {
          duration: 2.6,
          ease: [0.42, 0, 0.58, 1],
          repeat: Infinity,
          repeatType: 'mirror',
        },
      }}
      style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}