import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Calculator, Zap, AlertTriangle, Target, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Electrical Guides | WireSizes.com',
  description: 'Comprehensive electrical engineering guides covering wire sizing, power calculations, NEC codes, and electrical safety.',
};

const GUIDES = [
  {
    slug: 'electrical-power-calculations',
    title: 'Electrical Power Calculations',
    description: 'Master the fundamentals of electrical power, current, voltage, and energy calculations',
    icon: Calculator,
    color: 'blue',
    topics: ['Watts, Amps, Volts', 'Power Factor', 'Single & Three Phase', 'Ohms Law']
  },
  {
    slug: 'nec-code-compliance',
    title: 'NEC Code Compliance Guide',
    description: 'Navigate the National Electrical Code requirements for safe electrical installations',
    icon: Target,
    color: 'amber',
    topics: ['Wire Sizing Rules', 'Circuit Protection', 'Grounding', 'Load Calculations']
  },
  {
    slug: 'power-factor-explained',
    title: 'Power Factor Explained',
    description: 'Understanding reactive power, apparent power, and power factor correction',
    icon: BarChart3,
    color: 'green',
    topics: ['Real vs Apparent Power', 'Inductive Loads', 'Capacitive Correction', 'Efficiency']
  },
  {
    slug: 'single-vs-three-phase',
    title: 'Single vs Three Phase Systems',
    description: 'Compare electrical distribution systems and their applications',
    icon: Zap,
    color: 'purple',
    topics: ['Voltage Systems', 'Load Distribution', 'Motor Applications', 'Power Transmission']
  },
  {
    slug: 'wire-sizing-guide',
    title: 'Complete Wire Sizing Guide',
    description: 'Everything you need to know about selecting the right wire size',
    icon: AlertTriangle,
    color: 'red',
    topics: ['AWG Sizes', 'Ampacity Tables', 'Voltage Drop', 'Temperature Derating']
  },
  {
    slug: 'electrical-safety',
    title: 'Electrical Safety Fundamentals',
    description: 'Essential safety practices for electrical work and installations',
    icon: BookOpen,
    color: 'gray',
    topics: ['Arc Flash', 'OSHA Standards', 'PPE Requirements', 'Lockout/Tagout']
  },
];

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Electrical Engineering Guides</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Professional-grade electrical engineering education with interactive calculators, 
            detailed explanations, and real-world examples.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h2 className="font-semibold text-gray-900 mb-4">Guide Topics</h2>
              <nav className="space-y-2">
                {GUIDES.map((guide) => {
                  const IconComponent = guide.icon;
                  return (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.slug}`}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-${guide.color}-50 hover:text-${guide.color}-700`}
                    >
                      <IconComponent className={`w-5 h-5 text-${guide.color}-600`} />
                      <span className="text-sm font-medium">{guide.title}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Quick Calculator Links */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Calculators</h3>
                <div className="space-y-2">
                  <Link
                    href="/calculators/wire-size-calculator"
                    className="block text-sm text-primary-600 hover:text-primary-700 p-2 rounded hover:bg-primary-50"
                  >
                    Wire Size Calculator
                  </Link>
                  <Link
                    href="/calculators/voltage-drop-calculator"
                    className="block text-sm text-primary-600 hover:text-primary-700 p-2 rounded hover:bg-primary-50"
                  >
                    Voltage Drop Calculator
                  </Link>
                  <Link
                    href="/calculators/amps-to-watts-calculator"
                    className="block text-sm text-primary-600 hover:text-primary-700 p-2 rounded hover:bg-primary-50"
                  >
                    Amps to Watts Calculator
                  </Link>
                  <Link
                    href="/calculators"
                    className="block text-sm font-medium text-gray-700 hover:text-primary-700 p-2 rounded hover:bg-gray-50"
                  >
                    View All Calculators →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}