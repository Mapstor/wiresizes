'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Car, Zap, DollarSign, Clock, AlertTriangle, CheckCircle, Battery, Gauge, Home, Building, TrendingUp, Calculator, Wrench, Shield, Target, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CalculationResult {
  wireSize: string;
  wireSizeAluminum: string;
  breakerSize: number;
  conduitSize: string;
  groundWireSize: string;
  voltageDrop: number;
  voltageDropPercent: number;
  isAcceptable: boolean;
  estimatedInstallCost: {
    diy: number;
    professional: number;
  };
  chargingSpeed: {
    milesPerHour: number;
    kmPerHour: number;
    timeToFull: number;
  };
  monthlyEnergyCost: number;
  annualEnergyCost: number;
  co2Savings: number;
}

const EV_MODELS = [
  { name: 'Tesla Model 3/Y', battery: 75, efficiency: 4.1, maxChargeRate: 11.5 },
  { name: 'Tesla Model S/X', battery: 100, efficiency: 3.5, maxChargeRate: 11.5 },
  { name: 'Ford F-150 Lightning', battery: 131, efficiency: 2.4, maxChargeRate: 19.2 },
  { name: 'Chevrolet Bolt EV/EUV', battery: 65, efficiency: 3.5, maxChargeRate: 7.7 },
  { name: 'Ford Mustang Mach-E', battery: 91, efficiency: 3.3, maxChargeRate: 11.5 },
  { name: 'Hyundai Ioniq 5/6', battery: 77, efficiency: 3.4, maxChargeRate: 11.5 },
  { name: 'Kia EV6', battery: 77, efficiency: 3.4, maxChargeRate: 11.5 },
  { name: 'Volkswagen ID.4', battery: 82, efficiency: 3.2, maxChargeRate: 11.5 },
  { name: 'Nissan Leaf', battery: 62, efficiency: 3.5, maxChargeRate: 6.6 },
  { name: 'Audi e-tron', battery: 95, efficiency: 2.7, maxChargeRate: 11.5 },
  { name: 'BMW iX', battery: 111, efficiency: 2.9, maxChargeRate: 11.5 },
  { name: 'Rivian R1T/R1S', battery: 135, efficiency: 2.3, maxChargeRate: 11.5 },
  { name: 'Lucid Air', battery: 118, efficiency: 4.6, maxChargeRate: 19.2 },
  { name: 'Polestar 2', battery: 78, efficiency: 3.4, maxChargeRate: 11.5 },
  { name: 'Mercedes EQS', battery: 108, efficiency: 3.1, maxChargeRate: 11.5 }
];

const CHARGER_TYPES = [
  { 
    name: 'Level 1 (120V)', 
    voltage: 120, 
    current: 12, 
    power: 1.4,
    description: 'Standard household outlet, slowest charging',
    useCase: 'Emergency charging, PHEVs, overnight for short commutes'
  },
  { 
    name: 'Level 2 - 16A (240V)', 
    voltage: 240, 
    current: 16, 
    power: 3.8,
    description: 'Basic Level 2, portable chargers',
    useCase: 'Apartments, light daily driving'
  },
  { 
    name: 'Level 2 - 24A (240V)', 
    voltage: 240, 
    current: 24, 
    power: 5.8,
    description: 'Mid-range Level 2 charger',
    useCase: 'Moderate daily driving, shared charging'
  },
  { 
    name: 'Level 2 - 32A (240V)', 
    voltage: 240, 
    current: 32, 
    power: 7.7,
    description: 'Common residential hardwired',
    useCase: 'Single EV household, 40-mile daily commute'
  },
  { 
    name: 'Level 2 - 40A (240V)', 
    voltage: 240, 
    current: 40, 
    power: 9.6,
    description: 'High-power residential',
    useCase: 'Heavy daily use, faster charging needs'
  },
  { 
    name: 'Level 2 - 48A (240V)', 
    voltage: 240, 
    current: 48, 
    power: 11.5,
    description: 'Maximum residential Level 2',
    useCase: 'Tesla Wall Connector, multiple EVs'
  },
  { 
    name: 'Level 2 - 80A (240V)', 
    voltage: 240, 
    current: 80, 
    power: 19.2,
    description: 'Commercial grade Level 2',
    useCase: 'Commercial, fleet, Ford Lightning Pro'
  }
];

