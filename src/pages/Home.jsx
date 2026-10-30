import { Link } from 'react-router-dom';
import { ArrowRight, Award, BadgeIndianRupee, Boxes, CalendarCheck, Crosshair, FileText, Layers, ShieldCheck } from 'lucide-react';
import HeroDrawing from '../components/site/HeroDrawing';
import ProductCard from '../components/site/ProductCard';
import ProductImage from '../components/ui/ProductImage';
import CountUp from '../components/ui/CountUp';
import PhotoBackdrop from '../components/ui/PhotoBackdrop';
import { usePublicCatalog, useStore } from '../context/StoreContext';
import { INDUSTRIES } from '../lib/seed';
import { HERO_TINT } from '../lib/flags';
import { cn } from '../lib/utils';

// Numbers count up when the stats card scrolls into view; `text` items stay static.
const STATS = [
  { count: { from: 1980, to: 2006 }, label: 'Established', icon: CalendarCheck },
  { count: { to: 3000, suffix: '+' }, label: 'Product varieties', icon: Boxes },
  { count: { to: 7, suffix: 'μ', duration: 1200 }, label: 'Machining accuracy', icon: Crosshair },
  { text: 'ISO 9001', label: 'Certified', icon: Award },
];

const WHY = [
  {
    icon: BadgeIndianRupee,
    title: 'Cost-efficient pricing',
    text: 'Located in Jamnagar, India’s brass parts hub, with an in-house tool room and high-volume CNC capacity — so you get export quality at a competitive price.',
  },
  {
    icon: Layers,
    title: 'Raw material control',
    text: 'Brass rods and forgings are bought from approved mills and spectro-tested on arrival. Every lot is traceable from bar to box.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality excellence',
    text: 'ISO 9001 processes, in-process inspection and a final check on every lot, with dimensional reports and material certificates on request.',
  },
];

