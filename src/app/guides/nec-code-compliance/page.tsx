import Link from 'next/link';
import { Target, AlertTriangle, CheckCircle, BookOpen, Calculator, Zap, FileText, ExternalLink, ArrowRight, Shield, Activity, Eye, TrendingUp, BarChart3 } from 'lucide-react';

export const metadata = {
  title: 'NEC Code Compliance Guide | National Electrical Code Requirements 2023',
  description: 'Comprehensive NEC code compliance guide covering wire sizing, circuit protection, grounding, load calculations, and safety requirements with detailed tables and examples.',
  keywords: 'NEC code, National Electrical Code, electrical compliance, wire sizing code, circuit protection, electrical safety',
};

const AMPACITY_TABLE_310_16 = [
  { awg: '14', temp_60c: { cu: 20, al: 15 }, temp_75c: { cu: 25, al: 20 }, temp_90c: { cu: 30, al: 25 }, typical_use: 'Branch circuits, lighting' },
  { awg: '12', temp_60c: { cu: 25, al: 20 }, temp_75c: { cu: 30, al: 25 }, temp_90c: { cu: 35, al: 30 }, typical_use: 'General outlets, small appliances' },
  { awg: '10', temp_60c: { cu: 35, al: 30 }, temp_75c: { cu: 40, al: 35 }, temp_90c: { cu: 45, al: 40 }, typical_use: 'Water heaters, large appliances' },
  { awg: '8', temp_60c: { cu: 50, al: 40 }, temp_75c: { cu: 55, al: 45 }, temp_90c: { cu: 65, al: 55 }, typical_use: 'Sub-panels, large loads' },
  { awg: '6', temp_60c: { cu: 65, al: 50 }, temp_75c: { cu: 75, al: 65 }, temp_90c: { cu: 85, al: 75 }, typical_use: 'AC units, electric ranges' },
  { awg: '4', temp_60c: { cu: 85, al: 65 }, temp_75c: { cu: 95, al: 75 }, temp_90c: { cu: 110, al: 85 }, typical_use: 'Service entrances, feeders' },
  { awg: '2', temp_60c: { cu: 115, al: 90 }, temp_75c: { cu: 130, al: 100 }, temp_90c: { cu: 150, al: 115 }, typical_use: 'Main service panels' },
  { awg: '1/0', temp_60c: { cu: 150, al: 120 }, temp_75c: { cu: 170, al: 135 }, temp_90c: { cu: 195, al: 150 }, typical_use: 'Large service entrances' },
  { awg: '2/0', temp_60c: { cu: 175, al: 135 }, temp_75c: { cu: 195, al: 150 }, temp_90c: { cu: 225, al: 175 }, typical_use: 'Commercial feeders' },
  { awg: '4/0', temp_60c: { cu: 230, al: 180 }, temp_75c: { cu: 260, al: 205 }, temp_90c: { cu: 300, al: 230 }, typical_use: 'Industrial applications' },
];

const OVERCURRENT_PROTECTION = [
  { circuit_type: 'Lighting Circuits', wire_size: '14 AWG', max_breaker: '15A', nec_ref: '210.3', application: 'General lighting, receptacles' },
  { circuit_type: 'General Purpose', wire_size: '12 AWG', max_breaker: '20A', nec_ref: '210.3', application: 'Kitchen, bathroom, garage outlets' },
  { circuit_type: 'Small Appliance', wire_size: '12 AWG', max_breaker: '20A', nec_ref: '210.11(C)(1)', application: 'Kitchen countertop outlets' },
  { circuit_type: 'Laundry', wire_size: '12 AWG', max_breaker: '20A', nec_ref: '210.11(C)(2)', application: 'Dedicated laundry outlet' },
  { circuit_type: 'Electric Range', wire_size: '6 AWG', max_breaker: '50A', nec_ref: '210.19(A)(3)', application: '8-10 kW electric ranges' },
  { circuit_type: 'Water Heater', wire_size: '10 AWG', max_breaker: '30A', nec_ref: '422.13', application: '4500W water heaters' },
  { circuit_type: 'Air Conditioner', wire_size: '12 AWG', max_breaker: '25A', nec_ref: 'Article 440', application: 'Central AC compressor' },
];

