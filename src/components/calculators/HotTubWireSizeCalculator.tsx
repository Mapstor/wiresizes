'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Waves, Zap, DollarSign, Thermometer, AlertTriangle, CheckCircle, Shield, Home, Droplets, Wind, Timer, Calculator, Wrench, Target, TrendingUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CalculationResult {
  wireSize: string;
  wireSizeAluminum: string;
  breakerSize: number;
  breakerType: string;
  conduitSize: string;
  groundWireSize: string;
  disconnectRequired: boolean;
  gfciRequired: boolean;
  voltageDrop: number;
  voltageDropPercent: number;
  isAcceptable: boolean;
  estimatedInstallCost: {
    diy: number;
    professional: number;
  };
  heatingTime: {
    summerHours: number;
    winterHours: number;
  };
  monthlyOperatingCost: number;
  annualOperatingCost: number;
  energyUsagePerMonth: number;
}

const HOT_TUB_MODELS = [
  { brand: 'Hot Spring', model: 'Highlife 7-Person', jets: 45, voltage: 240, current: 50, heater: 6000, pumps: 2, capacity: 450 },
  { brand: 'Jacuzzi', model: 'J-495', jets: 62, voltage: 240, current: 60, heater: 6000, pumps: 3, capacity: 510 },
  { brand: 'Caldera', model: 'Cantabria', jets: 52, voltage: 240, current: 50, heater: 5500, pumps: 2, capacity: 475 },
  { brand: 'Sundance', model: 'Optima', jets: 56, voltage: 240, current: 50, heater: 6000, pumps: 2, capacity: 430 },
  { brand: 'Bullfrog', model: 'A9', jets: 48, voltage: 240, current: 60, heater: 5500, pumps: 3, capacity: 520 },
  { brand: 'Master Spas', model: 'Twilight TS8.2', jets: 50, voltage: 240, current: 50, heater: 5500, pumps: 2, capacity: 475 },
  { brand: 'Arctic Spas', model: 'Summit XL', jets: 65, voltage: 240, current: 60, heater: 6000, pumps: 3, capacity: 550 },
  { brand: 'Dimension One', model: 'Bay Collection', jets: 40, voltage: 240, current: 40, heater: 5500, pumps: 2, capacity: 380 },
  { brand: 'Coleman', model: 'SaluSpa', jets: 140, voltage: 120, current: 15, heater: 1300, pumps: 1, capacity: 250 },
  { brand: 'Intex', model: 'PureSpa Plus', jets: 170, voltage: 120, current: 15, heater: 1300, pumps: 1, capacity: 290 },
  { brand: 'Beachcomber', model: '740', jets: 44, voltage: 240, current: 50, heater: 5500, pumps: 2, capacity: 460 },
  { brand: 'Coast Spas', model: 'Infinity Edge', jets: 82, voltage: 240, current: 60, heater: 6000, pumps: 4, capacity: 600 },
  { brand: 'PDC Spas', model: 'LifeStyle Series', jets: 35, voltage: 240, current: 40, heater: 5500, pumps: 2, capacity: 350 },
  { brand: 'Marquis', model: 'Epic Series', jets: 49, voltage: 240, current: 50, heater: 5500, pumps: 2, capacity: 445 },
  { brand: 'Custom Build', model: 'Specify Requirements', jets: 50, voltage: 240, current: 50, heater: 5500, pumps: 2, capacity: 450 }
];

