'use client';

import { useState } from 'react';
import { BookOpen, Shield, AlertTriangle, Zap, Target, CheckCircle, Clock, Users, Building, Factory, HardHat, Eye, Shirt, Lock, Calculator } from 'lucide-react';
import Link from 'next/link';

const ARC_FLASH_BOUNDARIES = [
  { voltage_kv: '0.208-1', equipment_type: 'Panelboards', incident_energy_cal_cm2: '1.2-8', arc_flash_boundary_ft: '1.2-4', ppe_category: '1-2' },
  { voltage_kv: '0.208-1', equipment_type: 'Motor Control Centers', incident_energy_cal_cm2: '5-40', arc_flash_boundary_ft: '4-8', ppe_category: '2-4' },
  { voltage_kv: '0.480', equipment_type: 'Switchgear', incident_energy_cal_cm2: '8-25', arc_flash_boundary_ft: '4-6', ppe_category: '2-3' },
  { voltage_kv: '4.16', equipment_type: 'Medium Voltage', incident_energy_cal_cm2: '25-100', arc_flash_boundary_ft: '8-35', ppe_category: '4+' },
  { voltage_kv: '13.8', equipment_type: 'Distribution', incident_energy_cal_cm2: '40-200', arc_flash_boundary_ft: '15-50', ppe_category: '4+' },
  { voltage_kv: '34.5', equipment_type: 'Transmission', incident_energy_cal_cm2: '100-500', arc_flash_boundary_ft: '35-100', ppe_category: '4+' }
];

const PPE_CATEGORIES = [
  {
    category: '1',
    incident_energy: '1.2-4 cal/cm²',
    clothing: 'FR shirt & pants or FR coveralls',
    protection: '4 cal/cm² minimum arc rating',
    face: 'Safety glasses + face shield',
    hand: 'Leather work gloves',
    head: 'Hard hat',
    foot: 'Leather work shoes'
  },
  {
    category: '2', 
    incident_energy: '4.1-8 cal/cm²',
    clothing: 'FR shirt & pants + cotton underwear',
    protection: '8 cal/cm² minimum arc rating',
    face: 'Arc flash hood or face shield + safety glasses',
    hand: 'Rubber insulating gloves + leather protectors',
    head: 'Hard hat',
    foot: 'Leather work shoes'
  },
  {
    category: '3',
    incident_energy: '8.1-25 cal/cm²',
    clothing: 'FR clothing system',
    protection: '25 cal/cm² minimum arc rating',
    face: 'Arc flash hood',
    hand: 'Rubber insulating gloves + leather protectors',
    head: 'Hard hat',
    foot: 'Leather work shoes'
  },
  {
    category: '4',
    incident_energy: '25.1-40 cal/cm²',
    clothing: 'Multi-layer FR clothing system',
    protection: '40 cal/cm² minimum arc rating',
    face: 'Arc flash hood',
    hand: 'Rubber insulating gloves + leather protectors',
    head: 'Hard hat',
    foot: 'Leather work shoes'
  }
];

