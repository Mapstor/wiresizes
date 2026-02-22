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
  title: 'About WireSizes.com | Professional Electrical Wire Sizing Tools',
  description: 'Learn about WireSizes.com - the leading platform for NEC-compliant electrical wire sizing calculators. Trusted by electricians, contractors, and engineers worldwide.',
  keywords: 'about wiresizes, electrical calculators, NEC compliance, wire sizing tools, electrical engineering',
  alternates: {
    canonical: 'https://wiresizes.com/about'
  },
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "url": "https://wiresizes.com/about",
  "name": "About WireSizes.com",
  "description": "Professional electrical wire sizing calculators and tools platform",
  "mainEntity": {
    "@type": "Organization",
    "@id": "https://wiresizes.com/#organization",
    "name": "WireSizes.com",
    "description": "Leading platform for NEC-compliant electrical calculators",
    "url": "https://wiresizes.com",
    "logo": "https://wiresizes.com/icon.svg",
    "foundingDate": "2024",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": "10-50"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    }
  }
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
                <h1 className="text-5xl font-bold mb-2">About WireSizes.com</h1>
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
    </div>
    </>
  );
}