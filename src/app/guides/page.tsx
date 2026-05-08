import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, Zap, AlertTriangle, Target, BarChart3, BookOpen, TrendingUp, Users, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Electrical Engineering Guides — NEC, AWG',
  description: 'In-depth guides on wire sizing, NEC code compliance, voltage drop, ampacity, and electrical safety. For licensed electricians and contractors.',
  keywords: 'electrical guides, NEC compliance guide, wire sizing guide, voltage drop guide, electrical code, ampacity guide, electrical engineering',
  alternates: { canonical: '/guides' },
};

const GUIDES = [
  {
    slug: 'electrical-power-calculations',
    title: 'Electrical Power Calculations',
    description: 'Master the fundamentals of electrical power, current, voltage, and energy calculations with interactive examples and real-world applications.',
    icon: Calculator,
    color: 'blue',
    topics: ['Watts, Amps, Volts Relationships', 'Power Factor Analysis', 'Single & Three Phase Systems', 'Ohms Law Applications'],
    difficulty: 'Beginner to Intermediate',
    readTime: '15 min read',
    calculators: ['amps-to-watts-calculator', 'watts-to-amps-calculator', 'ohms-law-calculator']
  },
  {
    slug: 'nec-code-compliance',
    title: 'NEC Code Compliance Guide',
    description: 'Navigate the National Electrical Code requirements for safe and compliant electrical installations with detailed code references.',
    icon: Target,
    color: 'amber',
    topics: ['Wire Sizing Rules & Tables', 'Circuit Protection Requirements', 'Grounding Systems', 'Load Calculations'],
    difficulty: 'Intermediate to Advanced',
    readTime: '25 min read',
    calculators: ['wire-size-calculator', 'ground-wire-calculator', 'electrical-load-calculator']
  },
  {
    slug: 'power-factor-explained',
    title: 'Power Factor Explained',
    description: 'Understanding reactive power, apparent power, and power factor correction for efficient electrical systems.',
    icon: BarChart3,
    color: 'green',
    topics: ['Real vs Apparent Power', 'Inductive & Capacitive Loads', 'Power Factor Correction', 'Energy Efficiency'],
    difficulty: 'Intermediate',
    readTime: '20 min read',
    calculators: ['amps-to-watts-calculator', 'kva-to-amps-calculator', 'three-phase-calculator']
  },
  {
    slug: 'single-vs-three-phase',
    title: 'Single vs Three Phase Systems',
    description: 'Compare electrical distribution systems, their applications, and advantages in residential and commercial settings.',
    icon: Zap,
    color: 'purple',
    topics: ['Voltage System Configurations', 'Load Distribution Methods', 'Motor Applications', 'Power Transmission Efficiency'],
    difficulty: 'Beginner to Intermediate',
    readTime: '18 min read',
    calculators: ['three-phase-calculator', 'horsepower-to-amps-calculator', 'voltage-drop-calculator']
  },
  {
    slug: 'wire-sizing-guide',
    title: 'Complete Wire Sizing Guide',
    description: 'Everything you need to know about selecting the right wire size for safe and efficient electrical installations.',
    icon: AlertTriangle,
    color: 'red',
    topics: ['AWG Wire Sizes & Standards', 'Ampacity Tables & Derating', 'Voltage Drop Considerations', 'Temperature Corrections'],
    difficulty: 'All Levels',
    readTime: '30 min read',
    calculators: ['wire-size-calculator', 'ampacity-calculator', 'voltage-drop-calculator']
  },
  {
    slug: 'electrical-safety',
    title: 'Electrical Safety Fundamentals',
    description: 'Essential safety practices, standards, and procedures for electrical work and installations.',
    icon: BookOpen,
    color: 'gray',
    topics: ['Arc Flash Protection', 'OSHA & NFPA Standards', 'PPE Requirements', 'Lockout/Tagout Procedures'],
    difficulty: 'All Levels',
    readTime: '22 min read',
    calculators: ['circuit-breaker-calculator', 'ground-wire-calculator']
  },
];

