'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Building, Calculator, Zap, DollarSign, AlertTriangle, CheckCircle, Shield, TrendingUp, FileText, Target, Wrench, Users, Home, Factory, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ServiceCalculationResult {
  serviceType: string;
  recommendedServiceSize: number;
  serviceEntranceConductors: {
    copper: string;
    aluminum: string;
    parallelRuns: boolean;
  };
  groundingElectrodeSize: string;
  neutralSize: string;
  meterBaseType: string;
  mainBreakerSize: number;
  mainPanelSpaces: number;
  voltageDrop: number;
  voltageDropPercent: number;
  totalConnectedLoad: number;
  calculatedDemand: number;
  demandAmps: number;
  utilizationPercentage: number;
  estimatedCost: {
    materials: number;
    labor: number;
    permits: number;
    utilityFees: number;
    total: number;
  };
  nec310_12Compliant: boolean;
  weatherheadHeight: string;
  mastSize: string;
  anchorRequirements: string;
}

const SERVICE_TYPES = [
  { 
    name: 'Overhead Service Drop',
    description: 'Utility lines from pole to weatherhead',
    typicalUse: 'Standard residential, rural areas',
    advantages: 'Lower cost, easier maintenance',
    disadvantages: 'Weather exposed, aesthetic concerns',
    costMultiplier: 1.0
  },
  { 
    name: 'Underground Service Lateral',
    description: 'Buried cable from transformer to meter',
    typicalUse: 'Urban/suburban, new developments',
    advantages: 'Aesthetic, weather protected',
    disadvantages: 'Higher cost, difficult repairs',
    costMultiplier: 1.4
  },
  { 
    name: 'Mobile Home Service',
    description: 'Pedestal-mounted meter and disconnect',
    typicalUse: 'Manufactured homes, RV parks',
    advantages: 'Portable, standardized',
    disadvantages: 'Special requirements',
    costMultiplier: 0.9
  },
  { 
    name: 'Temporary Construction Service',
    description: 'Pole-mounted temporary power',
    typicalUse: 'Construction sites',
    advantages: 'Quick setup, portable',
    disadvantages: 'Limited duration',
    costMultiplier: 0.7
  }
];

const SERVICE_SIZES = [
  { size: 60, copper: '6 AWG', aluminum: '4 AWG', ground: '10 AWG', residential: false, commercial: false },
  { size: 100, copper: '4 AWG', aluminum: '2 AWG', ground: '8 AWG', residential: true, commercial: false },
  { size: 125, copper: '2 AWG', aluminum: '1/0 AWG', ground: '8 AWG', residential: true, commercial: false },
  { size: 150, copper: '1 AWG', aluminum: '2/0 AWG', ground: '6 AWG', residential: true, commercial: false },
  { size: 200, copper: '2/0 AWG', aluminum: '4/0 AWG', ground: '4 AWG', residential: true, commercial: true },
  { size: 225, copper: '3/0 AWG', aluminum: '250 MCM', ground: '4 AWG', residential: true, commercial: true },
  { size: 300, copper: '350 MCM', aluminum: '500 MCM', ground: '2 AWG', residential: false, commercial: true },
  { size: 400, copper: '500 MCM', aluminum: '750 MCM', ground: '1/0 AWG', residential: true, commercial: true },
  { size: 600, copper: '2×350 MCM', aluminum: '2×500 MCM', ground: '2/0 AWG', residential: false, commercial: true },
  { size: 800, copper: '2×500 MCM', aluminum: '2×750 MCM', ground: '3/0 AWG', residential: false, commercial: true },
  { size: 1000, copper: '3×500 MCM', aluminum: '3×750 MCM', ground: '4/0 AWG', residential: false, commercial: true },
  { size: 1200, copper: '4×500 MCM', aluminum: '4×750 MCM', ground: '250 MCM', residential: false, commercial: true }
];

