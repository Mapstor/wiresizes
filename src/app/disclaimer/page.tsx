import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  AlertTriangle, 
  Shield, 
  FileText,
  CheckCircle,
  Scale,
  Zap,
  Users,
  Globe,
  Clock,
  BookOpen,
  HardHat,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Disclaimer - WireSizes.com | Professional Electrical Calculator Limitations',
  description: 'Important disclaimer and limitations for WireSizes.com electrical wire sizing calculators. Understand professional responsibilities, safety requirements, and proper usage guidelines.',
  keywords: [
    'electrical calculator disclaimer',
    'wire sizing limitations',
    'professional responsibility',
    'electrical safety warning',
    'NEC compliance disclaimer',
    'calculation accuracy limits',
    'professional verification required',
    'electrical code compliance',
    'safety disclaimer',
    'liability limitations'
  ],
  robots: 'index, follow',
  openGraph: {
    title: 'Disclaimer - WireSizes.com',
    description: 'Important limitations and professional responsibilities for electrical calculation tools',
    type: 'website',
  }
};

const DISCLAIMER_CATEGORIES = [
  {
    category: 'Professional Verification Required',
    icon: Users,
    severity: 'critical',
    description: 'All calculations must be verified by licensed professionals before implementation',
    details: [
      'Licensed electrical engineer review required for all installations',
      'Local electrical contractor verification mandatory',
      'Authority Having Jurisdiction (AHJ) approval necessary',
      'Professional liability insurance recommended',
      'Continuing education and code updates essential'
    ]
  },
  {
    category: 'Code Compliance Limitations',
    icon: FileText,
    severity: 'critical',
    description: 'Local codes may have more restrictive requirements than NEC minimums',
    details: [
      'Local electrical codes take precedence over NEC minimums',
      'State and municipal code variations not fully incorporated',
      'Special occupancy requirements may not be addressed',
      'Environmental and altitude adjustments may be required',
      'Regular code updates may not be immediately reflected'
    ]
  },
  {
    category: 'Calculation Accuracy Limits',
    icon: AlertCircle,
    severity: 'high',
    description: 'Calculations are based on standard conditions and common applications',
    details: [
      'Standard ambient temperatures assumed (30°C/86°F)',
      'Normal installation conditions presumed',
      'Standard conductor materials and constructions',
      'Common voltage levels and system configurations',
      'Typical load characteristics and power factors'
    ]
  },
  {
    category: 'Safety Responsibilities',
    icon: HardHat,
    severity: 'critical',
    description: 'Users assume full responsibility for electrical safety and code compliance',
    details: [
      'Proper electrical safety procedures must be followed',
      'Personal protective equipment (PPE) requirements',
      'Lockout/tagout (LOTO) procedures mandatory',
      'Arc flash analysis and protection required',
      'Electrical shock prevention measures essential'
    ]
  }
];

const TECHNICAL_LIMITATIONS = [
  {
    limitation: 'Environmental Conditions',
    description: 'Standard calculations assume normal environmental conditions',
    factors: [
      'Ambient temperature variations beyond 30°C (86°F)',
      'High altitude installations above 6,000 feet',
      'Corrosive or wet location requirements',
      'Extreme hot or cold climate adjustments',
      'Special atmospheric conditions'
    ],
    mitigation: 'Consult NEC tables for derating factors and professional engineers for extreme conditions'
  },
  {
    limitation: 'Complex Load Calculations',
    description: 'Simplified calculations may not cover all load scenarios',
    factors: [
      'Non-linear loads and harmonic distortion',
      'Motor starting characteristics and inrush currents',
      'Variable frequency drive (VFD) applications',
      'Power factor correction requirements',
      'Demand factor variations for specific applications'
    ],
    mitigation: 'Professional electrical engineering analysis required for complex load scenarios'
  },
  {
    limitation: 'Installation Method Variables',
    description: 'Standard ampacity ratings assume common installation methods',
    factors: [
      'Cable tray fill calculations',
      'Underground duct bank configurations',
      'Parallel conductor installations',
      'Mixed conductor sizes in same raceway',
      'Special conduit fill requirements'
    ],
    mitigation: 'Detailed installation method analysis and professional engineering review required'
  },
  {
    limitation: 'Equipment Compatibility',
    description: 'Standard calculations may not account for specific equipment requirements',
    factors: [
      'Manufacturer-specific equipment ratings',
      'Terminal temperature limitations',
      'Equipment listing and certification requirements',
      'Special equipment grounding needs',
      'Coordination with protective devices'
    ],
    mitigation: 'Review manufacturer specifications and consult with equipment suppliers'
  }
];

