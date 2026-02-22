import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import {
  WireSizeCalculator,
  VoltageDropCalculator,
  WattsToAmpsCalculator,
  AmpsToWattsCalculator,
  VoltsToAmpsCalculator,
  KilowattsToAmpsCalculator,
  HorsepowerToAmpsCalculator,
  BTUToWattsCalculator,
  KVAToAmpsCalculator,
  OhmsLawCalculator,
  ConduitFillCalculator,
  BoxFillCalculator,
  GroundWireCalculator,
  AmpacityCalculator,
  EVChargerCalculator,
  HotTubCalculator,
  WelderCalculator,
  PoolPumpCalculator,
  WellPumpCalculator,
  AirConditionerCalculator,
  DryerCalculator,
  RangeCalculator,
  GarageSubpanelCalculator,
  RVHookupCalculator,
  CircuitBreakerCalculator,
  ElectricalLoadCalculator,
  ThreePhaseCalculator,
  LowVoltageCalculator,
  WireResistanceCalculator,
} from '@/components/calculators';

// Map of slugs to calculator components and metadata
// Note: Many calculators now have dedicated pages at /calculators/[calculator-name]/
// This dynamic route handles remaining calculators that don't have dedicated pages
const CALCULATOR_MAP: Record<string, {
  component: React.ComponentType;
  title: string;
  description: string;
}> = {
  // Keep only calculators that don't have dedicated pages
  // Removed the following calculators as requested:
  // - volts-to-amps-calculator
  // - kilowatts-to-amps-calculator 
  // - horsepower-to-amps-calculator
  // - btu-to-watts-calculator
  // - kva-to-amps-calculator
  // - ohms-law-calculator
  // - box-fill-calculator
  // - ground-wire-calculator
  
  'circuit-breaker-calculator': {
    component: CircuitBreakerCalculator,
    title: 'Circuit Breaker Calculator | Electrical Protection Calculator',
    description: 'Calculate circuit breaker size for electrical protection. Motor and general load breaker sizing.',
  },
  'low-voltage-calculator': {
    component: LowVoltageCalculator,
    title: 'Low Voltage Calculator | 12V 24V Circuit Calculator',
    description: 'Calculate wire size for low voltage systems. 12V and 24V DC circuit calculations.',
  },
  'wire-resistance-calculator': {
    component: WireResistanceCalculator,
    title: 'Wire Resistance Calculator | Conductor Resistance Calculator',
    description: 'Calculate electrical resistance of wire conductors. Resistance per length calculations.',
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const calculator = CALCULATOR_MAP[slug];
  
  if (!calculator) {
    return {
      title: 'Calculator Not Found | WireSizes.com',
      description: 'The requested calculator was not found.',
    };
  }

  return {
    title: calculator.title,
    description: calculator.description,
  };
}

export default async function CalculatorPage({ params }: Props) {
  const { slug } = await params;
  const calculator = CALCULATOR_MAP[slug];

  if (!calculator) {
    notFound();
  }

  const CalculatorComponent = calculator.component;

  return (
    <div className="py-8">
      <div className="container">
        <Suspense fallback={<div>Loading calculator...</div>}>
          <CalculatorComponent />
        </Suspense>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(CALCULATOR_MAP).map((slug) => ({
    slug,
  }));
}