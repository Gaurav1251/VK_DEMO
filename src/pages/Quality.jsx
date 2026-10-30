import { FlaskConical, Cog, ScanSearch, PackageCheck } from 'lucide-react';
import PageHeader from '../components/site/PageHeader';
import PartDrawing from '../components/PartDrawing';
import { CtaBanner, SectionHeading } from './Home';

const STEPS = [
  {
    icon: FlaskConical,
    title: 'Material testing',
    text: 'Every lot of brass rod and forging is checked in-house on our spectrometer for chemistry, and tested for hardness, before it reaches a machine.',
  },
  {
    icon: Cog,
    title: 'Precision machining',
    text: 'Parts are made on CNC sliding-head, turn-mill and VMC machines with proven programs and tooling — holding accuracy down to 7 microns.',
  },
  {
    icon: ScanSearch,
    title: 'In-process inspection',
    text: 'Operators and inspectors check critical dimensions on live machines, with camera-based VMS measurement for complex features.',
  },
  {
    icon: PackageCheck,
    title: 'Final check & packing',
    text: 'Optical sorting and 100% visual inspection aim for zero-ppm defects, then parts are packed for safe domestic and export shipping.',
  },
];

const GALLERY = [
  { src: '/images/factory-floor.jpg', tag: 'Shop floor', title: 'CNC turning bay', alt: 'Machinists inspecting brass parts beside CNC lathes' },
  { src: '/images/cnc-machining-centre.jpg', tag: 'Machining', title: 'Turn-mill operations', alt: 'CNC machining centre cutting a metal part held in a chuck' },
  { src: '/images/vk-shop-floor.jpg', tag: 'Production', title: 'CNC production line', alt: 'Operators running a row of CNC machines on the shop floor' },
];

const MACHINES = [
  '5-axis CNC sliding-head machines',
  'VMC — vertical machining centres',
  'CNC lathe machines',
  'Multi-axis turn-mill machines',
  'High-speed auto lathes',
  'Horizontal automatic hot forging machine',
  'Multi-axis sheet metal forming & power presses',
  'Deep hole drilling & special purpose machines',
  'Threading & milling special purpose machines',
  'Multi-function 4-in-1 index rotary machines',
  'Surface grinding & tool grinders',
  'Laser etching machine',
];

const LAB = [
  'Spectrometer for raw material chemistry',
  'Camera-based measurement system (VMS) with probe',
  'High-speed optical inspection & sorting machine',
  'Hardness testing machine',
  'Plating thickness tester',
  'Surface roughness tester',
  'Torque testing equipment',
  'Granite surface plate, height & depth gauges',
  'Vernier calipers & micrometers',
  'Qualified thread gauges — TRG, TPG, PPG',
];

const METALS = [
  {
    name: 'Brass',
    gradient: 'linear-gradient(135deg, #F6E27A 0%, #D4A72C 45%, #A87B12 100%)',
    drawing: 'turned',
    grades: ['Free cutting brass', 'Lead-free brass', 'DZR brass', 'Forging brass'],
    text: 'Our core material — easy to machine, corrosion resistant and conductive.',
  },
  {
    name: 'Copper',
    gradient: 'linear-gradient(135deg, #F4B38A 0%, #C8693A 45%, #8C3F1C 100%)',
    drawing: 'plate',
    grades: ['Copper & copper alloys', 'Tellurium copper', 'Phosphor & silicon bronze', 'Gun metal'],
    text: 'High conductivity for electrical terminals, earthing and heat transfer parts.',
  },
  {
    name: 'Steel',
    gradient: 'linear-gradient(135deg, #E5E9EF 0%, #A3ADBA 45%, #5F6B7A 100%)',
    drawing: 'shaft',
    grades: ['Mild & carbon steel', 'Chromium & nickel steel', 'Stainless 303, 304, 316', 'Low-carbon 304L, 316L'],
    text: 'Strength and wear resistance for automotive and engineering components.',
  },
];

function BulletList({ items }) {
  return (
    <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[15px] text-ink">
          <span className="mt-[7px] h-2 w-2 shrink-0 rounded-[2px] bg-accent" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function Quality() {
  return (
    <>
      <PageHeader
        title="Quality & Infrastructure"
        image="/images/precision-micro-tool.jpg"
        subtitle="ISO 9001 certified processes, in-house material testing and modern measuring instruments — so every lot matches your drawing."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Quality' }]}
      />

      <section className="section container-x">
        <SectionHeading center eyebrow="Our process" title="Quality at every step" text="From raw bar to packed carton, four checkpoints make sure only good parts leave Jamnagar." />
        <div className="relative mt-14">
          <div className="absolute left-[12%] right-[12%] top-[52px] hidden border-t-2 border-dashed border-brand/20 lg:block" aria-hidden="true" />
          <ol className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="card card-glow p-6">
                <div className="flex items-center justify-between">
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-lift">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-accent text-[11px] font-bold">
                      {i + 1}
                    </span>
                  </span>
                  <span className="text-4xl font-extrabold text-brand/[0.08]" aria-hidden="true">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-x pb-16 sm:pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          {GALLERY.map((g, i) => (
            <figure key={g.src} className={`card-glow group relative overflow-hidden rounded-2xl ${i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
              <img src={g.src} alt={g.alt} loading="lazy" className="aspect-[4/3] h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-deeper/90 via-brand-deeper/40 to-transparent px-5 pb-4 pt-12">
                <p className="text-xs font-bold uppercase tracking-wider text-accent">{g.tag}</p>
                <p className="mt-0.5 text-base font-bold text-white">{g.title}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <div className="card card-glow p-6 sm:p-8">
            <p className="eyebrow">Manufacturing</p>
            <h2 className="mt-2 text-2xl font-extrabold">Our machines</h2>
            <p className="mt-2 text-[15px] text-muted">Turning, milling, forging and pressing under one roof.</p>
            <BulletList items={MACHINES} />
          </div>
          <div className="card card-glow p-6 sm:p-8">
            <p className="eyebrow">Quality lab</p>
            <h2 className="mt-2 text-2xl font-extrabold">Measurement & testing</h2>
            <p className="mt-2 text-[15px] text-muted">World-class instruments for checking material, dimensions and finish.</p>
            <BulletList items={LAB} />
          </div>
        </div>
      </section>

      <section className="section container-x">
        <SectionHeading center eyebrow="Materials" title="Metals we work with" text="We machine a wide range of non-ferrous and ferrous metals and alloys, and supply mill certificates on request." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {METALS.map((m) => (
            <article key={m.name} className="card-glow overflow-hidden rounded-2xl border border-line bg-white">
              <div className="relative flex h-44 items-center justify-center overflow-hidden" style={{ background: m.gradient }}>
                <PartDrawing style={m.drawing} stroke="rgba(255,255,255,0.95)" dim="#fff" className="relative w-[70%] [&_g]:fill-white/10" title={`${m.name} part drawing`} />
              </div>
              <div className="p-6">
                <h3 className="mb-2 flex items-center gap-2.5 text-xl font-extrabold">
                  <span className="h-3 w-3 rounded-[3px]" style={{ background: m.gradient }} aria-hidden="true" />
                  {m.name}
                </h3>
                <p className="text-[15px] leading-relaxed text-muted">{m.text}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {m.grades.map((g) => (
                    <li key={g} className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-ink">
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