const INSTALLATION_TYPES = [
  { 
    name: '120V Plug-n-Play', 
    voltage: 120, 
    description: 'Basic inflatable models, limited heating',
    pros: 'No electrical work required, portable',
    cons: 'Very slow heating, limited jet power',
    useCase: 'Temporary installations, renters'
  },
  { 
    name: '240V 30A', 
    voltage: 240,
    current: 30, 
    description: 'Small 2-4 person hot tubs',
    pros: 'Lower installation cost, adequate for small tubs',
    cons: 'May struggle in cold climates',
    useCase: 'Small spas, mild climates'
  },
  { 
    name: '240V 40A', 
    voltage: 240,
    current: 40, 
    description: 'Medium 4-5 person hot tubs',
    pros: 'Good balance of cost and performance',
    cons: 'Limited for larger tubs',
    useCase: 'Average family hot tubs'
  },
  { 
    name: '240V 50A', 
    voltage: 240,
    current: 50, 
    description: 'Standard 5-7 person hot tubs',
    pros: 'Most common, handles most residential tubs',
    cons: 'May require panel upgrade',
    useCase: 'Standard residential installations'
  },
  { 
    name: '240V 60A', 
    voltage: 240,
    current: 60, 
    description: 'Large 7+ person or high-jet count',
    pros: 'Handles any residential hot tub',
    cons: 'Higher installation cost',
    useCase: 'Luxury spas, swim spas'
  }
];

