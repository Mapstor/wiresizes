'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Home, Calculator, Zap, DollarSign, AlertTriangle, CheckCircle, Shield, TrendingUp, Building, FileText, Target, Wrench, Users, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LoadCalculationResult {
  generalLighting: number;
  smallApplianceCircuits: number;
  laundryCircuit: number;
  fixedAppliances: number;
  totalConnectedLoad: number;
  demandFactorApplied: number;
  totalDemandLoad: number;
  largestMotor: number;
  finalDemandLoad: number;
  recommendedServiceSize: number;
  utilizationPercentage: number;
  isCompliant: boolean;
  panelUpgradeNeeded: boolean;
  estimatedCost: {
    serviceUpgrade: number;
    permitFees: number;
    inspection: number;
  };
}

const APPLIANCE_LOADS = [
  { name: 'Electric Range (8.75 kW max)', demand: 8000, nameplate: 8750, motor: false, continuous: false },
  { name: 'Electric Dryer', demand: 5000, nameplate: 5000, motor: false, continuous: false },
  { name: 'Water Heater (4.5 kW)', demand: 4500, nameplate: 4500, motor: false, continuous: true },
  { name: 'Central Air Conditioning (3.5 ton)', demand: 4200, nameplate: 4200, motor: true, continuous: false },
  { name: 'Heat Pump (3 ton)', demand: 3600, nameplate: 3600, motor: true, continuous: false },
  { name: 'Electric Furnace (15 kW)', demand: 15000, nameplate: 15000, motor: false, continuous: true },
  { name: 'EV Charger (Level 2 - 40A)', demand: 9600, nameplate: 9600, motor: false, continuous: true },
  { name: 'Hot Tub/Spa (50A)', demand: 12000, nameplate: 12000, motor: false, continuous: false },
  { name: 'Pool Pump (1.5 HP)', demand: 1800, nameplate: 1800, motor: true, continuous: true },
  { name: 'Well Pump (1 HP)', demand: 1200, nameplate: 1200, motor: true, continuous: false },
  { name: 'Garbage Disposal (1/2 HP)', demand: 600, nameplate: 600, motor: true, continuous: false },
  { name: 'Dishwasher (built-in)', demand: 1800, nameplate: 1800, motor: false, continuous: false },
  { name: 'Microwave (built-in)', demand: 1500, nameplate: 1500, motor: false, continuous: false },
  { name: 'Trash Compactor', demand: 1000, nameplate: 1000, motor: true, continuous: false },
  { name: 'Attic Fan (whole house)', demand: 500, nameplate: 500, motor: true, continuous: false },
  { name: 'Garage Door Opener', demand: 500, nameplate: 500, motor: true, continuous: false },
  { name: 'Sump Pump (1/3 HP)', demand: 800, nameplate: 800, motor: true, continuous: false },
  { name: 'Security System', demand: 100, nameplate: 100, motor: false, continuous: true },
  { name: 'Landscape Lighting (5kW)', demand: 5000, nameplate: 5000, motor: false, continuous: true },
  { name: 'Snow Melting System (10kW)', demand: 10000, nameplate: 10000, motor: false, continuous: true }
];