// Canonical, complete list of all guides on the site (used by both the
// in-page rendering above and the JSON-LD ItemList below).
const ALL_GUIDES = [
  { slug: 'wire-sizing-guide', title: 'Complete Wire Sizing Guide' },
  { slug: 'awg-wire-size-chart', title: 'AWG Wire Size Chart' },
  { slug: 'nec-table-310-16', title: 'NEC Table 310.16 — Conductor Ampacities' },
  { slug: 'nec-code-compliance', title: 'NEC Code Compliance Guide' },
  { slug: 'wire-size-for-100-amp', title: 'Wire Size for 100 Amp Service' },
  { slug: 'wire-size-for-200-amp', title: 'Wire Size for 200 Amp Service' },
  { slug: 'wire-size-for-ev-charger', title: 'Wire Size for EV Charger' },
  { slug: 'electrical-power-calculations', title: 'Electrical Power Calculations' },
  { slug: 'electrical-safety', title: 'Electrical Safety Fundamentals' },
  { slug: 'single-vs-three-phase', title: 'Single vs Three Phase Systems' },
  { slug: 'power-factor-explained', title: 'Power Factor Explained' },
];

const guidesCollectionSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://wiresizes.com/guides#webpage',
      url: 'https://wiresizes.com/guides',
      name: 'Electrical Engineering Guides',
      description:
        'In-depth guides on electrical wire sizing, NEC code compliance, voltage drop, ampacity, power factor, and electrical safety. Written for licensed electricians, contractors, and engineers.',
      isPartOf: { '@id': 'https://wiresizes.com/#website' },
      publisher: { '@id': 'https://wiresizes.com/#organization' },
      inLanguage: 'en-US',
      breadcrumb: { '@id': 'https://wiresizes.com/guides#breadcrumb' },
      mainEntity: { '@id': 'https://wiresizes.com/guides#guide-list' },
    },
    {
      '@type': 'ItemList',
      '@id': 'https://wiresizes.com/guides#guide-list',
      name: 'WireSizes.com electrical engineering guides',
      numberOfItems: ALL_GUIDES.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: ALL_GUIDES.map((g, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://wiresizes.com/guides/${g.slug}`,
        name: g.title,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://wiresizes.com/guides#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wiresizes.com' },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://wiresizes.com/guides' },
      ],
    },
  ],
};

const STATS = [
  { icon: Users, value: '50,000+', label: 'Engineers Educated' },
  { icon: Calculator, value: '29', label: 'Professional Calculators' },
  { icon: BookOpen, value: '6', label: 'Comprehensive Guides' },
  { icon: Award, value: 'NEC 2023', label: 'Code Compliant' },
];