const REAL_WORLD_SCENARIOS = [
  {
    title: 'Sarah\'s Backyard Oasis Installation',
    situation: 'Sarah is installing a 6-person Hot Spring Highlife hot tub on her patio, 75 feet from the main electrical panel. She lives in Michigan where winter temperatures drop to 10°F, and she wants year-round use. The hot tub will be her primary relaxation and therapy tool for chronic back pain.',
    problem: 'The hot tub requires 50A at 240V, and the long distance creates voltage drop concerns. Michigan code requires a disconnect within sight of the hot tub, and extreme cold weather means the heater will run frequently. She needs reliable power for therapeutic daily use.',
    analysis: 'Daily therapy use requires consistent 104°F temperature. In 10°F weather, maintaining temperature requires 4-6kW continuous heating. 50A circuit provides adequate power with headroom. 75ft distance requires voltage drop calculation for wire sizing.',
    calculation: '50A continuous load = 50A circuit (no derating for non-continuous per NEC 680.42). At 75ft: 6 AWG copper yields 2.9% voltage drop (acceptable). Cold climate suggests oversizing to 4 AWG for efficiency.',
    solution: '6 AWG THWN-2 copper in 1" PVC conduit, 50A GFCI breaker, outdoor-rated disconnect within sight. Total materials: $650. Professional installation: $1,800-2,200.',
    realWorldContext: 'Proper installation enables year-round therapy use. Energy cost: $85/month winter, $45/month summer. Health benefits and avoided therapy costs justify investment. Property value increase: $5,000-7,000.',
    lessons: [
      'Cold climates benefit from oversized wire to reduce heating costs',
      'GFCI protection is mandatory for hot tubs (NEC 680.42)',
      'Disconnect must be within sight but at least 5 feet away',
      'Therapeutic use justifies premium installation for reliability'
    ]
  },
  {
    title: 'Mike\'s Luxury Swim Spa Project',
    situation: 'Mike is installing a 19-foot swim spa with dual temperature zones in his Arizona backyard. The unit requires 60A service for its multiple pumps, jets, and swim current generator. His panel is 120 feet away, requiring underground installation through his landscaped yard.',
    problem: 'The swim spa draws 60A at full load with all features running. Arizona soil temperatures reach 95°F in summer, requiring temperature derating. The long underground run and high current create significant voltage drop potential.',
    analysis: 'Swim spa has 4 pumps plus resistance swimming jets totaling 14kW load. Dual zone heating requires 2x 5.5kW heaters. Underground installation in hot soil requires significant derating factors.',
    calculation: '60A circuit requires 4 AWG copper minimum. At 120ft with 95°F soil: derate to 88% capacity. Voltage drop with 4 AWG = 4.1% (excessive). Upgrade to 2 AWG for 2.6% drop.',
    solution: '2 AWG copper USE-2 in 1.5" PVC conduit, 60A GFCI breaker, emergency disconnect at equipment. Trenching 18" deep. Total cost: $4,500 installed.',
    realWorldContext: 'Swim spa enables year-round fitness, physical therapy, and entertainment. Replaces $50,000 pool at fraction of cost. Energy efficient compared to pool heating. ROI through health benefits and property value.',
    lessons: [
      'Swim spas require larger electrical service than standard hot tubs',
      'Underground installations need derating for soil temperature',
      'Long runs require upsizing wire beyond minimum code',
      'Dual-zone units may need special control wiring'
    ]
  },
  {
    title: 'Jennifer\'s Rental Property Hot Tub',
    situation: 'Jennifer owns a vacation rental cabin in Colorado mountains. She\'s adding a 5-person hot tub to increase bookings and nightly rates. The installation must be foolproof for guests and compliant with strict rental regulations. Elevation is 8,500 feet with frequent power outages.',
    problem: 'Rental use means heavy usage by inexperienced users. Mountain location has voltage fluctuations and outages. Local codes require extra safety measures for rentals. Must be maintainable remotely.',
    analysis: 'Guest safety paramount - need redundant GFCI protection and clear shutoff locations. High altitude affects heating efficiency. Power quality issues suggest surge protection. Remote monitoring essential.',
    calculation: '40A circuit adequate for 5-person tub. High altitude derating minimal for electrical. Add whole-house surge protector. Smart breaker for remote monitoring.',
    solution: '8 AWG copper, 40A GFCI breaker plus spa-side GFCI, surge protection, WiFi-enabled controls. Lockable disconnect. Cost: $3,200 installed.',
    realWorldContext: 'Hot tub adds $150/night to rental rate. Books 20 extra nights/year = $36,000 additional annual revenue. Guest injuries prevented by redundant safety. Remote monitoring saves service calls.',
    lessons: [
      'Rental properties need extra safety measures',
      'Redundant GFCI protection recommended for commercial use',
      'Smart controls enable remote troubleshooting',
      'Surge protection critical in mountain locations'
    ]
  },
  {
    title: 'Robert\'s Indoor Hot Tub Room',
    situation: 'Robert is converting his three-season porch into a year-round hot tub room. The 7-person Jacuzzi requires 60A service. Indoor installation requires special ventilation considerations and moisture management. The room will have heated floors and dehumidification.',
    problem: 'Indoor installations need exceptional ventilation to prevent moisture damage. Multiple electrical systems (hot tub, ventilation, dehumidifier, floor heating) require load calculations. Moisture creates additional electrical safety concerns.',
    analysis: 'Total load: 60A hot tub + 20A dehumidifier + 15A ventilation + 20A floor heat = 115A total. Requires sub-panel installation. Moisture demands GFCI on all circuits. Ventilation interlocked with hot tub operation.',
    calculation: 'Sub-panel fed with 2/0 aluminum (150A). Hot tub: 4 AWG copper on 60A GFCI. All wiring in PVC conduit for moisture protection. Dedicated circuits for each system.',
    solution: '150A sub-panel, 2/0 aluminum feeder, individual GFCI circuits. Humidity controls, vapor barriers. Total electrical: $5,500. Complete room conversion: $25,000.',
    realWorldContext: 'Indoor installation allows true year-round use regardless of weather. No weather damage or maintenance. Privacy and convenience worth premium. Adds unique selling point to home.',
    lessons: [
      'Indoor installations require comprehensive moisture management',
      'Multiple systems need coordinated electrical planning',
      'Sub-panel often necessary for total load',
      'Vapor barriers and ventilation critical for structure protection'
    ]
  },
  {
    title: 'Community HOA Shared Hot Tub',
    situation: 'A 50-unit condo HOA is installing a commercial-grade 12-person hot tub in the common area. It needs to handle continuous use, meet commercial codes, and have emergency shutoffs. The location is 200 feet from the electrical room.',
    problem: 'Commercial installation requires different code compliance (NEC 680.43). Heavy use demands robust electrical supply. Long distance creates voltage drop. Liability concerns require multiple safety features. ADA compliance needed.',
    analysis: 'Commercial spa requires 80A service for continuous operation. Public use mandates emergency shutoff buttons at multiple locations. Timer controls for operating hours. Lighting and accessibility per ADA.',
    calculation: '80A circuit requires 3 AWG copper minimum. 200ft run with 3 AWG = 3.8% drop (excessive). Use 1/0 copper for 2.4% drop. Commercial GFCI required.',
    solution: '1/0 copper THWN, 100A circuit, commercial GFCI, multiple emergency stops, timer controls, security lighting. Installation: $12,000.',
    realWorldContext: 'Amenity increases property values $5,000-10,000 per unit. Attracts premium buyers/renters. Insurance requires proper commercial installation. Reduces individual unit energy costs.',
    lessons: [
      'Commercial installations have stricter requirements',
      'Multiple emergency shutoffs required for public spas',
      'Liability insurance depends on code compliance',
      'Timer controls help manage operating costs'
    ]
  }
];