const REAL_WORLD_SCENARIOS = [
  {
    title: 'Modern 2,500 sq ft Family Home Load Calculation',
    situation: 'The Johnson family is building a new 2,500 sq ft home with modern electrical needs. They want central AC, electric dryer, dishwasher, garbage disposal, and are planning to add an EV charger and hot tub in the future. The local inspector requires detailed load calculations per NEC 220.',
    problem: 'The builder quoted a 200A service, but the family wants to verify this is adequate for their needs plus future additions. They need accurate load calculations for permit approval and want to avoid costly service upgrades later.',
    analysis: 'Standard calculation: 2,500 sq ft × 3 VA = 7,500 VA general lighting. Two 20A small appliance circuits = 3,000 VA. Laundry circuit = 1,500 VA. Major appliances: Range 8kW, Dryer 5kW, AC 4.2kW, Water heater 4.5kW. Future: EV charger 9.6kW, Hot tub 12kW.',
    calculation: 'Connected load: 7,500 + 3,000 + 1,500 + 8,000 + 5,000 + 4,200 + 4,500 + 9,600 + 12,000 = 55,300 VA. Demand factors applied per NEC 220.82: First 10kVA at 100% + remainder at 40% = 28,120 VA demand load.',
    solution: '200A service adequate with 28.1kW demand (117A utilization). Provides growth margin for additional loads. Panel upgrade not needed. Total electrical cost: $4,500 for service installation.',
    realWorldContext: 'Proper load calculation prevents expensive service upgrades later. The 200A service handles all planned loads with 40% spare capacity for future needs. Inspection approval simplified with detailed calculations.',
    lessons: [
      'Always calculate future loads during initial design',
      'NEC demand factors significantly reduce required service size',
      'Document all calculations for inspection approval',
      'Plan for 20% growth margin beyond initial needs'
    ]
  },
  {
    title: 'Historic Home Electrical Upgrade Assessment',
    situation: 'Maria bought a 1950s ranch home with original 100A electrical service. She wants to add central air, upgrade to electric appliances, install EV charging, and modernize the electrical system. The existing service has only 8 circuits and uses old breakers.',
    problem: 'The 100A service is inadequate for modern loads. She needs load calculations to determine required service size and justify the upgrade cost to insurance. Local utility requires load study before approving service increase.',
    analysis: 'Existing: 1,800 sq ft, gas appliances, window AC units, 100A service at 80% capacity. Planned: Central AC (3.5 ton), electric range, electric dryer, EV charger (40A), heat pump water heater, modern panel with AFCI/GFCI breakers.',
    calculation: 'New connected load: 5,400 + 3,000 + 1,500 + 8,000 + 5,000 + 4,200 + 9,600 + 4,500 = 41,200 VA. Demand calculation = 22,480 VA (94A). Recommend 200A service for growth.',
    solution: '200A service upgrade required. New main panel with 40 circuits, AFCI/GFCI protection. Utility service entrance upgrade. Total project cost: $6,500 installed.',
    realWorldContext: 'Service upgrade increases home value $8,000-12,000. Enables modern electrical needs and safety features. Insurance discount for updated electrical system. Project ROI within 3 years.',
    lessons: [
      'Historic homes often need complete service upgrades',
      'Utility coordination required for service size changes',
      'Modern safety features (AFCI/GFCI) add value and reduce insurance',
      'Calculate total project cost including permits and inspections'
    ]
  },
  {
    title: 'Luxury Home with High-End Appliances',
    situation: 'The Williams are building a 4,500 sq ft luxury home with premium electrical features: wine cellar cooling, heated floors, outdoor kitchen, pool/spa, whole house generator backup, smart home automation, and electric vehicle charging for multiple cars.',
    problem: 'The electrical contractor suggested 400A service, but the utility company questioned the need. They require detailed load calculations justifying the large service size. The project budget is significant, but they want to ensure adequate capacity.',
    analysis: 'Large home with numerous high-power loads. Wine cellar (2kW continuous), heated floors (15kW), outdoor kitchen (12kW), pool equipment (5kW), backup generator transfer (automatic), dual EV chargers (19.2kW each), plus standard luxury appliances.',
    calculation: 'Connected load exceeds 100kW. NEC 220.82 optional calculation applies. Demand factors for multiple appliances. Non-coincident loads considered. Final demand: ~65kW (270A at 240V). Recommend 400A for backup generator and future growth.',
    solution: '400A service with automatic transfer switch for generator. Main distribution panel (42-space) plus sub-panels. Smart load management system. Total electrical rough-in: $25,000.',
    realWorldContext: 'Luxury homes justify large electrical services for lifestyle and resale value. Smart systems optimize load management. Generator backup critical for high-end properties. Professional load study required for utility approval.',
    lessons: [
      'Luxury features drive electrical service requirements',
      'Generator backup affects service sizing calculations',
      'Smart load management enables efficient high-capacity systems',
      'Professional engineering may be required for large services'
    ]
  },
  {
    title: 'Multi-Generational Home Addition',
    situation: 'The Patel family is adding a 1,200 sq ft in-law suite to their existing home for elderly parents. The addition includes kitchen, laundry, bathroom, and separate HVAC. They want to determine if the existing 200A service can handle the additional load.',
    problem: 'Existing home uses 150A of the 200A service capacity. The addition adds significant load: kitchen appliances, washer/dryer, mini-split heat pumps, and accessibility features like stair lift. Need to calculate if service upgrade is required.',
    analysis: 'Existing home demand: ~30kW (125A). Addition loads: 1,200 sq ft lighting (3.6kVA), kitchen appliances (12kVA), laundry (6kVA), mini-split HVAC (4kVA), accessibility equipment (2kVA). Total new connected load: 27.6kVA.',
    calculation: 'Addition demand per NEC 220.82: First 10kVA at 100% + 17.6kVA at 40% = 17kVA demand. Total house demand: 30kW + 17kW = 47kW (196A). Just within 200A capacity.',
    solution: '200A service adequate with careful load management. Add sub-panel for addition. Smart controls for non-essential loads. Load shedding for peak demand periods. Installation cost: $3,200.',
    realWorldContext: 'Multi-generational living increases electrical demand significantly. Load management prevents expensive service upgrades. Sub-panels organize loads by living area. Smart systems provide automatic load balancing.',
    lessons: [
      'Additions can push electrical systems to capacity limits',
      'Sub-panels help organize multi-family electrical loads',
      'Smart load management extends existing service capacity',
      'Consider long-term care electrical needs in planning'
    ]
  },
  {
    title: 'Net-Zero Energy Home Electrical Planning',
    situation: 'Green Building Solutions is designing a net-zero energy home with 15kW solar array, battery storage, geothermal heat pump, induction cooking, heat pump water heater, and two EV chargers. All systems are electric with no fossil fuels.',
    problem: 'The all-electric design creates high electrical demand but solar/battery offset most grid usage. Load calculations must account for backup power scenarios when solar isn\'t producing and batteries are depleted.',
    analysis: 'Peak electrical demand occurs during winter evenings with no solar production. All heating, cooking, water heating, and potential EV charging from grid. Solar array (15kW) and battery (20kWh) provide significant offset during normal conditions.',
    calculation: 'Winter peak demand scenario: Geothermal heat pump 8kW, water heater 4.5kW, cooking 8kW, EV charging 19.2kW, general loads 5kW = 44.7kW total. Demand calculation: 32kW (133A). 200A service adequate.',
    solution: '200A service with smart energy management system. Battery backup for essential loads. Load shedding prevents grid peak demand. EV charging scheduled for solar production hours. Total electrical: $18,000.',
    realWorldContext: 'Net-zero homes require sophisticated electrical planning for energy independence. Smart systems maximize renewable energy usage. Load management critical for battery optimization. Results in $0 annual energy bills.',
    lessons: [
      'All-electric homes have high instantaneous demand',
      'Energy storage affects electrical system design',
      'Smart controls essential for renewable energy optimization',
      'Load shedding prevents peak demand charges'
    ]
  }
];