const WIRE_SIZES = [
  { awg: '14', copperAmpacity: 20, aluminumAmpacity: null, resistance: 2.53 },
  { awg: '12', copperAmpacity: 25, aluminumAmpacity: 20, resistance: 1.59 },
  { awg: '10', copperAmpacity: 35, aluminumAmpacity: 30, resistance: 0.999 },
  { awg: '8', copperAmpacity: 50, aluminumAmpacity: 40, resistance: 0.628 },
  { awg: '6', copperAmpacity: 65, aluminumAmpacity: 50, resistance: 0.395 },
  { awg: '4', copperAmpacity: 85, aluminumAmpacity: 65, resistance: 0.249 },
  { awg: '3', copperAmpacity: 100, aluminumAmpacity: 75, resistance: 0.197 },
  { awg: '2', copperAmpacity: 115, aluminumAmpacity: 90, resistance: 0.156 },
  { awg: '1', copperAmpacity: 130, aluminumAmpacity: 100, resistance: 0.124 },
  { awg: '1/0', copperAmpacity: 150, aluminumAmpacity: 120, resistance: 0.0983 },
  { awg: '2/0', copperAmpacity: 175, aluminumAmpacity: 135, resistance: 0.0779 },
  { awg: '3/0', copperAmpacity: 200, aluminumAmpacity: 155, resistance: 0.0618 },
  { awg: '4/0', copperAmpacity: 230, aluminumAmpacity: 180, resistance: 0.0490 }
];