const CLIMATE_CONSIDERATIONS = [
  { 
    climate: 'Hot & Dry (Arizona, Nevada)', 
    challenges: 'High ambient temps, soil heating, evaporation',
    recommendations: 'Derate for temperature, use THWN-2 wire, larger covers',
    energyCost: '$35-50/month'
  },
  { 
    climate: 'Cold & Snowy (Minnesota, Maine)', 
    challenges: 'Extreme heating demands, freezing risk, snow load',
    recommendations: 'Oversized heaters, freeze protection, reinforced covers',
    energyCost: '$80-120/month'
  },
  { 
    climate: 'Humid & Coastal (Florida, Carolina)', 
    challenges: 'Salt corrosion, hurricanes, constant humidity',
    recommendations: 'Marine-grade components, surge protection, anchor systems',
    energyCost: '$40-60/month'
  },
  { 
    climate: 'Mild & Temperate (California, Oregon)', 
    challenges: 'Minimal, occasional rain, earthquakes in some areas',
    recommendations: 'Standard installation, seismic straps where required',
    energyCost: '$30-45/month'
  },
  { 
    climate: 'Mountain & High Altitude (Colorado)', 
    challenges: 'Temperature swings, snow load, reduced heating efficiency',
    recommendations: 'Insulated covers, altitude-adjusted heaters, snow shed design',
    energyCost: '$60-90/month'
  }
];

const SAFETY_REQUIREMENTS = [
  {
    requirement: 'GFCI Protection',
    code: 'NEC 680.42',
    description: 'Ground Fault Circuit Interrupter required for all hot tub circuits',
    importance: 'Prevents electrocution from ground faults',
    testing: 'Test monthly using test button'
  },
  {
    requirement: 'Disconnect Switch',
    code: 'NEC 680.13',
    description: 'Emergency shutoff within sight of hot tub, minimum 5 feet away',
    importance: 'Allows safe servicing and emergency shutdown',
    testing: 'Verify operation quarterly'
  },
  {
    requirement: 'Bonding Grid',
    code: 'NEC 680.26',
    description: 'All metal within 5 feet must be bonded together',
    importance: 'Eliminates voltage gradients that could cause shock',
    testing: 'Inspect connections annually'
  },
  {
    requirement: 'Cover Interlock',
    code: 'ASTM F1346',
    description: 'Safety cover with locking mechanisms for unsupervised access',
    importance: 'Prevents drowning, required in many jurisdictions',
    testing: 'Check locks and straps monthly'
  },
  {
    requirement: 'Anti-Entrapment',
    code: 'VGB Act',
    description: 'Dual drains or anti-entrapment covers on all suctions',
    importance: 'Prevents hair/body entrapment injuries',
    testing: 'Inspect covers every 60 days'
  }
];

