const img = (name) => `/images/${name}.jpg`;

export const DEFAULT_SETTINGS = {
  heroHeadline: 'Precision brass components, machined in Jamnagar since 2006',
  heroText:
    'Neutral links, terminal blocks, plumbing fittings, brass inserts and CNC turned parts — made to your drawing, inspected to microns and shipped to switchgear, plumbing and automotive makers worldwide.',
  phone1: '+91 7573 001105',
  phone2: '+91 7878 788181',
  salesEmail: 'sales@vkindia.co.in',
  generalEmail: 'info@vkindia.co.in',
  address: '#28, GIDC II, Dared, Jamnagar 361004, Gujarat, India',
  whatsapp: '917573001105',
  hours: '8:30 AM – 6:00 PM (Friday holiday)',
  // Printed on bills and receipts
  companyName: 'VK India Incorporation',
  gstin: '',
  bankName: '',
  bankAccount: '',
  bankIfsc: '',
  upiId: '',
  billTerms: 'Goods once sold will not be taken back.\nInterest @ 18% p.a. will be charged on payments delayed beyond 30 days.\nSubject to Jamnagar jurisdiction.',
};

// Rate per piece (₹), used to fill in new orders. Admin only.
export const DEFAULT_PRICES = {
  'neutral-links-earth-bars': 38,
  'electrical-socket-pins': 2.4,
  'special-cable-glands': 46,
  'terminal-blocks': 14,
  'clamps-wiring-accessories': 1.8,
  'sheet-metal-pressed-parts': 3.2,
  'tees-elbows': 62,
  'brass-nozzles': 18,
  'water-connector-flange': 85,
  'brass-union': 74,
  'brass-ppr-inserts': 9.5,
  'high-precision-steel-parts': 12,
  'brass-spool-shaft': 28,
  'gas-valve-bodies': 145,
  'gas-nozzle-fittings': 4.5,
  'brass-threaded-inserts': 1.6,
  'high-precision-machined-parts': 35,
  'copper-parts': 22,
  'cnc-turned-parts': 8.5,
  'brass-hex-nuts': 0.9,
  'brass-screws-bolts': 1.2,
};

export const DEFAULT_CATEGORIES = [
  { id: 'electricals', name: 'Electricals', image: img('cat-neutral-links'), drawing: 'neutral-link' },
  { id: 'plumbing-sanitary', name: 'Plumbing & Sanitary', image: img('cat-plumbing-fittings'), drawing: 'fitting' },
  { id: 'automotive', name: 'Automotive', image: '', drawing: 'shaft' },
  { id: 'oil-gas', name: 'Oil & Gas', image: '', drawing: 'valve' },
  { id: 'plastic-moulding', name: 'Plastic Moulding', image: img('cat-brass-inserts'), drawing: 'insert' },
  { id: 'general-engineering', name: 'General Engineering', image: img('cat-cnc-turned-parts'), drawing: 'turned' },
  { id: 'fasteners', name: 'Fasteners', image: img('cat-fasteners'), drawing: 'nut' },
];

const BRASS = 'Brass CW614N / IS 319';

const p = (data) => ({
  image: '',
  featured: false,
  active: true,
  finish: 'Natural, nickel or tin plated',
  material: BRASS,
  createdAt: '2026-01-01T00:00:00.000Z',
  price: DEFAULT_PRICES[data.id] ?? '',
  ...data,
});

