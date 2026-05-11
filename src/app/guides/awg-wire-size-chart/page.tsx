import { Metadata } from 'next';
import { 
  Table, 
  Gauge, 
  Calculator, 
  BookOpen, 
  AlertCircle,
  CheckCircle,
  Info,
  TrendingUp,
  DollarSign,
  Zap,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { DatasetSchema } from '@/components/seo/DatasetSchema';
import { getArticleDates } from '@/lib/article-dates';
import { NEC_310_16 } from '@/lib/data/nec-tables';
import { WIRE_PROPERTIES } from '@/lib/data/wire-properties';

// Fixture-wire AWG sizes below NEC 310.16's smallest entry (14 AWG).
// Listed for completeness; not assigned a 310.16 ampacity.
const SUB_NEC_AWG = [
  { awg: '18', diameter_mm: 1.024, diameter_in: 0.0403, area_mm2: 0.823, resistance_20c: 6.385 },
  { awg: '16', diameter_mm: 1.291, diameter_in: 0.0508, area_mm2: 1.310, resistance_20c: 4.016 },
];

// AWG sizes covered by NEC 310.16 ampacity, displayed in this chart.
// Joined with WIRE_PROPERTIES (@20°C copper resistance, the site-wide
// voltage-drop convention) for the resistance column.
const AWG_CHART_ROWS = NEC_310_16
  .filter((row) => /^(14|12|10|8|6|4|3|2|1|[1234]\/0)$/.test(row.awg))
  .map((row) => {
    const wp = WIRE_PROPERTIES.find((p) => p.awg === row.awg);
    return {
      awg: row.awg,
      diameter_mm: row.diameter_mils * 0.0254,
      diameter_in: row.diameter_mils / 1000,
      area_mm2: row.area_mm2,
      resistance_20c: wp?.resistance_copper_ohm_per_1000ft ?? 0,
      copper_75c: row.copper_75c,
      aluminum_75c: row.aluminum_75c,
      // NEC 240.4(D) caps OCPD at 15/20/30 A regardless of ampacity, so
      // mark these rows with the asterisk and yellow background.
      smallConductor: row.awg === '14' || row.awg === '12' || row.awg === '10',
    };
  });


export const metadata: Metadata = {
  title: 'AWG Wire Size Chart — Diameter & Ampacity',
  description: 'Complete AWG reference: diameter (mm, inch), area (kcmil, mm²), DC resistance, NEC 310.16 copper and aluminum ampacity at 75°C.',
  keywords: 'AWG chart, wire size chart, American wire gauge, wire diameter table, AWG to mm conversion, wire resistance table, copper wire sizes, aluminum wire sizes, electrical wire chart',
  alternates: { canonical: '/guides/awg-wire-size-chart' },
};

// Article data for schema
const articleData = {
  headline: "Complete AWG Wire Size Chart & Reference Guide",
  description: "Comprehensive AWG wire size chart with diameters, resistance, ampacity ratings for copper and aluminum. Includes metric conversions, NEC ampacity tables, and wire selection guide.",
  url: "https://wiresizes.com/guides/awg-wire-size-chart",
  ...getArticleDates('src/app/guides/awg-wire-size-chart/page.tsx'),
};

export default function AWGWireSizeChartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-4">
              Complete AWG Wire Size Chart & Reference Guide
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              American Wire Gauge (AWG) comprehensive reference table with diameters, resistance, 
              ampacity ratings, and metric conversions for electrical installations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/calculators/wire-size-calculator" 
                className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Wire Size Calculator
              </Link>
              <Link 
                href="/guides/nec-table-310-16" 
                className="bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
              >
                <Table className="w-5 h-5" />
                NEC Table 310.16
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Reference Card */}
      <section className="py-8 -mt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl p-6 border-2 border-blue-200">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Gauge className="w-6 h-6 text-blue-600" />
                Quick AWG Reference - Most Common Sizes
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">14 AWG</h3>
                  <ul className="text-sm space-y-1 text-blue-700">
                    <li>• Diameter: 1.628 mm</li>
                    <li>• 15A circuits</li>
                    <li>• Lighting & outlets</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">12 AWG</h3>
                  <ul className="text-sm space-y-1 text-green-700">
                    <li>• Diameter: 2.053 mm</li>
                    <li>• 20A circuits</li>
                    <li>• Kitchen & bathroom</li>
                  </ul>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-900 mb-2">10 AWG</h3>
                  <ul className="text-sm space-y-1 text-amber-700">
                    <li>• Diameter: 2.588 mm</li>
                    <li>• 30A circuits</li>
                    <li>• Dryers & A/C</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">6 AWG</h3>
                  <ul className="text-sm space-y-1 text-purple-700">
                    <li>• Diameter: 4.116 mm</li>
                    <li>• 60A circuits</li>
                    <li>• EV chargers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete AWG Table */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Table className="w-6 h-6 text-blue-600" />
              Complete AWG Wire Size Table
            </h2>
            
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <th className="px-4 py-3 text-left">AWG</th>
                      <th className="px-4 py-3 text-center">Diameter (mm)</th>
                      <th className="px-4 py-3 text-center">Diameter (inch)</th>
                      <th className="px-4 py-3 text-center">Area (mm²)</th>
                      <th className="px-4 py-3 text-center">Resistance (Ω/1000ft)</th>
                      <th className="px-4 py-3 text-center">Cu Ampacity 75°C</th>
                      <th className="px-4 py-3 text-center">Al Ampacity 75°C</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {SUB_NEC_AWG.map((row) => (
                      <tr key={row.awg} className="hover:bg-blue-50">
                        <td className="px-4 py-3 font-mono font-bold">{row.awg}</td>
                        <td className="px-4 py-3 text-center">{row.diameter_mm.toFixed(3)}</td>
                        <td className="px-4 py-3 text-center">{row.diameter_in.toFixed(4)}</td>
                        <td className="px-4 py-3 text-center">{row.area_mm2.toFixed(3)}</td>
                        <td className="px-4 py-3 text-center">{row.resistance_20c.toFixed(3)}</td>
                        <td className="px-4 py-3 text-center">—</td>
                        <td className="px-4 py-3 text-center">—</td>
                      </tr>
                    ))}
                    {AWG_CHART_ROWS.map((row) => {
                      const cuLabel = row.copper_75c !== null ? `${row.copper_75c}${row.smallConductor ? '*' : ''}` : '—';
                      const alLabel = row.aluminum_75c !== null ? `${row.aluminum_75c}${row.smallConductor ? '*' : ''}` : '—';
                      const rowClass = row.smallConductor ? 'hover:bg-blue-50 bg-yellow-50' : 'hover:bg-blue-50';
                      return (
                        <tr key={row.awg} className={rowClass}>
                          <td className="px-4 py-3 font-mono font-bold">{row.awg}</td>
                          <td className="px-4 py-3 text-center">{row.diameter_mm.toFixed(3)}</td>
                          <td className="px-4 py-3 text-center">{row.diameter_in.toFixed(4)}</td>
                          <td className="px-4 py-3 text-center">{row.area_mm2.toFixed(2)}</td>
                          <td className="px-4 py-3 text-center">{row.resistance_20c < 0.1 ? row.resistance_20c.toFixed(4) : row.resistance_20c.toFixed(3)}</td>
                          <td className="px-4 py-3 text-center font-semibold">{cuLabel}</td>
                          <td className="px-4 py-3 text-center">{alLabel}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 bg-amber-50 border-t border-amber-200">
                <p className="text-xs text-amber-800">
                  <strong>*</strong> Limited by NEC 240.4(D) small conductor rule. 14 AWG max 15A, 12 AWG max 20A, 10 AWG max 30A protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metric Conversion Section */}
      <section className="py-8 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              AWG to Metric Wire Size Conversion
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">Common AWG to mm² Conversions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">AWG</th>
                        <th className="text-center py-2">mm²</th>
                        <th className="text-center py-2">Nearest Metric</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-2 font-mono">14 AWG</td>
                        <td className="py-2 text-center">2.08</td>
                        <td className="py-2 text-center">2.5 mm²</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono">12 AWG</td>
                        <td className="py-2 text-center">3.31</td>
                        <td className="py-2 text-center">4 mm²</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono">10 AWG</td>
                        <td className="py-2 text-center">5.26</td>
                        <td className="py-2 text-center">6 mm²</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono">8 AWG</td>
                        <td className="py-2 text-center">8.37</td>
                        <td className="py-2 text-center">10 mm²</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono">6 AWG</td>
                        <td className="py-2 text-center">13.3</td>
                        <td className="py-2 text-center">16 mm²</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono">4 AWG</td>
                        <td className="py-2 text-center">21.2</td>
                        <td className="py-2 text-center">25 mm²</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono">2 AWG</td>
                        <td className="py-2 text-center">33.6</td>
                        <td className="py-2 text-center">35 mm²</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono">1/0 AWG</td>
                        <td className="py-2 text-center">53.5</td>
                        <td className="py-2 text-center">50 mm²</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">AWG System Explained</h3>
                <div className="space-y-3 text-sm text-neutral-700">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p>
                      The AWG system is logarithmic - each 3-gauge decrease doubles the cross-sectional area.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p>
                      Smaller AWG numbers = larger wire diameters. AWG 0000 (4/0) is the largest standard size.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p>
                      For sizes larger than 4/0, kcmil (MCM) is used, representing thousands of circular mils.
                    </p>
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <strong>Formula:</strong> Diameter(n) = 0.005 × 92^((36-n)/39) inches
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Guide */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-600" />
              Wire Size Selection by Application
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <h3 className="font-semibold text-green-900 mb-3">Residential Circuits</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Lighting (15A)</span>
                    <span className="font-mono font-semibold">14 AWG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Outlets (20A)</span>
                    <span className="font-mono font-semibold">12 AWG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Kitchen GFCI (20A)</span>
                    <span className="font-mono font-semibold">12 AWG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Bathroom (20A)</span>
                    <span className="font-mono font-semibold">12 AWG</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <h3 className="font-semibold text-blue-900 mb-3">Appliances</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Dryer (30A)</span>
                    <span className="font-mono font-semibold">10 AWG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Range (50A)</span>
                    <span className="font-mono font-semibold">6 AWG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Water Heater (30A)</span>
                    <span className="font-mono font-semibold">10 AWG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>A/C Unit (20-30A)</span>
                    <span className="font-mono font-semibold">12-10 AWG</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <h3 className="font-semibold text-purple-900 mb-3">Special Applications</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>EV Charger (60A)</span>
                    <span className="font-mono font-semibold">6 AWG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Hot Tub (50A)</span>
                    <span className="font-mono font-semibold">6 AWG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sub Panel (100A)</span>
                    <span className="font-mono font-semibold">2 AWG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Service (200A)</span>
                    <span className="font-mono font-semibold">3/0 AWG</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-900">
                <AlertCircle className="inline w-4 h-4 mr-2" />
                <strong>Important:</strong> These are typical sizes. Always calculate based on actual load, distance, 
                and voltage drop. Consult NEC and local codes for specific requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Comparison */}
      <section className="py-8 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              Wire Cost Comparison by Size
            </h2>
            
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                      <th className="px-4 py-3 text-left">Wire Size</th>
                      <th className="px-4 py-3 text-center">Copper $/ft</th>
                      <th className="px-4 py-3 text-center">Aluminum $/ft</th>
                      <th className="px-4 py-3 text-center">Savings %</th>
                      <th className="px-4 py-3 text-center">100ft Cost Cu</th>
                      <th className="px-4 py-3 text-center">100ft Cost Al</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    <tr className="hover:bg-green-50">
                      <td className="px-4 py-3 font-mono font-semibold">14 AWG</td>
                      <td className="px-4 py-3 text-center">$0.45</td>
                      <td className="px-4 py-3 text-center">—</td>
                      <td className="px-4 py-3 text-center">—</td>
                      <td className="px-4 py-3 text-center font-semibold">$45</td>
                      <td className="px-4 py-3 text-center">—</td>
                    </tr>
                    <tr className="hover:bg-green-50">
                      <td className="px-4 py-3 font-mono font-semibold">12 AWG</td>
                      <td className="px-4 py-3 text-center">$0.65</td>
                      <td className="px-4 py-3 text-center">$0.35</td>
                      <td className="px-4 py-3 text-center text-green-600">46%</td>
                      <td className="px-4 py-3 text-center font-semibold">$65</td>
                      <td className="px-4 py-3 text-center">$35</td>
                    </tr>
                    <tr className="hover:bg-green-50">
                      <td className="px-4 py-3 font-mono font-semibold">10 AWG</td>
                      <td className="px-4 py-3 text-center">$0.95</td>
                      <td className="px-4 py-3 text-center">$0.45</td>
                      <td className="px-4 py-3 text-center text-green-600">53%</td>
                      <td className="px-4 py-3 text-center font-semibold">$95</td>
                      <td className="px-4 py-3 text-center">$45</td>
                    </tr>
                    <tr className="hover:bg-green-50">
                      <td className="px-4 py-3 font-mono font-semibold">8 AWG</td>
                      <td className="px-4 py-3 text-center">$1.55</td>
                      <td className="px-4 py-3 text-center">$0.75</td>
                      <td className="px-4 py-3 text-center text-green-600">52%</td>
                      <td className="px-4 py-3 text-center font-semibold">$155</td>
                      <td className="px-4 py-3 text-center">$75</td>
                    </tr>
                    <tr className="hover:bg-green-50">
                      <td className="px-4 py-3 font-mono font-semibold">6 AWG</td>
                      <td className="px-4 py-3 text-center">$2.80</td>
                      <td className="px-4 py-3 text-center">$1.20</td>
                      <td className="px-4 py-3 text-center text-green-600">57%</td>
                      <td className="px-4 py-3 text-center font-semibold">$280</td>
                      <td className="px-4 py-3 text-center">$120</td>
                    </tr>
                    <tr className="hover:bg-green-50">
                      <td className="px-4 py-3 font-mono font-semibold">2 AWG</td>
                      <td className="px-4 py-3 text-center">$5.50</td>
                      <td className="px-4 py-3 text-center">$2.20</td>
                      <td className="px-4 py-3 text-center text-green-600">60%</td>
                      <td className="px-4 py-3 text-center font-semibold">$550</td>
                      <td className="px-4 py-3 text-center">$220</td>
                    </tr>
                    <tr className="hover:bg-green-50">
                      <td className="px-4 py-3 font-mono font-semibold">2/0 AWG</td>
                      <td className="px-4 py-3 text-center">$12.50</td>
                      <td className="px-4 py-3 text-center">$4.80</td>
                      <td className="px-4 py-3 text-center text-green-600">62%</td>
                      <td className="px-4 py-3 text-center font-semibold">$1,250</td>
                      <td className="px-4 py-3 text-center">$480</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 bg-green-50 border-t border-green-200">
                <p className="text-xs text-green-800">
                  *Prices are approximate 2024 market averages for THHN/THWN-2 wire and may vary by location and supplier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Resources */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Technical Resources & Standards
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-3">NEC Standards</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://www.nfpa.org/codes-and-standards/nfpa-70-national-electrical-code" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-600 hover:underline flex items-center gap-1">
                      NFPA 70 - NEC
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li className="text-neutral-600">• Article 310 - Conductors</li>
                  <li className="text-neutral-600">• Table 310.16 - Ampacities</li>
                  <li className="text-neutral-600">• Chapter 9, Table 8 - Properties</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-3">Industry Standards</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://www.astm.org/b0258-18.html" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-600 hover:underline flex items-center gap-1">
                      ASTM B258 - AWG Sizes
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.ul.com/resources/wire-cable-guide" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-600 hover:underline flex items-center gap-1">
                      UL Wire & Cable Guide
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li className="text-neutral-600">• IEC 60228 - Metric sizes</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-3">Manufacturer Data</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://www.southwire.com/wire-cable" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-600 hover:underline flex items-center gap-1">
                      Southwire Specifications
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.generalcable.com/na/resources" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-600 hover:underline flex items-center gap-1">
                      General Cable Resources
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li className="text-neutral-600">• Wire specification sheets</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="py-12 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calculator className="w-6 h-6" />
              Related Calculators & Guides
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link 
                href="/calculators/wire-size-calculator"
                className="bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-colors"
              >
                <h3 className="font-semibold mb-2">Wire Size Calculator</h3>
                <p className="text-sm text-blue-100">Calculate exact wire size for any load</p>
              </Link>
              
              <Link 
                href="/calculators/voltage-drop-calculator"
                className="bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-colors"
              >
                <h3 className="font-semibold mb-2">Voltage Drop Calculator</h3>
                <p className="text-sm text-blue-100">Check voltage loss over distance</p>
              </Link>
              
              <Link 
                href="/calculators/ampacity-calculator"
                className="bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-colors"
              >
                <h3 className="font-semibold mb-2">Ampacity Calculator</h3>
                <p className="text-sm text-blue-100">Derate wire for temperature & fill</p>
              </Link>
              
              <Link 
                href="/guides/nec-table-310-16"
                className="bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-colors"
              >
                <h3 className="font-semibold mb-2">NEC Table 310.16</h3>
                <p className="text-sm text-blue-100">Complete ampacity reference table</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Standards basis + math behind AWG */}
      <section className="py-12 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">The Math Behind AWG — ASTM B258 and the Geometric Progression</h2>
            <p className="text-gray-600 mb-8">
              AWG is not arbitrary. The numbers in the table above derive
              from a specific geometric progression defined by ASTM B258
              (the Standard Specification for Standard Nominal Diameters
              and Cross-Sectional Areas of AWG Sizes of Solid Round Wires
              Used as Electrical Conductors). Understanding the math lets
              you derive any AWG specification from first principles.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-3">The geometric definition</h3>
                <p className="text-sm text-slate-700 mb-3">
                  AWG is anchored at two endpoints: 0000 (4/0) AWG = 0.4600&Prime;
                  diameter, and 36 AWG = 0.0050&Prime; diameter. The 38 sizes
                  between 4/0 and 36 are spaced in a geometric progression.
                </p>
                <div className="bg-blue-50 rounded p-3 font-mono text-xs space-y-1">
                  <div>Common ratio: r = (0.4600 / 0.0050)<sup>1/39</sup> = 92<sup>1/39</sup> &asymp; 1.1229</div>
                  <div>Diameter formula: d_n = 0.0050 &times; 92<sup>(36-n)/39</sup> inches</div>
                  <div>Each step UP in AWG (e.g., 14 → 12) multiplies diameter by 1.1229</div>
                  <div>Each 6-step jump multiplies diameter by ~2 (a useful approximation)</div>
                  <div>Each 3-step jump multiplies area by ~2</div>
                  <div>Each 10-step jump multiplies resistance by ~10</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-3">Above 4/0 — kcmil takes over</h3>
                <p className="text-sm text-slate-700 mb-3">
                  AWG runs out at 4/0 (0.4600&Prime;). Larger conductors are
                  specified by cross-sectional area in kcmil (thousands of
                  circular mils). 1 circular mil = the area of a circle
                  with diameter 0.001 inch (1 mil).
                </p>
                <div className="bg-blue-50 rounded p-3 font-mono text-xs space-y-1">
                  <div>Area in cmil = (diameter in mils)&sup2;</div>
                  <div>1 kcmil = 1,000 cmil = 0.5067 mm&sup2;</div>
                  <div>Examples:</div>
                  <div>  4/0 AWG &asymp; 211.6 kcmil (107 mm&sup2;)</div>
                  <div>  250 kcmil = 250,000 cmil (127 mm&sup2;)</div>
                  <div>  500 kcmil = 500,000 cmil (253 mm&sup2;)</div>
                  <div>  Older spec uses MCM (Roman M = 1,000); MCM = kcmil</div>
                </div>
              </div>
            </div>

            {/* Metric / SI cross-reference */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">AWG &harr; Metric SI conversion</h3>
            <p className="text-gray-600 mb-4">
              Most of the world uses metric SI sizes (mm&sup2;) instead of
              AWG. Conversion is exact: 1 kcmil = 0.5067 mm&sup2;. The
              table below pairs each AWG size with the closest commercial
              metric SI size, the conversion factor, and a note on whether
              the substitution is safe.
            </p>

            <div className="bg-white rounded-lg shadow-sm border border-blue-200 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">AWG</th>
                      <th className="px-4 py-3 text-center">Exact area (mm&sup2;)</th>
                      <th className="px-4 py-3 text-center">Closest std SI size</th>
                      <th className="px-4 py-3 text-center">SI vs AWG</th>
                      <th className="px-4 py-3 text-left">Substitution note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr><td className="px-4 py-2 font-mono font-bold">14</td><td className="px-4 py-2 text-center">2.08</td><td className="px-4 py-2 text-center">2.5 mm&sup2;</td><td className="px-4 py-2 text-center">SI is +20%</td><td className="px-4 py-2">2.5 mm&sup2; is fine for 14 AWG circuits; common in EU residential.</td></tr>
                    <tr><td className="px-4 py-2 font-mono font-bold">12</td><td className="px-4 py-2 text-center">3.31</td><td className="px-4 py-2 text-center">4 mm&sup2;</td><td className="px-4 py-2 text-center">SI is +21%</td><td className="px-4 py-2">4 mm&sup2; is the EU standard for 20 A circuits.</td></tr>
                    <tr><td className="px-4 py-2 font-mono font-bold">10</td><td className="px-4 py-2 text-center">5.26</td><td className="px-4 py-2 text-center">6 mm&sup2;</td><td className="px-4 py-2 text-center">SI is +14%</td><td className="px-4 py-2">6 mm&sup2; substitutes safely; common for EU dryers.</td></tr>
                    <tr><td className="px-4 py-2 font-mono font-bold">8</td><td className="px-4 py-2 text-center">8.37</td><td className="px-4 py-2 text-center">10 mm&sup2;</td><td className="px-4 py-2 text-center">SI is +20%</td><td className="px-4 py-2">10 mm&sup2; for cookers, water heaters in EU.</td></tr>
                    <tr><td className="px-4 py-2 font-mono font-bold">6</td><td className="px-4 py-2 text-center">13.30</td><td className="px-4 py-2 text-center">16 mm&sup2;</td><td className="px-4 py-2 text-center">SI is +20%</td><td className="px-4 py-2">16 mm&sup2; for sub-mains in EU dwellings.</td></tr>
                    <tr><td className="px-4 py-2 font-mono font-bold">4</td><td className="px-4 py-2 text-center">21.15</td><td className="px-4 py-2 text-center">25 mm&sup2;</td><td className="px-4 py-2 text-center">SI is +18%</td><td className="px-4 py-2">25 mm&sup2; for service-entrance / submains.</td></tr>
                    <tr><td className="px-4 py-2 font-mono font-bold">2</td><td className="px-4 py-2 text-center">33.62</td><td className="px-4 py-2 text-center">35 mm&sup2;</td><td className="px-4 py-2 text-center">SI is +4%</td><td className="px-4 py-2">35 mm&sup2; is closest match — same ampacity tier.</td></tr>
                    <tr><td className="px-4 py-2 font-mono font-bold">1/0</td><td className="px-4 py-2 text-center">53.49</td><td className="px-4 py-2 text-center">50 mm&sup2;</td><td className="px-4 py-2 text-center">SI is &minus;6%</td><td className="px-4 py-2">50 mm&sup2; is slightly smaller — verify ampacity.</td></tr>
                    <tr><td className="px-4 py-2 font-mono font-bold">2/0</td><td className="px-4 py-2 text-center">67.43</td><td className="px-4 py-2 text-center">70 mm&sup2;</td><td className="px-4 py-2 text-center">SI is +4%</td><td className="px-4 py-2">70 mm&sup2; matches.</td></tr>
                    <tr><td className="px-4 py-2 font-mono font-bold">4/0</td><td className="px-4 py-2 text-center">107.2</td><td className="px-4 py-2 text-center">120 mm&sup2;</td><td className="px-4 py-2 text-center">SI is +12%</td><td className="px-4 py-2">120 mm&sup2; is the standard SI replacement for 4/0.</td></tr>
                    <tr><td className="px-4 py-2 font-mono font-bold">250 kcmil</td><td className="px-4 py-2 text-center">126.7</td><td className="px-4 py-2 text-center">150 mm&sup2;</td><td className="px-4 py-2 text-center">SI is +18%</td><td className="px-4 py-2">150 mm&sup2; runs cooler — preferred where available.</td></tr>
                    <tr><td className="px-4 py-2 font-mono font-bold">500 kcmil</td><td className="px-4 py-2 text-center">253.4</td><td className="px-4 py-2 text-center">240 mm&sup2;</td><td className="px-4 py-2 text-center">SI is &minus;5%</td><td className="px-4 py-2">240 mm&sup2; is the closest standard size.</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-amber-50 border-t border-amber-200 px-4 py-3 text-xs text-amber-900">
                <strong>Note:</strong> NEC 310.16 ampacities are defined for AWG / kcmil
                conductors. When substituting metric SI conductors in NEC-jurisdiction work,
                verify the actual cross-sectional area meets or exceeds the AWG it replaces.
                IEC 60364 ampacity tables differ in derating philosophy from NEC.
              </div>
            </div>

            {/* Stranded vs Solid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-3">Stranded vs solid — when each is required</h3>
                <p className="text-sm text-slate-700 mb-3">
                  All AWG diameters in the table above are for SOLID
                  conductor. Stranded conductors of the same AWG have a
                  slightly larger overall diameter (typically 8&ndash;15 %
                  larger) because of the gaps between strands.
                </p>
                <ul className="text-sm space-y-2 text-slate-700">
                  <li><strong>Solid:</strong> required for fixed wiring 14&ndash;10 AWG (NEC 334.10 NM-B cable). Cheaper, easier to terminate under screw lugs.</li>
                  <li><strong>Stranded:</strong> required above 8 AWG (too stiff to bend). Required by Class B / Class C strand counts in NEC Chapter 9 Table 10. Necessary for control wiring, vibration applications.</li>
                  <li><strong>Class B (typical building):</strong> 7 strands at small AWG, 19 strands above 1/0.</li>
                  <li><strong>Class C / D / K (flexible):</strong> finer stranding for control cable, welding cable, portable cord.</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-3">Insulation type — pick by environment</h3>
                <p className="text-sm text-slate-700 mb-3">
                  Two conductors of identical AWG can have very different
                  ampacities depending on insulation rating. NEC 310.16
                  organizes by insulation temperature class:
                </p>
                <ul className="text-sm space-y-1 text-slate-700">
                  <li><strong>60&deg;C (TW, UF):</strong> direct burial, wet locations, older NM. Lowest ampacity.</li>
                  <li><strong>75&deg;C (THW, THWN, RHW, USE, XHHW wet, NM-B at conductor):</strong> general-purpose; most common termination rating.</li>
                  <li><strong>90&deg;C (THHN, XHHW-2 dry, RHH, USE-2):</strong> highest ampacity in conduit. NM-B cable insulation is 90&deg;C but ampacity is capped at 60&deg;C column per NEC 334.80.</li>
                </ul>
                <p className="text-xs text-slate-600 mt-3">
                  <strong>Key:</strong> the entire circuit&rsquo;s ampacity
                  is limited by the lowest-rated component. Most breakers and
                  panels in residential service are rated 75&deg;C, so even
                  if you use 90&deg;C THHN conductor, you must use the 75&deg;C
                  ampacity column — NEC 110.14(C).
                </p>
              </div>
            </div>

            {/* Real-world ampacity walk-through */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200 mb-8">
              <h3 className="text-lg font-bold text-blue-900 mb-3">Worked derivation — why 12 AWG is rated 25 A at 75&deg;C</h3>
              <p className="text-sm text-slate-700 mb-3">
                The ampacity values in NEC 310.16 are not arbitrary. They
                derive from a heat-balance equation between I&sup2;R losses
                in the conductor and convective + radiative cooling at the
                conductor surface, normalized to the insulation&rsquo;s rated
                operating temperature with 30&deg;C ambient.
              </p>
              <div className="bg-blue-50 rounded p-4 font-mono text-xs space-y-1">
                <div>12 AWG copper: diameter = 2.05 mm, surface area per ft = 0.0808&Prime; &times; &pi; &times; 12 = 3.05 in&sup2;</div>
                <div>R<sub>20&deg;C</sub> = 1.588 &Omega;/1000 ft (NEC Chapter 9 Table 8)</div>
                <div>R<sub>75&deg;C</sub> = R<sub>20&deg;C</sub> &times; (1 + 0.00393 &times; 55) = 1.588 &times; 1.216 = <strong>1.93 &Omega;/1000 ft</strong></div>
                <div>At 25 A, I&sup2;R loss = 25&sup2; &times; 1.93 / 1000 = 1.21 W/ft</div>
                <div>This power dissipation corresponds to a 45&deg;C rise above ambient (with 75&deg;C insulation, 30&deg;C ambient → 75&deg;C operating).</div>
                <div>Push to 30 A: I&sup2;R = 30&sup2; &times; 1.93 / 1000 = 1.74 W/ft → 65&deg;C rise → exceeds 75&deg;C insulation rating</div>
                <div>Hence 12 AWG @ 75&deg;C ampacity is exactly 25 A.</div>
              </div>
            </div>

            {/* Wire ampacity vs OCPD distinction */}
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
              <h3 className="text-lg font-bold text-amber-900 mb-3">Why 12 AWG ampacity is 25 A but the breaker can&rsquo;t exceed 20 A</h3>
              <p className="text-sm text-slate-700 mb-2">
                NEC 240.4(D) is the &ldquo;small-conductor rule&rdquo;: regardless of higher 310.16 ampacity, the OCPD on 14, 12, 10 AWG copper is capped:
              </p>
              <ul className="text-sm space-y-1 text-slate-700">
                <li><strong>14 AWG:</strong> ampacity 20 A (75&deg;C), OCPD max <strong>15 A</strong></li>
                <li><strong>12 AWG:</strong> ampacity 25 A (75&deg;C), OCPD max <strong>20 A</strong></li>
                <li><strong>10 AWG:</strong> ampacity 35 A (75&deg;C), OCPD max <strong>30 A</strong></li>
              </ul>
              <p className="text-sm text-slate-700 mt-3">
                <strong>Why the discrepancy?</strong> Small conductors are
                disproportionately sensitive to mechanical damage, poor
                terminations, and accumulated dust. The 240.4(D) cap creates
                a safety margin that 8 AWG and larger conductors don&rsquo;t
                need. There are five exceptions (motor circuits, taps,
                listed equipment, Air-conditioning per Article 440,
                fire alarm per Article 760) but they&rsquo;re narrow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ArticleSchema article={articleData} />
      <DatasetSchema
        path="/guides/awg-wire-size-chart"
        name="AWG Wire Size Chart — Diameter, Cross-Section, Resistance, Ampacity"
        alternateName={['American Wire Gauge Reference', 'AWG to mm² Conversion Chart']}
        description="Comprehensive AWG (American Wire Gauge) reference table from 18 AWG through 4/0 AWG. Per-row data: conductor diameter (mils, mm, inch), cross-sectional area (kcmil, mm²), DC resistance per 1000 ft at 20°C, and NEC 310.16 ampacity at 75°C for both copper and aluminum."
        variableMeasured={[
          { name: 'AWG size', description: 'American Wire Gauge designation per ASTM B258' },
          { name: 'Conductor diameter (metric)', description: 'Bare conductor outside diameter', unitText: 'millimeter', unitCode: 'MMT' },
          { name: 'Conductor diameter (imperial)', description: 'Bare conductor outside diameter', unitText: 'inch', unitCode: 'INH' },
          { name: 'Cross-sectional area', description: 'Conductor cross-sectional area', unitText: 'square millimeter', unitCode: 'MMK' },
          { name: 'DC resistance at 20°C', description: 'Direct-current resistance of uncoated copper conductor', unitText: 'ohm per 1000 foot' },
          { name: 'Copper ampacity at 75°C', description: 'Allowable ampacity per NEC 310.16, copper conductor, 75°C insulation rating', unitText: 'ampere', unitCode: 'AMP' },
          { name: 'Aluminum ampacity at 75°C', description: 'Allowable ampacity per NEC 310.16, aluminum conductor, 75°C insulation rating', unitText: 'ampere', unitCode: 'AMP' },
        ]}
        keywords={['AWG chart', 'American Wire Gauge', 'wire size chart', 'AWG to mm2', 'wire diameter', 'wire resistance', 'wire ampacity', 'NEC 310.16']}
        citation="NFPA 70 (NEC) 2023 Article 310 Table 310.16; ASTM B258 — Standard Specification for Standard Nominal Diameters and Cross-Sectional Areas of AWG Sizes; NEC Chapter 9 Tables 8 and 9"
        spatialCoverage="United States"
        datePublished={articleData.datePublished}
        dateModified={articleData.dateModified}
      />
    </div>
  );
}