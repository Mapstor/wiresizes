import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Scale,
  Gavel,
  Users,
  Globe,
  Clock,
  Mail
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service - WireSizes.com | Professional Electrical Calculator Platform',
  description: 'Complete Terms of Service for WireSizes.com professional electrical wire sizing calculators and educational resources. Legal framework governing platform usage, user responsibilities, and service limitations.',
  keywords: [
    'terms of service',
    'electrical calculator terms',
    'professional tool usage agreement',
    'WireSizes terms',
    'legal agreement',
    'electrical engineering tools',
    'calculator platform terms',
    'user agreement',
    'service terms',
    'electrical calculation disclaimer'
  ],
  robots: 'index, follow',
  openGraph: {
    title: 'Terms of Service - WireSizes.com',
    description: 'Legal terms and conditions for using WireSizes.com professional electrical calculators and resources',
    type: 'website',
  }
};

const PLATFORM_SERVICES = [
  {
    category: 'Core Calculators',
    services: [
      'Wire Size Calculator',
      'Voltage Drop Calculator', 
      'Ampacity Calculator',
      'Ground Wire Calculator',
      'Ohms Law Calculator'
    ]
  },
  {
    category: 'Power Conversion Tools',
    services: [
      'Watts to Amps Converter',
      'Amps to Watts Converter',
      'kW to Amps Calculator',
      'Kilowatts to Amps Calculator',
      'Horsepower to Amps Calculator'
    ]
  },
  {
    category: 'Equipment Specific Calculators',
    services: [
      'AC Wire Size Calculator',
      'EV Charger Wire Size Calculator',
      'Hot Tub Wire Size Calculator',
      'Garage Subpanel Wire Size Calculator',
      'Pool Pump Calculator'
    ]
  },
  {
    category: 'Advanced Calculators',
    services: [
      'Three Phase Calculator',
      'Conduit Fill Calculator',
      'Electrical Load Calculator',
      'Service Entrance Calculator',
      'Motor Circuit Calculator'
    ]
  },
  {
    category: 'Educational Resources',
    services: [
      'Wire Sizing Guides',
      'NEC Code References',
      'Safety Documentation',
      'Technical Articles',
      'Industry Standards'
    ]
  }
];

const USER_RESPONSIBILITIES = [
  {
    title: 'Professional Verification',
    description: 'Users must verify all calculations with licensed electrical professionals and official NEC tables before implementation.',
    icon: CheckCircle,
    importance: 'critical'
  },
  {
    title: 'Code Compliance',
    description: 'All electrical work must comply with local electrical codes, regulations, and Authority Having Jurisdiction (AHJ) requirements.',
    icon: Scale,
    importance: 'critical'
  },
  {
    title: 'Proper Usage',
    description: 'Calculators are for reference and educational purposes only. Users assume full responsibility for application of calculations.',
    icon: Shield,
    importance: 'high'
  },
  {
    title: 'Accurate Input Data',
    description: 'Users must provide accurate input parameters and understand the limitations of each calculation method.',
    icon: FileText,
    importance: 'high'
  },
  {
    title: 'Professional Licensing',
    description: 'Electrical installation work must be performed by appropriately licensed professionals in accordance with local laws.',
    icon: Users,
    importance: 'critical'
  }
];

const PROHIBITED_ACTIVITIES = [
  'Using calculators as sole basis for electrical installations without professional verification',
  'Attempting to reverse engineer or copy proprietary calculation algorithms',
  'Using the platform to violate any local, state, or federal electrical codes',
  'Distributing or reselling calculator results without proper attribution',
  'Automated scraping or data harvesting from the platform',
  'Attempting to overwhelm servers with excessive calculation requests',
  'Using the service for any illegal or unauthorized purposes',
  'Violating intellectual property rights of WireSizes.com or third parties',
  'Misrepresenting qualifications or professional licensing status',
  'Using calculators for life-critical applications without proper professional oversight'
];