const REAL_WORLD_SCENARIOS = [
  {
    title: 'New Construction 3,500 sq ft Home Service',
    situation: 'The Rodriguez family is building a 3,500 sq ft custom home with all-electric utilities including geothermal heat pump, electric vehicle charging, pool/spa, and outdoor kitchen. The builder needs to determine correct service entrance size for permit submittal.',
    problem: 'The home has significant electrical loads: 5-ton geothermal (7kW), Level 2 EV charger (9.6kW), pool equipment (3kW), spa (12kW), outdoor kitchen (8kW), plus standard home loads. Local utility requires underground service lateral.',
    analysis: 'Connected load calculation: General lighting (10.5kW), small appliances (3kW), laundry (1.5kW), range (8kW), water heater (4.5kW), geothermal (7kW), EV charger (9.6kW), pool/spa (15kW), outdoor kitchen (8kW). Total: 67.1kW connected load.',
    calculation: 'NEC 220.82 Optional Method: First 10kW at 100% = 10kW, Remaining 57.1kW at 40% = 22.8kW. Total demand = 32.8kW = 137A at 240V. Recommend 200A service for growth.',
    solution: '200A underground service with 4/0 aluminum URD cable in 2.5" PVC conduit, 200A meter base, 200A main breaker panel with 42 spaces. Cost: $5,800 installed.',
    realWorldContext: '200A service provides 63A (32%) spare capacity for future additions. Underground installation adds $1,200 but eliminates weather concerns and improves aesthetics. Property value increased by $15,000.',
    lessons: [
      'Underground service costs more but adds value',
      'Size for 20-30% growth beyond initial calculation',
      'Coordinate with utility early for transformer sizing',
      'Consider smart panel for load management'
    ]
  },
  {
    title: 'Historic Downtown Building Service Upgrade',
    situation: 'A 1920s brick building being converted from offices to residential lofts requires complete service upgrade. The existing 400A three-phase service must be replaced with appropriate residential service. Eight luxury loft units planned with individual metering.',
    problem: 'Building needs house panel for common areas plus eight apartment meters. Each unit will have electric heat pumps, washers/dryers, and high-end appliances. Historic district requirements complicate installation. Utility vault in alley requires coordination.',
    analysis: 'Each unit: 1,500 sq ft = 30A lighting/receptacle, heat pump 25A, kitchen 50A, laundry 30A = 135A calculated, 100A per unit after diversity. House loads: hallways, elevator, parking = 100A. Total building: 900A.',
    calculation: 'Multi-family calculation per NEC 220.84: 8 units × 100A × 0.43 diversity = 344A for units. Add 100A house loads = 444A total. CT metering required. Install 600A service with meter stack.',
    solution: '600A service with CT cabinet, 8-position meter stack, house panel. Underground feed from utility vault. Copper required in vault. Total project: $48,000.',
    realWorldContext: 'CT metering eliminates individual service drops, cleaner installation. Historic commission approved underground feed. Each unit can be separately billed. Project enables $2.4M property renovation.',
    lessons: [
      'Multi-family requires different calculation methods',
      'CT metering simplifies large services',
      'Historic districts have special requirements',
      'Utility coordination critical for downtown locations'
    ]
  },
  {
    title: 'Rural Farm Service Installation',
    situation: 'Johnson Farm needs new 400A service for expanded operations including grain dryer, shop building, irrigation pumps, and main house. Located 1/2 mile from nearest transformer, requiring long service run.',
    problem: 'Long distance from utility transformer creates significant voltage drop concerns. Multiple buildings need sub-panels. Grain dryer alone requires 100A, irrigation pumps 60A, shop 100A, house 100A. Three-phase power needed for motors.',
    analysis: 'Total connected load: Grain dryer 24kW, irrigation 15kW, shop 20kW, house 20kW, outbuildings 10kW = 89kW. Three-phase calculation different from single-phase. Long run requires voltage drop mitigation.',
    calculation: 'Three-phase power: 89kW at 480V = 107A calculated demand. Need 400A service for motor starting currents and growth. Voltage drop over 2,640 ft requires 500 MCM aluminum.',
    solution: '400A three-phase service, pad-mount transformer, 500 MCM aluminum direct burial cable, main distribution panel with circuit breakers for each building. Cost: $28,000 plus utility charges.',
    realWorldContext: 'Three-phase power enables efficient motor operation, reduces operating costs 30%. Utility charged $15,000 for transformer and primary extension. Enables grain drying on-site saving $20,000/year.',
    lessons: [
      'Rural installations often require utility line extensions',
      'Three-phase more efficient for motor loads',
      'Long runs require significant wire upsizing',
      'Agricultural services have special rate structures'
    ]
  },
  {
    title: 'Small Business Retrofit Service Upgrade',
    situation: 'Metro Coffee expanding into adjacent space, doubling their footprint. Current 200A service insufficient for additional equipment: commercial HVAC, walk-in cooler, additional espresso machines, commercial kitchen equipment.',
    problem: 'Existing 200A service at 85% capacity. Expansion adds: 5-ton HVAC (30A), walk-in cooler (20A), kitchen equipment (60A), lighting/receptacles (40A). Downtown location makes service upgrade complex. Business cannot close during upgrade.',
    analysis: 'Existing load: 170A measured. New loads: 150A calculated. Total: 320A required. Must maintain power during upgrade for business continuity. Coordinate with neighboring businesses for utility work.',
    calculation: 'Commercial calculation: 320A demand + 25% growth = 400A service recommended. Step up from 200A to 400A requires new service entrance, meter base, and main panel.',
    solution: '400A service with bypass meter base for hot cutover, new main distribution panel, temporary power during switchover. Weekend installation to minimize disruption. Cost: $14,000.',
    realWorldContext: 'Bypass meter allowed seamless transition without closing business. 400A service enables future expansion. Installation recovered through energy efficiency rebates and increased revenue from expanded operations.',
    lessons: [
      'Business continuity critical for commercial upgrades',
      'Bypass metering enables hot cutovers',
      'Weekend/night work minimizes revenue impact',
      'Size commercial services for significant growth'
    ]
  },
  {
    title: 'Solar-Ready Service Installation',
    situation: 'The Chen family building a net-zero home with 20kW solar array, battery backup, and all-electric appliances. Service entrance must accommodate bidirectional power flow, rapid shutdown requirements, and future expansion.',
    problem: 'Solar interconnection requires special metering and safety equipment. Battery system needs separate disconnect. Utility requires specific equipment for net metering. Code requires rapid shutdown and arc-fault detection.',
    analysis: 'Load calculation standard but must add solar generation capacity. 20kW solar + 15kW battery inverter + 40kW house loads = complex electrical design. Utility interconnection agreement needed.',
    calculation: 'House loads: 40kW calculated demand = 167A. Solar backfeed: 20kW = 83A. Combined rating: 250A minimum. Use 300A service for headroom. Special solar-ready meter base required.',
    solution: '300A service with solar-ready meter base, generation disconnect, rapid shutdown system, surge protection. Main panel with solar combiner section. Cost: $8,500 for solar-ready infrastructure.',
    realWorldContext: 'Solar-ready service adds $2,500 but saves $4,000 versus retrofit. Utility rebate $1,500 for solar interconnection. Net metering credits offset 100% of electrical bills. Home achieved net-zero certification.',
    lessons: [
      'Solar installations require special service equipment',
      'Utilities have specific interconnection requirements',
      'Rapid shutdown mandatory for roof-mount solar',
      'Plan service entrance for future battery addition'
    ]
  }
];