const LOCKOUT_STEPS = [
  {
    step: 1,
    title: 'Preparation & Planning',
    description: 'Identify all energy sources that need to be controlled',
    details: [
      'Review equipment drawings and energy isolation points',
      'Identify all electrical, mechanical, hydraulic, pneumatic, chemical, and thermal energy sources',
      'Determine required lockout devices and personal protective equipment',
      'Notify affected employees and coordinate with operations'
    ],
    safety_note: 'Never assume equipment is de-energized without proper verification'
  },
  {
    step: 2,
    title: 'Machine/Equipment Shutdown',
    description: 'Properly shut down equipment using normal operating procedures',
    details: [
      'Use normal operating procedures to shut down equipment',
      'Ensure all moving parts have come to a complete stop', 
      'Close all valves, switches, and control devices',
      'Allow equipment to reach safe temperature and pressure levels'
    ],
    safety_note: 'Emergency stops should only be used in actual emergency situations'
  },
  {
    step: 3,
    title: 'Energy Isolation',
    description: 'Isolate all energy sources from the equipment',
    details: [
      'Open disconnecting means for electrical energy sources',
      'Close valves for hydraulic, pneumatic, gas, steam, water, or other fluids',
      'Block mechanical motion points',
      'Relieve stored energy (capacitors, springs, elevated parts, etc.)'
    ],
    safety_note: 'Stored energy can be lethal even after main power is disconnected'
  },
  {
    step: 4,
    title: 'Lockout Device Application',
    description: 'Apply lockout devices to isolation points',
    details: [
      'Install lockout devices on all energy isolation points',
      'Use individual locks - each authorized employee applies their own lock',
      'Attach identification tags with employee name, date, and reason',
      'Test locks to ensure they cannot be removed without the key'
    ],
    safety_note: 'Each worker must apply their own lock - no sharing of keys allowed'
  },
  {
    step: 5,
    title: 'Stored Energy Release',
    description: 'Release or restrain all stored energy',
    details: [
      'Discharge capacitors safely using appropriate equipment',
      'Release spring tension using proper blocking methods',
      'Lower elevated equipment parts to stable positions',
      'Bleed hydraulic and pneumatic pressure to zero'
    ],
    safety_note: 'Stored energy release must be verified with proper test equipment'
  },
  {
    step: 6,
    title: 'Isolation Verification',
    description: 'Verify that equipment cannot be restarted',
    details: [
      'Test equipment controls to ensure they will not operate',
      'Use appropriate voltage testing equipment to verify zero energy',
      'Check that all valves are properly closed and secured',
      'Verify isolation at the point of work, not just at control panels'
    ],
    safety_note: 'Always test with known working voltage detector before and after testing'
  }
];