const SERVICE_SIZE_GUIDE = [
  { 
    service: '100A', 
    maxDemand: '20kW', 
    typicalHome: '1,000-1,500 sq ft', 
    suitableFor: 'Small homes, gas appliances', 
    limitations: 'No central AC + electric appliances',
    upgradeNeeded: 'For modern electrical needs'
  },
  { 
    service: '125A', 
    maxDemand: '25kW', 
    typicalHome: '1,500-2,000 sq ft', 
    suitableFor: 'Moderate electric loads', 
    limitations: 'Limited future expansion',
    upgradeNeeded: 'For EV charging + major appliances'
  },
  { 
    service: '150A', 
    maxDemand: '30kW', 
    typicalHome: '2,000-2,500 sq ft', 
    suitableFor: 'Standard modern home', 
    limitations: 'Future additions challenging',
    upgradeNeeded: 'For luxury appliances or EV charging'
  },
  { 
    service: '200A', 
    maxDemand: '40kW', 
    typicalHome: '2,500-3,500 sq ft', 
    suitableFor: 'Full electric + AC + EV', 
    limitations: 'Very high loads may challenge',
    upgradeNeeded: 'Rarely, most residential adequate'
  },
  { 
    service: '225A', 
    maxDemand: '45kW', 
    typicalHome: '3,500-4,000 sq ft', 
    suitableFor: 'Large homes, multiple EVs', 
    limitations: 'Commercial-grade equipment',
    upgradeNeeded: 'Never for typical residential'
  },
  { 
    service: '400A', 
    maxDemand: '80kW', 
    typicalHome: '4,000+ sq ft', 
    suitableFor: 'Luxury homes, backup generator', 
    limitations: 'Expensive, utility approval needed',
    upgradeNeeded: 'Only for extreme high-end applications'
  }
];

