import { Metadata } from 'next';
import { Table, Gauge, Calculator, Info, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { DatasetSchema } from '@/components/seo/DatasetSchema';
import { getArticleDates } from '@/lib/article-dates';
import awgData from '../../../../data/verified/awg.json';
import { diameterMm, sizeKeyFromAwgName, tableAmpacity } from '@/lib/calculations/sizes';
import { maxOcpd240_4D } from '@/lib/calculations/ampacity';
import table31016 from '../../../../data/verified/nec-310-16.json';

// 18 AWG to 4/0 AWG: diameters, areas and 20 °C resistance from data/verified/awg.json (NIST Handbook 100,
// Table 5, solid annealed copper); ampacities from the 75 °C columns of data/verified/nec-310-16.json.
const CHART_AWG_NAMES = ['18', '16', '14', '12', '10', '8', '6', '4', '3', '2', '1', '0', '00', '000', '0000'];
const AWG_CHART_ROWS = CHART_AWG_NAMES.map((name) => {
  const row = awgData.awg.find((r) => r.awg === name);
  if (!row) throw new Error(`awg.json has no ${name} AWG row`);
  const size = sizeKeyFromAwgName(name);
  const copperLimit = maxOcpd240_4D(size, 'Cu');
  const aluminumLimit = maxOcpd240_4D(size, 'Al');
  return {
    awg: size,
    diameter_mm: row.diameter_mm,
    diameter_in: row.diameter_in,
    area_mm2: row.area_mm2,
    resistance_20c: row.r20_cu_ohm_per_1000ft,
    copper_75c: tableAmpacity(size, 'Cu', 75),
    aluminum_75c: tableAmpacity(size, 'Al', 75),
    // NEC 240.4(D) rows without conditions: 14, 12 and 10 AWG copper, 12 and 10 AWG aluminum
    copperLimited: copperLimit !== null && copperLimit.conditions === null,
    aluminumLimited: aluminumLimit !== null && aluminumLimit.conditions === null,
  };
});

const OCPD_LIMIT_NOTE = `Limited by NEC 240.4(D) small conductor rule. Copper: ${['14', '12', '10']
  .map((size) => `${size} AWG max ${maxOcpd240_4D(size, 'Cu')?.max_ocpd_a} A`)
  .join(', ')} protection. Aluminum: ${['12', '10']
  .map((size) => `${size} AWG max ${maxOcpd240_4D(size, 'Al')?.max_ocpd_a} A`)
  .join(', ')} protection.`;

// AWG to mm² with the nearest IEC 60228 size, from data/verified/awg.json
const METRIC_ROWS = ['14', '12', '10', '8', '6', '4', '2', '0'].map((name) => {
  const row = awgData.awg.find((r) => r.awg === name);
  if (!row) throw new Error(`awg.json has no ${name} AWG row`);
  return { awg: `${sizeKeyFromAwgName(name)} AWG`, area_mm2: row.area_mm2, nearest_mm2: row.iec60228_nearest_mm2 };
});

const INSULATION_TYPES = table31016.columns_types;

const TITLE = 'AWG Wire Size Chart — Diameter & Ampacity';
const DESCRIPTION = 'AWG chart from 18 AWG to 4/0: diameter in mm and inches, area in mm², copper resistance at 20 °C and NEC Table 310.16 ampacity at 75 °C.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: 'AWG chart, wire size chart, American wire gauge, wire diameter table, AWG to mm conversion, wire resistance table, copper wire sizes, aluminum wire sizes, electrical wire chart',
  alternates: { canonical: '/guides/awg-wire-size-chart' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'WireSizes.com',
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://wiresizes.com/guides/awg-wire-size-chart',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/twitter-image'],
  },
};