export const DEFAULT_PRODUCTS = [
  // Electricals
  p({
    id: 'neutral-links-earth-bars',
    name: 'Neutral Links & Earth Bars',
    categoryId: 'electricals',
    short: 'Solid brass neutral links and earth bars for distribution boards and switchgear panels.',
    description:
      'Machined from solid extruded brass bar, our neutral links and earth bars give a low-resistance, corrosion-resistant connection point for neutral and earth conductors. Each bar is drilled, tapped and fitted with combination-head binding screws, and can be supplied with mounting studs, insulating bases or custom hole patterns to suit your enclosure.',
    sizes: '4 to 26 way · 6×9, 8×10, 10×12 mm sections',
    moq: '1,000 pcs',
    featured: true,
    image: img('cat-neutral-links'),
    drawing: 'neutral-link',
  }),
  p({
    id: 'electrical-socket-pins',
    name: 'Electrical Socket Pins',
    categoryId: 'electricals',
    short: 'Precision-turned plug and socket pins in solid or split designs to BS and IS standards.',
    description:
      'Turned on multi-spindle and CNC sliding-head machines for tight diameter control and a smooth contact surface. Available in solid, split and hollow designs with knurled, threaded or crimp ends, and plated for low contact resistance.',
    sizes: '2.5 to 8 mm dia · 5A, 6A, 15A, 16A',
    moq: '5,000 pcs',
    featured: true,
    image: img('vk-socket-pins'),
    drawing: 'pin',
  }),
  p({
    id: 'special-cable-glands',
    name: 'Special Cable Glands',
    categoryId: 'electricals',
    short: 'Brass cable glands with neoprene seals for armoured and unarmoured cables, IP68 ready.',
    description:
      'Single and double compression cable glands for industrial, marine and hazardous-area installations. Machined brass bodies with neoprene or silicone seals, supplied with locknuts, earth tags and shrouds on request.',
    sizes: 'M8 to M63 · PG7 to PG48 · NPT ½" to 2"',
    moq: '500 pcs',
    image: img('cat-cable-glands'),
    drawing: 'gland',
  }),
  p({
    id: 'terminal-blocks',
    name: 'Current & Potential Terminal Blocks',
    categoryId: 'electricals',
    short: 'Brass terminal blocks for energy meters, CT/PT circuits and control panels.',
    description:
      'High-conductivity brass terminals for current and potential circuits in meters and metering panels. Drilled and tapped to accept captive screws, with optional link plates, shorting bridges and test-terminal designs.',
    sizes: '2 to 12 way · 2.5 to 35 mm² conductors',
    moq: '2,000 pcs',
    featured: true,
    image: img('cat-terminal-blocks'),
    drawing: 'terminal-block',
  }),
  p({
    id: 'clamps-wiring-accessories',
    name: 'Clamps for Wiring Accessories',
    categoryId: 'electricals',
    short: 'Brass cable clamps, saddles and wire clamps for switches and sockets.',
    description:
      'Pressed and machined brass clamps for terminating conductors inside switches, sockets, holders and junction boxes. Supplied loose or pre-assembled with screws.',
    sizes: '1 to 16 mm² conductors',
    moq: '10,000 pcs',
    drawing: 'clamp',
  }),
  p({
    id: 'sheet-metal-pressed-parts',
    name: 'Sheet Metal / Pressed Parts',
    categoryId: 'electricals',
    short: 'Blanked, pierced and formed brass and copper strip parts made to drawing.',
    description:
      'Progressive and compound-tool pressings in brass, copper and phosphor bronze strip. Typical parts include contact strips, busbar links, lugs and spring contacts, with in-house tooling for repeat orders.',
    material: 'Brass CuZn37 / Copper ETP / Phosphor bronze',
    sizes: '0.3 to 3 mm strip thickness',
    moq: '10,000 pcs',
    drawing: 'plate',
  }),

  // Plumbing & Sanitary
  p({
    id: 'tees-elbows',
    name: 'Tees & Elbows',
    categoryId: 'plumbing-sanitary',
    short: 'Hot-forged and machined brass tees, elbows and couplers for water and gas lines.',
    description:
      'Forged from DZR or standard brass rod and CNC machined for accurate BSP and NPT threads. Pressure-tested and available in male, female and compression versions for plumbing and sanitary systems.',
    material: 'Brass CW617N / DZR CW602N',
    finish: 'Natural, chrome or nickel plated',
    sizes: '¼" to 2" · BSP / NPT threads',
    moq: '1,000 pcs',
    featured: true,
    image: img('cat-plumbing-fittings'),
    drawing: 'fitting',
  }),
  p({
    id: 'brass-nozzles',
    name: 'Brass Nozzles',
    categoryId: 'plumbing-sanitary',
    short: 'Spray, jet and garden nozzles with precision-drilled orifices.',
    description:
      'Turned brass nozzles for sanitary, garden, cooling and industrial spray applications. Orifice sizes are drilled and reamed for a consistent flow pattern from part to part.',
    sizes: '⅛" to 1" · 0.5 to 6 mm orifice',
    moq: '1,000 pcs',
    drawing: 'nozzle',
  }),
  p({
    id: 'water-connector-flange',
    name: 'Water Connector (Flange)',
    categoryId: 'plumbing-sanitary',
    short: 'Flanged brass water connectors for meters, pumps and tanks.',
    description:
      'Machined flange connectors with bolt-hole patterns to your drawing. Used on water meters, pumps, storage tanks and geysers, with a gasket face finished for a leak-free seal.',
    sizes: '½" to 2" · PCD to drawing',
    moq: '500 pcs',
    drawing: 'flange',
  }),
  p({
    id: 'brass-union',
    name: 'Brass Union',
    categoryId: 'plumbing-sanitary',
    short: 'Three-piece brass unions for easy disconnection of pipework.',
    description:
      'Three-piece unions with a hexagonal nut and lapped seating faces for a reliable metal-to-metal seal. Supplied in female × female, male × female and compression ends.',
    material: 'Brass CW617N',
    sizes: '¼" to 2" · BSP / NPT',
    moq: '1,000 pcs',
    image: img('vk-compression-fittings'),
    drawing: 'union',
  }),
  p({
    id: 'brass-ppr-inserts',
    name: 'Brass PPR Inserts',
    categoryId: 'plumbing-sanitary',
    short: 'Knurled male and female inserts for moulding into PPR and CPVC fittings.',
    description:
      'Brass inserts with deep diamond knurling and anti-rotation grooves so they lock firmly into PPR, CPVC and HDPE fittings during moulding. Threads are gauge-checked after machining.',
    sizes: '½" to 2" · 20 to 63 mm pipe',
    moq: '5,000 pcs',
    featured: true,
    image: img('vk-knurled-inserts'),
    drawing: 'insert',
  }),

  // Automotive
  p({
    id: 'high-precision-steel-parts',
    name: 'High Precision Steel Parts',
    categoryId: 'automotive',
    short: 'CNC-turned steel and stainless parts for automotive and two-wheeler assemblies.',
    description:
      'Shafts, pins, bushes and fasteners turned from free-cutting steel and stainless steel on CNC sliding-head machines, then heat treated, ground or plated as needed.',
    material: 'EN1A, EN8, SS 303 / 304',
    finish: 'Zinc, black oxide or passivated',
    sizes: '2 to 40 mm dia',
    moq: '2,000 pcs',
    drawing: 'turned',
  }),
  p({
    id: 'brass-spool-shaft',
    name: 'Brass Spool Shaft',
    categoryId: 'automotive',
    short: 'Precision-ground brass spool shafts for valves and hydraulic controls.',
    description:
      'Spool shafts turned and finished to tight diameter and concentricity tolerances for directional valves, carburettors and fuel systems. Every lot is 100% checked on air gauges.',
    sizes: '4 to 25 mm dia · up to 150 mm length',
    moq: '1,000 pcs',
    featured: true,
    drawing: 'shaft',
  }),

  // Oil & Gas
  p({
    id: 'gas-valve-bodies',
    name: 'Gas Valve Bodies',
    categoryId: 'oil-gas',
    short: 'Forged and machined brass bodies for LPG, CNG and natural gas valves.',
    description:
      'Hot-forged brass valve bodies machined on CNC turning centres and pressure-tested for leakage. Suitable for LPG cylinder valves, regulators, CNG kits and gas meters.',
    material: 'Brass CW617N (forging grade)',
    sizes: '¼" to 1" · to drawing',
    moq: '1,000 pcs',
    drawing: 'valve',
  }),
  p({
    id: 'gas-nozzle-fittings',
    name: 'Gas Nozzle Fittings',
    categoryId: 'oil-gas',
    short: 'Burner nozzles, jets and hose fittings for gas appliances.',
    description:
      'Micro-drilled brass jets and nozzle fittings for gas stoves, burners and industrial heaters. Orifices are checked with pin gauges for accurate gas flow.',
    sizes: 'M6 to M12 · 0.3 to 3 mm orifice',
    moq: '5,000 pcs',
    drawing: 'nozzle',
  }),

  // Plastic Moulding
  p({
    id: 'brass-threaded-inserts',
    name: 'Brass Threaded Inserts',
    categoryId: 'plastic-moulding',
    short: 'Moulded-in, heat-set and press-fit inserts for plastic parts.',
    description:
      'Straight and diamond-knurled threaded inserts that give plastic components durable, reusable metal threads. Available as mould-in, ultrasonic, heat-staked and press-fit types.',
    sizes: 'M2 to M12 · 2–56 to ½"-13 UNC',
    moq: '10,000 pcs',
    featured: true,
    image: img('cat-brass-inserts'),
    drawing: 'insert',
  }),

  // General Engineering
  p({
    id: 'high-precision-machined-parts',
    name: 'High Precision Machined Parts',
    categoryId: 'general-engineering',
    short: 'Complex multi-operation parts machined to tight tolerances from your drawing.',
    description:
      'Turned, milled, drilled and cross-holed parts made complete on CNC turn-mill centres. We hold tolerances down to ±0.007 mm and supply inspection reports with every lot.',
    material: 'Brass, copper, aluminium, steel',
    sizes: 'Up to 65 mm bar dia',
    moq: '500 pcs',
    drawing: 'turned',
  }),
  p({
    id: 'copper-parts',
    name: 'Copper Parts',
    categoryId: 'general-engineering',
    short: 'High-conductivity copper terminals, lugs and connectors.',
    description:
      'Machined and pressed parts in ETP and OF copper for electrical, earthing and heat-transfer applications. Tin and silver plating available.',
    material: 'Copper ETP C11000 / OF C10200',
    finish: 'Natural, tin or silver plated',
    sizes: 'To drawing',
    moq: '1,000 pcs',
    drawing: 'plate',
  }),
  p({
    id: 'cnc-turned-parts',
    name: 'CNC Turned Parts',
    categoryId: 'general-engineering',
    short: 'Brass CNC turned components in any shape, thread and finish to drawing.',
    description:
      'Bushes, spacers, adaptors, connectors and fittings turned on our fleet of CNC lathes and sliding-head machines. From prototypes to high-volume production with consistent dimensions.',
    sizes: '2 to 65 mm dia',
    moq: '1,000 pcs',
    featured: true,
    image: img('cat-cnc-turned-parts'),
    drawing: 'turned',
  }),

  // Fasteners
  p({
    id: 'brass-hex-nuts',
    name: 'Brass Hex Nuts',
    categoryId: 'fasteners',
    short: 'Full, half and lock nuts in brass for electrical and plumbing assemblies.',
    description:
      'Hex nuts machined from hexagonal brass bar with clean, burr-free threads. Available in full, thin, flange and dome variants in metric, BA and UNC threads.',
    sizes: 'M2 to M24 · BA · UNC',
    moq: '10,000 pcs',
    image: img('cat-fasteners'),
    drawing: 'nut',
  }),
  p({
    id: 'brass-screws-bolts',
    name: 'Brass Screws & Bolts',
    categoryId: 'fasteners',
    short: 'Slotted, Phillips and combination-head brass screws and bolts.',
    description:
      'Cold-headed and turned brass screws for terminals, switches and fixtures. Pan, cheese, countersunk and hex heads with slotted, Phillips or combination drives.',
    sizes: 'M2 to M12 · 4 to 100 mm length',
    moq: '10,000 pcs',
    drawing: 'screw',
  }),
];