const SAFETY_SCENARIOS = [
  {
    title: 'Arc Flash During Switchgear Inspection',
    situation: 'Mike, a maintenance electrician at a manufacturing facility, needs to perform routine inspection and testing on 480V switchgear. The equipment is energized and contains motor starters rated at 200 amps.',
    hazard: 'Arc flash risk due to high available fault current and close proximity to energized conductors during inspection and testing procedures.',
    nfpa_analysis: 'NFPA 70E Table 130.7(C)(15)(A)(b) indicates working distance of 18" on 480V switchgear with molded case breakers. Incident energy analysis shows 12 cal/cm² at the working distance.',
    ppe_required: 'PPE Category 3: Arc-rated clothing system (25 cal/cm² minimum), arc flash hood, rubber insulating gloves with leather protectors, and leather work shoes.',
    safety_procedure: 'De-energize equipment when possible. If energized work is justified, establish arc flash boundary at 5 feet, use insulated tools, and have qualified spotter outside boundary.',
    cost_analysis: '$485 PPE cost prevents $2.8M arc flash injury claim and facility downtime',
    lesson: 'Arc flash PPE must be selected based on calculated incident energy levels, not just voltage or equipment type.'
  },
  {
    title: 'Motor Control Center Maintenance Lockout',
    situation: 'Sarah, a plant electrician, needs to replace a damaged motor starter in a MCC that feeds multiple production lines. The work requires removing the bucket and working inside the energized lineup.',
    hazard: 'Multiple energy sources: 480V power, control circuits, and mechanical stored energy in motor starters. Risk of inadvertent contact with adjacent energized equipment.',
    nfpa_analysis: 'NFPA 70E requires lockout of all energy sources. Adjacent spaces in MCC remain energized, creating shock and arc flash hazards during bucket removal.',
    ppe_required: 'Category 2 PPE minimum for limited approach boundary work. Higher category required if approaching energized parts during bucket removal.',
    safety_procedure: 'Complete lockout/tagout of affected motor circuit. Verify zero energy state. Use barriers to separate work area from adjacent energized equipment. Test before touch protocol.',
    cost_analysis: '$45 lockout procedure prevents $125,000 injury claim and 8-hour production shutdown worth $95,000',
    lesson: 'Lockout procedures must address all energy sources, including control circuits and mechanical energy.'
  },
  {
    title: 'Overhead Power Line Clearance Violation',
    situation: 'Construction crew is operating a mobile crane near 13.8kV overhead distribution lines. The crane boom must pass within 15 feet of the conductors while placing rooftop equipment.',
    hazard: 'Electrical contact or flashover between crane and overhead conductors. 13.8kV lines can arc across significant air gaps, especially in humid conditions.',
    nfpa_analysis: 'NFPA 70E Table 130.2(C)(1) requires 10-foot minimum approach distance for unqualified persons working near 13.8kV lines. Additional clearance needed for equipment operation.',
    ppe_required: 'Not applicable - PPE cannot protect against overhead line contact. Engineering controls and safe work practices required.',
    safety_procedure: 'Contact utility to de-energize lines or install protective barriers. Use spotters to maintain clearance distances. Consider alternative lifting methods.',
    cost_analysis: '$3,500 utility coordination cost prevents $500,000 electrocution claim and project delays',
    lesson: 'Overhead power line safety requires engineering controls, not personal protective equipment.'
  },
  {
    title: 'Ground Fault in Wet Location',
    situation: 'James, a maintenance technician, is troubleshooting a motor that stopped working in a water treatment facility. The motor is in a wet location with standing water around the equipment.',
    hazard: 'Ground fault and electric shock risk due to compromised equipment grounding and wet conditions that reduce skin resistance.',
    nfpa_analysis: 'NFPA 70E requires GFCI protection for outlets in wet locations. Wet skin resistance can drop to 1000 ohms, making normally safe voltages lethal.',
    ppe_required: 'Rubber insulating gloves rated for working voltage, rubber-soled footwear, and arc-rated clothing for approach boundaries.',
    safety_procedure: 'Turn off power at source. Test circuits with voltage detector before contact. Use GFCI-protected equipment for any power tools or temporary lighting.',
    cost_analysis: '$125 GFCI equipment cost prevents $875,000 electrocution claim and regulatory fines',
    lesson: 'Wet locations dramatically increase electrical hazards and require enhanced protection measures.'
  },
  {
    title: 'High Voltage Cable Termination',
    situation: 'Alex, a utility lineman, is installing new cable terminations on a 34.5kV distribution circuit. Work must be performed with the line energized to maintain service to critical customers.',
    hazard: 'Extremely high voltage with lethal arc flash potential. 34.5kV can flash across large air gaps and deliver massive incident energy levels.',
    nfpa_analysis: 'NFPA 70E requires extensive training, PPE analysis, and work procedures for medium voltage energized work. Incident energy can exceed 100 cal/cm².',
    ppe_required: 'Maximum PPE Category 4+ with specialized high-voltage protective equipment. Arc flash boundary extends 35+ feet from work location.',
    safety_procedure: 'Detailed switching plan with system operator coordination. Hot stick procedures with minimum approach distances. Backup protection analysis.',
    cost_analysis: '$12,500 specialized PPE and procedures prevent $2.5M arc flash burn injury and system outage costs',
    lesson: 'High voltage work requires specialized training, equipment, and procedures beyond normal electrical safety practices.'
  }
];