const PROFESSIONAL_STANDARDS = [
  {
    organization: 'National Fire Protection Association (NFPA)',
    standard: 'NFPA 70 - National Electrical Code (NEC)',
    description: 'Primary electrical safety standard for the United States',
    authority: 'Code-making panels of electrical professionals and safety experts',
    website: 'https://www.nfpa.org/codes-and-standards/nfpa-70-national-electrical-code'
  },
  {
    organization: 'Underwriters Laboratories (UL)',
    standard: 'UL Standards for Electrical Equipment',
    description: 'Product safety testing and certification standards',
    authority: 'Independent safety science company',
    website: 'https://www.ul.com/news/understanding-wire-and-cable'
  },
  {
    organization: 'Institute of Electrical and Electronics Engineers (IEEE)',
    standard: 'IEEE Electrical Standards',
    description: 'Technical standards for electrical systems and equipment',
    authority: 'Professional engineering organization',
    website: 'https://www.ieee.org/standards/'
  },
  {
    organization: 'International Association of Electrical Inspectors (IAEI)',
    standard: 'Code Interpretation and Application',
    description: 'Electrical code interpretation and enforcement guidance',
    authority: 'Professional electrical inspectors organization',
    website: 'https://iaei.org/'
  }
];

const USAGE_GUIDELINES = [
  {
    guideline: 'Educational and Reference Use Only',
    description: 'Calculators are intended for educational purposes and preliminary design reference',
    requirements: [
      'Use for learning electrical principles and code requirements',
      'Preliminary design calculations and feasibility studies',
      'Training and educational program support',
      'Professional development and continuing education',
      'Code interpretation and application guidance'
    ]
  },
  {
    guideline: 'Professional Verification Mandatory',
    description: 'All calculations must be verified by qualified electrical professionals',
    requirements: [
      'Licensed electrical engineer review and approval',
      'Professional engineer (PE) stamp where required by law',
      'Licensed electrical contractor verification',
      'Local building department plan review and approval',
      'Authority Having Jurisdiction (AHJ) inspection and approval'
    ]
  },
  {
    guideline: 'Code Compliance Responsibility',
    description: 'Users are responsible for ensuring compliance with all applicable codes',
    requirements: [
      'Current National Electrical Code (NEC) compliance',
      'Local electrical code requirements and variations',
      'State electrical code modifications and additions',
      'Municipal ordinances and special requirements',
      'Occupancy-specific code requirements (hospitals, schools, etc.)'
    ]
  }
];

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-neutral-50">
      <div className="container py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-red-600 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Important Disclaimer
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Critical limitations, professional responsibilities, and safety requirements for using WireSizes.com 
            electrical calculation tools. Please read and understand these important disclaimers before using our platform.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <HardHat className="w-4 h-4" />
              <span>Safety Critical Information</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span>Legal Requirements</span>
            </div>
          </div>
        </div>

        {/* Critical Safety Warning */}
        <div className="mb-16">
          <div className="bg-red-600 text-white rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-red-200" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">CRITICAL SAFETY WARNING</h2>
                <div className="space-y-4 text-red-100">
                  <p className="text-lg leading-relaxed">
                    <strong>ELECTRICAL WORK CAN BE DANGEROUS.</strong> Improper electrical installations can result in 
                    electrocution, fire, property damage, injury, or death. All electrical work must be performed by 
                    qualified, licensed professionals in accordance with applicable electrical codes and regulations.
                  </p>
                  <p className="text-lg leading-relaxed">
                    <strong>PROFESSIONAL VERIFICATION REQUIRED.</strong> These calculators provide reference information only. 
                    All calculations must be verified by licensed electrical professionals before any electrical work is performed.
                  </p>
                  <p className="text-lg leading-relaxed">
                    <strong>CODE COMPLIANCE MANDATORY.</strong> Local electrical codes, regulations, and Authority Having 
                    Jurisdiction (AHJ) requirements take precedence over all calculations and recommendations provided.
                  </p>
                </div>
                <div className="bg-red-700/50 rounded-lg p-4 border border-red-400/30 mt-6">
                  <p className="text-red-100 font-medium">
                    <strong>By using this platform, you acknowledge that you understand these safety requirements and 
                    assume full responsibility for proper professional verification and code compliance.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Disclaimer Categories</h2>
          <div className="space-y-8">
            {DISCLAIMER_CATEGORIES.map((category, index) => (
              <div key={index} className={`rounded-xl p-8 border shadow-sm ${
                category.severity === 'critical' 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    category.severity === 'critical' 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{category.category}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        category.severity === 'critical'
                          ? 'bg-red-200 text-red-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {category.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {category.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                            category.severity === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className="text-sm text-gray-600">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Limitations */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Technical Limitations</h2>
          <div className="space-y-8">
            {TECHNICAL_LIMITATIONS.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.limitation}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h4 className="font-medium text-gray-700 mb-3">Factors Not Fully Addressed:</h4>
                    <ul className="space-y-2">
                      {item.factors.map((factor, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="lg:col-span-1">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">Required Mitigation:</h4>
                      <p className="text-sm text-blue-700">{item.mitigation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Standards */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            Authoritative Standards
          </h2>
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <p className="text-gray-600 mb-6">
              WireSizes.com calculations are based on established industry standards. Users should always reference 
              the most current versions of these standards and consult with the appropriate professional organizations:
            </p>
            <div className="grid lg:grid-cols-2 gap-6">
              {PROFESSIONAL_STANDARDS.map((standard, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{standard.organization}</h3>
                  <h4 className="font-medium text-blue-600 mb-3">{standard.standard}</h4>
                  <p className="text-sm text-gray-600 mb-3">{standard.description}</p>
                  <p className="text-xs text-gray-500 mb-3">Authority: {standard.authority}</p>
                  <a 
                    href={standard.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Visit Official Website
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Proper Usage Guidelines</h2>
          <div className="space-y-6">
            {USAGE_GUIDELINES.map((guideline, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{guideline.guideline}</h3>
                <p className="text-gray-600 mb-4">{guideline.description}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {guideline.requirements.map((requirement, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Scale className="w-8 h-8 text-purple-600" />
            Limitation of Liability
          </h2>
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">No Professional Relationship</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Use of WireSizes.com does not establish a professional engineering relationship or consultation agreement. 
                  Our calculators provide reference information only and do not constitute professional electrical engineering services.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">User Assumes Full Responsibility</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Users assume complete responsibility for the verification, application, and implementation of all calculations 
                  and information obtained from this platform. Professional engineering review and local code compliance 
                  verification are the user's responsibility.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Exclusion of Damages</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  WireSizes.com shall not be liable for any direct, indirect, special, incidental, or consequential damages, 
                  including but not limited to property damage, personal injury, business interruption, or loss of profits 
                  arising from the use of our platform or reliance on our calculations.
                </p>
              </div>
            </div>
            <div className="bg-amber-100 rounded-lg p-4 border border-amber-300 mt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-800 font-medium mb-2">Important Legal Notice</p>
                  <p className="text-amber-700 text-sm">
                    These limitations are an essential part of our service agreement. If you do not agree with these 
                    limitations, you should not use WireSizes.com. Continued use indicates acceptance of all terms and limitations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact for Safety Issues */}
        <div className="mb-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <Zap className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-red-800 mb-4">Report Safety Concerns</h2>
                <p className="text-red-700 mb-4">
                  If you identify any calculation errors or safety concerns with our platform, please report them immediately:
                </p>
                <div className="bg-red-100 rounded-lg p-4 border border-red-300">
                  <div className="space-y-2">
                    <p className="text-red-800 font-semibold">
                      Emergency Safety Contact: <a href="mailto:emergency@wiresizes.com" className="underline">emergency@wiresizes.com</a>
                    </p>
                    <p className="text-red-700 text-sm">
                      Include "SAFETY CRITICAL" in the subject line for immediate escalation
                    </p>
                    <p className="text-red-600 text-xs">
                      Available 24/7 • 2-hour response guarantee for safety-critical issues
                    </p>
                  </div>
                </div>
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
            <Link href="/terms" className="text-blue-600 hover:text-blue-700 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-blue-600 hover:text-blue-700 transition-colors">
              Contact Us
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