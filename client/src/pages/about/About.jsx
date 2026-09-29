import { motion } from 'framer-motion'
import {
  FiArrowUpRight,
  FiCompass,
  FiHeart,
  FiLayers,
  FiShield,
  FiUsers,
} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { FadeIn, Float, StaggerContainer, StaggerItem } from '../../components/motion/Motion'

const principles = [
  {
    icon: FiCompass,
    title: 'Clarity over noise',
    copy: 'Useful details, honest context, and a calmer way to find the right next step.',
    tint: 'bg-[#e5f3eb] text-[#16734f]',
  },
  {
    icon: FiUsers,
    title: 'People in the middle',
    copy: 'We design for the humans behind every application, interview, and new beginning.',
    tint: 'bg-[#fff0d9] text-[#b76a17]',
  },
  {
    icon: FiLayers,
    title: 'Room to grow',
    copy: 'A better match is more than a job title. It is a place to learn, contribute, and belong.',
    tint: 'bg-[#e9e6f8] text-[#5e4fa2]',
  },
]

const milestones = [
  ['01', 'A simpler beginning', 'HireHub started with one question: why does finding good work feel so difficult?'],
  ['02', 'A wider circle', 'Job seekers and ambitious teams came together around a more thoughtful experience.'],
  ['03', 'The work continues', 'We keep listening, improving, and making space for the opportunities ahead.'],
]

const About = () => {
  return (
    <main className="overflow-hidden bg-[#f8f7f3] text-[#19221d]">

      <section className="relative isolate border-b border-[#dfe5df] bg-[#f1f5ed]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_88%_8%,rgba(247,224,185,0.75),transparent_27%),radial-gradient(circle_at_8%_45%,rgba(216,235,218,0.85),transparent_30%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10 lg:pb-28 lg:pt-24">
          <FadeIn className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#238457]"><span className="h-2 w-2 rounded-full bg-[#f0b866]" /> About HireHub</p>
            <h1 className="mt-6 font-serif text-5xl leading-[0.98] tracking-[-0.02em] sm:text-7xl">Work should feel <span className="italic text-[#1f7a50]">human.</span></h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-[#53615a] sm:text-lg">HireHub brings good people and meaningful opportunities closer together. We are building a job search that feels clearer, kinder, and more like a conversation.</p>
            <Link to="/register" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-[#1f7a50] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#185e3e] focus:outline-none focus:ring-2 focus:ring-[#1f7a50] focus:ring-offset-2">Find your next chapter <FiArrowUpRight size={17} /></Link>
          </FadeIn>

          <div className="relative mx-auto w-full max-w-xl lg:mr-0">
            <motion.div className="relative aspect-[1.08] overflow-hidden rounded-[2rem] bg-[#c5d8c9] shadow-[18px_20px_0_#dbe8dc]" initial={{ opacity: 0, scale: 0.94, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85" alt="Friends sharing a relaxed conversation outdoors" className="h-full w-full object-cover mix-blend-multiply opacity-90" />
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(31,122,80,0.18),transparent_48%,rgba(255,205,133,0.28))]" />
            </motion.div>
            <Float className="absolute -bottom-7 -left-4 w-[min(84%,285px)] sm:-left-8">
              <div className="rounded-2xl border border-white/80 bg-white/95 p-5 shadow-[0_18px_35px_rgba(25,54,38,0.15)] backdrop-blur">
                <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f3eb] text-[#1f7a50]"><FiHeart size={19} /></span><div><p className="text-xs font-bold uppercase tracking-wider text-[#839088]">Our north star</p><p className="mt-1 font-serif text-xl">Better work, together.</p></div></div>
              </div>
            </Float>
          </div>
        </div>
      </section>

      <section className="border-b border-[#dfe5df] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-3 sm:px-8 lg:px-10 lg:py-14">
          {[['34k+', 'roles to explore'], ['12k+', 'people moving forward'], ['1', 'steadfast mission']].map(([number, label]) => <FadeIn key={label} className="border-l-2 border-[#f0b866] pl-5"><p className="font-serif text-4xl text-[#1f7a50]">{number}</p><p className="mt-2 text-sm font-semibold text-[#69766e]">{label}</p></FadeIn>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <FadeIn className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#238457]">What guides us</p><h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">A little more care changes the whole search.</h2></FadeIn>
        <StaggerContainer className="mt-12 grid gap-4 md:grid-cols-3">
          {principles.map(({ icon: Icon, title, copy, tint }) => <StaggerItem key={title} className="rounded-2xl border border-[#e2e7e1] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#b8d4c2] hover:shadow-[0_15px_30px_rgba(46,74,57,0.08)]"><span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tint}`}><Icon size={22} /></span><h3 className="mt-8 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[#69766e]">{copy}</p></StaggerItem>)}
        </StaggerContainer>
      </section>

      <section className="border-y border-[#dfe5df] bg-[#e8f0e8]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:px-10 lg:py-24"><FadeIn><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f7a50] text-white"><FiShield size={23} /></span><h2 className="mt-6 max-w-md font-serif text-4xl leading-tight sm:text-5xl">Built for the <span className="italic text-[#238457]">long view.</span></h2></FadeIn><StaggerContainer className="grid gap-8 sm:grid-cols-3">{milestones.map(([number, title, copy]) => <StaggerItem key={number} className="border-t border-[#cfd9d1] pt-4"><span className="text-xs font-bold text-[#238457]">{number}</span><h3 className="mt-8 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[#69766e]">{copy}</p></StaggerItem>)}</StaggerContainer></div>
      </section>

      <section className="bg-[#1f7a50] px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-20"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#bce2c8]">There is room for you here</p><h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight sm:text-6xl">Let&apos;s make the next move count.</h2></div><Link to="/register" className="inline-flex items-center gap-3 rounded-xl bg-[#f7ca82] px-5 py-3 text-sm font-bold text-[#213128] transition hover:bg-[#ffda9c] focus:outline-none focus:ring-2 focus:ring-[#f7ca82] focus:ring-offset-2 focus:ring-offset-[#1f7a50]">Create your profile <FiArrowUpRight /></Link></div></section>
    </main>
  )
}

export default About;
