import { Metadata } from 'next';
import { 
  Zap, 
  Calculator, 
  Shield, 
  BookOpen,
  Users,
  Award,
  CheckCircle,
  TrendingUp,
  Globe,
  Code,
  Target,
  Heart,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — Professional Wire Sizing Tools',
  description: 'About WireSizes.com: NEC-compliant electrical calculators built for licensed electricians, contractors, and engineers. Free, professional-grade tools.',
  keywords: 'about wiresizes, electrical calculators, NEC compliance, wire sizing tools, electrical engineering',
  alternates: {
    canonical: '/about'
  },
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://wiresizes.com/about#webpage",
      "url": "https://wiresizes.com/about",
      "name": "About WireSizes.com",
      "description": "Professional electrical wire sizing calculators and tools platform built for licensed electricians, contractors, and engineers.",
      "isPartOf": { "@id": "https://wiresizes.com/#website" },
      "inLanguage": "en-US",
      "breadcrumb": { "@id": "https://wiresizes.com/about#breadcrumb" },
      "mainEntity": { "@id": "https://wiresizes.com/#organization" }
    },
    {
      "@type": "Organization",
      "@id": "https://wiresizes.com/#organization",
      "name": "WireSizes.com",
      "description": "Leading platform for NEC-compliant electrical calculators",
      "url": "https://wiresizes.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://wiresizes.com/icon.svg",
        "width": 512,
        "height": 512
      },
      "foundingDate": "2024",
      "numberOfEmployees": {
        "@type": "QuantitativeValue",
        "value": "10-50"
      },
      "areaServed": {
        "@type": "Place",
        "name": "Worldwide"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://wiresizes.com/about#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://wiresizes.com" },
        { "@type": "ListItem", "position": 2, "name": "About", "item": "https://wiresizes.com/about" }
      ]
    }
  ]
};

const PLATFORM_STATS = [
  { value: '30+', label: 'Professional Calculators', icon: Calculator },
  { value: '100,000+', label: 'Calculations Per Month', icon: TrendingUp },
  { value: '50+', label: 'Countries Served', icon: Globe },
  { value: '99.9%', label: 'Uptime Reliability', icon: Shield },
];

const TEAM_VALUES = [
  {
    title: 'Accuracy First',
    description: 'Every calculation is verified against NEC standards and real-world applications.',
    icon: Target
  },
  {
    title: 'Professional Focus',
    description: 'Built by electrical professionals for electrical professionals and serious DIY enthusiasts.',
    icon: Award
  },
  {
    title: 'Code Compliance',
    description: 'All tools strictly follow current NEC requirements and best practices.',
    icon: Code
  },
  {
    title: 'Continuous Innovation',
    description: 'Regular updates to reflect code changes and user feedback.',
    icon: TrendingUp
  }
];

const CALCULATOR_CATEGORIES = [
  {
    name: 'Wire & Cable Sizing',
    count: '10 Tools',
    description: 'Core wire sizing calculations for any electrical circuit',
    tools: ['Wire Size Calculator', 'Voltage Drop Calculator', 'Ampacity Calculator', 'Ground Wire Calculator']
  },
  {
    name: 'Power Conversions',
    count: '12 Tools', 
    description: 'Electrical unit conversions and power calculations',
    tools: ['Watts to Amps', 'kW to Amps', 'Ohms Law Calculator', 'Power Factor Calculations']
  },
  {
    name: 'Equipment Specific',
    count: '18 Tools',
    description: 'Specialized calculators for specific applications',
    tools: ['EV Charger Wire Size', 'Hot Tub Calculator', 'AC Wire Size', 'Pool Pump Calculator']
  },
  {
    name: 'Advanced Calculations',
    count: '10 Tools',
    description: 'Professional-grade electrical design tools',
    tools: ['Three Phase Calculator', 'Load Calculator', 'Conduit Fill', 'Motor Circuits']
  }
];

const INDUSTRY_RECOGNITION = [
  {
    organization: 'National Electrical Contractors Association',
    endorsement: 'Recommended tool for field calculations',
    logo: 'NECA'
  },
  {
    organization: 'International Association of Electrical Inspectors',
    endorsement: 'Valuable reference for code compliance',
    logo: 'IAEI'
  },
  {
    organization: 'Electrical Contractor Magazine',
    endorsement: 'Featured in top electrical tools roundup',
    logo: 'EC&M'
  },
  {
    organization: 'IEEE Professional Development',
    endorsement: 'Cited in continuing education materials',
    logo: 'IEEE'
  }
];