// Article data for schema
const articleData = {
  headline: "AWG Wire Size Chart & Reference Guide",
  description: DESCRIPTION,
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
              AWG Wire Size Chart & Reference Guide
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              American Wire Gauge (AWG) reference table with diameters, resistance, ampacity and the nearest metric sizes, 18 AWG to 4/0.
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
                    <li>• Diameter: {diameterMm('14')?.toFixed(3)} mm</li>
                    <li>• 15 A circuits</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">12 AWG</h3>
                  <ul className="text-sm space-y-1 text-green-700">
                    <li>• Diameter: {diameterMm('12')?.toFixed(3)} mm</li>
                    <li>• 20 A circuits</li>
                  </ul>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-900 mb-2">10 AWG</h3>
                  <ul className="text-sm space-y-1 text-amber-700">
                    <li>• Diameter: {diameterMm('10')?.toFixed(3)} mm</li>
                    <li>• 30 A circuits</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">6 AWG</h3>
                  <ul className="text-sm space-y-1 text-purple-700">
                    <li>• Diameter: {diameterMm('6')?.toFixed(3)} mm</li>
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
              AWG Wire Size Table
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
                      <th className="px-4 py-3 text-center">Ω/1000 ft, solid annealed copper, 20 °C (NIST Handbook 100)</th>
                      <th className="px-4 py-3 text-center">Cu Ampacity 75 °C</th>
                      <th className="px-4 py-3 text-center">Al Ampacity 75 °C</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {AWG_CHART_ROWS.map((row) => {
                      const cuLabel = row.copper_75c !== null ? `${row.copper_75c}${row.copperLimited ? '*' : ''}` : '—';
                      const alLabel = row.aluminum_75c !== null ? `${row.aluminum_75c}${row.aluminumLimited ? '*' : ''}` : '—';
                      const rowClass = row.copperLimited || row.aluminumLimited ? 'hover:bg-blue-50 bg-yellow-50' : 'hover:bg-blue-50';
                      return (
                        <tr key={row.awg} className={rowClass}>
                          <td className="px-4 py-3 font-mono font-bold">{row.awg}</td>
                          <td className="px-4 py-3 text-center">{row.diameter_mm.toFixed(3)}</td>
                          <td className="px-4 py-3 text-center">{row.diameter_in.toFixed(4)}</td>
                          <td className="px-4 py-3 text-center">{row.area_mm2}</td>
                          <td className="px-4 py-3 text-center">{row.resistance_20c}</td>
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
                  <strong>*</strong> {OCPD_LIMIT_NOTE}
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
                      {METRIC_ROWS.map((row) => (
                        <tr key={row.awg}>
                          <td className="py-2 font-mono">{row.awg}</td>
                          <td className="py-2 text-center">{row.area_mm2}</td>
                          <td className="py-2 text-center">{row.nearest_mm2} mm²</td>
                        </tr>
                      ))}
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
                <p className="text-sm text-blue-100">Calculate the wire size for your load</p>
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

            {/* Stranded vs Solid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-3">Stranded vs solid</h3>
                <p className="text-sm text-slate-700 mb-3">
                  All AWG diameters in the table above are for SOLID
                  conductor.
                </p>
                <ul className="text-sm space-y-2 text-slate-700">
                  <li><strong>Stranded:</strong> in raceways, 8 AWG and larger shall be stranded unless permitted or required elsewhere to be solid (2023 NEC 310.3(C)).</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-3">Insulation type</h3>
                <p className="text-sm text-slate-700 mb-3">
                  Two conductors of identical AWG can have very different
                  ampacities depending on insulation rating. NEC 310.16
                  organizes by insulation temperature class:
                </p>
                <ul className="text-sm space-y-1 text-slate-700">
                  <li><strong>60 &deg;C:</strong> {INSULATION_TYPES.cu_60}</li>
                  <li><strong>75 &deg;C:</strong> {INSULATION_TYPES.cu_75}</li>
                  <li><strong>90 &deg;C:</strong> {INSULATION_TYPES.cu_90}</li>
                </ul>
              </div>
            </div>

            {/* Wire ampacity vs OCPD distinction */}
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
              <h3 className="text-lg font-bold text-amber-900 mb-3">Why 12 AWG ampacity is 25 A (75 &deg;C column) but the breaker can&rsquo;t exceed 20 A</h3>
              <p className="text-sm text-slate-700 mb-2">
                NEC 240.4(D) is the &ldquo;small-conductor rule&rdquo;: regardless of higher 310.16 ampacity, the OCPD on 14, 12, 10 AWG copper is capped:
              </p>
              <ul className="text-sm space-y-1 text-slate-700">
                <li><strong>14 AWG:</strong> ampacity 20 A (75 &deg;C), OCPD max <strong>15 A</strong></li>
                <li><strong>12 AWG:</strong> ampacity 25 A (75 &deg;C), OCPD max <strong>20 A</strong></li>
                <li><strong>10 AWG:</strong> ampacity 35 A (75 &deg;C), OCPD max <strong>30 A</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ArticleSchema article={articleData} />
      <DatasetSchema
        path="/guides/awg-wire-size-chart"
        name="AWG Wire Size Chart — Diameter, Cross-Section, Resistance, Ampacity"
        alternateName={['American Wire Gauge Reference', 'AWG to mm² Conversion Chart']}
        description="AWG (American Wire Gauge) reference table from 18 AWG through 4/0 AWG. Per-row data: conductor diameter (mm, inch), cross-sectional area (mm²), DC resistance per 1000 ft at 20 °C, and NEC 310.16 ampacity at 75 °C for both copper and aluminum."
        variableMeasured={[
          { name: 'AWG size', description: 'American Wire Gauge designation per ASTM B258' },
          { name: 'Conductor diameter (metric)', description: 'Bare conductor outside diameter', unitText: 'millimeter', unitCode: 'MMT' },
          { name: 'Conductor diameter (imperial)', description: 'Bare conductor outside diameter', unitText: 'inch', unitCode: 'INH' },
          { name: 'Cross-sectional area', description: 'Conductor cross-sectional area', unitText: 'square millimeter', unitCode: 'MMK' },
          { name: 'DC resistance at 20 °C', description: 'Direct-current resistance of uncoated copper conductor', unitText: 'ohm per 1000 foot' },
          { name: 'Copper ampacity at 75 °C', description: 'Allowable ampacity per NEC 310.16, copper conductor, 75 °C insulation rating', unitText: 'ampere', unitCode: 'AMP' },
          { name: 'Aluminum ampacity at 75 °C', description: 'Allowable ampacity per NEC 310.16, aluminum conductor, 75 °C insulation rating', unitText: 'ampere', unitCode: 'AMP' },
        ]}
        keywords={['AWG chart', 'American Wire Gauge', 'wire size chart', 'AWG to mm2', 'wire diameter', 'wire resistance', 'wire ampacity', 'NEC 310.16']}
        citation="NFPA 70 (NEC) 2023 Article 310 Table 310.16; ASTM B258 — Standard Specification for Standard Nominal Diameters and Cross-Sectional Areas of AWG Sizes; NIST (NBS) Handbook 100, Copper Wire Tables, Table 5"
        spatialCoverage="United States"
        datePublished={articleData.datePublished}
        dateModified={articleData.dateModified}
      />
    </div>
  );
}