const NEC_DEMAND_FACTORS = [
  { loadType: 'General Lighting (first 3kVA)', factor: 1.0, description: '100% of first 3,000 VA' },
  { loadType: 'General Lighting (over 3kVA)', factor: 0.35, description: '35% of remainder over 3,000 VA' },
  { loadType: 'Small Appliance Circuits', factor: 1.0, description: '100% of 3,000 VA (minimum 2 circuits)' },
  { loadType: 'Laundry Circuit', factor: 1.0, description: '100% of 1,500 VA' },
  { loadType: 'Fixed Appliances (3 or less)', factor: 1.0, description: '100% of nameplate rating' },
  { loadType: 'Fixed Appliances (4 or more)', factor: 0.75, description: '75% of total if 4+ appliances' },
  { loadType: 'Electric Range (12kW or less)', factor: 0.80, description: '80% of nameplate, 8kW minimum' },
  { loadType: 'Electric Dryer', factor: 1.0, description: '100% of nameplate, 5kW minimum' },
  { loadType: 'Air Conditioning', factor: 1.0, description: '100% of largest motor load' },
  { loadType: 'Heating (electric)', factor: 1.0, description: '100% if no AC, or 100% of larger load' },
  { loadType: 'Motors (largest)', factor: 1.25, description: '125% of largest motor FLA' }
];

