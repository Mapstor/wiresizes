import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Mail, 
  MessageCircle, 
  Phone,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Shield,
  Wrench,
  BookOpen,
  Globe,
  Zap,
  FileText,
  HelpCircle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact WireSizes.com - Professional Electrical Calculator Support',
  description: 'Get professional support for electrical wire sizing calculators, technical assistance, and expert guidance. Multiple contact channels for electrical professionals worldwide.',
  keywords: [
    'electrical calculator support',
    'wire sizing help',
    'technical assistance',
    'electrical engineering support',
    'NEC compliance questions',
    'professional electrical tools',
    'calculator technical support',
    'electrical calculation help',
    'wire size consulting',
    'electrical code assistance'
  ],
  robots: 'index, follow',
  openGraph: {
    title: 'Contact WireSizes.com - Professional Support',
    description: 'Get expert support for electrical calculations, wire sizing, and NEC compliance questions',
    type: 'website',
  }
};

const CONTACT_CHANNELS = [
  {
    type: 'Technical Support',
    icon: Wrench,
    description: 'Calculator issues, technical questions, and platform assistance',
    method: 'Email Support',
    contact: 'support@wiresizes.com',
    response: '24-48 hours',
    availability: 'Monday-Friday, 8 AM - 6 PM EST',
    color: 'blue'
  },
  {
    type: 'Professional Consulting',
    icon: Users,
    description: 'Expert electrical engineering consultation and project guidance',
    method: 'Professional Line',
    contact: 'consulting@wiresizes.com',
    response: '24-48 hours',
    availability: 'Monday-Friday, 9 AM - 5 PM EST',
    color: 'green'
  },
  {
    type: 'Legal & Compliance',
    icon: Shield,
    description: 'Terms of service, privacy policy, and legal compliance questions',
    method: 'Legal Department',
    contact: 'legal@wiresizes.com',
    response: '3-5 business days',
    availability: 'Monday-Friday, 9 AM - 5 PM EST',
    color: 'purple'
  },
  {
    type: 'Educational Resources',
    icon: BookOpen,
    description: 'Training materials, educational partnerships, and curriculum development',
    method: 'Education Team',
    contact: 'education@wiresizes.com',
    response: '2-3 business days',
    availability: 'Monday-Friday, 8 AM - 5 PM EST',
    color: 'orange'
  }
];

const SUPPORT_CATEGORIES = [
  {
    category: 'Calculator Technical Issues',
    icon: Wrench,
    items: [
      'Calculation result discrepancies',
      'Input parameter questions',
      'Browser compatibility issues',
      'Mobile app functionality',
      'Print and export problems',
      'Performance and loading issues'
    ]
  },
  {
    category: 'Electrical Code Questions',
    icon: FileText,
    items: [
      'NEC 2023 interpretation questions',
      'Local code variation guidance',
      'AHJ requirement clarification',
      'Code update notifications',
      'Ampacity table questions',
      'Derating factor applications'
    ]
  },
  {
    category: 'Professional Services',
    icon: Users,
    items: [
      'Custom calculation development',
      'Enterprise integration support',
      'Professional training programs',
      'Bulk licensing options',
      'API access requests',
      'White-label solutions'
    ]
  },
  {
    category: 'Educational Support',
    icon: BookOpen,
    items: [
      'Curriculum development assistance',
      'Student access programs',
      'Training material requests',
      'Certification program support',
      'Academic partnerships',
      'Research collaboration'
    ]
  }
];

const RESPONSE_EXPECTATIONS = [
  {
    priority: 'Critical Safety Issues',
    response: 'Within 2 hours',
    description: 'Calculation errors that could pose safety risks',
    icon: AlertTriangle,
    color: 'red'
  },
  {
    priority: 'Technical Support',
    response: '24-48 hours',
    description: 'Calculator functionality and technical questions',
    icon: Wrench,
    color: 'blue'
  },
  {
    priority: 'General Inquiries',
    response: '2-3 business days',
    description: 'General questions and information requests',
    icon: MessageCircle,
    color: 'green'
  },
  {
    priority: 'Partnership & Business',
    response: '3-5 business days',
    description: 'Business partnerships and commercial inquiries',
    icon: Globe,
    color: 'purple'
  }
];