const daysAgo = (days, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 15, 0, 0);
  return d.toISOString();
};

export function buildSeedEnquiries() {
  return [
    {
      id: 'enq-1004',
      createdAt: daysAgo(0, 9),
      name: 'Rahul Mehta',
      company: 'Mehta Switchgear Pvt Ltd',
      email: 'rahul@mehtaswitchgear.in',
      phone: '+91 98250 41122',
      country: 'India',
      message:
        'We need 8-way and 12-way neutral links with M5 screws for our new DB range, plus CT terminal blocks. Please share price, lead time and plating options.',
      items: [
        { productId: 'neutral-links-earth-bars', name: 'Neutral Links & Earth Bars', qty: 5000 },
        { productId: 'terminal-blocks', name: 'Current & Potential Terminal Blocks', qty: 2000 },
      ],
      source: 'My Enquiry',
      status: 'New',
    },
    {
      id: 'enq-1003',
      createdAt: daysAgo(2, 14),
      name: 'James Carter',
      company: 'Carter Plumbing Supplies',
      email: 'james@carterplumbing.co.uk',
      phone: '+44 7700 900412',
      country: 'United Kingdom',
      message: 'Looking for DZR brass PPR inserts, 20 mm and 25 mm, for our moulding partner. Need WRAS-compatible material certificates.',
      items: [{ productId: 'brass-ppr-inserts', name: 'Brass PPR Inserts', qty: 20000 }],
      source: 'My Enquiry',
      status: 'Contacted',
    },
    {
      id: 'enq-1002',
      createdAt: daysAgo(5, 11),
      name: 'Ahmed Al Mansoori',
      company: 'Gulf Gas Equipment LLC',
      email: 'ahmed@gulfgas.ae',
      phone: '+971 50 123 4567',
      country: 'United Arab Emirates',
      message: 'Please quote for LPG valve bodies as per attached drawing. Monthly requirement around 3,000 pcs.',
      items: [{ productId: 'gas-valve-bodies', name: 'Gas Valve Bodies', qty: 3000 }],
      source: 'My Enquiry',
      status: 'Quoted',
    },
    {
      id: 'enq-1001',
      createdAt: daysAgo(9, 16),
      name: 'Priya Shah',
      company: 'Shah Auto Components',
      email: 'priya@shahauto.in',
      phone: '+91 99099 77311',
      country: 'India',
      message: 'Repeat order for spool shafts, same drawing as last batch (rev C).',
      items: [{ productId: 'brass-spool-shaft', name: 'Brass Spool Shaft', qty: 1500 }],
      source: 'My Enquiry',
      status: 'Closed',
    },
  ];
}