export default function ResidentialLoadCalculator() {
  const [houseSize, setHouseSize] = useState(2500);
  const [existingServiceSize, setExistingServiceSize] = useState(200);
  const [selectedAppliances, setSelectedAppliances] = useState<boolean[]>(new Array(APPLIANCE_LOADS.length).fill(false));
  const [customAppliances, setCustomAppliances] = useState<Array<{name: string, watts: number, isMotor: boolean}>>([]);
  const [electricHeat, setElectricHeat] = useState(false);
  const [electricHeating, setElectricHeating] = useState(0);
  const [airConditioning, setAirConditioning] = useState(true);
  const [acLoad, setAcLoad] = useState(4200);
  const [futureLoads, setFutureLoads] = useState(false);
  const [results, setResults] = useState<LoadCalculationResult | null>(null);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [showOptionalMethod, setShowOptionalMethod] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const calculateLoad = () => {
    // General lighting load (NEC 220.12)
    const generalLighting = Math.max(houseSize * 3, 3000); // 3 VA per sq ft, minimum 3000 VA
    
    // Small appliance circuits (NEC 220.52(A))
    const smallApplianceCircuits = 3000; // Minimum 2 circuits × 1500 VA each
    
    // Laundry circuit (NEC 220.52(B))  
    const laundryCircuit = 1500;
    
    // Fixed appliances
    let totalApplianceLoad = 0;
    let motorLoads: number[] = [];
    
    selectedAppliances.forEach((selected, index) => {
      if (selected) {
        const appliance = APPLIANCE_LOADS[index];
        totalApplianceLoad += appliance.demand;
        if (appliance.motor) {
          motorLoads.push(appliance.demand);
        }
      }
    });
    
    customAppliances.forEach(appliance => {
      totalApplianceLoad += appliance.watts;
      if (appliance.isMotor) {
        motorLoads.push(appliance.watts);
      }
    });
    
    // Add heating/cooling loads
    if (electricHeat) {
      totalApplianceLoad += electricHeating;
    }
    if (airConditioning) {
      totalApplianceLoad += acLoad;
      motorLoads.push(acLoad);
    }
    
    // Total connected load
    const totalConnectedLoad = generalLighting + smallApplianceCircuits + laundryCircuit + totalApplianceLoad;
    
    // Apply demand factors (NEC 220.82 Optional Method)
    let demandLoad = 0;
    
    // First 10 kVA at 100%
    const first10kVA = Math.min(totalConnectedLoad, 10000);
    demandLoad += first10kVA;
    
    // Remainder at 40%
    if (totalConnectedLoad > 10000) {
      demandLoad += (totalConnectedLoad - 10000) * 0.4;
    }
    
    // Largest motor at 25% additional (NEC 430.24)
    const largestMotor = motorLoads.length > 0 ? Math.max(...motorLoads) : 0;
    const motorContribution = largestMotor * 0.25;
    
    // Final demand load
    const finalDemandLoad = demandLoad + motorContribution;
    
    // Service size calculation
    const demandAmps = finalDemandLoad / 240;
    const utilizationPercentage = (demandAmps / existingServiceSize) * 100;
    
    // Determine recommended service size
    let recommendedServiceSize = 100;
    if (demandAmps > 83) recommendedServiceSize = 125;
    if (demandAmps > 104) recommendedServiceSize = 150; 
    if (demandAmps > 125) recommendedServiceSize = 200;
    if (demandAmps > 166) recommendedServiceSize = 225;
    if (demandAmps > 187) recommendedServiceSize = 400;
    
    // Cost estimates
    const serviceUpgradeCost = 
      recommendedServiceSize === 100 ? 2500 :
      recommendedServiceSize === 125 ? 3000 :
      recommendedServiceSize === 150 ? 3500 :
      recommendedServiceSize === 200 ? 4000 :
      recommendedServiceSize === 225 ? 5500 :
      8000;
    
    setResults({
      generalLighting,
      smallApplianceCircuits,
      laundryCircuit,
      fixedAppliances: totalApplianceLoad,
      totalConnectedLoad,
      demandFactorApplied: demandLoad,
      totalDemandLoad: demandLoad,
      largestMotor: motorContribution,
      finalDemandLoad,
      recommendedServiceSize,
      utilizationPercentage,
      isCompliant: demandAmps <= (existingServiceSize * 0.83), // 80% rule + margin
      panelUpgradeNeeded: recommendedServiceSize > existingServiceSize,
      estimatedCost: {
        serviceUpgrade: serviceUpgradeCost,
        permitFees: 250,
        inspection: 150
      }
    });
  };

  const performCalculation = useCallback(() => {
    calculateLoad();
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [houseSize, existingServiceSize, selectedAppliances, customAppliances, electricHeat, electricHeating, airConditioning, acLoad]);

  const handleReset = useCallback(() => {
    setHouseSize(2500);
    setExistingServiceSize(200);
    setSelectedAppliances(new Array(APPLIANCE_LOADS.length).fill(false));
    setCustomAppliances([]);
    setElectricHeat(false);
    setElectricHeating(0);
    setAirConditioning(true);
    setAcLoad(4200);
    setFutureLoads(false);
    setShowResults(false);
  }, []);

  const toggleAppliance = (index: number) => {
    const newSelection = [...selectedAppliances];
    newSelection[index] = !newSelection[index];
    setSelectedAppliances(newSelection);
  };

  const addCustomAppliance = () => {
    setCustomAppliances([...customAppliances, { name: '', watts: 0, isMotor: false }]);
  };

  const updateCustomAppliance = (index: number, field: string, value: any) => {
    const updated = [...customAppliances];
    updated[index] = { ...updated[index], [field]: value };
    setCustomAppliances(updated);
  };

  const removeCustomAppliance = (index: number) => {
    setCustomAppliances(customAppliances.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (showResults) {
      calculateLoad();
    }
  }, [houseSize, existingServiceSize, selectedAppliances, customAppliances, electricHeat, electricHeating, airConditioning, acLoad, showResults]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <div className="flex items-center gap-3 mb-4">
          <Home className="w-8 h-8 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">Residential Load Calculator</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Calculate electrical service size requirements per NEC Article 220. Determine if your current panel 
          can handle new loads or if service upgrade is needed. Essential for permits and electrical planning.
        </p>
        <div className="bg-indigo-100 rounded-lg p-3 border border-indigo-300">
          <p className="text-sm text-indigo-700 flex items-start gap-2">
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
            This calculator uses NEC 220.82 Optional Method for single-family dwellings. 
            Consult local electrical codes and licensed electrician for final calculations.
          </p>
        </div>
      </div>

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Load Calculation Parameters</h3>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Basic Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                House Size (Square Feet)
              </label>
              <input
                type="number"
                value={houseSize}
                onChange={(e) => setHouseSize(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min="500"
                max="10000"
                step="100"
              />
              <p className="text-xs text-gray-500 mt-1">Used for general lighting load calculation (3 VA/sq ft)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current/Existing Service Size
              </label>
              <select
                value={existingServiceSize}
                onChange={(e) => setExistingServiceSize(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={60}>60 Amp (Older Homes)</option>
                <option value={100}>100 Amp (Standard)</option>
                <option value={125}>125 Amp</option>
                <option value={150}>150 Amp</option>
                <option value={200}>200 Amp (Modern)</option>
                <option value={225}>225 Amp</option>
                <option value={400}>400 Amp (Luxury)</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={electricHeat}
                  onChange={(e) => setElectricHeat(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">Electric Heat</label>
              </div>
              
              {electricHeat && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Electric Heating Load (Watts)
                  </label>
                  <input
                    type="number"
                    value={electricHeating}
                    onChange={(e) => setElectricHeating(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="0"
                    max="30000"
                    step="500"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={airConditioning}
                  onChange={(e) => setAirConditioning(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">Air Conditioning</label>
              </div>
              
              {airConditioning && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    AC Load (Watts)
                  </label>
                  <input
                    type="number"
                    value={acLoad}
                    onChange={(e) => setAcLoad(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="0"
                    max="15000"
                    step="200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Typical: 1,200W/ton (3.5 ton = 4,200W)</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Appliances */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Major Appliances & Equipment</h4>
              <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
                {APPLIANCE_LOADS.map((appliance, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedAppliances[index]}
                        onChange={() => toggleAppliance(index)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{appliance.name}</div>
                        <div className="text-xs text-gray-500">
                          {(appliance.demand / 1000).toFixed(1)} kW
                          {appliance.motor && <span className=" ml-1 text-blue-600">(Motor)</span>}
                          {appliance.continuous && <span className=" ml-1 text-orange-600">(Continuous)</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">Custom Appliances</h4>
                <button
                  onClick={addCustomAppliance}
                  className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200"
                >
                  + Add Custom
                </button>
              </div>
              
              {customAppliances.map((appliance, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded mb-2">
                  <input
                    type="text"
                    placeholder="Appliance name"
                    value={appliance.name}
                    onChange={(e) => updateCustomAppliance(index, 'name', e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Watts"
                    value={appliance.watts || ''}
                    onChange={(e) => updateCustomAppliance(index, 'watts', Number(e.target.value))}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                  <label className="flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      checked={appliance.isMotor}
                      onChange={(e) => updateCustomAppliance(index, 'isMotor', e.target.checked)}
                      className="h-3 w-3"
                    />
                    Motor
                  </label>
                  <button
                    onClick={() => removeCustomAppliance(index)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {/* Calculate Button */}
          <Button onClick={performCalculation} className="w-full">
            <Calculator className="w-4 h-4" />
            Calculate Load Requirements
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" ref={resultsRef}>
          {/* Load Calculation Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Load Calculation (NEC 220.82)</h3>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">General Lighting</div>
                <div className="text-lg font-bold text-gray-900">
                  {(results.generalLighting / 1000).toFixed(1)} kVA
                </div>
                <div className="text-xs text-gray-500">{houseSize} sq ft × 3 VA/sq ft</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Small Appliance</div>
                  <div className="text-lg font-bold text-gray-900">
                    {(results.smallApplianceCircuits / 1000).toFixed(1)} kVA
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Laundry</div>
                  <div className="text-lg font-bold text-gray-900">
                    {(results.laundryCircuit / 1000).toFixed(1)} kVA
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Fixed Appliances</div>
                <div className="text-lg font-bold text-blue-700">
                  {(results.fixedAppliances / 1000).toFixed(1)} kVA
                </div>
              </div>
              
              <div className="border-t pt-3">
                <div className="text-sm text-gray-600">Total Connected Load</div>
                <div className="text-xl font-bold text-gray-900">
                  {(results.totalConnectedLoad / 1000).toFixed(1)} kVA
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">After Demand Factors</div>
                <div className="text-xl font-bold text-green-700">
                  {(results.demandFactorApplied / 1000).toFixed(1)} kVA
                </div>
                <div className="text-xs text-gray-500">NEC 220.82 Optional Method</div>
              </div>
              
              {results.largestMotor > 0 && (
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Largest Motor (25%)</div>
                  <div className="text-lg font-bold text-yellow-700">
                    +{(results.largestMotor / 1000).toFixed(1)} kVA
                  </div>
                </div>
              )}
              
              <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                <div className="text-sm text-gray-600">Final Demand Load</div>
                <div className="text-2xl font-bold text-indigo-700">
                  {(results.finalDemandLoad / 1000).toFixed(1)} kVA
                </div>
                <div className="text-sm text-indigo-600">
                  ({(results.finalDemandLoad / 240).toFixed(0)} Amps @ 240V)
                </div>
              </div>
            </div>
          </div>

          {/* Service Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Service Requirements</h3>
            </div>
            
            <div className="space-y-3">
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Recommended Service Size</div>
                <div className="text-2xl font-bold text-yellow-700">
                  {results.recommendedServiceSize} AMP
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Current Service Utilization</div>
                <div className={`text-lg font-bold ${
                  results.utilizationPercentage > 80 ? 'text-red-600' : 
                  results.utilizationPercentage > 60 ? 'text-yellow-600' : 
                  'text-green-600'
                }`}>
                  {results.utilizationPercentage.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">
                  {(results.finalDemandLoad / 240).toFixed(0)}A of {existingServiceSize}A capacity
                </div>
              </div>
              
              <div className={`rounded-lg p-3 ${
                results.isCompliant ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {results.isCompliant ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    results.isCompliant ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {results.isCompliant ? 'Current Service Adequate' : 'Service Upgrade Required'}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${
                  results.isCompliant ? 'text-green-600' : 'text-red-600'
                }`}>
                  {results.isCompliant 
                    ? 'Your existing service can handle the calculated load'
                    : 'Current service insufficient for calculated electrical load'
                  }
                </p>
              </div>
              
              {results.panelUpgradeNeeded && (
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <div className="text-sm font-medium text-orange-800 mb-1">Panel Upgrade Needed</div>
                  <div className="text-xs text-orange-700">
                    Upgrade from {existingServiceSize}A to {results.recommendedServiceSize}A service
                  </div>
                </div>
              )}
              
              <div className="pt-3 border-t">
                <div className="text-xs text-gray-500 space-y-1">
                  <div>• 80% rule: Max continuous load = {(existingServiceSize * 0.8).toFixed(0)}A</div>
                  <div>• Growth margin recommended for future loads</div>
                  <div>• Local codes may require larger service</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Cost Analysis</h3>
            </div>
            
            <div className="space-y-3">
              {results.panelUpgradeNeeded ? (
                <>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">Service Upgrade Cost</div>
                    <div className="text-xl font-bold text-green-700">
                      ${results.estimatedCost.serviceUpgrade.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {existingServiceSize}A to {results.recommendedServiceSize}A
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Permit Fees</div>
                      <div className="text-lg font-bold text-gray-700">
                        ${results.estimatedCost.permitFees}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Inspection</div>
                      <div className="text-lg font-bold text-gray-700">
                        ${results.estimatedCost.inspection}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-sm text-gray-600">Total Project Cost</div>
                    <div className="text-2xl font-bold text-blue-700">
                      ${(results.estimatedCost.serviceUpgrade + results.estimatedCost.permitFees + results.estimatedCost.inspection).toLocaleString()}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-medium text-green-800">No Upgrade Required</div>
                  <div className="text-sm text-green-600 mt-1">
                    Your current {existingServiceSize}A service is adequate
                  </div>
                </div>
              )}
              
              <div className="pt-3 border-t">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Cost Factors:</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>• Service entrance location</div>
                  <div>• Utility connection fees</div>
                  <div>• Panel type (main breaker/main lug)</div>
                  <div>• Local permit requirements</div>
                  <div>• Electrical contractor rates</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Size Guide */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Residential Service Size Guide</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-50">
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Service Size</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Max Demand</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Typical Home Size</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Suitable For</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Limitations</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Upgrade Needed When</th>
              </tr>
            </thead>
            <tbody>
              {SERVICE_SIZE_GUIDE.map((service, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-purple-600">
                    {service.service}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">{service.maxDemand}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">{service.typicalHome}</td>
                  <td className="border border-gray-300 px-4 py-3 text-sm">{service.suitableFor}</td>
                  <td className="border border-gray-300 px-4 py-3 text-sm text-orange-600">{service.limitations}</td>
                  <td className="border border-gray-300 px-4 py-3 text-sm">{service.upgradeNeeded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEC Demand Factors Reference */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">NEC Demand Factors Reference</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          National Electrical Code Article 220.82 Optional Method demand factors for single-family dwellings.
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Load Type</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Demand Factor</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {NEC_DEMAND_FACTORS.map((factor, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium">{factor.loadType}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-blue-600">
                    {(factor.factor * 100).toFixed(0)}%
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm">{factor.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Important Notes:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Optional method generally results in smaller calculated load than standard method</li>
            <li>• Cannot be used for hotels, motels, or multifamily dwellings</li>
            <li>• Local authority having jurisdiction may require standard calculation</li>
            <li>• Consider future load growth when sizing service entrance</li>
          </ul>
        </div>
      </div>

      {/* Real-World Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Professional Load Calculation Examples</h3>
        
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {REAL_WORLD_SCENARIOS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedScenario(idx)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedScenario === idx 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Example {idx + 1}
            </button>
          ))}
        </div>
        
        {REAL_WORLD_SCENARIOS[selectedScenario] && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
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
              <h5 className="font-semibold text-yellow-800 mb-2">NEC 220.82 Calculation</h5>
              <p className="text-sm text-yellow-700 font-mono">
                {REAL_WORLD_SCENARIOS[selectedScenario].calculation}
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="font-semibold text-green-800 mb-2">Professional Solution</h5>
              <p className="text-sm text-green-700">
                {REAL_WORLD_SCENARIOS[selectedScenario].solution}
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h5 className="font-semibold text-purple-800 mb-2">Project Outcome</h5>
              <p className="text-sm text-purple-700">
                {REAL_WORLD_SCENARIOS[selectedScenario].realWorldContext}
              </p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-2">Professional Insights</h5>
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