const GROUNDING_CONDUCTOR_TABLE = [
  { service_size: '100A', grounding_electrode: '8 AWG Cu', equipment_grounding: '8 AWG Cu', bonding_jumper: '6 AWG Cu' },
  { service_size: '150A', grounding_electrode: '6 AWG Cu', equipment_grounding: '6 AWG Cu', bonding_jumper: '4 AWG Cu' },
  { service_size: '200A', grounding_electrode: '4 AWG Cu', equipment_grounding: '4 AWG Cu', bonding_jumper: '2 AWG Cu' },
  { service_size: '300A', grounding_electrode: '2 AWG Cu', equipment_grounding: '2 AWG Cu', bonding_jumper: '1/0 AWG Cu' },
  { service_size: '400A', grounding_electrode: '1/0 AWG Cu', equipment_grounding: '1/0 AWG Cu', bonding_jumper: '2/0 AWG Cu' },
];

const LOAD_CALCULATION_FACTORS = [
  { load_type: 'General Lighting', demand_factor: '100%', watts_per_sqft: 3.5, nec_reference: '220.12' },
  { load_type: 'Small Appliance', demand_factor: '100%', watts_per_sqft: 'N/A', nec_reference: '220.52(A)' },
  { load_type: 'Laundry', demand_factor: '100%', watts_per_sqft: 'N/A', nec_reference: '220.52(B)' },
  { load_type: 'Electric Range', demand_factor: '80%', watts_per_sqft: 'N/A', nec_reference: '220.55' },
  { load_type: 'Water Heater', demand_factor: '100%', watts_per_sqft: 'N/A', nec_reference: '220.82' },
  { load_type: 'Air Conditioning', demand_factor: '100%', watts_per_sqft: 'N/A', nec_reference: '220.83(C)' },
  { load_type: 'Heat Pump', demand_factor: '100%', watts_per_sqft: 'N/A', nec_reference: '220.82(C)' },
];

const VOLTAGE_DROP_STANDARDS = [
  { circuit_type: 'Branch Circuits', max_voltage_drop: '3%', nec_recommendation: '210.19(A)', calculation_basis: 'Furthest outlet' },
  { circuit_type: 'Feeders', max_voltage_drop: '3%', nec_recommendation: '215.2(A)(1)', calculation_basis: 'Service point to panel' },
  { circuit_type: 'Combined Total', max_voltage_drop: '5%', nec_recommendation: 'FPN No. 2', calculation_basis: 'Service to furthest load' },
];

const INSTALLATION_METHODS = [
  { method: 'Romex (NM Cable)', indoor_rating: 'Yes', outdoor_rating: 'No', wet_location: 'No', temp_rating: '90°C', applications: ['Residential wiring', 'Dry locations'] },
  { method: 'THWN/THHN', indoor_rating: 'Yes', outdoor_rating: 'Yes', wet_location: 'Yes', temp_rating: '90°C', applications: ['Conduit installations', 'Commercial/Industrial'] },
  { method: 'UF Cable', indoor_rating: 'Yes', outdoor_rating: 'Yes', wet_location: 'Yes', temp_rating: '90°C', applications: ['Underground feeders', 'Outdoor circuits'] },
  { method: 'MC Cable', indoor_rating: 'Yes', outdoor_rating: 'No', wet_location: 'No', temp_rating: '90°C', applications: ['Commercial buildings', 'Exposed installations'] },
  { method: 'Rigid Conduit', indoor_rating: 'Yes', outdoor_rating: 'Yes', wet_location: 'Yes', temp_rating: 'N/A', applications: ['Industrial', 'Hazardous locations'] },
];