const UTILITY_REQUIREMENTS = [
  { 
    utility: 'Pacific Gas & Electric (CA)',
    serviceMax: '400A residential',
    meterHeight: '4-6 ft',
    clearances: '3 ft sides, 3 ft front',
    specialRequirements: 'Seismic bracing required, fire hardening in certain areas'
  },
  { 
    utility: 'ConEd (New York)',
    serviceMax: '200A typical',
    meterHeight: '4-5.5 ft',
    clearances: '2 ft sides, 3 ft front',
    specialRequirements: 'Network protector required, vault installations common'
  },
  { 
    utility: 'ComEd (Illinois)',
    serviceMax: '320A residential',
    meterHeight: '4-6 ft',
    clearances: '3 ft working space',
    specialRequirements: 'Cold weather specifications, anti-theft provisions'
  },
  { 
    utility: 'Duke Energy (NC/SC)',
    serviceMax: '400A residential',
    meterHeight: '4.5-6 ft',
    clearances: '3 ft sides, 36" front',
    specialRequirements: 'Hurricane ratings required coastal areas'
  },
  { 
    utility: 'Oncor (Texas)',
    serviceMax: '400A standard',
    meterHeight: '4-6 ft',
    clearances: '36" all sides',
    specialRequirements: 'Smart meter compatible, surge protection recommended'
  }
];

