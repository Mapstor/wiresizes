'use client';

import { useState } from 'react';
import { AlertTriangle, Zap, Calculator, TrendingUp, ThermometerSun, Cable, Building, Home, Factory, BarChart3, Target, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const AWG_TABLE = [
  { awg: '14', diameter_mils: 64.1, area_kcmil: 4.11, ampacity_60c: { cu: 20, al: 15 }, ampacity_75c: { cu: 25, al: 20 }, ampacity_90c: { cu: 30, al: 25 }, ohms_1000ft: 2.53, weight_lb_1000ft: 12.4 },
  { awg: '12', diameter_mils: 80.8, area_kcmil: 6.53, ampacity_60c: { cu: 25, al: 20 }, ampacity_75c: { cu: 30, al: 25 }, ampacity_90c: { cu: 35, al: 30 }, ohms_1000ft: 1.59, weight_lb_1000ft: 19.8 },
  { awg: '10', diameter_mils: 101.9, area_kcmil: 10.38, ampacity_60c: { cu: 35, al: 30 }, ampacity_75c: { cu: 40, al: 35 }, ampacity_90c: { cu: 50, al: 40 }, ohms_1000ft: 0.999, weight_lb_1000ft: 31.4 },
  { awg: '8', diameter_mils: 128.5, area_kcmil: 16.51, ampacity_60c: { cu: 50, al: 40 }, ampacity_75c: { cu: 55, al: 45 }, ampacity_90c: { cu: 70, al: 55 }, ohms_1000ft: 0.628, weight_lb_1000ft: 49.9 },
  { awg: '6', diameter_mils: 162.0, area_kcmil: 26.24, ampacity_60c: { cu: 65, al: 50 }, ampacity_75c: { cu: 75, al: 65 }, ampacity_90c: { cu: 95, al: 75 }, ohms_1000ft: 0.395, weight_lb_1000ft: 79.5 },
  { awg: '4', diameter_mils: 204.3, area_kcmil: 41.74, ampacity_60c: { cu: 85, al: 65 }, ampacity_75c: { cu: 95, al: 75 }, ampacity_90c: { cu: 120, al: 95 }, ohms_1000ft: 0.249, weight_lb_1000ft: 126.4 },
  { awg: '3', diameter_mils: 229.4, area_kcmil: 52.62, ampacity_60c: { cu: 100, al: 75 }, ampacity_75c: { cu: 115, al: 85 }, ampacity_90c: { cu: 130, al: 100 }, ohms_1000ft: 0.197, weight_lb_1000ft: 159.3 },
  { awg: '2', diameter_mils: 257.6, area_kcmil: 66.36, ampacity_60c: { cu: 115, al: 90 }, ampacity_75c: { cu: 130, al: 100 }, ampacity_90c: { cu: 145, al: 115 }, ohms_1000ft: 0.156, weight_lb_1000ft: 201.0 },
  { awg: '1', diameter_mils: 289.3, area_kcmil: 83.69, ampacity_60c: { cu: 130, al: 100 }, ampacity_75c: { cu: 145, al: 115 }, ampacity_90c: { cu: 165, al: 130 }, ohms_1000ft: 0.124, weight_lb_1000ft: 253.3 },
  { awg: '1/0', diameter_mils: 325.0, area_kcmil: 105.6, ampacity_60c: { cu: 150, al: 120 }, ampacity_75c: { cu: 170, al: 135 }, ampacity_90c: { cu: 195, al: 150 }, ohms_1000ft: 0.0983, weight_lb_1000ft: 319.5 },
  { awg: '2/0', diameter_mils: 364.8, area_kcmil: 133.1, ampacity_60c: { cu: 175, al: 135 }, ampacity_75c: { cu: 195, al: 150 }, ampacity_90c: { cu: 225, al: 175 }, ohms_1000ft: 0.0779, weight_lb_1000ft: 402.8 },
  { awg: '3/0', diameter_mils: 409.6, area_kcmil: 167.8, ampacity_60c: { cu: 200, al: 155 }, ampacity_75c: { cu: 225, al: 175 }, ampacity_90c: { cu: 260, al: 200 }, ohms_1000ft: 0.0618, weight_lb_1000ft: 508.0 },
  { awg: '4/0', diameter_mils: 460.0, area_kcmil: 211.6, ampacity_60c: { cu: 230, al: 180 }, ampacity_75c: { cu: 260, al: 205 }, ampacity_90c: { cu: 300, al: 230 }, ohms_1000ft: 0.0490, weight_lb_1000ft: 640.5 }
];

const TEMPERATURE_CORRECTION_FACTORS = [
  { temp_c: 21, temp_f: 70, factor_60c: 1.08, factor_75c: 1.05, factor_90c: 1.04 },
  { temp_c: 26, temp_f: 79, factor_60c: 1.00, factor_75c: 1.00, factor_90c: 1.00 },
  { temp_c: 31, temp_f: 88, factor_60c: 0.91, factor_75c: 0.94, factor_90c: 0.96 },
  { temp_c: 36, temp_f: 97, factor_60c: 0.82, factor_75c: 0.88, factor_90c: 0.91 },
  { temp_c: 41, temp_f: 106, factor_60c: 0.71, factor_75c: 0.82, factor_90c: 0.87 },
  { temp_c: 46, temp_f: 115, factor_60c: 0.58, factor_75c: 0.75, factor_90c: 0.82 },
  { temp_c: 51, temp_f: 124, factor_60c: 0.41, factor_75c: 0.67, factor_90c: 0.76 },
  { temp_c: 56, temp_f: 133, factor_60c: 0.00, factor_75c: 0.58, factor_90c: 0.71 }
];

const CONDUIT_FILL_TABLE = [
  { conduit_size: '1/2"', max_fill_40: 3, max_fill_total: 6, area_sq_in: 0.304 },
  { conduit_size: '3/4"', max_fill_40: 5, max_fill_total: 10, area_sq_in: 0.533 },
  { conduit_size: '1"', max_fill_40: 8, max_fill_total: 16, area_sq_in: 0.864 },
  { conduit_size: '1-1/4"', max_fill_40: 14, max_fill_total: 26, area_sq_in: 1.496 },
  { conduit_size: '1-1/2"', max_fill_40: 17, max_fill_total: 35, area_sq_in: 2.036 },
  { conduit_size: '2"', max_fill_40: 31, max_fill_total: 60, area_sq_in: 3.356 },
  { conduit_size: '2-1/2"', max_fill_40: 46, max_fill_total: 90, area_sq_in: 5.858 },
  { conduit_size: '3"', max_fill_40: 67, max_fill_total: 129, area_sq_in: 8.846 },
  { conduit_size: '3-1/2"', max_fill_40: 87, max_fill_total: 171, area_sq_in: 11.545 },
  { conduit_size: '4"', max_fill_40: 120, max_fill_total: 236, area_sq_in: 15.949 }
];

const INSTALLATION_SCENARIOS = [
  {
    title: 'Residential Kitchen Circuit - 20A GFCI Outlet',
    situation: 'Maria is renovating her kitchen and needs to install new 20-amp GFCI outlets for countertop appliances. The circuit will serve coffee makers, toasters, and small appliances that typically draw 15-18 amps total.',
    problem: 'The electrical panel is 45 feet from the kitchen, and she needs to determine the correct wire size. The circuit will be installed in conduit through the basement with ambient temperatures around 85°F.',
    calculation: 'For 20A circuit: Minimum 12 AWG wire. Distance check: 45ft × 2 = 90ft total. Voltage drop = (2 × 90 × 20 × 1.59) ÷ 1000 ÷ 120 = 2.4V (2% acceptable)',
    solution: '12 AWG THWN-2 copper wire in 3/4" EMT conduit with 20A GFCI breaker',
    realWorldContext: 'Kitchen circuits require GFCI protection per NEC 210.8. Proper wire sizing prevents voltage drop that causes appliances to underperform and waste energy.',
    cost: '$185 total project cost vs $95 for undersized wire that would cause problems'
  },
  {
    title: 'Commercial HVAC Unit - 60A Three-Phase',
    situation: 'Tom manages facilities for a mid-size office building installing a new 60-amp, 480V three-phase rooftop HVAC unit. The electrical room is 120 feet from the rooftop location.',
    problem: 'The unit draws 60 amps at full load during peak cooling. Installation is in outdoor conduit with summer temperatures reaching 110°F. Voltage drop must be minimized for motor efficiency.',
    calculation: 'Base requirement: 4 AWG copper (75A rating). Temperature correction at 110°F: 75A × 0.82 = 61.5A (adequate). Voltage drop check needed for 240ft total run.',
    solution: '4 AWG THWN-2 copper in 1-1/4" rigid conduit with 60A breaker and motor protection',
    realWorldContext: 'Commercial HVAC systems require precise voltage for efficiency. Undersized wire reduces motor life and increases energy costs significantly.',
    cost: '$1,200 for proper installation vs $2,800 annual energy waste with voltage drop'
  },
  {
    title: 'Industrial Motor Feeder - 100A Single Phase',
    situation: 'Jennifer is the plant electrician installing a 100-amp feeder for a large industrial air compressor located 200 feet from the main panel. The motor operates continuously during production shifts.',
    problem: 'The 100HP motor requires consistent voltage for optimal performance. The feeder runs through a hot mechanical room with ambient temperatures of 104°F, and voltage drop must not exceed 3%.',
    calculation: 'Base: 3/0 AWG (225A at 75°C). Temperature derating: 225A × 0.88 = 198A (adequate). Voltage drop: Check 400ft total run for 3% limit.',
    solution: '3/0 AWG XHHW copper in 2" rigid steel conduit with 100A feeder breaker',
    realWorldContext: 'Industrial motors are sensitive to voltage variation. Proper feeders prevent motor damage, reduce maintenance, and ensure production reliability.',
    cost: '$2,100 wire cost prevents $15,000 motor replacement and production delays'
  },
  {
    title: 'Solar Array DC Combiner - 40A Continuous',
    situation: 'Robert is installing a residential solar system with DC combiners located 80 feet from the main panel. The system generates 40 amps continuously during peak sun hours.',
    problem: 'DC current requires oversizing for continuous load (125% factor). Wire runs in attic space where temperatures reach 130°F in summer. String voltage is 450VDC.',
    calculation: 'Continuous load: 40A × 1.25 = 50A minimum. Temperature correction at 130°F severely limits capacity. May need 75°C or 90°C rated wire.',
    solution: '6 AWG USE-2 or THWN-2 in EMT conduit with 50A DC breaker and rapid shutdown',
    realWorldContext: 'Solar DC circuits have unique NEC requirements for safety and fire prevention. Proper sizing prevents arc faults and ensures system longevity.',
    cost: '$420 for proper DC wire vs potential $8,000 system replacement from arc damage'
  },
  {
    title: 'Residential Service Entrance - 200A Main',
    situation: 'Steve is upgrading his home electrical service from 100A to 200A to support an EV charger, heat pump, and modern electrical loads. The meter is 15 feet from the main panel.',
    problem: 'Service entrance conductors must handle 200A continuous load with minimal voltage drop. Installation includes underground feed from meter to panel through PVC conduit.',
    calculation: 'NEC Table 310.12: 200A service requires 2/0 AWG copper or 4/0 aluminum minimum. Consider parallel runs for large services.',
    solution: '2/0 AWG copper USE-2 cable in 2" PVC conduit with 200A main breaker panel',
    realWorldContext: 'Service upgrades enable modern electrical needs. Proper sizing ensures utility voltage stability and prevents panel overheating.',
    cost: '$1,800 service upgrade enables $30,000 in home electrification investments'
  }
];

export default function WireSizingGuidePage() {
  const [selectedMaterial, setSelectedMaterial] = useState<'copper' | 'aluminum'>('copper');
  const [selectedTemp, setSelectedTemp] = useState('75c');
  const [selectedAWG, setSelectedAWG] = useState('12');
  const [calculatorInputs, setCalculatorInputs] = useState({
    current: 20,
    distance: 100,
    voltage: 120,
    allowableDrop: 3
  });

  const calculateVoltageDropPercent = (current: number, distance: number, resistance: number, voltage: number) => {
    const voltageDrop = (2 * distance * current * resistance) / 1000;
    return (voltageDrop / voltage) * 100;
  };

  const selectedWire = AWG_TABLE.find(wire => wire.awg === selectedAWG);
  const voltageDropPercent = selectedWire 
    ? calculateVoltageDropPercent(calculatorInputs.current, calculatorInputs.distance, selectedWire.ohms_1000ft, calculatorInputs.voltage)
    : 0;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 border">
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Complete Wire Sizing Guide
              </h1>
              <p className="text-xl text-gray-600">
                Professional wire selection for safe, efficient, and code-compliant electrical installations
              </p>
            </div>
          </div>
          
          <div className="bg-white/70 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
              <AlertTriangle className="w-5 h-5" />
              Critical Safety Notice
            </div>
            <p className="text-gray-700 text-sm">
              Incorrect wire sizing can cause fires, equipment damage, and electrical hazards. Always consult local codes and qualified electricians for installations.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link 
              href="/calculators/wire-size-calculator"
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Wire Size Calculator
            </Link>
            <Link 
              href="/calculators/ampacity-calculator"
              className="border border-red-600 text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              Ampacity Calculator
            </Link>
            <Link 
              href="/calculators/voltage-drop-calculator"
              className="border border-red-600 text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              Voltage Drop Calculator
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive AWG Table */}
      <div className="bg-white rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-6">
          <Cable className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Interactive AWG Wire Table (NEC Table 310.16)
          </h2>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
              <select 
                value={selectedMaterial} 
                onChange={(e) => setSelectedMaterial(e.target.value as 'copper' | 'aluminum')}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="copper">Copper (CU)</option>
                <option value="aluminum">Aluminum (AL)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Temperature Rating</label>
              <select 
                value={selectedTemp} 
                onChange={(e) => setSelectedTemp(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="60c">60°C (140°F)</option>
                <option value="75c">75°C (167°F)</option>
                <option value="90c">90°C (194°F)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">AWG Size</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Diameter (mils)</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Area (kcmil)</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Ampacity</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Resistance (Ω/1000ft)</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Weight (lb/1000ft)</th>
              </tr>
            </thead>
            <tbody>
              {AWG_TABLE.map((wire, index) => {
                let ampacity;
                if (selectedTemp === '60c') ampacity = selectedMaterial === 'copper' ? wire.ampacity_60c.cu : wire.ampacity_60c.al;
                else if (selectedTemp === '75c') ampacity = selectedMaterial === 'copper' ? wire.ampacity_75c.cu : wire.ampacity_75c.al;
                else ampacity = selectedMaterial === 'copper' ? wire.ampacity_90c.cu : wire.ampacity_90c.al;

                return (
                  <tr key={index} className={`${wire.awg === selectedAWG ? 'bg-red-50 border-red-200' : 'hover:bg-gray-50'}`}>
                    <td className="border border-gray-300 px-4 py-3 font-semibold">{wire.awg}</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{wire.diameter_mils}</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{wire.area_kcmil}</td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-red-600">{ampacity}A</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{wire.ohms_1000ft}</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{wire.weight_lb_1000ft}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>* Ampacities based on NEC Table 310.16 for not more than three current-carrying conductors in raceway or cable.</p>
          <p>* Ambient temperature not over 30°C (86°F). For other conditions, apply correction factors.</p>
        </div>
      </div>

      {/* Temperature Correction Factors */}
      <div className="bg-white rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-6">
          <ThermometerSun className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">Temperature Correction Factors</h2>
        </div>

        <p className="text-gray-600 mb-6">
          When ambient temperature exceeds 30°C (86°F), wire ampacity must be reduced using these correction factors from NEC Table 310.15(B)(1).
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-orange-50">
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Temperature</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">60°C Rating</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">75°C Rating</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">90°C Rating</th>
              </tr>
            </thead>
            <tbody>
              {TEMPERATURE_CORRECTION_FACTORS.map((temp, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 text-center font-medium">
                    {temp.temp_c}°C ({temp.temp_f}°F)
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    {temp.factor_60c.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    {temp.factor_75c.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    {temp.factor_90c.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <h3 className="font-semibold text-orange-800 mb-2">Example Calculation:</h3>
          <p className="text-orange-700 text-sm">
            12 AWG copper (75°C) = 25A base rating. At 110°F ambient: 25A × 0.82 = 20.5A derated capacity
          </p>
        </div>
      </div>

      {/* Voltage Drop Calculator */}
      <div className="bg-white rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Interactive Voltage Drop Calculator</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Input Parameters</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current (Amps)</label>
              <input
                type="number"
                value={calculatorInputs.current}
                onChange={(e) => setCalculatorInputs(prev => ({...prev, current: Number(e.target.value)}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                min="0"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">One-Way Distance (ft)</label>
              <input
                type="number"
                value={calculatorInputs.distance}
                onChange={(e) => setCalculatorInputs(prev => ({...prev, distance: Number(e.target.value)}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                min="0"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Voltage (V)</label>
              <select
                value={calculatorInputs.voltage}
                onChange={(e) => setCalculatorInputs(prev => ({...prev, voltage: Number(e.target.value)}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value={120}>120V Single Phase</option>
                <option value={240}>240V Single Phase</option>
                <option value={208}>208V Three Phase</option>
                <option value={480}>480V Three Phase</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wire Size (AWG)</label>
              <select
                value={selectedAWG}
                onChange={(e) => setSelectedAWG(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                {AWG_TABLE.map(wire => (
                  <option key={wire.awg} value={wire.awg}>{wire.awg} AWG</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Voltage Drop Results</h3>
            
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Voltage Drop</div>
                <div className="text-2xl font-bold text-gray-900">
                  {voltageDropPercent.toFixed(2)}%
                </div>
              </div>

              <div className={`rounded-lg p-4 ${voltageDropPercent <= 3 ? 'bg-green-50 text-green-800' : voltageDropPercent <= 5 ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'}`}>
                <div className="flex items-center gap-2">
                  {voltageDropPercent <= 3 ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Excellent - NEC Recommended</span>
                    </>
                  ) : voltageDropPercent <= 5 ? (
                    <>
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-medium">Acceptable - NEC Maximum</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-medium">Excessive - Upgrade Required</span>
                    </>
                  )}
                </div>
                <div className="text-sm mt-1">
                  {voltageDropPercent <= 3 && "Optimal efficiency and equipment performance"}
                  {voltageDropPercent > 3 && voltageDropPercent <= 5 && "Maximum allowed by NEC code"}
                  {voltageDropPercent > 5 && "May cause equipment malfunction and inefficiency"}
                </div>
              </div>

              {selectedWire && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Wire Information</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>Resistance: {selectedWire.ohms_1000ft} Ω/1000ft</div>
                    <div>Ampacity (75°C): {selectedMaterial === 'copper' ? selectedWire.ampacity_75c.cu : selectedWire.ampacity_75c.al}A</div>
                    <div>Total circuit length: {calculatorInputs.distance * 2} ft</div>
                    <div>Voltage drop: {((2 * calculatorInputs.distance * calculatorInputs.current * selectedWire.ohms_1000ft) / 1000).toFixed(2)}V</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conduit Fill Table */}
      <div className="bg-white rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-6">
          <Building className="w-6 h-6 text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-900">Conduit Fill Guidelines (NEC Chapter 9, Table 4)</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Maximum number of THWN conductors allowed in EMT conduit. NEC limits fill to 40% for 3+ conductors.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Conduit Size</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Cross-Sectional Area</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">40% Fill (3+ wires)</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Total Capacity</th>
              </tr>
            </thead>
            <tbody>
              {CONDUIT_FILL_TABLE.map((conduit, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-semibold">{conduit.conduit_size}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">{conduit.area_sq_in}" sq in</td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-blue-600">{conduit.max_fill_40} conductors</td>
                  <td className="border border-gray-300 px-4 py-3 text-center text-gray-500">{conduit.max_fill_total} max</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">NEC Conduit Fill Rules:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 1 conductor: 53% maximum fill</li>
            <li>• 2 conductors: 31% maximum fill</li>
            <li>• 3 or more conductors: 40% maximum fill</li>
            <li>• Equipment grounding conductors count as current-carrying</li>
          </ul>
        </div>
      </div>

      {/* Wire Selection Process */}
      <div className="bg-white rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Professional Wire Selection Process</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Step 1: Load Analysis</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Calculate actual load current (motors at 125%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Apply NEC load factors and demand calculations</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Consider future expansion and load growth</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Step 2: Environmental Factors</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Determine ambient temperature conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Count current-carrying conductors in raceway</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Select appropriate insulation temperature rating</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Step 3: Code Compliance</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Verify minimum wire size per NEC Table 310.16</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Apply correction and adjustment factors</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Check special application requirements</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Step 4: Voltage Drop Check</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Calculate voltage drop for circuit length</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Ensure ≤3% for branch circuits, ≤5% total</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Upsize wire if voltage drop exceeds limits</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Step 5: Final Selection</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Choose largest required wire size</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Verify conduit fill compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Document calculations for inspection</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Professional Tip:</h4>
              <p className="text-purple-700 text-sm">
                Always size wire for the most restrictive requirement. When ampacity and voltage drop calculations differ, choose the larger wire size for safety and performance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-World Installation Scenarios */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Real-World Installation Scenarios</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Learn from detailed scenarios showing complete wire sizing decisions in residential, commercial, and industrial applications.
          </p>
        </div>

        <div className="grid lg:grid-cols-1 gap-8">
          {INSTALLATION_SCENARIOS.map((scenario, index) => {
            const IconComponent = index === 0 ? Home : index === 1 ? Building : index === 2 ? Factory : index === 3 ? Zap : Building;
            
            return (
              <div key={index} className="bg-white rounded-xl border p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    index === 0 ? 'bg-blue-100' : 
                    index === 1 ? 'bg-green-100' : 
                    index === 2 ? 'bg-purple-100' : 
                    index === 3 ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      index === 0 ? 'text-blue-600' : 
                      index === 1 ? 'text-green-600' : 
                      index === 2 ? 'text-purple-600' : 
                      index === 3 ? 'text-yellow-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{scenario.title}</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Situation:</h4>
                    <p className="text-gray-700">{scenario.situation}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Technical Challenge:</h4>
                    <p className="text-gray-700">{scenario.problem}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Wire Sizing Calculation:</h4>
                    <p className="text-gray-700 font-mono text-sm">{scenario.calculation}</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Professional Solution:</h4>
                    <p className="text-green-700">{scenario.solution}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Industry Context:</h4>
                    <p className="text-gray-700">{scenario.realWorldContext}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">Cost Analysis</div>
                      <div className="text-sm font-semibold text-gray-900">{scenario.cost}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Reference Cards */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-8 border">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Wire Sizing Quick Reference</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600" />
              Residential Circuits
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>15A outlets:</span>
                <span className="font-semibold">14 AWG</span>
              </div>
              <div className="flex justify-between">
                <span>20A kitchen/bath:</span>
                <span className="font-semibold">12 AWG</span>
              </div>
              <div className="flex justify-between">
                <span>30A dryer:</span>
                <span className="font-semibold">10 AWG</span>
              </div>
              <div className="flex justify-between">
                <span>40A range:</span>
                <span className="font-semibold">8 AWG</span>
              </div>
              <div className="flex justify-between">
                <span>100A sub-panel:</span>
                <span className="font-semibold">3 AWG</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-green-600" />
              Commercial Loads
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>20A lighting:</span>
                <span className="font-semibold">12 AWG</span>
              </div>
              <div className="flex justify-between">
                <span>30A HVAC:</span>
                <span className="font-semibold">10 AWG</span>
              </div>
              <div className="flex justify-between">
                <span>60A equipment:</span>
                <span className="font-semibold">4 AWG</span>
              </div>
              <div className="flex justify-between">
                <span>100A motor:</span>
                <span className="font-semibold">3/0 AWG</span>
              </div>
              <div className="flex justify-between">
                <span>200A service:</span>
                <span className="font-semibold">2/0 AWG</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Safety Reminders
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div>• Always verify local code requirements</div>
              <div>• Apply correction factors for temperature</div>
              <div>• Check voltage drop on long runs</div>
              <div>• Size for continuous loads at 125%</div>
              <div>• Verify conduit fill compliance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Calculators */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border">
        <div className="max-w-3xl mx-auto text-center">
          <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Professional Wire Sizing Tools</h2>
          <p className="text-gray-600 mb-6">
            Use our specialized calculators for precise wire sizing and electrical calculations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/calculators/wire-size-calculator"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Wire Size Calculator
            </Link>
            <Link 
              href="/calculators/ampacity-calculator"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Ampacity Calculator
            </Link>
            <Link 
              href="/calculators/voltage-drop-calculator"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Voltage Drop Calculator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}