export default function HotTubWireSizeCalculator() {
  const [hotTubModel, setHotTubModel] = useState(HOT_TUB_MODELS[0]);
  const [customSpecs, setCustomSpecs] = useState({
    voltage: 240,
    current: 50,
    heaterWatts: 5500
  });
  const [distance, setDistance] = useState(50);
  const [installLocation, setInstallLocation] = useState<'outdoor' | 'indoor'>('outdoor');
  const [climate, setClimate] = useState(CLIMATE_CONSIDERATIONS[0]);
  const [electricityRate, setElectricityRate] = useState(0.13);
  const [usageHours, setUsageHours] = useState(10); // hours per week
  const [existingPanelCapacity, setExistingPanelCapacity] = useState(200);
  const [availableCapacity, setAvailableCapacity] = useState(60);
  const [includeSubPanel, setIncludeSubPanel] = useState(false);
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const calculateWireSize = () => {
    const current = hotTubModel.model === 'Specify Requirements' 
      ? customSpecs.current 
      : hotTubModel.current;
    const voltage = hotTubModel.model === 'Specify Requirements' 
      ? customSpecs.voltage 
      : hotTubModel.voltage;
    const heaterWatts = hotTubModel.model === 'Specify Requirements' 
      ? customSpecs.heaterWatts 
      : hotTubModel.heater;
    
    // Wire sizing based on current
    const wireSize = 
      current <= 20 ? '12' :
      current <= 30 ? '10' :
      current <= 40 ? '8' :
      current <= 50 ? '6' :
      current <= 60 ? '4' :
      current <= 80 ? '3' :
      '2';
    
    const wireSizeAluminum = 
      current <= 20 ? '10' :
      current <= 30 ? '8' :
      current <= 40 ? '6' :
      current <= 50 ? '4' :
      current <= 60 ? '2' :
      current <= 80 ? '1' :
      '1/0';
    
    // Calculate voltage drop
    const resistance = 
      wireSize === '12' ? 1.59 :
      wireSize === '10' ? 0.999 :
      wireSize === '8' ? 0.628 :
      wireSize === '6' ? 0.395 :
      wireSize === '4' ? 0.249 :
      wireSize === '3' ? 0.197 :
      0.156;
    
    const totalDistance = distance * 2;
    const voltageDrop = (totalDistance * current * resistance) / 1000;
    const voltageDropPercent = (voltageDrop / voltage) * 100;
    
    // Breaker sizing
    const breakerSize = 
      current <= 20 ? 20 :
      current <= 30 ? 30 :
      current <= 40 ? 40 :
      current <= 50 ? 50 :
      current <= 60 ? 60 :
      current <= 80 ? 80 :
      100;
    
    // Conduit sizing
    const conduitSize = 
      wireSize === '12' || wireSize === '10' ? '3/4"' :
      wireSize === '8' || wireSize === '6' ? '1"' :
      wireSize === '4' || wireSize === '3' ? '1-1/4"' :
      '1-1/2"';
    
    // Ground wire size per NEC Table 250.122
    const groundWireSize = 
      breakerSize <= 20 ? '12 AWG' :
      breakerSize <= 60 ? '10 AWG' :
      breakerSize <= 100 ? '8 AWG' :
      '6 AWG';
    
    // Calculate heating times (rough estimates)
    const gallons = hotTubModel.capacity;
    const btu_per_hour = heaterWatts * 3.412;
    const summerHours = (gallons * 8.33 * 30) / btu_per_hour; // 30°F rise
    const winterHours = (gallons * 8.33 * 60) / btu_per_hour; // 60°F rise
    
    // Operating costs
    const weeklyKwh = (heaterWatts / 1000) * usageHours * 0.75; // 75% heater duty cycle
    const monthlyKwh = weeklyKwh * 4.33;
    const monthlyOperatingCost = monthlyKwh * electricityRate;
    const annualOperatingCost = monthlyOperatingCost * 12;
    
    // Installation costs
    const materialCost = 
      (distance * (wireSize <= '8' ? 6 : wireSize <= '4' ? 10 : 15)) +
      (breakerSize * 2) +
      250 + // Disconnect switch
      (includeSubPanel ? 400 : 0) +
      (distance * 4); // Conduit and fittings
    
    const laborCost = 
      (distance * 12) +
      800 + // Base installation
      (installLocation === 'indoor' ? 400 : 0) +
      (includeSubPanel ? 600 : 0);
    
    setResults({
      wireSize: wireSize + ' AWG',
      wireSizeAluminum: wireSizeAluminum + ' AWG',
      breakerSize,
      breakerType: 'GFCI',
      conduitSize,
      groundWireSize,
      disconnectRequired: true,
      gfciRequired: true,
      voltageDrop,
      voltageDropPercent,
      isAcceptable: voltageDropPercent <= 3,
      estimatedInstallCost: {
        diy: materialCost,
        professional: materialCost + laborCost
      },
      heatingTime: {
        summerHours,
        winterHours
      },
      monthlyOperatingCost,
      annualOperatingCost,
      energyUsagePerMonth: monthlyKwh
    });
  };

  const performCalculation = useCallback(() => {
    calculateWireSize();
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [hotTubModel, customSpecs, distance, installLocation, climate, electricityRate, usageHours, includeSubPanel]);

  const handleReset = useCallback(() => {
    setHotTubModel(HOT_TUB_MODELS[0]);
    setCustomSpecs({
      voltage: 240,
      current: 50,
      heaterWatts: 5500
    });
    setDistance(50);
    setInstallLocation('outdoor');
    setClimate(CLIMATE_CONSIDERATIONS[0]);
    setElectricityRate(0.13);
    setUsageHours(10);
    setExistingPanelCapacity(200);
    setAvailableCapacity(60);
    setIncludeSubPanel(false);
    setShowResults(false);
  }, []);

  useEffect(() => {
    if (showResults) {
      calculateWireSize();
    }
  }, [hotTubModel, customSpecs, distance, installLocation, climate, electricityRate, usageHours, includeSubPanel, showResults]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <Waves className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Hot Tub Wire Size Calculator</h2>
        </div>
        <p className="text-gray-600">
          Professional electrical sizing for hot tub and spa installations. Calculate wire gauge, GFCI requirements, 
          disconnect placement, and heating costs for any hot tub model.
        </p>
        <div className="mt-4 bg-red-50 rounded-lg p-3 border border-red-200">
          <p className="text-sm text-red-700 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            Hot tub electrical work requires permits and licensed electrician in most jurisdictions. 
            Improper installation can cause electrocution or fire.
          </p>
        </div>
      </div>

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Hot Tub Specifications</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hot Tub Model
              </label>
              <select
                value={HOT_TUB_MODELS.indexOf(hotTubModel)}
                onChange={(e) => setHotTubModel(HOT_TUB_MODELS[parseInt(e.target.value)])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {HOT_TUB_MODELS.map((model, idx) => (
                  <option key={idx} value={idx}>
                    {model.brand} {model.model} - {model.jets} jets
                  </option>
                ))}
              </select>
              {hotTubModel && (
                <div className="text-xs text-gray-500 mt-1">
                  {hotTubModel.voltage}V / {hotTubModel.current}A / {hotTubModel.capacity} gal / {hotTubModel.heater}W heater
                </div>
              )}
            </div>

            {hotTubModel.model === 'Specify Requirements' && (
              <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-xs font-medium text-gray-600">Voltage</label>
                  <select
                    value={customSpecs.voltage}
                    onChange={(e) => setCustomSpecs({...customSpecs, voltage: Number(e.target.value)})}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  >
                    <option value={120}>120V</option>
                    <option value={240}>240V</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Current (Amps)</label>
                  <input
                    type="number"
                    value={customSpecs.current}
                    onChange={(e) => setCustomSpecs({...customSpecs, current: Number(e.target.value)})}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    min="15"
                    max="100"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Heater (Watts)</label>
                  <input
                    type="number"
                    value={customSpecs.heaterWatts}
                    onChange={(e) => setCustomSpecs({...customSpecs, heaterWatts: Number(e.target.value)})}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    min="1000"
                    max="11000"
                    step="500"
                  />
                </div>
              </div>
            )}

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
              <p className="text-xs text-gray-500 mt-1">One-way distance to hot tub location</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Installation Location
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setInstallLocation('outdoor')}
                  className={`flex-1 py-2 px-4 rounded-lg border ${
                    installLocation === 'outdoor' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  Outdoor
                </button>
                <button
                  onClick={() => setInstallLocation('indoor')}
                  className={`flex-1 py-2 px-4 rounded-lg border ${
                    installLocation === 'indoor' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  Indoor
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Include Sub-Panel
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeSubPanel}
                  onChange={(e) => setIncludeSubPanel(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">
                  Add sub-panel near hot tub (recommended for long runs)
                </span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Climate Zone
              </label>
              <select
                value={CLIMATE_CONSIDERATIONS.indexOf(climate)}
                onChange={(e) => setClimate(CLIMATE_CONSIDERATIONS[parseInt(e.target.value)])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CLIMATE_CONSIDERATIONS.map((c, idx) => (
                  <option key={idx} value={idx}>{c.climate}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Typical energy cost: {climate.energyCost}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weekly Usage (hours)
              </label>
              <input
                type="number"
                value={usageHours}
                onChange={(e) => setUsageHours(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="168"
              />
              <p className="text-xs text-gray-500 mt-1">Average hours of use per week</p>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Electrical Panel
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
                  <p className="text-xs text-gray-500 mt-1">Total capacity</p>
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
              {availableCapacity < (results?.breakerSize || 50) && (
                <p className="text-xs text-red-600 mt-1">
                  ⚠ Panel upgrade may be required
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {/* Calculate Button */}
          <Button onClick={performCalculation} className="w-full">
            <Calculator className="w-4 h-4" />
            Calculate Hot Tub Wire Size
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
        <div className="grid lg:grid-cols-3 gap-6" ref={resultsRef}>
          {/* Electrical Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Electrical Requirements</h3>
            </div>
            
            <div className="space-y-3">
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Wire Size (Copper)</div>
                <div className="text-xl font-bold text-yellow-700">{results.wireSize}</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Wire Size (Aluminum)</div>
                <div className="text-xl font-bold text-gray-700">{results.wireSizeAluminum}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Breaker</div>
                  <div className="text-lg font-bold text-gray-700">{results.breakerSize}A</div>
                  <div className="text-xs text-blue-600">{results.breakerType}</div>
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
                </div>
                <div className="text-xs">
                  {results.isAcceptable ? '✓ Within limits' : '⚠ Consider larger wire'}
                </div>
              </div>
            </div>
          </div>

          {/* Safety Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Safety Requirements</h3>
            </div>
            
            <div className="space-y-3">
              <div className={`rounded-lg p-3 ${results.gfciRequired ? 'bg-red-50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">GFCI Protection</span>
                  <span className="text-sm font-bold text-red-600">REQUIRED</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">NEC 680.42 mandatory</p>
              </div>
              
              <div className={`rounded-lg p-3 ${results.disconnectRequired ? 'bg-red-50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Disconnect Switch</span>
                  <span className="text-sm font-bold text-red-600">REQUIRED</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Within sight, 5ft minimum</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm font-medium text-blue-700">Bonding Requirements</div>
                <p className="text-xs text-blue-600 mt-1">
                  All metal within 5ft must be bonded (NEC 680.26)
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-700">Cover Interlock</div>
                <p className="text-xs text-gray-600 mt-1">
                  Locking cover recommended for safety
                </p>
              </div>
            </div>
          </div>

          {/* Cost Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Cost Analysis</h3>
            </div>
            
            <div className="space-y-3">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Installation Cost</div>
                <div className="text-lg font-bold text-green-700">
                  DIY: ${results.estimatedInstallCost.diy.toFixed(0)}
                </div>
                <div className="text-lg font-bold text-green-700">
                  Pro: ${results.estimatedInstallCost.professional.toFixed(0)}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Heating Time</div>
                <div className="text-sm">
                  Summer: {results.heatingTime.summerHours.toFixed(1)} hrs
                </div>
                <div className="text-sm">
                  Winter: {results.heatingTime.winterHours.toFixed(1)} hrs
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Operating Costs</div>
                <div className="text-lg font-bold text-blue-700">
                  ${results.monthlyOperatingCost.toFixed(0)}/month
                </div>
                <div className="text-sm text-gray-600">
                  ${results.annualOperatingCost.toFixed(0)}/year
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {results.energyUsagePerMonth.toFixed(0)} kWh/month
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Heating Time Visualization */}
      {showResults && results && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Heating Performance Analysis</h3>
          
          <div className="space-y-6">
            {/* Heating Time Bars */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Initial Heating Time (Cold Start)</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Summer (70°F to 104°F)</span>
                    <span>{results.heatingTime.summerHours.toFixed(1)} hours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${Math.min(100, results.heatingTime.summerHours * 100 / 24)}%` }}
                    >
                      {results.heatingTime.summerHours.toFixed(1)}h
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Winter (40°F to 104°F)</span>
                    <span>{results.heatingTime.winterHours.toFixed(1)} hours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${Math.min(100, results.heatingTime.winterHours * 100 / 48)}%` }}
                    >
                      {results.heatingTime.winterHours.toFixed(1)}h
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Temperature Maintenance */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Temperature Maintenance</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">2-3°F</div>
                  <div className="text-xs text-gray-600">Heat loss per hour</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">15-20</div>
                  <div className="text-xs text-gray-600">Min/hour heating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">$0.50</div>
                  <div className="text-xs text-gray-600">Cost per hour</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-World Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Real Installation Scenarios</h3>
        
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
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
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
              <h5 className="font-semibold text-yellow-800 mb-2">Electrical Calculation</h5>
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

      {/* Climate Considerations Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Thermometer className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Climate-Specific Considerations</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-orange-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Climate Zone</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Challenges</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Recommendations</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Typical Cost</th>
              </tr>
            </thead>
            <tbody>
              {CLIMATE_CONSIDERATIONS.map((climate, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium">{climate.climate}</td>
                  <td className="border border-gray-300 px-4 py-3 text-sm">{climate.challenges}</td>
                  <td className="border border-gray-300 px-4 py-3 text-sm">{climate.recommendations}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-medium text-orange-600">
                    {climate.energyCost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety Requirements */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 border border-red-200">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-red-600" />
          <h3 className="text-xl font-bold text-gray-900">Mandatory Safety Requirements</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {SAFETY_REQUIREMENTS.map((req, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 border-l-4 border-red-500">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-red-800">{req.requirement}</h4>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">{req.code}</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{req.description}</p>
              <p className="text-sm text-blue-700 font-medium mb-1">Why it matters:</p>
              <p className="text-sm text-gray-600">{req.importance}</p>
              <p className="text-xs text-gray-500 mt-2 italic">Testing: {req.testing}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Installation Types Comparison */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Installation Type Comparison</h3>
        
        <div className="space-y-4">
          {INSTALLATION_TYPES.map((type, idx) => (
            <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{type.name}</h4>
                {type.current && (
                  <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {type.current}A
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">{type.description}</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs font-semibold text-green-700">Pros:</span>
                  <p className="text-xs text-gray-600">{type.pros}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-red-700">Cons:</span>
                  <p className="text-xs text-gray-600">{type.cons}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-blue-700">Best For:</span>
                  <p className="text-xs text-gray-600">{type.useCase}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}