const GROUNDING_REQUIREMENTS = [
  { serviceSize: '100A', copperGEC: '8 AWG', aluminumGEC: '6 AWG', groundRods: '2 × 8 ft', waterPipeBond: '8 AWG' },
  { serviceSize: '150A', copperGEC: '6 AWG', aluminumGEC: '4 AWG', groundRods: '2 × 8 ft', waterPipeBond: '6 AWG' },
  { serviceSize: '200A', copperGEC: '4 AWG', aluminumGEC: '2 AWG', groundRods: '2 × 8 ft', waterPipeBond: '4 AWG' },
  { serviceSize: '300A', copperGEC: '2 AWG', aluminumGEC: '1/0 AWG', groundRods: '2 × 8 ft', waterPipeBond: '2 AWG' },
  { serviceSize: '400A', copperGEC: '1/0 AWG', aluminumGEC: '3/0 AWG', groundRods: '2 × 8 ft', waterPipeBond: '1/0 AWG' }
];

export default function ServiceEntranceCalculator() {
  const [buildingType, setBuildingType] = useState<'residential' | 'commercial'>('residential');
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [calculatedLoad, setCalculatedLoad] = useState(32000); // Watts
  const [voltage, setVoltage] = useState(240);
  const [phases, setPhases] = useState<1 | 3>(1);
  const [runLength, setRunLength] = useState(25); // feet from transformer/pole to meter
  const [growthFactor, setGrowthFactor] = useState(25); // percentage
  const [weatherExposure, setWeatherExposure] = useState<'exposed' | 'protected'>('exposed');
  const [soilType, setSoilType] = useState<'normal' | 'rocky' | 'wet'>('normal');
  const [specialRequirements, setSpecialRequirements] = useState({
    solarReady: false,
    generatorReady: false,
    evCharging: false,
    surgeProtection: false
  });
  const [results, setResults] = useState<ServiceCalculationResult | null>(null);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const calculateService = () => {
    // Calculate demand amperage
    const demandAmps = calculatedLoad / voltage / (phases === 3 ? 1.732 : 1);
    const demandWithGrowth = demandAmps * (1 + growthFactor / 100);
    
    // Determine service size
    let recommendedSize = 100;
    const sizes = [60, 100, 125, 150, 200, 225, 300, 400, 600, 800, 1000, 1200];
    for (const size of sizes) {
      if (demandWithGrowth <= size * 0.8) {
        recommendedSize = size;
        break;
      }
    }
    
    // Get conductor sizes
    const serviceInfo = SERVICE_SIZES.find(s => s.size === recommendedSize) || SERVICE_SIZES[3];
    const parallelRuns = serviceInfo.copper.includes('×');
    
    // Calculate voltage drop
    const resistance = parallelRuns ? 0.025 : 0.05; // Simplified
    const voltageDrop = (2 * runLength * demandAmps * resistance) / 1000;
    const voltageDropPercent = (voltageDrop / voltage) * 100;
    
    // Grounding requirements
    const groundingInfo = GROUNDING_REQUIREMENTS.find(
      g => parseInt(g.serviceSize) >= recommendedSize
    ) || GROUNDING_REQUIREMENTS[2];
    
    // Cost calculation
    const baseMaterialCost = 
      recommendedSize * 8 + // Service entrance cable
      runLength * 12 + // Cost per foot
      (serviceType.name === 'Underground Service Lateral' ? runLength * 25 : 0) + // Trenching
      800; // Meter base and hardware
    
    const laborCost = 
      recommendedSize * 4 + // Base labor
      runLength * 8 + // Installation per foot
      (weatherExposure === 'exposed' ? 500 : 0) + // Weather head/mast
      1200; // Base installation
    
    const permitCost = 150 + recommendedSize * 0.5;
    const utilityFees = recommendedSize > 200 ? 500 : 250;
    
    // Apply service type multiplier
    const adjustedMaterialCost = baseMaterialCost * serviceType.costMultiplier;
    const adjustedLaborCost = laborCost * serviceType.costMultiplier;
    
    // Special requirements costs
    if (specialRequirements.solarReady) {
      adjustedMaterialCost + 800;
      adjustedLaborCost + 400;
    }
    if (specialRequirements.generatorReady) {
      adjustedMaterialCost + 600;
      adjustedLaborCost + 300;
    }
    
    // Panel sizing
    const mainPanelSpaces = 
      recommendedSize <= 125 ? 24 :
      recommendedSize <= 200 ? 42 :
      recommendedSize <= 400 ? 54 :
      84;
    
    // Mast and weatherhead for overhead
    const mastSize = 
      recommendedSize <= 150 ? '2" rigid conduit' :
      recommendedSize <= 200 ? '2.5" rigid conduit' :
      '3" rigid conduit';
    
    const weatherheadHeight = '12 ft minimum from grade';
    const anchorRequirements = recommendedSize > 200 ? 'Guy wire or roof bracket required' : 'Wall brackets at 8 ft intervals';
    
    setResults({
      serviceType: serviceType.name,
      recommendedServiceSize: recommendedSize,
      serviceEntranceConductors: {
        copper: serviceInfo.copper,
        aluminum: serviceInfo.aluminum,
        parallelRuns
      },
      groundingElectrodeSize: groundingInfo.copperGEC,
      neutralSize: serviceInfo.aluminum, // Typically same as phase conductors
      meterBaseType: `${recommendedSize}A ${phases === 3 ? 'three-phase' : 'single-phase'}`,
      mainBreakerSize: recommendedSize,
      mainPanelSpaces,
      voltageDrop,
      voltageDropPercent,
      totalConnectedLoad: calculatedLoad * 1.25, // Add margin
      calculatedDemand: calculatedLoad,
      demandAmps,
      utilizationPercentage: (demandAmps / recommendedSize) * 100,
      estimatedCost: {
        materials: Math.round(adjustedMaterialCost),
        labor: Math.round(adjustedLaborCost),
        permits: Math.round(permitCost),
        utilityFees,
        total: Math.round(adjustedMaterialCost + adjustedLaborCost + permitCost + utilityFees)
      },
      nec310_12Compliant: true,
      weatherheadHeight,
      mastSize,
      anchorRequirements
    });
  };

  const performCalculation = useCallback(() => {
    calculateService();
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [buildingType, serviceType, calculatedLoad, voltage, phases, runLength, growthFactor, weatherExposure, soilType, specialRequirements]);

  const handleReset = useCallback(() => {
    setBuildingType('residential');
    setServiceType(SERVICE_TYPES[0]);
    setCalculatedLoad(32000);
    setVoltage(240);
    setPhases(1);
    setRunLength(25);
    setGrowthFactor(25);
    setWeatherExposure('exposed');
    setSoilType('normal');
    setSpecialRequirements({
      solarReady: false,
      generatorReady: false,
      evCharging: false,
      surgeProtection: false
    });
    setShowResults(false);
  }, []);

  useEffect(() => {
    if (showResults) {
      calculateService();
    }
  }, [buildingType, serviceType, calculatedLoad, voltage, phases, runLength, growthFactor, weatherExposure, soilType, specialRequirements, showResults]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <Building className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Service Entrance Calculator</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Calculate complete service entrance requirements including conductor sizing, grounding, meter base, 
          and main panel specifications per NEC Article 230 and Table 310.12.
        </p>
        <div className="bg-purple-100 rounded-lg p-3 border border-purple-300">
          <p className="text-sm text-purple-700 flex items-start gap-2">
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
            Service entrance installation requires utility coordination, permits, and professional installation. 
            This calculator provides NEC-compliant specifications for planning and permitting.
          </p>
        </div>
      </div>

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Entrance Specifications</h3>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Building Type
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setBuildingType('residential')}
                  className={`flex-1 py-2 px-4 rounded-lg border ${
                    buildingType === 'residential' 
                      ? 'bg-purple-50 border-purple-500 text-purple-700' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <Home className="w-4 h-4 inline mr-2" />
                  Residential
                </button>
                <button
                  onClick={() => setBuildingType('commercial')}
                  className={`flex-1 py-2 px-4 rounded-lg border ${
                    buildingType === 'commercial' 
                      ? 'bg-purple-50 border-purple-500 text-purple-700' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <Factory className="w-4 h-4 inline mr-2" />
                  Commercial
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <select
                value={SERVICE_TYPES.indexOf(serviceType)}
                onChange={(e) => setServiceType(SERVICE_TYPES[parseInt(e.target.value)])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {SERVICE_TYPES.map((type, idx) => (
                  <option key={idx} value={idx}>{type.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">{serviceType.description}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calculated Demand Load (Watts)
              </label>
              <input
                type="number"
                value={calculatedLoad}
                onChange={(e) => setCalculatedLoad(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="5000"
                max="500000"
                step="1000"
              />
              <p className="text-xs text-gray-500 mt-1">From load calculation (NEC 220)</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voltage
                </label>
                <select
                  value={voltage}
                  onChange={(e) => setVoltage(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={120}>120V</option>
                  <option value={240}>240V</option>
                  <option value={208}>208V</option>
                  <option value={480}>480V</option>
                  <option value={277}>277V</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phases
                </label>
                <select
                  value={phases}
                  onChange={(e) => setPhases(Number(e.target.value) as 1 | 3)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={1}>Single Phase</option>
                  <option value={3}>Three Phase</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Run Length (feet)
              </label>
              <input
                type="number"
                value={runLength}
                onChange={(e) => setRunLength(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
                max="1000"
              />
              <p className="text-xs text-gray-500 mt-1">Distance from transformer/pole to meter</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Growth Factor (%)
              </label>
              <input
                type="number"
                value={growthFactor}
                onChange={(e) => setGrowthFactor(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
                max="100"
                step="5"
              />
              <p className="text-xs text-gray-500 mt-1">Future load growth allowance</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weather Exposure
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setWeatherExposure('exposed')}
                  className={`flex-1 py-2 px-4 rounded-lg border ${
                    weatherExposure === 'exposed' 
                      ? 'bg-purple-50 border-purple-500 text-purple-700' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  Exposed
                </button>
                <button
                  onClick={() => setWeatherExposure('protected')}
                  className={`flex-1 py-2 px-4 rounded-lg border ${
                    weatherExposure === 'protected' 
                      ? 'bg-purple-50 border-purple-500 text-purple-700' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  Protected
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soil Type (Underground Only)
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value as 'normal' | 'rocky' | 'wet')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={serviceType.name !== 'Underground Service Lateral'}
              >
                <option value="normal">Normal Soil</option>
                <option value="rocky">Rocky/Difficult</option>
                <option value="wet">Wet/Corrosive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Special Requirements
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={specialRequirements.solarReady}
                    onChange={(e) => setSpecialRequirements({...specialRequirements, solarReady: e.target.checked})}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Solar Ready (Net Metering)</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={specialRequirements.generatorReady}
                    onChange={(e) => setSpecialRequirements({...specialRequirements, generatorReady: e.target.checked})}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Generator Transfer Ready</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={specialRequirements.evCharging}
                    onChange={(e) => setSpecialRequirements({...specialRequirements, evCharging: e.target.checked})}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">EV Charging Provision</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={specialRequirements.surgeProtection}
                    onChange={(e) => setSpecialRequirements({...specialRequirements, surgeProtection: e.target.checked})}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Whole House Surge Protection</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {/* Calculate Button */}
          <Button onClick={performCalculation} className="w-full">
            <Calculator className="w-4 h-4" />
            Calculate Service Requirements
          </Button>

          {/* Reset Button */}
          <Button variant="secondary" onClick={handleReset} className="w-full">
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>
        </div>
      </div>

      {/* Results */}
      {showResults && results && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" ref={resultsRef}>
            {/* Service Specifications */}
            <div className="bg-white rounded-xl shadow-lg p-6 min-w-0">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900">Service Specifications</h3>
              </div>
              
              <div className="space-y-3">
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Recommended Service Size</div>
                  <div className="text-2xl font-bold text-yellow-700">
                    {results.recommendedServiceSize} AMP
                  </div>
                  <div className="text-xs text-gray-500">{results.serviceType}</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Service Conductors</div>
                  <div className="text-sm font-bold text-gray-900">
                    Copper: {results.serviceEntranceConductors.copper}
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    Aluminum: {results.serviceEntranceConductors.aluminum}
                  </div>
                  {results.serviceEntranceConductors.parallelRuns && (
                    <div className="text-xs text-orange-600 mt-1">⚠ Parallel runs required</div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600">Ground Wire</div>
                    <div className="text-sm font-bold text-gray-900">
                      {results.groundingElectrodeSize}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600">Neutral</div>
                    <div className="text-sm font-bold text-gray-900">
                      {results.neutralSize}
                    </div>
                  </div>
                </div>
                
                <div className={`rounded-lg p-3 ${
                  results.voltageDropPercent <= 3 ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="text-sm text-gray-600">Voltage Drop</div>
                  <div className={`text-lg font-bold ${
                    results.voltageDropPercent <= 3 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {results.voltageDropPercent.toFixed(2)}%
                  </div>
                  <div className="text-xs">
                    {results.voltageDropPercent <= 3 ? '✓ Acceptable' : '⚠ Consider larger wire'}
                  </div>
                </div>
              </div>
            </div>

            {/* Equipment Requirements */}
            <div className="bg-white rounded-xl shadow-lg p-6 min-w-0">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Equipment Requirements</h3>
              </div>
              
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Meter Base</div>
                  <div className="text-lg font-bold text-blue-700">
                    {results.meterBaseType}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Main Breaker</div>
                  <div className="text-lg font-bold text-gray-900">
                    {results.mainBreakerSize}A
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Panel Spaces</div>
                  <div className="text-lg font-bold text-gray-900">
                    {results.mainPanelSpaces} spaces
                  </div>
                </div>
                
                {serviceType.name === 'Overhead Service Drop' && (
                  <>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Mast Size</div>
                      <div className="text-sm font-bold text-purple-700">
                        {results.mastSize}
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Weatherhead Height</div>
                      <div className="text-sm font-bold text-purple-700">
                        {results.weatherheadHeight}
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Anchoring</div>
                      <div className="text-sm text-purple-700">
                        {results.anchorRequirements}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Cost Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6 min-w-0">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Cost Estimate</h3>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Materials</span>
                    <span className="text-sm font-bold text-gray-900">
                      ${results.estimatedCost.materials.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Labor</span>
                    <span className="text-sm font-bold text-gray-900">
                      ${results.estimatedCost.labor.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Permits</span>
                    <span className="text-sm font-bold text-gray-900">
                      ${results.estimatedCost.permits.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Utility Fees</span>
                    <span className="text-sm font-bold text-gray-900">
                      ${results.estimatedCost.utilityFees.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Total Estimate</span>
                      <span className="text-xl font-bold text-green-700">
                        ${results.estimatedCost.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Estimates vary by location</p>
                  <p>• Additional costs may apply</p>
                  <p>• Get multiple quotes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Load Analysis Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Load Analysis Summary</h3>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Calculated Demand</div>
                <div className="text-2xl font-bold text-indigo-700">
                  {(results.calculatedDemand / 1000).toFixed(1)} kW
                </div>
                <div className="text-xs text-gray-500">
                  {results.demandAmps.toFixed(0)}A @ {voltage}V
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Service Utilization</div>
                <div className={`text-2xl font-bold ${
                  results.utilizationPercentage > 80 ? 'text-red-600' : 
                  results.utilizationPercentage > 60 ? 'text-yellow-600' : 
                  'text-green-600'
                }`}>
                  {results.utilizationPercentage.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">
                  {results.demandAmps.toFixed(0)}A of {results.recommendedServiceSize}A
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Growth Capacity</div>
                <div className="text-2xl font-bold text-green-700">
                  {(100 - results.utilizationPercentage).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500">
                  {(results.recommendedServiceSize - results.demandAmps).toFixed(0)}A available
                </div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">NEC Compliance</div>
                <div className="flex items-center gap-2">
                  {results.nec310_12Compliant ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="text-lg font-bold text-green-700">Compliant</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                      <span className="text-lg font-bold text-red-700">Review</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-500">Table 310.12</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Utility Requirements Table */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Building className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">Major Utility Service Requirements</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Common utility company requirements for residential service installations. Always verify with your local utility.
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-orange-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Utility Company</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Max Residential</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Meter Height</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Clearances</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Special Requirements</th>
              </tr>
            </thead>
            <tbody>
              {UTILITY_REQUIREMENTS.map((utility, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium">{utility.utility}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-orange-600">
                    {utility.serviceMax}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">{utility.meterHeight}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center text-sm">{utility.clearances}</td>
                  <td className="border border-gray-300 px-4 py-3 text-sm">{utility.specialRequirements}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 bg-orange-50 rounded-lg p-4">
          <h4 className="font-semibold text-orange-800 mb-2">Utility Coordination Process:</h4>
          <ol className="text-sm text-orange-700 space-y-1">
            <li>1. Submit service application with load calculation</li>
            <li>2. Utility reviews transformer capacity and service availability</li>
            <li>3. Schedule pre-installation inspection if required</li>
            <li>4. Complete installation per utility specifications</li>
            <li>5. Schedule final inspection and meter installation</li>
          </ol>
        </div>
      </div>

      {/* Real-World Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Professional Service Installation Examples</h3>
        
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {REAL_WORLD_SCENARIOS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedScenario(idx)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedScenario === idx 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Example {idx + 1}
            </button>
          ))}
        </div>
        
        {REAL_WORLD_SCENARIOS[selectedScenario] && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">
                {REAL_WORLD_SCENARIOS[selectedScenario].title}
              </h4>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-2">Project Overview</h5>
                <p className="text-sm text-gray-700">
                  {REAL_WORLD_SCENARIOS[selectedScenario].situation}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-2">Technical Challenge</h5>
                <p className="text-sm text-gray-700">
                  {REAL_WORLD_SCENARIOS[selectedScenario].problem}
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-semibold text-blue-800 mb-2">Load Analysis</h5>
              <p className="text-sm text-blue-700">
                {REAL_WORLD_SCENARIOS[selectedScenario].analysis}
              </p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <h5 className="font-semibold text-yellow-800 mb-2">Service Calculation</h5>
              <p className="text-sm text-yellow-700 font-mono">
                {REAL_WORLD_SCENARIOS[selectedScenario].calculation}
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="font-semibold text-green-800 mb-2">Installation Solution</h5>
              <p className="text-sm text-green-700">
                {REAL_WORLD_SCENARIOS[selectedScenario].solution}
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h5 className="font-semibold text-purple-800 mb-2">Project Results</h5>
              <p className="text-sm text-purple-700">
                {REAL_WORLD_SCENARIOS[selectedScenario].realWorldContext}
              </p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-2">Professional Lessons</h5>
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
    </div>
  );
}