const REAL_WORLD_SCENARIOS = [
  {
    title: 'Sarah\'s Tesla Model 3 Home Installation',
    situation: 'Sarah just bought a Tesla Model 3 Long Range and lives in a suburban home with an attached garage. Her electrical panel is in the basement, 65 feet from where she wants to install the Tesla Wall Connector. She drives 45 miles daily for work.',
    problem: 'She needs to determine the right wire size for a 48A Tesla Wall Connector installation. The garage gets hot in summer (95°F) and she wants to future-proof for a potential second EV.',
    analysis: 'Daily needs: 45 miles × 1.2 safety factor = 54 miles needed. At 4.1 mi/kWh efficiency, that\'s 13.2 kWh daily. A 48A charger provides 11.5kW, charging her daily needs in just 1.15 hours.',
    calculation: '48A continuous load requires 60A circuit (125% rule per NEC 625.41). With 65ft run, voltage drop with 6 AWG copper = 2.1% (acceptable). Temperature derating at 95°F = 0.94 factor.',
    solution: '6 AWG THWN-2 copper in 1" conduit with 60A breaker. Ground: 10 AWG. Total material cost: $420. Installation: $1,200-1,800.',
    realWorldContext: 'This setup provides 44 miles of range per hour of charging. Sarah can fully charge from empty in 7 hours overnight. Annual fuel savings vs gas car: $1,800.',
    lessons: [
      'Always size for continuous load at 125%',
      'Consider future second EV needs',
      'Temperature derating matters in hot garages',
      'Copper wire costs more but allows smaller conduit'
    ]
  },
  {
    title: 'Mike\'s Multi-Unit Apartment Complex',
    situation: 'Mike owns a 12-unit apartment complex and wants to install four Level 2 chargers in the parking area. The main electrical room is 200 feet from the parking spaces. Local incentives require load management.',
    problem: 'He needs to install four 32A chargers with load management to avoid service upgrade. Total available capacity is 100A for EV charging. Underground installation required.',
    analysis: 'Load management allows 100A total for 4× 40A circuits (32A continuous). Peak demand managed by smart panels. Each charger provides 7.7kW, sufficient for overnight apartment charging.',
    calculation: 'Subpanel fed with 2 AWG aluminum (100A at 75°C). Individual chargers: 8 AWG copper, 40A breakers. 200ft underground run requires voltage drop calculation: 3.8% with 2 AWG aluminum.',
    solution: 'Main feed: 2 AWG aluminum USE-2 in 2" PVC conduit. Branch circuits: 8 AWG THWN-2. Smart load management system. Total cost: $8,500 materials, $12,000 installed.',
    realWorldContext: 'Load management prevents $25,000 service upgrade. Adds $150/month revenue per parking space. Property value increase: $40,000. ROI: 18 months.',
    lessons: [
      'Load management crucial for multi-unit dwellings',
      'Aluminum acceptable for long underground runs',
      'Smart panels enable more chargers on limited power',
      'Property value and rental income justify investment'
    ]
  },
  {
    title: 'Jennifer\'s Rural Farm F-150 Lightning Setup',
    situation: 'Jennifer bought a Ford F-150 Lightning for her rural farm. She needs the truck\'s Pro Power Onboard feature for tools and wants to use it for home backup power. The barn is 150 feet from the house panel.',
    problem: 'She needs 80A charging capability for the massive 131kWh battery and faster charging after heavy towing days. Also needs to wire for bidirectional power flow for home backup.',
    analysis: 'F-150 Lightning extended range: 131kWh battery. Heavy towing drops range 50%. Needs 19.2kW (80A) charging to recover quickly. Home backup requires transfer switch installation.',
    calculation: '80A continuous = 100A circuit required. At 150ft: 3 AWG copper for 2.8% drop, or 1/0 aluminum for 3.1% drop. Bidirectional setup requires special Ford Charge Station Pro.',
    solution: '1/0 AWG aluminum URD in 2.5" PVC conduit, 100A breaker, Ford Charge Station Pro with transfer switch. Total cost: $4,200 materials, $3,500 installation.',
    realWorldContext: 'Charges truck from 20% to 80% in 8 hours. Provides 3-10 days home backup power during outages. Saves $4,500/year in fuel for farm operations.',
    lessons: [
      'Large batteries need higher amperage charging',
      'Bidirectional charging requires special equipment',
      'Rural installations often have longer wire runs',
      'Vehicle-to-home backup adds significant value'
    ]
  },
  {
    title: 'Robert\'s Solar-Integrated EV Charging',
    situation: 'Robert has a 12kW solar array and wants to charge his Hyundai Ioniq 5 primarily from solar power. He works from home and can charge during peak solar hours.',
    problem: 'He needs to size wiring for both solar integration and grid charging. Wants to maximize solar self-consumption and minimize grid usage during peak rates.',
    analysis: 'Ioniq 5 battery: 77kWh. Daily driving: 30 miles = 9kWh. Solar produces 50kWh daily average. Smart charger needed for solar-matching charging rates.',
    calculation: '48A charger allows full solar utilization at 11.5kW. DC-coupled system more efficient. Wire sizing: 6 AWG for 30ft run to garage. Solar integration requires smart inverter.',
    solution: 'SolarEdge EV charger integrated with inverter. 6 AWG copper, 60A breaker. Smart scheduling for solar-only charging. Cost: $2,800 complete system.',
    realWorldContext: '95% charging from solar saves $1,400/year. Zero emissions driving. Time-of-use optimization saves additional $300/year. Grid independence during outages.',
    lessons: [
      'Solar integration requires smart charging systems',
      'DC-coupled systems more efficient than AC',
      'Time-of-use rates affect charging strategy',
      'Solar + EV provides energy independence'
    ]
  },
  {
    title: 'Commercial Fleet Depot Installation',
    situation: 'Amazon DSP (Delivery Service Partner) installing charging for 20 Rivian EDV vans. Depot has 480V three-phase power. Vans need overnight charging for 120-mile daily routes.',
    problem: 'Must charge 20 vehicles overnight (8 hours) with 99.9% reliability. Each van has 135kWh battery, uses 65kWh daily. Limited to 800A service.',
    analysis: '20 vans × 65kWh ÷ 8 hours = 162.5kW total power needed. With diversity factor: 130kW peak. Requires sophisticated load management. 480V reduces current and wire sizes.',
    calculation: 'Main feed: 500 MCM copper (380A). Distribution: 40A circuits per charger. Step-down transformers to 240V. Load management critical.',
    solution: 'Intelligent load management system, 500 MCM feeders, twenty 11.5kW chargers with load sharing. Total cost: $185,000 installed ($9,250 per vehicle).',
    realWorldContext: 'Saves $4,000/van/year in fuel. Reduces maintenance 70%. Meets corporate sustainability goals. Qualifies for $50,000 federal tax credit.',
    lessons: [
      'Fleet charging requires load management',
      'Three-phase power reduces installation costs',
      'Diversity factor crucial for large installations',
      'Federal incentives significantly reduce costs'
    ]
  }
];