export default function GuidesHomePage() {
  return (
    <div className="space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guidesCollectionSchema) }}
      />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Electrical Engineering Education
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Master electrical calculations, code compliance, and safety with our comprehensive guides. 
            Each guide includes interactive calculators, real-world examples, and professional insights.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/guides/electrical-power-calculations"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Start Learning
            </Link>
            <Link 
              href="/calculators"
              className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              Browse Calculators
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg border p-6 text-center">
              <IconComponent className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Featured Guides Grid */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Engineering Guide Library</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From basic electrical theory to advanced NEC code compliance, our guides provide 
            the knowledge you need for professional electrical work.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {GUIDES.map((guide) => {
            const IconComponent = guide.icon;
            return (
              <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                <div className="bg-white rounded-xl border hover:shadow-lg transition-shadow p-8 h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 bg-${guide.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-6 h-6 text-${guide.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{guide.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className={`bg-${guide.color}-100 text-${guide.color}-700 px-2 py-1 rounded-full`}>
                          {guide.difficulty}
                        </span>
                        <span>{guide.readTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{guide.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Topics Covered:</h4>
                      <ul className="space-y-1">
                        {guide.topics.map((topic, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Related Calculators:</h4>
                      <div className="flex flex-wrap gap-1">
                        {guide.calculators.map((calc, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {calc.replace(/-/g, ' ').replace(/calculator/g, '').trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <span className={`text-${guide.color}-600 font-medium hover:text-${guide.color}-700`}>
                      Read Guide →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Learning Path Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border">
        <div className="max-w-4xl mx-auto text-center">
          <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended Learning Path</h2>
          <p className="text-gray-600 mb-6">
            New to electrical engineering? Follow our structured learning path for the best educational experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white rounded-lg border p-4 text-left">
              <div className="text-lg font-semibold text-green-600 mb-1">1. Start Here</div>
              <div className="text-sm text-gray-700">Electrical Power Calculations</div>
            </div>
            <div className="flex items-center text-gray-400">→</div>
            <div className="bg-white rounded-lg border p-4 text-left">
              <div className="text-lg font-semibold text-blue-600 mb-1">2. Then</div>
              <div className="text-sm text-gray-700">Single vs Three Phase</div>
            </div>
            <div className="flex items-center text-gray-400">→</div>
            <div className="bg-white rounded-lg border p-4 text-left">
              <div className="text-lg font-semibold text-purple-600 mb-1">3. Next</div>
              <div className="text-sm text-gray-700">Wire Sizing Guide</div>
            </div>
            <div className="flex items-center text-gray-400">→</div>
            <div className="bg-white rounded-lg border p-4 text-left">
              <div className="text-lg font-semibold text-amber-600 mb-1">4. Finally</div>
              <div className="text-sm text-gray-700">NEC Code Compliance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick FAQ — citations, AI, and how to navigate */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions About These Guides</h2>
        <div className="space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Which NEC edition do these guides reference?</h3>
            <p className="text-sm text-slate-700">
              All guides reference NEC 2023 (NFPA 70-2023), which is the
              most recent published edition as of 2026. Where a 2017 or
              2020 edition value differs materially, both are noted. The
              NEC 2026 edition publishes in mid-2026; we will update guides
              within 90 days of publication and indicate the affected pages
              via the schema <code>dateModified</code> field.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Are these guides authoritative for code-compliance work?</h3>
            <p className="text-sm text-slate-700">
              These guides are educational references. The authoritative
              source is the NEC document published by NFPA, available at
              nfpa.org. Local jurisdictions may adopt the current NEC
              edition with amendments (state-specific articles), or remain
              on an older edition. Always confirm with your local Authority
              Having Jurisdiction (AHJ) before installing.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Can I cite these guides in design documents?</h3>
            <p className="text-sm text-slate-700">
              Yes for educational citation; we recommend pairing the
              wiresizes.com URL with the underlying NEC article number
              (e.g., &ldquo;wiresizes.com/guides/nec-table-310-16, citing
              NEC 2023 Article 310 Table 310.16&rdquo;). For permit-stamped
              engineering documents, cite the NEC edition directly.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Do AI assistants (ChatGPT, Claude, Perplexity) cite these guides?</h3>
            <p className="text-sm text-slate-700">
              Each guide publishes structured data (Article, FAQPage, HowTo
              schemas where applicable) and a per-section <code>llms.txt</code>{' '}
              with NEC quick-reference values, so AI assistants can ingest
              the canonical numbers cleanly. The most-cited surfaces tend
              to be the NEC quick-reference tables in the awg-wire-size-chart
              and nec-table-310-16 pages — both are emitted as Google Dataset
              schema with PropertyValue typed columns.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">How are these guides different from each other?</h3>
            <p className="text-sm text-slate-700">
              The wire-sizing-guide is a step-by-step procedure for
              selecting any conductor. The NEC Table 310.16 page is the
              canonical ampacity reference. The AWG wire size chart is
              the physical-properties reference (diameter, area, resistance).
              The per-amperage guides (100A, 200A, EV charger) are
              installation-specific. The NEC code compliance guide ties
              everything together at the design level. Power Calculations,
              Single-vs-Three-Phase, and Power Factor are theory references
              that support the practical guides.
            </p>
          </div>
        </div>
      </div>

      {/* Why these guides exist + how they're built */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 border border-slate-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Why These Guides Exist — Standards Basis and Update Cadence</h2>
        <p className="text-gray-700 mb-6">
          Every guide on WireSizes.com is anchored to a specific authoritative
          source — not aggregated from secondary websites or AI-generated text.
          Below is the standards basis for each guide category, plus our
          methodology for keeping content current as the underlying codes evolve.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
            <h3 className="text-lg font-bold text-blue-900 mb-3">Wire-sizing guides — NEC 2023 (NFPA 70)</h3>
            <p className="text-sm text-slate-700 mb-3">
              All ampacity, conductor, and overcurrent-protection guidance
              cites the National Electrical Code 2023 edition (NFPA 70-2023).
              Specific articles referenced across the wire-sizing guides:
            </p>
            <ul className="text-sm space-y-1 text-slate-700">
              <li><strong>Article 110:</strong> general installation requirements (110.14(C) for terminations)</li>
              <li><strong>Article 210:</strong> branch circuits (210.19(A) for continuous-load 125%)</li>
              <li><strong>Article 220:</strong> branch-circuit, feeder, service load calculations</li>
              <li><strong>Article 240:</strong> overcurrent protection (240.4(D) small-conductor rule, 240.6 standard sizes)</li>
              <li><strong>Article 250:</strong> grounding and bonding (Table 250.122 EGC sizing)</li>
              <li><strong>Article 310:</strong> conductors (Table 310.16 ampacity, 310.12 dwelling 83% rule, 310.15 derating)</li>
              <li><strong>Article 334:</strong> NM-B / Romex cable (334.80 ampacity restriction)</li>
              <li><strong>Article 430:</strong> motors (FLC tables 430.247-250)</li>
              <li><strong>Chapter 9:</strong> Tables 4 and 5 (conduit fill), Table 8 (DC resistance)</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
            <h3 className="text-lg font-bold text-blue-900 mb-3">Safety guides — NFPA 70E and OSHA 1910.147</h3>
            <p className="text-sm text-slate-700 mb-3">
              The electrical safety guide cites NFPA 70E-2024 (Standard for
              Electrical Safety in the Workplace) for arc-flash boundaries,
              PPE categories, and incident-energy calculations, plus OSHA
              29 CFR 1910.147 (the federal regulation for control of
              hazardous energy / lockout-tagout).
            </p>
            <ul className="text-sm space-y-1 text-slate-700">
              <li><strong>NFPA 70E-2024 130.4:</strong> arc-flash risk assessment</li>
              <li><strong>NFPA 70E-2024 130.7:</strong> PPE selection by incident energy</li>
              <li><strong>NFPA 70E-2024 Annex D:</strong> incident-energy calculation methods</li>
              <li><strong>OSHA 1910.147(c)(4):</strong> energy-control program</li>
              <li><strong>OSHA 1910.147(c)(5):</strong> tags as backup, locks as primary</li>
              <li><strong>OSHA 1910.147(d):</strong> shutdown / isolation / verification sequence</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
            <h3 className="text-lg font-bold text-blue-900 mb-3">Reference data — ASTM B258 and NEC Chapter 9</h3>
            <p className="text-sm text-slate-700 mb-3">
              The AWG conductor tables are anchored to ASTM B258 (the
              definitional standard for AWG diameters and cross-sectional
              areas). DC resistance values come from NEC Chapter 9 Table
              8 at 75&deg;C uncoated copper. Aluminum properties from NEC
              Chapter 9 Table 8 alternate columns.
            </p>
            <ul className="text-sm space-y-1 text-slate-700">
              <li><strong>ASTM B258:</strong> nominal AWG diameters, geometric progression definition</li>
              <li><strong>NEC Chapter 9 Table 8:</strong> DC resistance per 1000 ft</li>
              <li><strong>NEC Chapter 9 Table 9:</strong> AC resistance and reactance for typical conductor configurations</li>
              <li><strong>IEC 60228:</strong> metric SI conductor sizes (1/1.5/2.5/4/6/10/16/25/35/50/70/95/120/150/185/240 mm&sup2;)</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
            <h3 className="text-lg font-bold text-blue-900 mb-3">Site update cadence</h3>
            <p className="text-sm text-slate-700 mb-3">
              NEC publishes a new edition every three years (2017 → 2020
              → 2023 → 2026). Within each three-year cycle, NFPA issues
              tentative interim amendments (TIAs) that may revise specific
              tables or articles. Our update cadence:
            </p>
            <ul className="text-sm space-y-1 text-slate-700">
              <li><strong>Major edition:</strong> full review within 90 days of NEC publication</li>
              <li><strong>TIA / errata:</strong> review within 30 days of NFPA notification</li>
              <li><strong>Calculator validation:</strong> spot-check of sample inputs every quarter</li>
              <li><strong>Each guide page:</strong> last-modified date is git-derived, visible in JSON-LD <code>dateModified</code> field</li>
              <li><strong>Canonical NEC reference data:</strong> stored in a single source-of-truth module (<code>src/lib/data/nec-tables.ts</code>) so corrections propagate to every page automatically</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Reading order by role</h3>
          <p className="text-sm text-slate-700 mb-4">
            The recommended path above (Power Calculations → Single vs
            Three Phase → Wire Sizing → NEC Code Compliance) is geared
            toward someone learning the field. Other roles may benefit
            from a different sequence:
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded p-4">
              <div className="font-bold text-blue-900 mb-2">Apprentice / DIY homeowner</div>
              <ol className="text-sm text-slate-700 list-decimal list-inside space-y-1">
                <li>Electrical Safety (essential before touching anything)</li>
                <li>Electrical Power Calculations (the formulas)</li>
                <li>Wire Sizing Guide (step-by-step)</li>
                <li>Wire Size for [your application]</li>
                <li>NEC Code Compliance (after a few projects)</li>
              </ol>
            </div>

            <div className="bg-purple-50 rounded p-4">
              <div className="font-bold text-purple-900 mb-2">Licensed electrician / journeyman</div>
              <ol className="text-sm text-slate-700 list-decimal list-inside space-y-1">
                <li>NEC Code Compliance (refresh on 2023 changes)</li>
                <li>NEC Table 310.16 (the daily reference)</li>
                <li>Wire Sizing Guide (advanced derating cases)</li>
                <li>Power Factor Explained (commercial work)</li>
                <li>Single vs Three Phase (industrial conversions)</li>
              </ol>
            </div>

            <div className="bg-emerald-50 rounded p-4">
              <div className="font-bold text-emerald-900 mb-2">Inspector / AHJ representative</div>
              <ol className="text-sm text-slate-700 list-decimal list-inside space-y-1">
                <li>NEC Code Compliance (verification checklist)</li>
                <li>NEC Table 310.16 (ampacity verification)</li>
                <li>Wire Size for 100/200 Amp (residential service compliance)</li>
                <li>Electrical Safety (NFPA 70E for inspector PPE)</li>
                <li>Wire Sizing Guide (uncommon derating cases)</li>
              </ol>
            </div>

            <div className="bg-amber-50 rounded p-4">
              <div className="font-bold text-amber-900 mb-2">Engineer / designer</div>
              <ol className="text-sm text-slate-700 list-decimal list-inside space-y-1">
                <li>Power Factor Explained (commercial PF correction)</li>
                <li>Electrical Power Calculations (single/three-phase math)</li>
                <li>Single vs Three Phase (selection criteria)</li>
                <li>NEC Table 310.16 (310.15(B)(7) Neher-McGrath exceptions)</li>
                <li>NEC Code Compliance (full design checklist)</li>
              </ol>
            </div>

            <div className="bg-rose-50 rounded p-4">
              <div className="font-bold text-rose-900 mb-2">Student / instructor</div>
              <ol className="text-sm text-slate-700 list-decimal list-inside space-y-1">
                <li>Electrical Power Calculations (formulas + worked examples)</li>
                <li>AWG Wire Size Chart (geometric progression math)</li>
                <li>Single vs Three Phase (system theory)</li>
                <li>NEC Table 310.16 (heat-balance derivation)</li>
                <li>Power Factor Explained (kVA/kW/kVAR triangle)</li>
              </ol>
            </div>

            <div className="bg-cyan-50 rounded p-4">
              <div className="font-bold text-cyan-900 mb-2">Property manager / facilities</div>
              <ol className="text-sm text-slate-700 list-decimal list-inside space-y-1">
                <li>Electrical Safety (LOTO procedure for service work)</li>
                <li>Wire Size for 200 Amp (typical service upgrade)</li>
                <li>Wire Size for EV Charger (deployment planning)</li>
                <li>Power Factor Explained (utility bill optimization)</li>
                <li>NEC Code Compliance (permit / inspection workflow)</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}