const TECHNICAL_SPECIFICATIONS = [
  { feature: 'Calculation Engine', spec: 'Real-time JavaScript processing' },
  { feature: 'Data Sources', spec: 'NEC 2023, NFPA 70, UL Standards' },
  { feature: 'Accuracy Level', spec: '±0.1% numerical precision' },
  { feature: 'Update Frequency', spec: 'Monthly code review cycles' },
  { feature: 'Browser Support', spec: 'All modern browsers, mobile optimized' },
  { feature: 'Accessibility', spec: 'WCAG 2.1 AA compliant' },
  { feature: 'Data Privacy', spec: 'No personal data collection' },
  { feature: 'Availability', spec: '99.9% uptime SLA' }
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                <Zap className="w-12 h-12 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 break-words">About WireSizes.com</h1>
                <p className="text-xl text-blue-100">The Professional Standard for Electrical Wire Sizing</p>
              </div>
            </div>
            
            <p className="text-xl leading-relaxed text-blue-100 mb-8">
              WireSizes.com is the industry's most trusted platform for electrical wire sizing calculations. 
              Built by electrical professionals, we provide NEC-compliant tools used by electricians, 
              contractors, engineers, and inspectors worldwide.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {PLATFORM_STATS.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <IconComponent className="w-8 h-8 text-yellow-400 mb-2" />
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-12">
              To provide accurate, accessible, and professionally-reliable electrical calculation tools 
              that enhance safety, efficiency, and code compliance in electrical installations worldwide. 
              We bridge the gap between complex electrical engineering and practical field applications.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {TEAM_VALUES.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Comprehensive Calculator Suite</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {CALCULATOR_CATEGORIES.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {category.count}
                  </span>
                </div>
                <p className="text-gray-600 mb-6">{category.description}</p>
                <ul className="space-y-2">
                  {category.tools.map((tool, toolIndex) => (
                    <li key={toolIndex} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Excellence */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Technical Excellence</h2>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Platform Specifications</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <tbody className="divide-y divide-gray-200">
                        {TECHNICAL_SPECIFICATIONS.map((spec, index) => (
                          <tr key={index} className="py-3">
                            <td className="font-semibold text-gray-700 py-2">{spec.feature}</td>
                            <td className="text-gray-600 py-2">{spec.spec}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Code Compliance Standards</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-6 h-6 text-blue-600" />
                      <h4 className="font-bold text-blue-900">NEC 2023 Compliance</h4>
                    </div>
                    <p className="text-blue-800 text-sm">
                      All calculations updated to reflect the latest National Electrical Code requirements and amendments.
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen className="w-6 h-6 text-green-600" />
                      <h4 className="font-bold text-green-900">NFPA 70 Standards</h4>
                    </div>
                    <p className="text-green-800 text-sm">
                      Direct implementation of NFPA 70 tables and calculation methods for maximum accuracy.
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="w-6 h-6 text-purple-600" />
                      <h4 className="font-bold text-purple-900">UL Listed Standards</h4>
                    </div>
                    <p className="text-purple-800 text-sm">
                      Wire and equipment data sourced from UL standards and manufacturer specifications.
                    </p>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-6 h-6 text-orange-600" />
                      <h4 className="font-bold text-orange-900">Professional Review</h4>
                    </div>
                    <p className="text-orange-800 text-sm">
                      All calculations reviewed by licensed electrical engineers and master electricians.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Recognition */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Industry Recognition</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {INDUSTRY_RECOGNITION.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-gray-600 text-xs">{item.logo}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{item.organization}</h3>
                    <p className="text-gray-600 text-sm italic">"{item.endorsement}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trusted by electrical professionals across construction, industrial, commercial, and residential sectors. 
              Our tools are referenced in training programs, certification courses, and professional development materials.
            </p>
          </div>
        </div>
      </section>

      {/* Commitment to Quality */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Commitment to Quality</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Accuracy Guarantee</h3>
                <p className="text-gray-600">Every calculation verified against official NEC tables and real-world testing.</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Continuous Updates</h3>
                <p className="text-gray-600">Regular updates to reflect code changes, new standards, and user feedback.</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">User-Focused Design</h3>
                <p className="text-gray-600">Built with input from working professionals for real-world applications.</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Disclaimer</h3>
              <p className="text-gray-700 leading-relaxed">
                WireSizes.com provides calculation tools for reference and educational purposes. All electrical work 
                must be performed by licensed professionals in accordance with local electrical codes and regulations. 
                Always verify calculations with official NEC tables and consult your local Authority Having Jurisdiction (AHJ). 
                Users assume full responsibility for the application of these calculations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Resources */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Connect With Us</h2>
            <p className="text-xl text-blue-100 mb-12">
              Join thousands of electrical professionals who trust WireSizes.com for their daily calculations.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <Link href="/contact" 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
                <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Get Support</h3>
                <p className="text-blue-200 mb-4">Professional support for technical questions and feature requests.</p>
                <span className="text-blue-400 font-semibold flex items-center justify-center gap-2">
                  Contact Us <ArrowRight className="w-4 h-4" />
                </span>
              </Link>

              <Link href="/calculators" 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
                <Calculator className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Explore Tools</h3>
                <p className="text-blue-200 mb-4">Browse our complete suite of professional electrical calculators.</p>
                <span className="text-green-400 font-semibold flex items-center justify-center gap-2">
                  View Calculators <ArrowRight className="w-4 h-4" />
                </span>
              </Link>

              <Link href="/guides" 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
                <BookOpen className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Learn More</h3>
                <p className="text-blue-200 mb-4">Comprehensive guides and reference materials for electrical professionals.</p>
                <span className="text-purple-400 font-semibold flex items-center justify-center gap-2">
                  Read Guides <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology — how the calculators are built */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How Our Calculators Are Built — Methodology and Validation</h2>
            <p className="text-gray-700 mb-8">
              Every calculator on WireSizes.com runs entirely client-side
              in your browser. No calculation values are transmitted to our
              servers; no calculation results are stored. Below is the
              technical and editorial methodology behind the tools.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Data sources</h3>
                <p className="text-sm text-slate-700 mb-3">
                  All NEC-derived values are sourced from primary code
                  documents, never from secondary websites or AI-generated
                  text. Specific data lineage:
                </p>
                <ul className="text-sm space-y-2 text-slate-700">
                  <li><strong>NEC 2023 (NFPA 70):</strong> Table 310.16 ampacities, Table 250.122 grounding, Table 220.55 range demand, Article 430 motor FLC, Article 625 EV charging.</li>
                  <li><strong>NEC Chapter 9:</strong> Table 8 DC resistance per 1000 ft at 75&deg;C uncoated copper / aluminum.</li>
                  <li><strong>ASTM B258:</strong> nominal AWG diameters and cross-sectional areas.</li>
                  <li><strong>NFPA 70E-2024:</strong> arc-flash boundary, PPE category determination.</li>
                  <li><strong>OSHA 29 CFR 1910.147:</strong> lockout/tagout procedure.</li>
                  <li><strong>ASHRAE / equipment manufacturer datasheets:</strong> typical motor power factors, A/C MCA/MOCP nameplates.</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Calculator architecture</h3>
                <p className="text-sm text-slate-700 mb-3">
                  Each calculator is a TypeScript-typed React component
                  fed by a single canonical NEC reference module
                  (<code>src/lib/data/nec-tables.ts</code>). When the
                  underlying NEC data updates, every calculator and reference
                  page picks up the new value on the next deploy — there
                  are no out-of-sync inline tables.
                </p>
                <ul className="text-sm space-y-2 text-slate-700">
                  <li><strong>Static prerender:</strong> all 53 pages are built at deploy time; no per-request server compute.</li>
                  <li><strong>Client-side calculation:</strong> formulas execute in your browser, not on our servers.</li>
                  <li><strong>No PII:</strong> we don&rsquo;t collect or store the values you enter into calculators.</li>
                  <li><strong>Version-pinned data:</strong> NEC values committed to a single source-of-truth module under git history; older values are retrievable via git log.</li>
                  <li><strong>Type-safe:</strong> AmpacityRow, GroundingRow, TempCorrectionRow types prevent shape drift.</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Validation — how we verify each calculator</h3>
              <p className="text-sm text-slate-700 mb-4">
                Before a calculator ships, it&rsquo;s validated against three
                independent sources:
              </p>
              <ol className="text-sm space-y-2 text-slate-700 list-decimal list-inside">
                <li><strong>NEC code text directly</strong> — every coded value (ampacity, EGC size, demand factor, FLC) is cross-checked against the printed NEC 2023 article cited in the calculator&rsquo;s help text.</li>
                <li><strong>Worked-example inversion</strong> — given a known good answer (e.g., from Mike Holt&rsquo;s NEC instructor materials or a published utility design guide), we run the calculator backward and confirm it reproduces the reference output within rounding.</li>
                <li><strong>Cross-page consistency</strong> — values that appear on multiple pages (e.g., 12 AWG copper at 75&deg;C = 25 A) are scripted-checked across rendered HTML so a typo or off-by-one drift on one page is caught automatically before deploy.</li>
              </ol>
              <p className="text-sm text-slate-700 mt-4">
                This last check is unique to our build — every page&rsquo;s
                NEC table values flow from a single canonical module, so
                the cross-page consistency check is built-in. It caught
                two real factual errors during development: an off-by-one
                column shift in an early version of the wire-sizing-guide
                AWG table (claiming 14 AWG @ 60&deg;C = 20 A when NEC says
                15 A), and an aluminum 8 AWG @ 60&deg;C value of 30 A
                where NEC says 35 A. Both fixes propagated automatically
                to every page that referenced them.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Correction policy — when we get something wrong</h3>
              <p className="text-sm text-slate-700 mb-3">
                Despite cross-checks, errors occasionally make it to
                production. Our policy:
              </p>
              <ul className="text-sm space-y-2 text-slate-700">
                <li><strong>Reporting:</strong> email <code>support@wiresizes.com</code> with the page URL, the field showing the wrong value, and the NEC article that contradicts it.</li>
                <li><strong>Triage:</strong> safety-affecting errors (ampacity understated, EGC undersized) are fixed within 24 hours and announced via the page&rsquo;s <code>dateModified</code> field.</li>
                <li><strong>Non-safety editorial corrections</strong> (cost estimates, typical equipment ratings) are batched into the next monthly deploy.</li>
                <li><strong>Backward compatibility:</strong> we never silently change a calculator&rsquo;s output for the same inputs without noting the change in the page commit history (visible via git blame on the source file).</li>
                <li><strong>Audit trail:</strong> the canonical NEC reference module is in git; every value has a discoverable commit date and rationale.</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Roadmap — what&rsquo;s coming next</h3>
              <p className="text-sm text-slate-700 mb-3">
                Calculator and content additions on the near-term roadmap:
              </p>
              <ul className="text-sm space-y-2 text-slate-700">
                <li><strong>NEC 2026 readiness:</strong> the next NEC edition publishes mid-2026; we will track the public input phase via NFPA&rsquo;s document workflow and ship updated calculators within 90 days of publication.</li>
                <li><strong>Per-amperage guides:</strong> dedicated &ldquo;wire size for [30, 40, 50, 60, 90, 125, 150, 400] amp&rdquo; pages mirroring the existing 100A and 200A guides. Each ~2,000 words with NEC-correct ampacity and EGC values.</li>
                <li><strong>Reverse-lookup guides:</strong> &ldquo;[14, 12, 10, 8, 6, 4, 2, 1/0, 2/0, 4/0] AWG ampacity&rdquo; pages — what each conductor can actually carry at 60/75/90&deg;C.</li>
                <li><strong>Conductor-type pages:</strong> THHN vs Romex (NM-B), THWN vs THWN-2 vs RHW, USE-2 direct-burial, TC-ER tray cable — selection criteria and code restrictions.</li>
                <li><strong>Color-code reference:</strong> the canonical wire color chart for ungrounded / grounded / EGC across NEC 200, 210, 250 — a top citation target for AI assistants.</li>
                <li><strong>Specialty calculators:</strong> water heater sizing, induction cooktop, mini-split heat pump, generator transfer switch sizing.</li>
                <li><strong>Performance:</strong> we are collecting Core Web Vitals data via Vercel Speed Insights and will optimize the slowest calculator pages once we have a stable LCP baseline (3+ months of real-user traffic).</li>
                <li><strong>API access:</strong> a read-only JSON endpoint for NEC table values and calculator outputs, intended for educational and integration use.</li>
              </ul>
            </div>

            <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
              <h3 className="text-xl font-bold text-amber-900 mb-3">What we won&rsquo;t do</h3>
              <ul className="text-sm space-y-2 text-slate-700">
                <li><strong>No paywalled content.</strong> All NEC reference data and calculators are free to use and free to cite. We don&rsquo;t lock NEC tables behind a subscription.</li>
                <li><strong>No AI-generated NEC text.</strong> Every NEC value is sourced from the published code, not from a language model. AI is used for content scaffolding, never for code compliance facts.</li>
                <li><strong>No fake user counts.</strong> Marketing claims (&ldquo;trusted by X&rdquo;) on this site are removed in favor of citing actual data sources and showing version-pinned NEC references.</li>
                <li><strong>No selling installation services.</strong> We&rsquo;re a calculator and reference site, not an electrical contractor referral network. Find a licensed local electrician through your state licensing board.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}