const INSTALLATION_GUIDE = {
  planning: [
    'Assess your electrical panel capacity (typically need 40-100A available)',
    'Determine charger location (garage, carport, driveway, parking space)',
    'Measure distance from panel to charger location',
    'Check local codes and permit requirements',
    'Consider future EV purchases or home additions',
    'Evaluate time-of-use electric rates for optimal charging schedules'
  ],
  permits: [
    'Building permit typically required for new circuit installation',
    'Electrical permit specifically for EV charger',
    'Some areas require dedicated EV charger permits',
    'Utility notification may be required for high-amperage installations',
    'HOA approval needed in some communities',
    'Historic districts may have additional requirements'
  ],
  installation: [
    'Turn off main breaker before any panel work',
    'Install appropriate circuit breaker (40A, 50A, 60A, etc.)',
    'Run conduit from panel to charger location',
    'Pull appropriate gauge wire through conduit',
    'Install disconnect switch if required by code (usually for outdoor)',
    'Mount and wire charger according to manufacturer instructions',
    'Connect equipment grounding conductor',
    'Test GFCI protection if applicable',
    'Schedule inspection before energizing',
    'Configure charger settings and smart features'
  ],
  safety: [
    'Never work on live circuits',
    'Use GFCI protection for outdoor installations',
    'Ensure proper grounding and bonding',
    'Follow torque specifications for all connections',
    'Use appropriate wire types for wet locations',
    'Maintain required clearances from windows, doors',
    'Install bollards for protection if needed',
    'Consider surge protection devices'
  ]
};

