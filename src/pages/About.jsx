import { Leaf, Globe2, HandCoins, Handshake, Scale, ShieldCheck, Users } from 'lucide-react';
import PageHeader from '../components/site/PageHeader';
import CountUp from '../components/ui/CountUp';
import { CtaBanner, SectionHeading } from './Home';

const PRINCIPLES = [
  { icon: Scale, title: 'Lawful conduct', text: 'We follow every law and regulation that applies to our business, in India and in the markets we export to.' },
  { icon: Handshake, title: 'Ethical business', text: 'We deal fairly and honestly with customers, vendors and every other partner we work with.' },
  { icon: Users, title: 'People first', text: 'We respect the rights of our workers and have zero tolerance for child or forced labour.' },
  { icon: Leaf, title: 'Environment & safety', text: 'We protect the environment and the safety of our employees, contractors and visitors.' },
  { icon: Globe2, title: 'International standards', text: 'Our work is performed to recognised international quality standards, with ISO 9001 processes.' },
  { icon: HandCoins, title: 'Anti-corruption', text: 'We avoid improper practices of any kind and comply with anti-corruption laws in India and abroad.' },
];

export default function About() {
  return (
    <>
      <PageHeader
        title="About VK India"
        image="/images/factory-floor.jpg"
        imagePosition="center 35%"
        subtitle="A Jamnagar manufacturer of precision machined components, hot forged parts and assemblies — since 2006."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'About Us' }]}
      />

      <section className="section container-x grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div data-reveal="left">
          <p className="eyebrow">Our story</p>
          <h2 className="mt-2 text-[28px] font-extrabold leading-tight sm:text-[34px]">Built on precision, trusted for consistency</h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted sm:text-base">
            <p>
              VK India Incorporation was founded in 2006 in Jamnagar, Gujarat — the heart of India’s brass parts industry. We manufacture
              cost-effective, high-precision machined components, hot forged parts and complete assemblies for customers in the energy,
              electrical, automobile, locomotive, plumbing and oil &amp; gas industries.
            </p>
            <p>
              Today we offer more than 3,000 product varieties in brass, copper, steel and their alloys — from neutral links and terminal
              blocks to PPR inserts, gas valve bodies and custom CNC turned parts made to our customers’ drawings.
            </p>
            <p>
              Our customers put their name on the products we make. That is why we focus on consistent quality and timely delivery on every
              order, so we protect their reputation as carefully as our own.
            </p>
          </div>
          <div data-reveal="zoom" className="mt-8 overflow-hidden rounded-2xl">
            <img src="/images/factory-floor.jpg" alt="Machinists inspecting brass parts beside CNC lathes on the VK India shop floor" className="aspect-[16/9] w-full object-cover" loading="lazy" />
          </div>
        </div>

        <aside data-reveal="right" className="lg:pt-10">
          <div className="hero-bg relative overflow-hidden rounded-2xl p-7 text-white shadow-lift sm:p-9 lg:sticky lg:top-28">
            <div className="relative">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <ShieldCheck className="h-6 w-6 text-accent" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-2xl font-extrabold text-white">Our commitment</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/75">
                To deliver parts that are right the first time — made responsibly, with care for our people and the environment, and backed
                by an ISO 9001 quality system.
              </p>
              <dl className="mt-8 grid grid-cols-2 gap-4">
                {[
                  [{ from: 1980, to: 2006 }, 'Year founded'],
                  [{ to: 3000, suffix: '+' }, 'Product varieties'],
                  [{ to: 7, suffix: 'μ', duration: 1200 }, 'Machining accuracy'],
                  ['ISO 9001', 'Certified processes'],
                ].map(([count, label]) => (
                  <div key={label} className="rounded-xl border border-white/15 bg-white/5 p-4">
                    <dt className="sr-only">{label}</dt>
                    <dd className="text-2xl font-extrabold text-white">
                      {typeof count === 'string' ? count : <CountUp {...count} />}
                    </dd>
                    <dd className="mt-0.5 text-xs font-medium text-white/65">{label}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 flex items-start gap-3 rounded-xl bg-white/10 p-4 text-sm text-white/85">
                <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                We are committed to protecting the environment and the safety of our employees, contractors and visitors.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section className="section bg-soft">
        <div className="container-x">
          <SectionHeading center eyebrow="How we work" title="Business principles" text="The commitments that guide every order, every supplier and every person at VK India." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map(({ icon: Icon, title, text }) => (
              <div key={title} data-reveal className="card card-glow p-6 sm:p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-tint text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-20 sm:pt-24">
        <CtaBanner />
      </div>
    </>
  );
}