const PROFESSIONAL_SERVICES = [
  {
    service: 'Custom Calculator Development',
    description: 'Development of specialized calculators for unique electrical applications',
    features: [
      'Custom calculation algorithms',
      'Industry-specific parameters',
      'Integration with existing systems',
      'Professional validation and testing',
      'Ongoing maintenance and updates'
    ],
    contact: 'consulting@wiresizes.com'
  },
  {
    service: 'Enterprise Training Programs',
    description: 'Comprehensive training programs for electrical teams and organizations',
    features: [
      'On-site training sessions',
      'Custom curriculum development',
      'Certification programs',
      'Ongoing support and resources',
      'Performance tracking and assessment'
    ],
    contact: 'education@wiresizes.com'
  },
  {
    service: 'Code Compliance Consulting',
    description: 'Expert guidance on electrical code compliance and interpretation',
    features: [
      'NEC code interpretation',
      'Local code variation guidance',
      'AHJ interaction support',
      'Compliance documentation',
      'Regular code update briefings'
    ],
    contact: 'consulting@wiresizes.com'
  }
];

const INTERNATIONAL_SUPPORT = [
  {
    region: 'North America',
    countries: ['United States', 'Canada', 'Mexico'],
    standards: ['NEC', 'CEC', 'NOM'],
    support: 'Full localization and code support',
    contact: 'support@wiresizes.com'
  },
  {
    region: 'European Union',
    countries: ['Germany', 'France', 'United Kingdom', 'Netherlands', 'Others'],
    standards: ['IEC', 'EN', 'VDE', 'BS'],
    support: 'Limited support, IEC-based calculations',
    contact: 'international@wiresizes.com'
  },
  {
    region: 'Asia Pacific',
    countries: ['Australia', 'New Zealand', 'Japan', 'Singapore'],
    standards: ['AS/NZS', 'JIS', 'SS'],
    support: 'Consultation available for standard adaptation',
    contact: 'international@wiresizes.com'
  },
  {
    region: 'Other Regions',
    countries: ['All other countries'],
    standards: ['Local standards'],
    support: 'General guidance, standard interpretation',
    contact: 'international@wiresizes.com'
  }
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-neutral-50">
      <div className="container py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Contact Us
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Get professional support for electrical wire sizing calculators, technical assistance, and expert guidance. 
            Our team of electrical engineers and support specialists is here to help electrical professionals worldwide.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>24/7 Critical Support Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>International Support</span>
            </div>
          </div>
        </div>

        {/* Quick Contact Alert */}
        <div className="mb-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Critical Safety Issues</h3>
                <p className="text-red-700 mb-4">
                  If you've identified a calculation error that could pose a safety risk, please contact us immediately at:
                </p>
                <div className="bg-red-100 rounded-lg p-4 border border-red-300">
                  <p className="text-red-800 font-semibold">
                    Emergency Contact: <a href="mailto:emergency@wiresizes.com" className="underline">emergency@wiresizes.com</a>
                  </p>
                  <p className="text-red-700 text-sm mt-1">
                    Include "SAFETY CRITICAL" in the subject line for immediate escalation (2-hour response guarantee)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Contact Channels */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Professional Support Channels</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {CONTACT_CHANNELS.map((channel, index) => (
              <div key={index} className={`bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-${channel.color}-100 text-${channel.color}-600`}>
                    <channel.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{channel.type}</h3>
                    <p className="text-gray-600 text-sm mb-4">{channel.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{channel.method}:</span>
                        <a href={`mailto:${channel.contact}`} className={`text-sm font-medium text-${channel.color}-600 hover:underline`}>
                          {channel.contact}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Response: {channel.response}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{channel.availability}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Support Categories</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {SUPPORT_CATEGORIES.map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <category.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
                </div>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Response Time Expectations */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Response Time Expectations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {RESPONSE_EXPECTATIONS.map((expectation, index) => (
              <div key={index} className={`bg-white rounded-xl p-6 border border-${expectation.color}-200 shadow-sm`}>
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-${expectation.color}-100 rounded-lg mb-4`}>
                    <expectation.icon className={`w-6 h-6 text-${expectation.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{expectation.priority}</h3>
                  <div className={`text-lg font-bold text-${expectation.color}-600 mb-2`}>{expectation.response}</div>
                  <p className="text-sm text-gray-600">{expectation.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Professional Services</h2>
          <div className="space-y-8">
            {PROFESSIONAL_SERVICES.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">{service.service}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-6 h-full flex flex-col justify-center">
                      <h4 className="font-semibold text-gray-900 mb-3">Get Started</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Contact our professional services team to discuss your specific requirements and get a customized solution.
                      </p>
                      <a 
                        href={`mailto:${service.contact}?subject=Professional Services Inquiry - ${service.service}`}
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Contact Team
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* International Support */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-600" />
            International Support
          </h2>
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <div className="grid lg:grid-cols-2 gap-8">
              {INTERNATIONAL_SUPPORT.map((region, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{region.region}</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Countries Supported:</h4>
                      <p className="text-sm text-gray-600">{region.countries.join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Standards:</h4>
                      <p className="text-sm text-gray-600">{region.standards.join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Support Level:</h4>
                      <p className="text-sm text-gray-600">{region.support}</p>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <a 
                        href={`mailto:${region.contact}?subject=International Support - ${region.region}`}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Mail className="w-4 h-4" />
                        {region.contact}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-blue-600" />
            Frequently Asked Questions
          </h2>
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Are calculations guaranteed accurate?</h3>
                  <p className="text-sm text-gray-600">
                    Our calculations are based on NEC 2023 standards and extensively tested. However, all results 
                    must be verified by licensed professionals before implementation.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Do you provide installation services?</h3>
                  <p className="text-sm text-gray-600">
                    We provide calculation tools and consulting services only. All electrical installation work 
                    must be performed by licensed electrical contractors.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How often are calculators updated?</h3>
                  <p className="text-sm text-gray-600">
                    We continuously monitor code changes and update our algorithms accordingly. Major updates 
                    follow NEC revision cycles, with minor updates as needed.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Do you support international codes?</h3>
                  <p className="text-sm text-gray-600">
                    Primary support is for NEC-based calculations. Limited support is available for IEC and 
                    other international standards through our consulting services.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Is professional consultation available?</h3>
                  <p className="text-sm text-gray-600">
                    Yes, our team includes licensed electrical engineers available for professional consultation, 
                    project review, and custom solution development.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">What about mobile app support?</h3>
                  <p className="text-sm text-gray-600">
                    Our platform is fully responsive and optimized for mobile use. Native mobile apps are 
                    under development for enhanced offline capabilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Office Information */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Office Information</h2>
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Headquarters
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>WireSizes.com</p>
                  <p>Professional Electrical Calculation Platform</p>
                  <p>United States</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2">Business Hours</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Monday - Friday: 8:00 AM - 6:00 PM EST</p>
                    <p>Saturday: 9:00 AM - 2:00 PM EST</p>
                    <p>Sunday: Emergency support only</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Emergency Contact
                </h3>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-red-800 font-medium mb-2">Critical Safety Issues</p>
                  <p className="text-red-700 text-sm mb-3">
                    For calculation errors that could pose immediate safety risks:
                  </p>
                  <div className="space-y-2">
                    <a href="mailto:emergency@wiresizes.com" className="block text-red-600 font-medium hover:underline">
                      emergency@wiresizes.com
                    </a>
                    <p className="text-xs text-red-600">Available 24/7 • 2-hour response guarantee</p>
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