const dayAgo = (days) => daysAgo(days).slice(0, 10);

const line = (productId, qty, unit = 'pcs') => {
  const product = DEFAULT_PRODUCTS.find((pr) => pr.id === productId);
  return { id: `ln-${productId}`, productId, name: product.name, qty, unit, rate: DEFAULT_PRICES[productId] };
};

export function buildSeedOrders() {
  return [
    {
      id: 'ord-0004',
      seq: 4,
      date: dayAgo(1),
      deliveryDate: dayAgo(1),
      createdAt: daysAgo(1, 12),
      status: 'Delivered',
      customer: { name: 'Kiran Patel', company: 'Patel Hardware Stores', phone: '+91 98242 55018', email: '', gstin: '', address: 'Grain Market Road, Jamnagar 361001, Gujarat' },
      items: [line('brass-hex-nuts', 20000), line('brass-screws-bolts', 10000)],
      discount: { type: 'percent', value: 0 },
      tax: { rate: 18, interState: false },
      freight: 0,
      notes: 'Counter sale, collected by customer.',
      payments: [{ id: 'pay-0004-1', date: dayAgo(1), amount: 35400, mode: 'Cash', note: '' }],
    },
    {
      id: 'ord-0003',
      seq: 3,
      date: dayAgo(3),
      deliveryDate: dayAgo(-25),
      createdAt: daysAgo(3, 15),
      status: 'Confirmed',
      enquiryId: 'enq-1002',
      customer: { name: 'Ahmed Al Mansoori', company: 'Gulf Gas Equipment LLC', phone: '+971 50 123 4567', email: 'ahmed@gulfgas.ae', gstin: '', address: 'Industrial Area 12, Sharjah, United Arab Emirates' },
      items: [line('gas-valve-bodies', 3000)],
      discount: { type: 'amount', value: 10000 },
      tax: { rate: 0, interState: true },
      freight: 0,
      notes: 'Export order — FOB Mundra. 30% advance before dispatch.',
      payments: [],
    },
    {
      id: 'ord-0002',
      seq: 2,
      date: dayAgo(12),
      deliveryDate: dayAgo(-6),
      createdAt: daysAgo(12, 11),
      status: 'In production',
      customer: { name: 'Rahul Mehta', company: 'Mehta Switchgear Pvt Ltd', phone: '+91 98250 41122', email: 'rahul@mehtaswitchgear.in', gstin: '24AAKCM4521F1Z8', address: 'Plot 214, GIDC Vatva, Ahmedabad 382445, Gujarat' },
      items: [line('neutral-links-earth-bars', 5000), line('terminal-blocks', 2000)],
      discount: { type: 'percent', value: 5 },
      tax: { rate: 18, interState: false },
      freight: 1500,
      notes: 'Nickel plated. Pack 100 pcs per box.',
      payments: [{ id: 'pay-0002-1', date: dayAgo(12), amount: 100000, mode: 'Cheque', note: 'Cheque no. 004512, HDFC Bank' }],
    },
    {
      id: 'ord-0001',
      seq: 1,
      date: dayAgo(24),
      deliveryDate: dayAgo(8),
      createdAt: daysAgo(24, 10),
      status: 'Delivered',
      customer: { name: 'Priya Shah', company: 'Shah Auto Components', phone: '+91 99099 77311', email: 'priya@shahauto.in', gstin: '27AAHFS7731K1ZQ', address: 'MIDC Bhosari, Pune 411026, Maharashtra' },
      items: [line('brass-spool-shaft', 1500)],
      discount: { type: 'percent', value: 0 },
      tax: { rate: 18, interState: true },
      freight: 0,
      notes: 'Drawing rev C.',
      payments: [
        { id: 'pay-0001-1', date: dayAgo(24), amount: 20000, mode: 'Bank transfer', note: 'Advance' },
        { id: 'pay-0001-2', date: dayAgo(6), amount: 29560, mode: 'UPI', note: 'Final payment' },
      ],
    },
  ];
}

export function buildSeed() {
  return {
    settings: { ...DEFAULT_SETTINGS },
    categories: DEFAULT_CATEGORIES.map((c) => ({ ...c })),
    products: DEFAULT_PRODUCTS.map((pr) => ({ ...pr })),
    enquiries: buildSeedEnquiries(),
    orders: buildSeedOrders(),
  };
}

export const ENQUIRY_STATUSES = ['New', 'Contacted', 'Quoted', 'Closed'];

export const INDUSTRIES = [
  'Energy & Power',
  'Electrical Switchgear',
  'Automobiles',
  'Locomotives',
  'Plumbing & Sanitary',
  'Oil & Gas',
  'Plastic Moulding',
  'General Engineering',
];