const SAFETY_REQUIREMENTS = [
  { 
    area: 'GFCI Protection', 
    requirement: 'Required in bathrooms, kitchens, outdoors, basements, garages', 
    nec_ref: '210.8', 
    violations: ['Missing GFCI in wet locations', 'Improper GFCI wiring'],
    solution: 'Install GFCI outlets or circuit breakers'
  },
  { 
    area: 'AFCI Protection', 
    requirement: 'Required in bedrooms, living areas (2020+ NEC)', 
    nec_ref: '210.12', 
    violations: ['No AFCI protection in required areas', 'Wrong AFCI type'],
    solution: 'Install AFCI circuit breakers'
  },
  { 
    area: 'Dedicated Circuits', 
    requirement: 'Required for major appliances', 
    nec_ref: '210.23', 
    violations: ['Overloaded circuits', 'Sharing dedicated circuits'],
    solution: 'Install separate circuits for major loads'
  },
];

export default function NECCodeComplianceGuide() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 border-2 border-amber-200">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-10 h-10 text-amber-600" />
            <h1 className="text-4xl font-bold text-gray-900">NEC Code Compliance Guide</h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Master the National Electrical Code (NEC 2023) requirements for safe electrical installations. 
            This comprehensive guide covers wire sizing, circuit protection, grounding, and load calculations 
            with detailed tables, examples, and compliance checklists.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/calculators/wire-size-calculator"
              className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Wire Size Calculator
            </Link>
            <div className="flex items-center gap-2 text-sm text-amber-700">
              <Shield className="w-4 h-4" />
              NEC 2023 Compliant
            </div>
            <div className="flex items-center gap-2 text-sm text-amber-700">
              <BookOpen className="w-4 h-4" />
              25 min comprehensive read
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Navigation</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="#ampacity-tables" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Ampacity Tables</span>
          </Link>
          <Link href="#overcurrent-protection" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="font-medium">Circuit Protection</span>
          </Link>
          <Link href="#grounding-systems" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span className="font-medium">Grounding Systems</span>
          </Link>
          <Link href="#load-calculations" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
            <Calculator className="w-5 h-5 text-purple-600" />
            <span className="font-medium">Load Calculations</span>
          </Link>
        </div>
      </div>

      {/* NEC Ampacity Table 310.16 */}
      <div id="ampacity-tables" className="bg-white rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">NEC Table 310.16 - Conductor Ampacities</h2>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>Important:</strong> These ampacities are for copper and aluminum conductors in raceway, cable, or directly buried. 
              Apply derating factors for ambient temperature and conductor bundling per NEC 310.15(B).
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-3 text-left font-semibold">Wire Size (AWG)</th>
                <th className="border px-4 py-3 text-center font-semibold" colSpan={2}>60°C (140°F)</th>
                <th className="border px-4 py-3 text-center font-semibold" colSpan={2}>75°C (167°F)</th>
                <th className="border px-4 py-3 text-center font-semibold" colSpan={2}>90°C (194°F)</th>
                <th className="border px-4 py-3 text-left font-semibold">Typical Applications</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border px-4 py-2 text-xs"></th>
                <th className="border px-4 py-2 text-xs">Cu</th>
                <th className="border px-4 py-2 text-xs">Al</th>
                <th className="border px-4 py-2 text-xs">Cu</th>
                <th className="border px-4 py-2 text-xs">Al</th>
                <th className="border px-4 py-2 text-xs">Cu</th>
                <th className="border px-4 py-2 text-xs">Al</th>
                <th className="border px-4 py-2 text-xs"></th>
              </tr>
            </thead>
            <tbody>
              {AMPACITY_TABLE_310_16.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-3 font-mono font-bold">{row.awg}</td>
                  <td className="border px-4 py-3 text-center">{row.temp_60c.cu}A</td>
                  <td className="border px-4 py-3 text-center">{row.temp_60c.al}A</td>
                  <td className="border px-4 py-3 text-center font-semibold text-green-600">{row.temp_75c.cu}A</td>
                  <td className="border px-4 py-3 text-center font-semibold text-green-600">{row.temp_75c.al}A</td>
                  <td className="border px-4 py-3 text-center">{row.temp_90c.cu}A</td>
                  <td className="border px-4 py-3 text-center">{row.temp_90c.al}A</td>
                  <td className="border px-4 py-3 text-sm text-gray-600">{row.typical_use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3">Temperature Derating Factors (NEC 310.15)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>21-25°C (70-77°F):</span>
                <span className="font-mono">1.08</span>
              </div>
              <div className="flex justify-between">
                <span>26-30°C (78-86°F):</span>
                <span className="font-mono">1.00</span>
              </div>
              <div className="flex justify-between">
                <span>31-35°C (87-95°F):</span>
                <span className="font-mono">0.91</span>
              </div>
              <div className="flex justify-between">
                <span>36-40°C (96-104°F):</span>
                <span className="font-mono">0.82</span>
              </div>
              <div className="flex justify-between">
                <span>41-45°C (105-113°F):</span>
                <span className="font-mono">0.71</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-800 mb-3">Bundling Derating (NEC 310.15(B)(3)(a))</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>4-6 conductors:</span>
                <span className="font-mono">0.80</span>
              </div>
              <div className="flex justify-between">
                <span>7-9 conductors:</span>
                <span className="font-mono">0.70</span>
              </div>
              <div className="flex justify-between">
                <span>10-20 conductors:</span>
                <span className="font-mono">0.50</span>
              </div>
              <div className="flex justify-between">
                <span>21-30 conductors:</span>
                <span className="font-mono">0.45</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link 
            href="/calculators/ampacity-calculator"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Calculator className="w-5 h-5" />
            Use Ampacity Calculator
          </Link>
        </div>
      </div>

      {/* Overcurrent Protection */}
      <div id="overcurrent-protection" className="bg-white rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">Overcurrent Protection Requirements</h2>
        </div>

        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-3">NEC 240.4 - Protection of Conductors</h3>
          <p className="text-sm text-green-700 mb-3">
            Conductors must be protected against overcurrent in accordance with their ampacities. 
            The overcurrent device rating cannot exceed the conductor ampacity, except for specific exceptions.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-green-800">Standard Sizes (240.6):</h4>
              <div className="font-mono text-green-700">15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100A...</div>
            </div>
            <div>
              <h4 className="font-medium text-green-800">Small Conductor Protection (240.4(D)):</h4>
              <div className="text-green-700">14 AWG: 15A max, 12 AWG: 20A max, 10 AWG: 30A max</div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-3 text-left font-semibold">Circuit Type</th>
                <th className="border px-4 py-3 text-left font-semibold">Wire Size</th>
                <th className="border px-4 py-3 text-left font-semibold">Max Breaker</th>
                <th className="border px-4 py-3 text-left font-semibold">NEC Reference</th>
                <th className="border px-4 py-3 text-left font-semibold">Application</th>
              </tr>
            </thead>
            <tbody>
              {OVERCURRENT_PROTECTION.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-3 font-medium">{row.circuit_type}</td>
                  <td className="border px-4 py-3 font-mono">{row.wire_size}</td>
                  <td className="border px-4 py-3 font-bold text-red-600">{row.max_breaker}</td>
                  <td className="border px-4 py-3 text-blue-600 font-mono text-sm">{row.nec_ref}</td>
                  <td className="border px-4 py-3 text-sm text-gray-600">{row.application}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Common Violations
            </h3>
            <ul className="space-y-2 text-sm text-red-700">
              <li>• Oversized breakers for wire capacity</li>
              <li>• Missing GFCI/AFCI protection</li>
              <li>• Shared neutrals without proper protection</li>
              <li>• Incorrect motor circuit protection</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Inspection Points
            </h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Verify breaker size matches wire rating</li>
              <li>• Check for proper arc fault protection</li>
              <li>• Confirm GFCI in required locations</li>
              <li>• Validate motor overload protection</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Best Practices
            </h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li>• Use 75°C column for sizing</li>
              <li>• Apply derating factors properly</li>
              <li>• Install proper OCPD coordination</li>
              <li>• Document all calculations</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/calculators/circuit-breaker-calculator"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <Shield className="w-5 h-5" />
            Circuit Breaker Calculator
          </Link>
        </div>
      </div>

      {/* Grounding Systems */}
      <div id="grounding-systems" className="bg-white rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-8 h-8 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900">Grounding & Bonding Systems</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">NEC Article 250 - Grounding Requirements</h3>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Grounding Electrode System (250.50)</h4>
                <ul className="space-y-2 text-sm text-yellow-700">
                  <li>• Metal water pipe (250.52(A)(1))</li>
                  <li>• Metal building frame (250.52(A)(2))</li>
                  <li>• Concrete-encased electrode (250.52(A)(3))</li>
                  <li>• Ground ring (250.52(A)(4))</li>
                  <li>• Rod and pipe electrodes (250.52(A)(5))</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Equipment Grounding (250.118)</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Equipment grounding conductors</li>
                  <li>• Conduit systems (rigid, IMC, EMT)</li>
                  <li>• Cable armor and sheaths</li>
                  <li>• Grounding-type receptacles</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Grounding Conductor Sizing (NEC 250.122)</h3>
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border px-3 py-2 text-left">Service Size</th>
                    <th className="border px-3 py-2 text-left">Grounding Electrode</th>
                    <th className="border px-3 py-2 text-left">Equipment Ground</th>
                    <th className="border px-3 py-2 text-left">Bonding Jumper</th>
                  </tr>
                </thead>
                <tbody>
                  {GROUNDING_CONDUCTOR_TABLE.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border px-3 py-2 font-bold">{row.service_size}</td>
                      <td className="border px-3 py-2 font-mono">{row.grounding_electrode}</td>
                      <td className="border px-3 py-2 font-mono">{row.equipment_grounding}</td>
                      <td className="border px-3 py-2 font-mono">{row.bonding_jumper}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200 p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">Grounding System Diagram</h3>
          <div className="bg-white rounded-lg p-4 mb-4">
            {/* SVG Grounding System Diagram */}
            <svg viewBox="0 0 600 400" className="w-full h-64">
              {/* Service Panel */}
              <rect x="50" y="50" width="100" height="150" fill="#e5e7eb" stroke="#374151" strokeWidth="2" />
              <text x="100" y="40" textAnchor="middle" className="text-sm font-semibold fill-gray-700">Service Panel</text>
              
              {/* Grounding Electrode Conductor */}
              <line x1="150" y1="125" x2="250" y2="125" stroke="#22c55e" strokeWidth="3" />
              <text x="200" y="115" textAnchor="middle" className="text-xs fill-green-600">GEC</text>
              
              {/* Grounding Electrode */}
              <circle cx="270" cy="125" r="15" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
              <text x="270" y="150" textAnchor="middle" className="text-xs fill-amber-600">Electrode</text>
              
              {/* Equipment Grounding Conductor */}
              <line x1="100" y1="200" x2="100" y2="300" stroke="#3b82f6" strokeWidth="3" />
              <line x1="100" y1="300" x2="200" y2="300" stroke="#3b82f6" strokeWidth="3" />
              
              {/* Load Equipment */}
              <rect x="200" y="280" width="60" height="40" fill="#f3f4f6" stroke="#6b7280" strokeWidth="2" />
              <text x="230" y="305" textAnchor="middle" className="text-xs fill-gray-600">Load</text>
              
              {/* Grounding symbols */}
              <g>
                <line x1="265" y1="140" x2="275" y2="140" stroke="#000" strokeWidth="2" />
                <line x1="267" y1="145" x2="273" y2="145" stroke="#000" strokeWidth="2" />
                <line x1="269" y1="150" x2="271" y2="150" stroke="#000" strokeWidth="2" />
              </g>
              
              {/* Labels */}
              <text x="400" y="80" className="text-sm font-semibold fill-gray-700">Grounding System Components:</text>
              <text x="400" y="105" className="text-xs fill-green-600">• GEC: Grounding Electrode Conductor</text>
              <text x="400" y="125" className="text-xs fill-blue-600">• EGC: Equipment Grounding Conductor</text>
              <text x="400" y="145" className="text-xs fill-amber-600">• Grounding Electrode (Rod, Ufer, etc.)</text>
              <text x="400" y="165" className="text-xs fill-gray-600">• Main Bonding Jumper in Panel</text>
            </svg>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-green-100 rounded p-3">
              <h4 className="font-medium text-green-800">Grounding Electrode Conductor</h4>
              <p className="text-green-700">Connects electrical system to earth via grounding electrodes</p>
            </div>
            <div className="bg-blue-100 rounded p-3">
              <h4 className="font-medium text-blue-800">Equipment Grounding Conductor</h4>
              <p className="text-blue-700">Provides fault current return path for safety</p>
            </div>
            <div className="bg-amber-100 rounded p-3">
              <h4 className="font-medium text-amber-800">Bonding Jumpers</h4>
              <p className="text-amber-700">Ensures electrical continuity in the grounding system</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/calculators/ground-wire-calculator"
            className="inline-flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
          >
            <Zap className="w-5 h-5" />
            Ground Wire Calculator
          </Link>
        </div>
      </div>

      {/* Load Calculations */}
      <div id="load-calculations" className="bg-white rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Load Calculations (NEC Article 220)</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Standard Method (220.82)</h3>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-purple-800 mb-3">Dwelling Unit Load Calculation</h4>
              <div className="space-y-3 text-sm">
                <div className="bg-white rounded p-3">
                  <strong>1. General Lighting Load:</strong><br/>
                  <span className="text-purple-700">3.5 VA per sq ft × dwelling area</span>
                </div>
                <div className="bg-white rounded p-3">
                  <strong>2. Small Appliance Circuits:</strong><br/>
                  <span className="text-purple-700">1,500 VA × number of circuits (minimum 2)</span>
                </div>
                <div className="bg-white rounded p-3">
                  <strong>3. Laundry Circuit:</strong><br/>
                  <span className="text-purple-700">1,500 VA</span>
                </div>
                <div className="bg-white rounded p-3">
                  <strong>4. Appliance Loads:</strong><br/>
                  <span className="text-purple-700">Nameplate rating of fixed appliances</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Demand Factors</h3>
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border px-3 py-2 text-left">Load Type</th>
                    <th className="border px-3 py-2 text-center">Demand Factor</th>
                    <th className="border px-3 py-2 text-center">NEC Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {LOAD_CALCULATION_FACTORS.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border px-3 py-2 font-medium">{row.load_type}</td>
                      <td className="border px-3 py-2 text-center font-mono font-bold text-purple-600">
                        {row.demand_factor}
                      </td>
                      <td className="border px-3 py-2 text-center text-blue-600 font-mono">
                        {row.nec_reference}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border p-6 mb-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-4">Sample Calculation: 2,000 sq ft Dwelling</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-purple-800 mb-3">Calculated Loads</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>General Lighting:</span>
                  <span className="font-mono">2,000 × 3.5 = 7,000 VA</span>
                </div>
                <div className="flex justify-between">
                  <span>Small Appliance (2):</span>
                  <span className="font-mono">2 × 1,500 = 3,000 VA</span>
                </div>
                <div className="flex justify-between">
                  <span>Laundry:</span>
                  <span className="font-mono">1,500 VA</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold">
                  <span>Subtotal:</span>
                  <span className="font-mono">11,500 VA</span>
                </div>
                <div className="flex justify-between">
                  <span>First 3,000 VA @ 100%:</span>
                  <span className="font-mono">3,000 VA</span>
                </div>
                <div className="flex justify-between">
                  <span>Remainder @ 35%:</span>
                  <span className="font-mono">8,500 × 0.35 = 2,975 VA</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold text-purple-700">
                  <span>Net Calculated Load:</span>
                  <span className="font-mono">5,975 VA</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-purple-800 mb-3">Service Size Determination</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Net Load:</span>
                  <span className="font-mono">5,975 VA</span>
                </div>
                <div className="flex justify-between">
                  <span>Voltage:</span>
                  <span className="font-mono">240V</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Calculated Amperage:</span>
                  <span className="font-mono">5,975 ÷ 240 = 24.9A</span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum Service:</span>
                  <span className="font-mono font-bold text-green-600">100A</span>
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  Note: NEC 230.79(C) requires minimum 100A service for dwellings
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/calculators/electrical-load-calculator"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            <Calculator className="w-5 h-5" />
            Load Calculation Calculator
          </Link>
        </div>
      </div>

      {/* Voltage Drop Requirements */}
      <div className="bg-white rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-8 h-8 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">Voltage Drop Standards</h2>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-800 mb-3">NEC Recommendations (Fine Print Notes)</h3>
          <p className="text-sm text-red-700 mb-3">
            While voltage drop limits are not code requirements, NEC provides recommendations 
            in Fine Print Notes for proper system performance and equipment operation.
          </p>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-3 text-left font-semibold">Circuit Type</th>
                <th className="border px-4 py-3 text-center font-semibold">Max Voltage Drop</th>
                <th className="border px-4 py-3 text-left font-semibold">NEC Reference</th>
                <th className="border px-4 py-3 text-left font-semibold">Calculation Basis</th>
              </tr>
            </thead>
            <tbody>
              {VOLTAGE_DROP_STANDARDS.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-3 font-medium">{row.circuit_type}</td>
                  <td className="border px-4 py-3 text-center font-bold text-red-600 text-lg">{row.max_voltage_drop}</td>
                  <td className="border px-4 py-3 text-blue-600 font-mono">{row.nec_recommendation}</td>
                  <td className="border px-4 py-3 text-sm text-gray-600">{row.calculation_basis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-3">Voltage Drop Formula</h3>
            <div className="bg-white rounded p-3 mb-3">
              <div className="font-mono text-center">
                <div className="text-lg">VD = (2 × K × I × L) ÷ CM</div>
                <div className="text-sm text-gray-600 mt-2">
                  Single-phase and DC circuits
                </div>
              </div>
            </div>
            <div className="bg-white rounded p-3">
              <div className="font-mono text-center">
                <div className="text-lg">VD = (1.73 × K × I × L) ÷ CM</div>
                <div className="text-sm text-gray-600 mt-2">
                  Three-phase circuits
                </div>
              </div>
            </div>
            <div className="text-xs text-blue-700 mt-3">
              Where: VD = Voltage Drop, K = Resistance constant (12.9 Cu, 21.2 Al), 
              I = Current (A), L = Length (ft), CM = Circular Mils
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3">Impact of Excessive Voltage Drop</h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 text-red-500" />
                <span>Reduced equipment efficiency and lifespan</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 text-red-500" />
                <span>Motor overheating and poor starting</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 text-red-500" />
                <span>Lighting dimming and flickering</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 text-red-500" />
                <span>Increased energy consumption</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 text-red-500" />
                <span>Equipment malfunction or damage</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/calculators/voltage-drop-calculator"
            className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            <TrendingUp className="w-5 h-5" />
            Voltage Drop Calculator
          </Link>
        </div>
      </div>

      {/* Installation Methods */}
      <div className="bg-white rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">Wiring Methods & Installation</h2>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-3 text-left font-semibold">Installation Method</th>
                <th className="border px-4 py-3 text-center font-semibold">Indoor</th>
                <th className="border px-4 py-3 text-center font-semibold">Outdoor</th>
                <th className="border px-4 py-3 text-center font-semibold">Wet Location</th>
                <th className="border px-4 py-3 text-center font-semibold">Temp Rating</th>
                <th className="border px-4 py-3 text-left font-semibold">Typical Applications</th>
              </tr>
            </thead>
            <tbody>
              {INSTALLATION_METHODS.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-3 font-medium">{row.method}</td>
                  <td className="border px-4 py-3 text-center">
                    {row.indoor_rating === 'Yes' ? 
                      <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : 
                      <AlertTriangle className="w-5 h-5 text-red-600 mx-auto" />
                    }
                  </td>
                  <td className="border px-4 py-3 text-center">
                    {row.outdoor_rating === 'Yes' ? 
                      <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : 
                      <AlertTriangle className="w-5 h-5 text-red-600 mx-auto" />
                    }
                  </td>
                  <td className="border px-4 py-3 text-center">
                    {row.wet_location === 'Yes' ? 
                      <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : 
                      <AlertTriangle className="w-5 h-5 text-red-600 mx-auto" />
                    }
                  </td>
                  <td className="border px-4 py-3 text-center font-mono font-bold">{row.temp_rating}</td>
                  <td className="border px-4 py-3 text-sm">
                    <ul>
                      {row.applications.map((app, appIndex) => (
                        <li key={appIndex}>• {app}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety Requirements */}
      <div className="bg-white rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">Critical Safety Requirements</h2>
        </div>

        <div className="space-y-6">
          {SAFETY_REQUIREMENTS.map((req, index) => (
            <div key={index} className="border-l-4 border-red-500 bg-red-50 rounded-r-lg p-6">
              <h3 className="text-xl font-semibold text-red-900 mb-2">{req.area}</h3>
              <p className="text-red-800 mb-4">{req.requirement}</p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">NEC Reference:</h4>
                  <div className="bg-white rounded p-2 font-mono text-blue-600">{req.nec_ref}</div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Common Violations:</h4>
                  <ul className="text-sm text-red-700">
                    {req.violations.map((violation, vIndex) => (
                      <li key={vIndex} className="flex items-start gap-2">
                        <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {violation}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Solution:</h4>
                  <div className="text-sm text-red-700 bg-white rounded p-2">
                    {req.solution}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Tools */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">NEC Compliance Calculators</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Wire Size Calculator', slug: 'wire-size-calculator', icon: Calculator, color: 'blue', description: 'NEC compliant wire sizing' },
            { name: 'Ampacity Calculator', slug: 'ampacity-calculator', icon: BarChart3, color: 'green', description: 'Derating factors included' },
            { name: 'Load Calculator', slug: 'electrical-load-calculator', icon: TrendingUp, color: 'purple', description: 'Article 220 calculations' },
            { name: 'Ground Wire Calculator', slug: 'ground-wire-calculator', icon: Zap, color: 'yellow', description: 'Table 250.122 sizing' },
            { name: 'Circuit Breaker Calculator', slug: 'circuit-breaker-calculator', icon: Shield, color: 'red', description: 'OCPD sizing per 240.4' },
            { name: 'Voltage Drop Calculator', slug: 'voltage-drop-calculator', icon: Activity, color: 'indigo', description: 'NEC recommendations' },
          ].map((calc, index) => {
            const IconComponent = calc.icon;
            return (
              <Link 
                key={index} 
                href={`/calculators/${calc.slug}`}
                className={`block p-6 rounded-lg border hover:shadow-lg transition-all hover:border-${calc.color}-300`}
              >
                <div className={`w-12 h-12 bg-${calc.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent className={`w-6 h-6 text-${calc.color}-600`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{calc.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{calc.description}</p>
                <div className={`text-${calc.color}-600 text-sm flex items-center gap-1`}>
                  Try Calculator <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Continue Your NEC Education</h2>
        <p className="text-gray-600 mb-6">
          Master more aspects of electrical code compliance with these related guides and advanced topics.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/guides/wire-sizing-guide"
            className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            Complete Wire Sizing Guide
          </Link>
          <Link 
            href="/guides/electrical-safety"
            className="border border-amber-600 text-amber-700 px-6 py-3 rounded-lg font-medium hover:bg-amber-50 transition-colors"
          >
            Electrical Safety Guide
          </Link>
          <Link 
            href="/guides/electrical-power-calculations"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Power Calculations
          </Link>
        </div>
      </div>
    </div>
  );
}