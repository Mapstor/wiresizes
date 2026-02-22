import Link from 'next/link';
import { Calculator, Zap, AlertTriangle, Target, BarChart3, BookOpen, TrendingUp, Users, Award } from 'lucide-react';

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

const STATS = [
  { icon: Users, value: '50,000+', label: 'Engineers Educated' },
  { icon: Calculator, value: '29', label: 'Professional Calculators' },
  { icon: BookOpen, value: '6', label: 'Comprehensive Guides' },
  { icon: Award, value: 'NEC 2023', label: 'Code Compliant' },
];

export default function GuidesHomePage() {
  return (
    <div className="space-y-12">
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
    </div>
  );
}