export function SectionHeading({ eyebrow, title, text, action, center = false }) {
  return (
    <div className={`flex flex-col gap-4 ${center ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'}`}>
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-2 text-[28px] font-extrabold leading-tight sm:text-[34px]">{title}</h2>
        {text && <p className="mt-3 text-[15px] leading-relaxed text-muted sm:text-base">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function CtaBanner() {
  return (
    <section className="container-x pb-20 sm:pb-24">
      <div className="hero-bg relative overflow-hidden rounded-2xl px-6 py-10 text-white shadow-lift sm:px-12 sm:py-14">
        <PhotoBackdrop src="/images/cnc-milling-chips.jpg" position="center 55%" />
        <svg className="pointer-events-none absolute -bottom-10 right-6 hidden h-56 opacity-20 md:block" viewBox="0 0 200 200" fill="none" stroke="#fff" strokeWidth="1.4" aria-hidden="true">
          <rect x="30" y="30" width="140" height="140" rx="6" />
          <path d="M30 70h140M70 30v140" strokeDasharray="5 5" />
          <circle cx="120" cy="120" r="30" />
          <path d="M120 80v80M80 120h80" stroke="#FB923C" />
        </svg>
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <FileText className="h-5 w-5 text-accent" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-white sm:text-[32px] sm:leading-tight">Have a drawing or a part list?</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-white/75">
              Send us your drawing, sample photo or bill of materials. Our engineers review it and send a detailed quote — usually within 24 hours.
            </p>
          </div>
          <Link to="/contact" className="btn btn-primary btn-lg shrink-0 self-start md:self-auto">
            Request a quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { settings } = useStore();
  const { products, categories, categoryById, counts } = usePublicCatalog();
  const popular = products.filter((p) => p.featured).slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="hero-bg relative overflow-hidden text-white">
        {/* CNC lathe photo, blended into the blue as a muted texture so text and drawing stay crisp */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <img
            src="/images/hero-cnc-lathe.jpg"
            alt=""
            fetchpriority="high"
            className={cn('h-full w-full object-cover object-[center_45%]', HERO_TINT && 'opacity-[0.32] mix-blend-luminosity')}
          />
          {HERO_TINT ? (
            <>
              {/* Darker behind the headline (left) and behind the drawing (right) */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,31,77,0.78)_0%,rgba(5,31,77,0.45)_45%,rgba(5,31,77,0.25)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(640px_420px_at_78%_45%,rgba(5,31,77,0.6),transparent_70%)]" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-deeper/70 to-transparent" />
            </>
          ) : (
            <>
              {/* Natural-colour photo: neutral (not blue) shade only where text and drawing sit */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,10,14,0.8)_0%,rgba(8,10,14,0.66)_38%,rgba(8,10,14,0.3)_62%,rgba(8,10,14,0.2)_100%)]" />
              <div className="absolute inset-0 hidden bg-[radial-gradient(640px_440px_at_76%_46%,rgba(8,10,14,0.72),transparent_75%)] lg:block" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,14,0.3)_0%,rgba(8,10,14,0.15)_40%,rgba(8,10,14,0.6)_100%)] lg:hidden" />
            </>
          )}
        </div>
        <div className="container-x relative grid items-center gap-10 pb-32 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pb-40 lg:pt-24">
          <div>
            <p
              className={cn(
                'fade-up inline-flex items-center gap-2 rounded-full border border-accent/40 px-3.5 py-1.5 text-xs font-bold text-[#FDBA74] sm:text-[13px]',
                HERO_TINT ? 'bg-accent/15' : 'bg-black/45 backdrop-blur-sm',
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              ISO 9001 certified · Exporting worldwide
            </p>
            <h1
              className={cn(
                'fade-up mt-6 text-[34px] font-extrabold leading-[1.1] text-white [animation-delay:0.1s] sm:text-5xl lg:text-[56px]',
                !HERO_TINT && '[text-shadow:0_2px_4px_rgba(0,0,0,0.35),0_4px_24px_rgba(0,0,0,0.55)]',
              )}
            >
              {settings.heroHeadline}
            </h1>
            <p
              className={cn(
                'fade-up mt-5 max-w-xl text-base leading-relaxed [animation-delay:0.2s] sm:text-lg',
                HERO_TINT ? 'text-white/75' : 'text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6),0_2px_14px_rgba(0,0,0,0.6)]',
              )}
            >
              {settings.heroText}
            </p>
            <div className="fade-up mt-8 flex flex-wrap gap-3 [animation-delay:0.3s]">
              <Link to="/products" className="btn btn-primary btn-lg">
                View products <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link to="/contact" className={cn('btn btn-outline-light btn-lg', !HERO_TINT && 'bg-black/35 backdrop-blur-sm')}>
                Request a quote
              </Link>
            </div>
          </div>
          <div className={cn('relative mx-auto w-full max-w-[600px]', !HERO_TINT && '[filter:drop-shadow(0_0_2px_rgba(0,0,0,0.9))_drop-shadow(0_2px_8px_rgba(0,0,0,0.6))]')}>
            <HeroDrawing />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-x relative z-10 -mt-20 lg:-mt-24">
        <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-white shadow-float lg:grid-cols-4">
          {STATS.map(({ count, text, label, icon: Icon }, i) => (
            <div
              key={label}
              className={`flex items-center gap-4 p-5 sm:p-7 ${i % 2 === 0 ? 'border-r border-line' : ''} ${i < 2 ? 'border-b border-line lg:border-b-0' : ''} ${i === 1 ? 'lg:border-r' : ''}`}
            >
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand sm:flex">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <dt className="sr-only">{label}</dt>
                <dd className="text-2xl font-extrabold text-brand sm:text-[30px]">
                  {count ? <CountUp {...count} /> : text}
                </dd>
                <dd className="text-[13px] font-medium text-muted sm:text-sm">{label}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      {/* Categories */}
      <section className="section container-x">
        <SectionHeading
          eyebrow="What we make"
          title="Product categories"
          text="Machined, forged and pressed components in brass, copper and steel — made to standard sizes or your own drawing."
          action={
            <Link to="/products" className="btn btn-outline-blue shrink-0 self-start sm:self-auto">
              All products <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/products?category=${c.id}`}
              className="card-glow group overflow-hidden rounded-2xl border border-line bg-white"
            >
              <ProductImage item={c} rounded="rounded-none" className="aspect-[4/3]" />
              <div className="flex items-center justify-between gap-2 p-4 sm:p-5">
                <div className="min-w-0">
                  <h3 className="truncate text-[15px] font-bold sm:text-base">{c.name}</h3>
                  <p className="mt-0.5 text-[13px] text-muted">
                    {counts[c.id] || 0} {(counts[c.id] || 0) === 1 ? 'product' : 'products'}
                  </p>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand transition group-hover:bg-accent group-hover:text-white">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
          <Link
            to="/contact"
            className="card-glow drawing-bg flex flex-col justify-between rounded-2xl border border-dashed border-brand/30 p-5 sm:p-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-accent shadow-card">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="mt-6 block text-base font-bold text-ink">Custom parts</span>
              <span className="mt-1 block text-[13px] leading-relaxed text-muted">Made to your drawing or sample, from 500 pcs.</span>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-accent">
                Send a drawing <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </span>
          </Link>
        </div>
      </section>

      {/* Popular products */}
      <section className="section bg-soft">
        <div className="container-x">
          <SectionHeading
            eyebrow="Most requested"
            title="Popular products"
            text="The parts our customers order most — add them to My Enquiry and get one quote for everything."
            action={
              <Link to="/products" className="btn btn-outline-blue shrink-0 self-start sm:self-auto">
                View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          {popular.length ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {popular.map((p) => (
                <ProductCard key={p.id} product={p} category={categoryById[p.categoryId]} />
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
              No popular products yet. <Link to="/products" className="font-semibold text-brand hover:underline">Browse the full range</Link>.
            </p>
          )}
        </div>
      </section>

      {/* Why choose us */}
      <section className="section container-x">
        <SectionHeading center eyebrow="Why VK India" title="Why choose us" text="Buyers in India and abroad trust us for consistent parts, honest prices and on-time delivery." />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {WHY.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="card card-glow overflow-hidden p-7">
              <span className="absolute right-5 top-4 text-5xl font-extrabold text-brand/[0.06]" aria-hidden="true">
                0{i + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-tint text-accent">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industries + factory */}
      <section className="pb-20 sm:pb-24">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <img src="/images/factory-floor.jpg" alt="CNC turning machines on the VK India factory floor in Jamnagar" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lift" loading="lazy" />
            <div className="absolute -bottom-5 left-5 right-5 flex items-center gap-4 rounded-xl border border-line bg-white p-4 shadow-float sm:left-auto sm:right-6 sm:w-72">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                <Crosshair className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="text-sm leading-snug">
                <span className="block font-bold text-ink">In-house CNC shop</span>
                <span className="text-muted">Turning, milling &amp; sliding-head</span>
              </p>
            </div>
          </div>
          <div className="pt-6 lg:pt-0">
            <p className="eyebrow">Industries we serve</p>
            <h2 className="mt-2 text-[28px] font-extrabold leading-tight sm:text-[34px]">Parts that power, plumb and move the world</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted sm:text-base">
              From switchgear panels in Gujarat to plumbing systems in the UK and gas equipment in the Gulf, our components work inside
              products across these industries.
            </p>
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {INDUSTRIES.map((name) => (
                <li key={name} className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
