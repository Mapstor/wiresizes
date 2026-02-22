'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Calculator, Zap, AlertCircle, CheckCircle2, TrendingUp, Settings, Gauge, DollarSign, Wrench, House } from 'lucide-react';

const GarageSubpanelWireSizeCalculator: React.FC = () => {
  const [amperage, setAmperage] = useState<string>('60');
  const [distance, setDistance] = useState<string>('75');
  const [voltage, setVoltage] = useState<string>('240');
  const [wireType, setWireType] = useState<'copper' | 'aluminum'>('copper');
  const [installMethod, setInstallMethod] = useState<'conduit' | 'direct'>('conduit');
  const [maxVoltageDrop, setMaxVoltageDrop] = useState<string>('3');
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [wireSize, setWireSize] = useState<string>('');
  const [groundSize, setGroundSize] = useState<string>('');
  const [actualVoltageDrop, setActualVoltageDrop] = useState<number>(0);
  const [voltageAtLoad, setVoltageAtLoad] = useState<number>(0);
  const [conduitSize, setConduitSize] = useState<string>('');
  const [estimatedCost, setEstimatedCost] = useState<number>(0);

  const calculateWireSize = useCallback(() => {
    const amps = parseFloat(amperage) || 0;
    const dist = parseFloat(distance) || 0;
    const volts = parseFloat(voltage) || 240;
    const maxDrop = parseFloat(maxVoltageDrop) || 3;

    if (amps <= 0 || dist <= 0) {
      setWireSize('Invalid input');
      setGroundSize('Invalid input');
      setActualVoltageDrop(0);
      setVoltageAtLoad(0);
      setConduitSize('Invalid input');
      setEstimatedCost(0);
      return;
    }

    // Wire resistance values (ohms per 1000 ft) at 75°C
    const copperResistance: { [key: string]: number } = {
      '14': 3.14,
      '12': 1.98,
      '10': 1.24,
      '8': 0.778,
      '6': 0.491,
      '4': 0.308,
      '3': 0.245,
      '2': 0.194,
      '1': 0.154,
      '1/0': 0.122,
      '2/0': 0.0967,
      '3/0': 0.0766,
      '4/0': 0.0608,
      '250': 0.0515,
      '300': 0.0429,
      '350': 0.0367,
      '400': 0.0321,
      '500': 0.0258,
    };

    const aluminumResistance: { [key: string]: number } = {
      '12': 3.25,
      '10': 2.04,
      '8': 1.28,
      '6': 0.808,
      '4': 0.508,
      '3': 0.403,
      '2': 0.319,
      '1': 0.253,
      '1/0': 0.201,
      '2/0': 0.159,
      '3/0': 0.126,
      '4/0': 0.100,
      '250': 0.0847,
      '300': 0.0707,
      '350': 0.0605,
      '400': 0.0529,
      '500': 0.0424,
    };

    // Ampacity ratings at 75°C
    const copperAmpacity: { [key: string]: number } = {
      '14': 20,
      '12': 25,
      '10': 35,
      '8': 50,
      '6': 65,
      '4': 85,
      '3': 100,
      '2': 115,
      '1': 130,
      '1/0': 150,
      '2/0': 175,
      '3/0': 200,
      '4/0': 230,
      '250': 255,
      '300': 285,
      '350': 310,
      '400': 335,
      '500': 380,
    };

    const aluminumAmpacity: { [key: string]: number } = {
      '12': 20,
      '10': 30,
      '8': 40,
      '6': 50,
      '4': 65,
      '3': 75,
      '2': 90,
      '1': 100,
      '1/0': 120,
      '2/0': 135,
      '3/0': 155,
      '4/0': 180,
      '250': 205,
      '300': 230,
      '350': 250,
      '400': 270,
      '500': 310,
    };

    const resistance = wireType === 'copper' ? copperResistance : aluminumResistance;
    const ampacity = wireType === 'copper' ? copperAmpacity : aluminumAmpacity;
    
    // Find wire size that meets both ampacity and voltage drop requirements
    let selectedWire = '';
    let selectedResistance = 0;
    let vDrop = 0;
    
    const maxAllowableVoltageDrop = (volts * maxDrop) / 100;
    
    for (const [gauge, ampRating] of Object.entries(ampacity)) {
      if (ampRating >= amps) {
        const r = resistance[gauge];
        // Voltage drop formula: VD = 2 × L × I × R / 1000
        vDrop = (2 * dist * amps * r) / 1000;
        
        if (vDrop <= maxAllowableVoltageDrop) {
          selectedWire = gauge + ' AWG';
          if (gauge.includes('/')) selectedWire = gauge;
          selectedResistance = r;
          break;
        }
      }
    }

    if (!selectedWire) {
      selectedWire = 'Size exceeds standard - consult engineer';
    }

    setWireSize(selectedWire);
    setActualVoltageDrop((vDrop / volts) * 100);
    setVoltageAtLoad(volts - vDrop);

    // Determine ground wire size based on amperage
    let ground = '10 AWG';
    if (amps <= 60) ground = '10 AWG';
    else if (amps <= 100) ground = '8 AWG';
    else if (amps <= 200) ground = '6 AWG';
    else if (amps <= 300) ground = '4 AWG';
    else if (amps <= 400) ground = '3 AWG';
    else ground = '2 AWG or larger';
    setGroundSize(ground);

    // Determine conduit size (simplified)
    let conduit = '3/4"';
    if (amps <= 30) conduit = '3/4"';
    else if (amps <= 50) conduit = '1"';
    else if (amps <= 70) conduit = '1-1/4"';
    else if (amps <= 100) conduit = '1-1/2"';
    else if (amps <= 150) conduit = '2"';
    else if (amps <= 200) conduit = '2-1/2"';
    else conduit = '3" or larger';
    setConduitSize(conduit);

    // Estimate cost (rough approximation)
    const wireCostPerFoot = wireType === 'copper' ? 
      (amps <= 30 ? 2.5 : amps <= 60 ? 4.5 : amps <= 100 ? 8 : 15) :
      (amps <= 30 ? 1.5 : amps <= 60 ? 2.5 : amps <= 100 ? 4 : 8);
    
    const totalWireLength = dist * 3 + dist; // 3 conductors + ground
    const wireCost = totalWireLength * wireCostPerFoot;
    const conduitCost = dist * 2; // Rough estimate $2/ft
    const panelCost = amps <= 60 ? 200 : amps <= 100 ? 300 : 450;
    
    setEstimatedCost(Math.round(wireCost + conduitCost + panelCost));
  }, [amperage, distance, voltage, wireType, maxVoltageDrop]);

  const performCalculation = useCallback(() => {
    calculateWireSize();
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [calculateWireSize]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-xl p-8 mb-8">
        <div className="flex items-center mb-6">
          <House className="w-10 h-10 text-blue-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Garage Subpanel Wire Size Calculator</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subpanel Amperage Rating
              </label>
              <select
                value={amperage}
                onChange={(e) => setAmperage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="30">30 Amp</option>
                <option value="40">40 Amp</option>
                <option value="50">50 Amp</option>
                <option value="60">60 Amp</option>
                <option value="70">70 Amp</option>
                <option value="80">80 Amp</option>
                <option value="100">100 Amp</option>
                <option value="125">125 Amp</option>
                <option value="150">150 Amp</option>
                <option value="200">200 Amp</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Distance to Garage (feet)
              </label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter distance in feet"
                min="0"
                step="5"
              />
              <p className="text-xs text-gray-500 mt-1">One-way distance from main panel to subpanel</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                System Voltage
              </label>
              <select
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="120">120V (Single Phase)</option>
                <option value="240">240V (Split Phase)</option>
                <option value="208">208V (Three Phase)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Wire Type
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setWireType('copper')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    wireType === 'copper'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Copper
                </button>
                <button
                  onClick={() => setWireType('aluminum')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    wireType === 'aluminum'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Aluminum
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Installation Method
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setInstallMethod('conduit')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    installMethod === 'conduit'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Conduit
                </button>
                <button
                  onClick={() => setInstallMethod('direct')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    installMethod === 'direct'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Direct Burial
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Voltage Drop (%)
              </label>
              <select
                value={maxVoltageDrop}
                onChange={(e) => setMaxVoltageDrop(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="2">2% (Conservative)</option>
                <option value="3">3% (NEC Recommended)</option>
                <option value="5">5% (Maximum Total)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">NEC recommends 3% for feeders</p>
            </div>
          </div>
        </div>

        <button
          onClick={performCalculation}
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors flex items-center justify-center"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Calculate Wire Size
        </button>
      </div>

      {showResults && (
        <div ref={resultsRef} className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Zap className="w-8 h-8 text-yellow-500 mr-3" />
            Wire Size Requirements
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium">Required Wire Size</span>
                <Settings className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600">
                {wireSize}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {wireType === 'copper' ? 'Copper' : 'Aluminum'} conductor
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium">Ground Wire Size</span>
                <Wrench className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {groundSize}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Equipment grounding conductor
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium">Voltage Drop</span>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600">
                {actualVoltageDrop.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {voltageAtLoad.toFixed(1)}V at subpanel
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium">Conduit Size</span>
                <Gauge className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600">
                {conduitSize}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Minimum conduit diameter
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 font-medium">Estimated Material Cost</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">
              ${estimatedCost.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Wire, conduit, and panel (materials only)
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">Installation Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Install separate ground rod system at garage (2 rods, 6 ft apart)</li>
                  <li>Do NOT bond neutral and ground at subpanel</li>
                  <li>Main breaker required at subpanel for disconnect</li>
                  <li>Burial depth: {installMethod === 'conduit' ? '18" for PVC, 6" for RMC' : '24" for direct burial'}</li>
                  <li>All garage receptacles require GFCI protection</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle2 className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">Wire Run</span>
              </div>
              <div className="text-lg font-bold text-gray-800">
                {(parseFloat(distance) * 3).toFixed(0)} ft
              </div>
              <div className="text-xs text-gray-500">Total conductor length</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle2 className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">Power Loss</span>
              </div>
              <div className="text-lg font-bold text-gray-800">
                {((actualVoltageDrop / 100) * parseFloat(amperage) * parseFloat(voltage) / 1000).toFixed(2)} kW
              </div>
              <div className="text-xs text-gray-500">Due to resistance</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle2 className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">Available Power</span>
              </div>
              <div className="text-lg font-bold text-gray-800">
                {((voltageAtLoad * parseFloat(amperage)) / 1000).toFixed(1)} kW
              </div>
              <div className="text-xs text-gray-500">At subpanel</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GarageSubpanelWireSizeCalculator;