export default function EVChargerWireSizeCalculator() {
  const [chargerType, setChargerType] = useState(CHARGER_TYPES[4]); // 40A default
  const [distance, setDistance] = useState(50);
  const [vehicleModel, setVehicleModel] = useState(EV_MODELS[0]);
  const [dailyMiles, setDailyMiles] = useState(40);
  const [electricityRate, setElectricityRate] = useState(0.13);
  const [installationType, setInstallationType] = useState<'indoor' | 'outdoor'>('indoor');
  const [wireType, setWireType] = useState<'copper' | 'aluminum'>('copper');
  const [existingPanelCapacity, setExistingPanelCapacity] = useState(200);
  const [availableCapacity, setAvailableCapacity] = useState(60);
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const calculateWireSize = () => {
    const continuousLoad = chargerType.current;
    const requiredCircuitSize = Math.ceil(continuousLoad * 1.25);
    
    // Find appropriate wire size
    const copperWire = WIRE_SIZES.find(w => w.copperAmpacity >= requiredCircuitSize);
    const aluminumWire = WIRE_SIZES.find(w => w.aluminumAmpacity && w.aluminumAmpacity >= requiredCircuitSize);
    
    // Calculate voltage drop
    const totalDistance = distance * 2; // Round trip
    const voltageDrop = copperWire 
      ? (totalDistance * continuousLoad * copperWire.resistance) / 1000
      : 0;
    const voltageDropPercent = (voltageDrop / chargerType.voltage) * 100;
    
    // Calculate charging speeds
    const actualPower = chargerType.power;
    const milesPerHour = actualPower * vehicleModel.efficiency;
    const kmPerHour = milesPerHour * 1.60934;
    const timeToFull = vehicleModel.battery / actualPower;
    
    // Calculate costs
    const dailyKwh = dailyMiles / vehicleModel.efficiency;
    const monthlyEnergyCost = dailyKwh * 30 * electricityRate;
    const annualEnergyCost = dailyKwh * 365 * electricityRate;
    
    // CO2 savings (vs 25 MPG gas car)
    const annualGallons = (dailyMiles * 365) / 25;
    const co2Savings = annualGallons * 19.6; // pounds of CO2 per gallon
    
    // Installation cost estimates
    const materialCost = 
      (distance * (wireType === 'copper' ? 8 : 5)) + // Wire cost per foot
      (requiredCircuitSize <= 60 ? 75 : 125) + // Breaker cost
      (distance * 3) + // Conduit
      350; // Charger hardware
      
    const laborCost = 
      (distance * 10) + // Labor per foot
      500 + // Panel work
      (installationType === 'outdoor' ? 300 : 0); // Outdoor premium
    
    // Determine breaker size (standard sizes)
    const breakerSizes = [15, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const breakerSize = breakerSizes.find(size => size >= requiredCircuitSize) || 100;
    
    // Conduit size
    const conduitSize = 
      copperWire?.awg === '14' || copperWire?.awg === '12' ? '1/2"' :
      copperWire?.awg === '10' || copperWire?.awg === '8' ? '3/4"' :
      copperWire?.awg === '6' || copperWire?.awg === '4' ? '1"' :
      copperWire?.awg === '3' || copperWire?.awg === '2' ? '1-1/4"' :
      '1-1/2"';
    
    // Ground wire size (per NEC Table 250.122)
    const groundWireSize = 
      breakerSize <= 20 ? '12 AWG' :
      breakerSize <= 60 ? '10 AWG' :
      breakerSize <= 100 ? '8 AWG' :
      '6 AWG';
    
    setResults({
      wireSize: copperWire ? `${copperWire.awg} AWG` : 'Size not found',
      wireSizeAluminum: aluminumWire ? `${aluminumWire.awg} AWG` : 'Size not found',
      breakerSize,
      conduitSize,
      groundWireSize,
      voltageDrop,
      voltageDropPercent,
      isAcceptable: voltageDropPercent <= 3,
      estimatedInstallCost: {
        diy: materialCost,
        professional: materialCost + laborCost
      },
      chargingSpeed: {
        milesPerHour,
        kmPerHour,
        timeToFull
      },
      monthlyEnergyCost,
      annualEnergyCost,
      co2Savings
    });
  };

  const performCalculation = useCallback(() => {
    calculateWireSize();
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [chargerType, distance, vehicleModel, dailyMiles, electricityRate, installationType, wireType]);

  const handleReset = useCallback(() => {
    setChargerType(CHARGER_TYPES[4]); // 40A default
    setDistance(50);
    setVehicleModel(EV_MODELS[0]);
    setDailyMiles(40);
    setElectricityRate(0.13);
    setInstallationType('indoor');
    setWireType('copper');
    setExistingPanelCapacity(200);
    setAvailableCapacity(60);
    setShowResults(false);
  }, []);

  useEffect(() => {
    if (showResults) {
      calculateWireSize();
    }
  }, [chargerType, distance, vehicleModel, dailyMiles, electricityRate, installationType, wireType, showResults]);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <Car className="w-8 h-8 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">EV Charger Wire Size Calculator</h2>
        </div>
        <p className="text-gray-600">
          Calculate the exact wire size, breaker, and installation requirements for your electric vehicle charger. 
          Includes NEC Article 625 compliance, cost analysis, and charging time estimates.
        </p>
      </div>

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Charging Setup Configuration</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Charger Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Charger Type & Amperage
              </label>
              <select
                value={CHARGER_TYPES.indexOf(chargerType)}
                onChange={(e) => setChargerType(CHARGER_TYPES[parseInt(e.target.value)])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CHARGER_TYPES.map((type, idx) => (
                  <option key={idx} value={idx}>
                    {type.name} - {type.power}kW
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">{chargerType.description}</p>
              <p className="text-xs text-blue-600 mt-1">Best for: {chargerType.useCase}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance from Panel (feet)
              </label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="500"
              />
              <p className="text-xs text-gray-500 mt-1">One-way distance from electrical panel to charger</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Installation Type
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setInstallationType('indoor')}
                  className={`flex-1 py-2 px-4 rounded-lg border ${
                    installationType === 'indoor' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  Indoor/Garage
                </button>
                <button
                  onClick={() => setInstallationType('outdoor')}
                  className={`flex-1 py-2 px-4 rounded-lg border ${
                    installationType === 'outdoor' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  Outdoor
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wire Type Preference
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setWireType('copper')}
                  className={`flex-1 py-2 px-4 rounded-lg border ${
                    wireType === 'copper' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  Copper
                </button>
                <button
                  onClick={() => setWireType('aluminum')}
                  className={`flex-1 py-2 px-4 rounded-lg border ${
                    wireType === 'aluminum' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  Aluminum
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Vehicle Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Electric Vehicle Model
              </label>
              <select
                value={EV_MODELS.indexOf(vehicleModel)}
                onChange={(e) => setVehicleModel(EV_MODELS[parseInt(e.target.value)])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {EV_MODELS.map((model, idx) => (
                  <option key={idx} value={idx}>
                    {model.name} ({model.battery} kWh)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Driving Distance (miles)
              </label>
              <input
                type="number"
                value={dailyMiles}
                onChange={(e) => setDailyMiles(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="300"
              />
              <p className="text-xs text-gray-500 mt-1">Average miles driven per day</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Electricity Rate ($/kWh)
              </label>
              <input
                type="number"
                value={electricityRate}
                onChange={(e) => setElectricityRate(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="1"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">Your utility rate per kilowatt-hour</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Electrical Panel Capacity
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="number"
                    value={existingPanelCapacity}
                    onChange={(e) => setExistingPanelCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="100"
                    max="400"
                  />
                  <p className="text-xs text-gray-500 mt-1">Total amps</p>
                </div>
                <div>
                  <input
                    type="number"
                    value={availableCapacity}
                    onChange={(e) => setAvailableCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Available amps</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {/* Calculate Button */}
          <Button onClick={performCalculation} className="w-full">
            <Calculator className="w-4 h-4" />
            Calculate EV Charger Wire Size
          </Button>

          {/* Reset Button */}
          <Button variant="secondary" onClick={handleReset} className="w-full">
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {showResults && results && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" ref={resultsRef}>
          {/* Technical Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Technical Requirements</h3>
            </div>
            
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Wire Size (Copper)</div>
                <div className="text-xl font-bold text-blue-600">{results.wireSize}</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Wire Size (Aluminum)</div>
                <div className="text-xl font-bold text-gray-700">{results.wireSizeAluminum}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Breaker Size</div>
                  <div className="text-lg font-bold text-gray-700">{results.breakerSize}A</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Conduit</div>
                  <div className="text-lg font-bold text-gray-700">{results.conduitSize}</div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Equipment Ground</div>
                <div className="text-lg font-bold text-gray-700">{results.groundWireSize}</div>
              </div>
              
              <div className={`rounded-lg p-3 ${results.isAcceptable ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="text-sm text-gray-600">Voltage Drop</div>
                <div className={`text-lg font-bold ${results.isAcceptable ? 'text-green-600' : 'text-red-600'}`}>
                  {results.voltageDropPercent.toFixed(2)}%
                  {results.isAcceptable ? (
                    <span className="text-sm ml-2">✓ Acceptable</span>
                  ) : (
                    <span className="text-sm ml-2">⚠ High</span>
                  )}
                </div>
              </div>
              
              {availableCapacity < results.breakerSize && (
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Panel Upgrade May Be Required</span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    Available capacity ({availableCapacity}A) less than required ({results.breakerSize}A)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Charging Performance */}
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Charging Performance</h3>
            </div>
            
            <div className="space-y-3">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Charging Speed</div>
                <div className="text-xl font-bold text-green-600">
                  {results.chargingSpeed.milesPerHour.toFixed(1)} mi/hr
                </div>
                <div className="text-sm text-gray-500">
                  {results.chargingSpeed.kmPerHour.toFixed(1)} km/hr
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Time to Full Charge</div>
                <div className="text-lg font-bold text-gray-700">
                  {results.chargingSpeed.timeToFull.toFixed(1)} hours
                </div>
                <div className="text-sm text-gray-500">From empty to 100%</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Daily Charging Time</div>
                <div className="text-lg font-bold text-gray-700">
                  {(dailyMiles / results.chargingSpeed.milesPerHour).toFixed(1)} hours
                </div>
                <div className="text-sm text-gray-500">For {dailyMiles} miles</div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Power Delivery</div>
                <div className="text-lg font-bold text-blue-600">
                  {chargerType.power} kW
                </div>
                <div className="text-sm text-gray-500">
                  {chargerType.voltage}V @ {chargerType.current}A
                </div>
              </div>
            </div>
          </div>

          {/* Cost Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Cost Analysis</h3>
            </div>
            
            <div className="space-y-3">
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Installation Cost</div>
                <div className="text-lg font-bold text-yellow-700">
                  DIY: ${results.estimatedInstallCost.diy.toFixed(0)}
                </div>
                <div className="text-lg font-bold text-yellow-700">
                  Pro: ${results.estimatedInstallCost.professional.toFixed(0)}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Monthly Energy Cost</div>
                <div className="text-lg font-bold text-gray-700">
                  ${results.monthlyEnergyCost.toFixed(0)}
                </div>
                <div className="text-sm text-gray-500">
                  vs ~${((dailyMiles * 30 / 25) * 3.50).toFixed(0)} gas
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Annual Savings</div>
                <div className="text-lg font-bold text-green-600">
                  ${(((dailyMiles * 365 / 25) * 3.50) - results.annualEnergyCost).toFixed(0)}
                </div>
                <div className="text-sm text-gray-500">vs gasoline vehicle</div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">CO₂ Reduction</div>
                <div className="text-lg font-bold text-blue-600">
                  {(results.co2Savings / 1000).toFixed(1)} tons/year
                </div>
                <div className="text-sm text-gray-500">
                  {results.co2Savings.toFixed(0)} lbs CO₂ saved
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Charging Time Visualization */}
      {showResults && results && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Charging Time Visualization</h3>
          
          <div className="space-y-4">
            {/* Daily Charge Timeline */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Daily Charging ({dailyMiles} miles)</span>
                <span>{(dailyMiles / results.chargingSpeed.milesPerHour).toFixed(1)} hours</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ width: `${Math.min(100, (dailyMiles / results.chargingSpeed.milesPerHour) * 100 / 12)}%` }}
                >
                  {(dailyMiles / results.chargingSpeed.milesPerHour).toFixed(1)}h
                </div>
              </div>
            </div>
            
            {/* Full Charge Timeline */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Full Charge (0-100%)</span>
                <span>{results.chargingSpeed.timeToFull.toFixed(1)} hours</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ width: `${Math.min(100, results.chargingSpeed.timeToFull * 100 / 12)}%` }}
                >
                  {results.chargingSpeed.timeToFull.toFixed(1)}h
                </div>
              </div>
            </div>
            
            {/* Comparison with other charger types */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-3">Charging Speed Comparison</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: 'Level 1', hours: vehicleModel.battery / 1.4, color: 'red' },
                  { name: '32A L2', hours: vehicleModel.battery / 7.7, color: 'yellow' },
                  { name: '48A L2', hours: vehicleModel.battery / 11.5, color: 'green' },
                  { name: 'DC Fast', hours: vehicleModel.battery / 150, color: 'blue' }
                ].map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div className={`h-20 bg-${item.color}-100 rounded-lg flex items-end justify-center p-2`}>
                      <div 
                        className={`w-full bg-${item.color}-500 rounded`}
                        style={{ height: `${Math.min(100, (1 / item.hours) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs font-medium mt-1">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.hours.toFixed(1)}h</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-World Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Real-World Installation Examples</h3>
        
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {REAL_WORLD_SCENARIOS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedScenario(idx)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedScenario === idx 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Scenario {idx + 1}
            </button>
          ))}
        </div>
        
        {REAL_WORLD_SCENARIOS[selectedScenario] && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">
                {REAL_WORLD_SCENARIOS[selectedScenario].title}
              </h4>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-2">Situation</h5>
                <p className="text-sm text-gray-700">
                  {REAL_WORLD_SCENARIOS[selectedScenario].situation}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-2">Challenge</h5>
                <p className="text-sm text-gray-700">
                  {REAL_WORLD_SCENARIOS[selectedScenario].problem}
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-semibold text-blue-800 mb-2">Technical Analysis</h5>
              <p className="text-sm text-blue-700">
                {REAL_WORLD_SCENARIOS[selectedScenario].analysis}
              </p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <h5 className="font-semibold text-yellow-800 mb-2">Wire Sizing Calculation</h5>
              <p className="text-sm text-yellow-700 font-mono">
                {REAL_WORLD_SCENARIOS[selectedScenario].calculation}
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="font-semibold text-green-800 mb-2">Solution Implemented</h5>
              <p className="text-sm text-green-700">
                {REAL_WORLD_SCENARIOS[selectedScenario].solution}
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h5 className="font-semibold text-purple-800 mb-2">Real-World Impact</h5>
              <p className="text-sm text-purple-700">
                {REAL_WORLD_SCENARIOS[selectedScenario].realWorldContext}
              </p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-2">Key Lessons</h5>
              <ul className="space-y-1">
                {REAL_WORLD_SCENARIOS[selectedScenario].lessons.map((lesson, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {lesson}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Installation Guide */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Complete Installation Guide</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Planning Phase
            </h4>
            <ul className="space-y-2">
              {INSTALLATION_GUIDE.planning.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              Permits & Codes
            </h4>
            <ul className="space-y-2">
              {INSTALLATION_GUIDE.permits.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-orange-600" />
              Installation Steps
            </h4>
            <ol className="space-y-2">
              {INSTALLATION_GUIDE.installation.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-orange-600 font-medium">{idx + 1}.</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Safety Requirements
            </h4>
            <ul className="space-y-2">
              {INSTALLATION_GUIDE.safety.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* NEC Code References */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">NEC Article 625 - Electric Vehicle Charging</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-medium text-gray-800 mb-2">625.41 - Rating</h4>
            <p className="text-sm text-gray-600">
              EV supply equipment shall have sufficient rating to supply the load served. 
              For continuous loads, the rating shall be 125% of the maximum load.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-medium text-gray-800 mb-2">625.42 - Disconnecting Means</h4>
            <p className="text-sm text-gray-600">
              Must be provided to disconnect the circuit conductors including the grounded conductor 
              from the premises wiring.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-medium text-gray-800 mb-2">625.44 - Equipment Connection</h4>
            <p className="text-sm text-gray-600">
              EV supply equipment rated &gt;60A or &gt;150V to ground shall be permanently connected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}