export default function ElectricalSafetyPage() {
  const [selectedPPECategory, setSelectedPPECategory] = useState('1');
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [lockoutProgress, setLockoutProgress] = useState(0);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 border border-red-200">
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Electrical Safety Fundamentals
              </h1>
              <p className="text-xl text-gray-600">
                Essential safety practices, standards, and procedures for electrical work and installations
              </p>
            </div>
          </div>
          
          <div className="bg-red-100 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
              <AlertTriangle className="w-5 h-5" />
              Critical Safety Warning
            </div>
            <p className="text-red-700 text-sm">
              Electrical work can be lethal. This guide provides educational information only. 
              Always follow local codes, employer safety procedures, and work with qualified professionals.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link 
              href="/calculators/circuit-breaker-calculator"
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Circuit Protection Calculator
            </Link>
            <Link 
              href="/calculators/ground-wire-calculator"
              className="border border-red-600 text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              Grounding Calculator
            </Link>
            <Link 
              href="/guides/nec-code-compliance"
              className="border border-red-600 text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              NEC Compliance Guide
            </Link>
          </div>
        </div>
      </div>

      {/* Arc Flash Protection */}
      <div className="bg-white rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900">Arc Flash Protection (NFPA 70E)</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Arc flash is an electrical explosion resulting from an electric arc. NFPA 70E provides standards for electrical safety 
          in the workplace, including arc flash protection requirements and personal protective equipment (PPE) selection.
        </p>

        {/* Arc Flash Boundaries Table */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Typical Arc Flash Incident Energy Levels</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-yellow-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Voltage Level</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Equipment Type</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Incident Energy</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Arc Flash Boundary</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold">PPE Category</th>
                </tr>
              </thead>
              <tbody>
                {ARC_FLASH_BOUNDARIES.map((boundary, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">{boundary.voltage_kv} kV</td>
                    <td className="border border-gray-300 px-4 py-3">{boundary.equipment_type}</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{boundary.incident_energy_cal_cm2} cal/cm²</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{boundary.arc_flash_boundary_ft} ft</td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-yellow-600">{boundary.ppe_category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            * Values are typical ranges. Actual incident energy must be calculated for specific installations per NFPA 70E requirements.
          </p>
        </div>

        {/* PPE Categories Interactive */}
        <div className="bg-yellow-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Protective Equipment (PPE) Categories</h3>
          
          <div className="flex gap-4 mb-6">
            {PPE_CATEGORIES.map((category) => (
              <button
                key={category.category}
                onClick={() => setSelectedPPECategory(category.category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPPECategory === category.category
                    ? 'bg-yellow-600 text-white'
                    : 'bg-white text-yellow-700 border border-yellow-300 hover:bg-yellow-100'
                }`}
              >
                Category {category.category}
              </button>
            ))}
          </div>

          {PPE_CATEGORIES.filter(cat => cat.category === selectedPPECategory).map(category => (
            <div key={category.category} className="bg-white rounded-lg p-6 border">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">PPE Category {category.category} Requirements</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Incident Energy:</strong> {category.incident_energy}</div>
                    <div><strong>Arc Rating:</strong> {category.protection}</div>
                    <div><strong>Clothing:</strong> {category.clothing}</div>
                    <div><strong>Face Protection:</strong> {category.face}</div>
                    <div><strong>Hand Protection:</strong> {category.hand}</div>
                    <div><strong>Head Protection:</strong> {category.head}</div>
                    <div><strong>Foot Protection:</strong> {category.foot}</div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Key Safety Points:</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• All PPE must be arc-rated and tested to ASTM F1506</li>
                    <li>• PPE must cover all exposed skin within arc flash boundary</li>
                    <li>• Inspect PPE before each use for damage or contamination</li>
                    <li>• Remove damaged or contaminated PPE from service immediately</li>
                    <li>• Match PPE arc rating to calculated incident energy</li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lockout/Tagout Procedures */}
      <div className="bg-white rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Lockout/Tagout Procedures (OSHA 29 CFR 1910.147)</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Lockout/Tagout (LOTO) procedures protect workers from hazardous energy during equipment maintenance and servicing. 
          Proper LOTO prevents an estimated 120 deaths and 50,000 injuries annually.
        </p>

        {/* Interactive LOTO Steps */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Six Steps of Lockout/Tagout</h3>
            <div className="flex gap-2">
              {LOCKOUT_STEPS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setLockoutProgress(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    lockoutProgress === index
                      ? 'bg-blue-600 text-white'
                      : index < lockoutProgress
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {LOCKOUT_STEPS.map((step, index) => (
            <div 
              key={index} 
              className={`mb-4 transition-all duration-300 ${
                lockoutProgress === index ? 'block' : 'hidden'
              }`}
            >
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-gray-700 mb-4">{step.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Detailed Steps:</h5>
                        <ul className="space-y-1">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="text-sm text-gray-700 flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-red-200">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="font-semibold text-red-800">Critical Safety Note</span>
                        </div>
                        <p className="text-sm text-red-700">{step.safety_note}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setLockoutProgress(Math.max(0, lockoutProgress - 1))}
              disabled={lockoutProgress === 0}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
            >
              Previous Step
            </button>
            <button
              onClick={() => setLockoutProgress(Math.min(5, lockoutProgress + 1))}
              disabled={lockoutProgress === 5}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              Next Step
            </button>
          </div>
        </div>

        {/* LOTO Requirements Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">OSHA Lockout/Tagout Key Requirements</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Energy Control Program Must Include:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Written energy control procedures for each machine/equipment</li>
                <li>• Employee training on energy control procedures</li>
                <li>• Periodic inspection of energy control procedures (annually)</li>
                <li>• Standardized lockout/tagout devices and hardware</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Individual Responsibilities:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Each worker applies and removes only their own lock</li>
                <li>• Locks must withstand workplace environment</li>
                <li>• Tags must clearly identify worker and warn against operation</li>
                <li>• Test equipment to verify zero energy state before work begins</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Scenarios */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Real-World Safety Scenarios</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Learn from detailed safety scenarios showing proper hazard analysis, PPE selection, and safety procedures 
            for common electrical work situations.
          </p>
        </div>

        {/* Scenario Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2">
            {SAFETY_SCENARIOS.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedScenario(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  selectedScenario === index
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-8">
          {SAFETY_SCENARIOS.map((scenario, index) => (
            <div 
              key={index} 
              className={`${selectedScenario === index ? 'block' : 'hidden'}`}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  index === 0 ? 'bg-yellow-100' : 
                  index === 1 ? 'bg-blue-100' : 
                  index === 2 ? 'bg-green-100' : 
                  index === 3 ? 'bg-purple-100' : 'bg-red-100'
                }`}>
                  {index === 0 && <Zap className="w-6 h-6 text-yellow-600" />}
                  {index === 1 && <Lock className="w-6 h-6 text-blue-600" />}
                  {index === 2 && <AlertTriangle className="w-6 h-6 text-green-600" />}
                  {index === 3 && <Shield className="w-6 h-6 text-purple-600" />}
                  {index === 4 && <Zap className="w-6 h-6 text-red-600" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{scenario.title}</h3>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Situation:</h4>
                    <p className="text-gray-700 text-sm">{scenario.situation}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Electrical Hazard:</h4>
                    <p className="text-gray-700 text-sm">{scenario.hazard}</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">NFPA 70E Analysis:</h4>
                  <p className="text-blue-700 text-sm">{scenario.nfpa_analysis}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Required PPE:</h4>
                    <p className="text-green-700 text-sm">{scenario.ppe_required}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-800 mb-2">Safety Procedures:</h4>
                    <p className="text-orange-700 text-sm">{scenario.safety_procedure}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Cost-Benefit Analysis:</h4>
                  <p className="text-gray-700 text-sm mb-2">{scenario.cost_analysis}</p>
                  <div className="text-sm text-gray-600 italic">{scenario.lesson}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OSHA & NFPA Standards Summary */}
      <div className="bg-white rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">Key Safety Standards & Regulations</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5" />
                OSHA Standards (29 CFR)
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>1910.147 - Lockout/Tagout:</strong> Control of hazardous energy during maintenance and servicing
                </div>
                <div>
                  <strong>1910.269 - Electric Power Generation:</strong> Safety requirements for electric power generation, transmission, and distribution
                </div>
                <div>
                  <strong>1910.303-308 - Electrical Design:</strong> General electrical design and installation requirements
                </div>
                <div>
                  <strong>1910.331-335 - Electrical Work Practices:</strong> Safety-related work practices for electrical workers
                </div>
                <div>
                  <strong>1926.95 - PPE:</strong> Personal protective equipment requirements for construction workers
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Training Requirements
              </h3>
              <div className="space-y-2 text-sm">
                <div><strong>Qualified Workers:</strong> Training in electrical safety, hazard recognition, and protective measures</div>
                <div><strong>Unqualified Workers:</strong> Basic electrical safety awareness training</div>
                <div><strong>Refresher Training:</strong> Annual updates on procedures and standards</div>
                <div><strong>Documentation:</strong> Records of all safety training and competency verification</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                NFPA Standards
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>NFPA 70E:</strong> Standard for Electrical Safety in the Workplace - comprehensive electrical safety requirements
                </div>
                <div>
                  <strong>NFPA 70 (NEC):</strong> National Electrical Code - electrical installation standards for safety
                </div>
                <div>
                  <strong>NFPA 497:</strong> Recommended Practice for Classification of Flammable Liquids and Gases
                </div>
                <div>
                  <strong>NFPA 1584:</strong> Standard on the Rehabilitation Process for Members During Emergency Operations
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="font-bold text-yellow-800 mb-4 flex items-center gap-2">
                <HardHat className="w-5 h-5" />
                Personal Protective Equipment
              </h3>
              <div className="space-y-2 text-sm">
                <div><strong>Head Protection:</strong> Non-conductive hard hats meeting ANSI Z89.1</div>
                <div><strong>Eye Protection:</strong> Safety glasses with side shields, face shields for arc flash</div>
                <div><strong>Hand Protection:</strong> Rubber insulating gloves with leather protectors</div>
                <div><strong>Body Protection:</strong> Arc-rated clothing based on incident energy analysis</div>
                <div><strong>Foot Protection:</strong> Electrical hazard rated footwear</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Response */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 border border-red-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            Electrical Emergency Response
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 border border-red-200">
              <h3 className="font-bold text-red-800 mb-3">Electrical Shock Response</h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>1. Turn off power at source immediately</li>
                <li>2. Do not touch victim if still energized</li>
                <li>3. Call 911 immediately</li>
                <li>4. Begin CPR if qualified and needed</li>
                <li>5. Treat for shock and burns</li>
                <li>6. Keep victim warm and still</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-orange-200">
              <h3 className="font-bold text-orange-800 mb-3">Electrical Fire Response</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>1. Disconnect electrical power if safe to do so</li>
                <li>2. Use Class C fire extinguisher only</li>
                <li>3. Never use water on electrical fires</li>
                <li>4. Evacuate if fire spreads</li>
                <li>5. Call fire department</li>
                <li>6. Ventilate area after extinguishing</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-yellow-200">
              <h3 className="font-bold text-yellow-800 mb-3">Arc Flash Burns</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>1. Remove victim from hazard area</li>
                <li>2. Call 911 for severe burns</li>
                <li>3. Remove hot/burned clothing carefully</li>
                <li>4. Cool burns with cool water</li>
                <li>5. Cover with sterile bandages</li>
                <li>6. Treat for shock</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-700 text-sm">
              <strong>Emergency Numbers:</strong> 911 (Emergency) • Poison Control: 1-800-222-1222 • Local Utility Emergency Line
            </p>
          </div>
        </div>
      </div>

      {/* Related Calculators */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border">
        <div className="max-w-3xl mx-auto text-center">
          <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Safety-Related Calculators</h2>
          <p className="text-gray-600 mb-6">
            Use our specialized calculators to ensure safe electrical installations and proper circuit protection.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/calculators/circuit-breaker-calculator"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Circuit Breaker Calculator
            </Link>
            <Link 
              href="/calculators/ground-wire-calculator"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Grounding Calculator
            </Link>
            <Link 
              href="/calculators/electrical-load-calculator"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Load Calculator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}