const LIMITATION_AREAS = [
  {
    area: 'Calculation Accuracy',
    limitation: 'While based on NEC 2023 standards, calculations may not account for all specific installation conditions or local code variations.',
    mitigation: 'Always verify with local electrical codes and licensed professionals'
  },
  {
    area: 'Environmental Factors',
    limitation: 'Standard calculations may not fully account for extreme environmental conditions, altitude adjustments, or specialized applications.',
    mitigation: 'Consult engineering professionals for specialized installations'
  },
  {
    area: 'Code Updates',
    limitation: 'Electrical codes are periodically updated. Platform updates may lag behind the latest code revisions.',
    mitigation: 'Verify current code requirements with official NEC publications'
  },
  {
    area: 'Local Variations',
    limitation: 'Local electrical codes may have more restrictive requirements than NEC minimums.',
    mitigation: 'Check with local Authority Having Jurisdiction (AHJ) for specific requirements'
  },
  {
    area: 'Complex Installations',
    limitation: 'Calculators address common scenarios but may not cover highly specialized or complex electrical installations.',
    mitigation: 'Engage qualified electrical engineers for complex projects'
  }
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-neutral-50">
      <div className="container py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Terms of Service
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Legal framework governing the use of WireSizes.com professional electrical calculation platform, 
            user responsibilities, and service limitations. Please read carefully before using our services.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Last Updated: February 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Jurisdiction: United States</span>
            </div>
          </div>
        </div>

        {/* Agreement Acceptance */}
        <div className="mb-12">
          <div className="bg-blue-600 text-white rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Gavel className="w-8 h-8 text-blue-200" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
                <p className="text-blue-100 text-lg leading-relaxed mb-6">
                  By accessing and using WireSizes.com (the "Platform"), you agree to be bound by these Terms of Service 
                  and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited 
                  from using or accessing this site.
                </p>
                <div className="bg-blue-700/50 rounded-lg p-4 border border-blue-400/30">
                  <p className="text-blue-100 font-medium">
                    <strong>Important:</strong> These terms specifically govern the use of professional electrical calculation 
                    tools. Misuse of electrical calculations can result in property damage, injury, or death. Professional 
                    verification is required for all electrical work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Description */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Service Description
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Platform Overview</h3>
              <p className="text-gray-600 mb-4">
                WireSizes.com provides professional electrical wire sizing calculators, voltage drop calculators, 
                ampacity tables, and educational resources based on National Electrical Code (NEC) 2023 standards.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 30+ Professional calculation tools</li>
                <li>• NEC 2023 compliant algorithms</li>
                <li>• Educational guides and references</li>
                <li>• Professional-grade accuracy standards</li>
                <li>• Authority links to industry standards</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Intended Use</h3>
              <p className="text-gray-600 mb-4">
                Our tools are designed for electrical professionals, engineers, contractors, and students for 
                reference, education, and preliminary calculations only.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Reference and educational purposes</li>
                <li>• Preliminary design calculations</li>
                <li>• Professional learning and training</li>
                <li>• Code compliance verification assistance</li>
                <li>• Engineering consultation support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Available Services */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Services</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {PLATFORM_SERVICES.map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.category}</h3>
                <ul className="space-y-2">
                  {category.services.map((service, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* User Responsibilities */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            User Responsibilities
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {USER_RESPONSIBILITIES.map((responsibility, index) => (
              <div key={index} className={`bg-white rounded-xl p-6 border shadow-sm ${
                responsibility.importance === 'critical' 
                  ? 'border-red-200 bg-red-50/30' 
                  : 'border-yellow-200 bg-yellow-50/30'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    responsibility.importance === 'critical' 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    <responsibility.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{responsibility.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{responsibility.description}</p>
                    {responsibility.importance === 'critical' && (
                      <div className="mt-3 bg-red-100 rounded-lg p-3 border border-red-200">
                        <p className="text-red-800 text-xs font-medium">
                          CRITICAL REQUIREMENT - Failure to comply may result in safety hazards, code violations, or legal liability.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prohibited Activities */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            Prohibited Activities
          </h2>
          <div className="bg-red-50 rounded-xl p-8 border border-red-200">
            <p className="text-red-800 font-medium mb-6">
              The following activities are strictly prohibited when using WireSizes.com:
            </p>
            <div className="grid lg:grid-cols-2 gap-4">
              {PROHIBITED_ACTIVITIES.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-red-700 text-sm leading-relaxed">{activity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Limitations */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Service Limitations</h2>
          <div className="space-y-6">
            {LIMITATION_AREAS.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.area}</h3>
                    <p className="text-gray-600 text-sm mb-3">{item.limitation}</p>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <p className="text-blue-800 text-sm">
                        <strong>Mitigation:</strong> {item.mitigation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Disclaimer */}
        <div className="mb-12">
          <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-8">
            <div className="flex gap-4">
              <div className="text-amber-600 flex-shrink-0">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-amber-800 mb-4">Professional Disclaimer</h2>
                <div className="space-y-4 text-amber-700">
                  <p className="leading-relaxed">
                    <strong>CRITICAL NOTICE:</strong> All calculations provided by WireSizes.com are for reference 
                    and educational purposes only. These tools do not replace the need for professional electrical 
                    design, engineering review, or code compliance verification.
                  </p>
                  <p className="leading-relaxed">
                    <strong>REQUIRED PROFESSIONAL VERIFICATION:</strong> All electrical work must be designed, 
                    reviewed, and approved by licensed electrical professionals in accordance with local electrical 
                    codes, regulations, and Authority Having Jurisdiction (AHJ) requirements.
                  </p>
                  <p className="leading-relaxed">
                    <strong>USER ASSUMES FULL RESPONSIBILITY:</strong> Users assume complete responsibility for 
                    the application, verification, and implementation of any calculations or information obtained 
                    from this platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Intellectual Property Rights</h2>
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Platform Content</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Calculation algorithms and methodologies</li>
                  <li>• User interface design and functionality</li>
                  <li>• Educational content and documentation</li>
                  <li>• Branding, logos, and visual elements</li>
                  <li>• Database structures and data organization</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Third-Party Rights</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• NEC standards owned by NFPA</li>
                  <li>• UL standards and certifications</li>
                  <li>• Industry association materials</li>
                  <li>• Manufacturer specifications</li>
                  <li>• Open source libraries and frameworks</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Liability Limitations */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Limitation of Liability</h2>
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">No Warranty</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  WireSizes.com is provided "as is" without any representations or warranties, express or implied. 
                  We make no representations or warranties in relation to this website or the information and materials provided.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Limitation of Damages</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Under no circumstances shall WireSizes.com be liable for any direct, indirect, special, incidental, 
                  or consequential damages, including but not limited to property damage, personal injury, business 
                  interruption, or loss of profits arising from use of our platform.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Responsibility</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Users acknowledge that electrical work carries inherent risks and that proper professional oversight, 
                  licensing, and code compliance are essential for safe installations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Updates and Modifications */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Terms Updates</h2>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <p className="text-gray-600 mb-4">
              WireSizes.com reserves the right to revise these Terms of Service at any time. Updated terms will be 
              posted on this page with the revision date clearly marked.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-blue-800 text-sm">
                <strong>User Responsibility:</strong> It is your responsibility to check this page periodically 
                for changes. Continued use of the platform after posting of changes constitutes acceptance of those changes.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Mail className="w-8 h-8 text-blue-600" />
            Contact Information
          </h2>
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal Questions</h3>
                <p className="text-gray-600 mb-4">
                  For questions about these Terms of Service, liability concerns, or legal compliance matters, 
                  please contact our legal department.
                </p>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contact Legal Department
                </Link>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Support</h3>
                <p className="text-gray-600 mb-4">
                  For technical issues, calculator questions, or platform support, our technical team is available 
                  to assist with platform-related inquiries.
                </p>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Technical Support
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/about" className="text-blue-600 hover:text-blue-700 transition-colors">
              About WireSizes.com
            </Link>
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-blue-600 hover:text-blue-700 transition-colors">
              Contact Us
            </Link>
            <Link href="/disclaimer" className="text-blue-600 hover:text-blue-700 transition-colors">
              Disclaimer
            </Link>
            <Link href="/calculators" className="text-blue-600 hover:text-blue-700 transition-colors">
              All Calculators
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}