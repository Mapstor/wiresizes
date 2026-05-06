import type { Metadata } from 'next';
import GuideClient from './GuideClient';
import { getArticleDates } from '@/lib/article-dates';
import { HowToSchema } from '@/components/seo/HowToSchema';

export const metadata: Metadata = {
  title: 'Electrical Safety — Arc Flash, PPE, OSHA',
  description: 'Electrical safety: arc flash boundaries, incident energy, NFPA 70E PPE categories, OSHA 1910.147 lockout/tagout, voltage verification.',
  keywords: 'electrical safety, arc flash safety, NFPA 70E, PPE categories, OSHA electrical, lockout tagout, incident energy, electrical hazards',
  alternates: { canonical: '/guides/electrical-safety' },
};

const HOWTO_LOTO_STEPS = [
  {
    name: 'Notify all affected employees of the impending shutdown',
    text: 'Inform every worker who operates or works near the equipment before any energy isolation begins. OSHA 29 CFR 1910.147(c)(9) requires this. Document who was notified and at what time.',
  },
  {
    name: 'Identify all energy sources connected to the equipment',
    text: 'Electrical is rarely the only source. Look for hydraulic, pneumatic, mechanical (springs, gravity), thermal (steam, heated fluid), and chemical (process gases). Each source needs its own isolation. Use single-line diagrams and equipment manuals.',
  },
  {
    name: 'Shut down equipment using the normal stopping procedure',
    text: 'Press the stop button or use the standard control sequence. Do not skip to disconnecting energy — controlled shutdown protects the equipment and prevents stored-energy hazards from sudden de-energization.',
  },
  {
    name: 'Isolate every energy source at its disconnecting means',
    text: 'For electrical: open the disconnect switch or rack out the breaker (not just push the off button on the equipment). For pneumatic / hydraulic: close the supply valve and bleed downstream pressure. Each source isolated separately.',
  },
  {
    name: 'Apply lockout devices and your personal lock to every isolation point',
    text: 'Each authorized employee places their own personally assigned lock on each isolation device using a lockout hasp if multiple workers are involved (group lockout). Tags alone are insufficient when locks can be applied. Per OSHA 1910.147(c)(5)(ii), tags are a backup, not a primary control.',
  },
  {
    name: 'Release or restrain any stored energy',
    text: 'Capacitors must be discharged with grounding sticks. Springs must be unloaded or blocked. Suspended loads must be lowered or supported. Pressurized fluid lines must be vented to atmosphere. Verify zero stored energy before proceeding.',
  },
  {
    name: 'Verify isolation by attempting to start the equipment',
    text: 'Press the normal start button. The equipment must NOT energize. For electrical, also use a properly rated voltage tester per NFPA 70E to confirm de-energization at the work points (test the meter on a known live source, then on the dead circuit, then back on the live source — three-step verification).',
  },
  {
    name: 'Perform the work while the lockout remains in place continuously',
    text: 'Locks stay on for the duration of the task. Do not remove a lock to "quickly check" something. If a shift change occurs, the outgoing worker keeps their lock on until the incoming worker has applied theirs (continuity of protection).',
  },
  {
    name: 'Before re-energizing: inspect the work area and remove tools',
    text: 'Confirm all tools, jumpers, and temporary grounds are removed. Verify all guards are reinstalled and fasteners torqued. Account for every worker — no one inside the equipment.',
  },
  {
    name: 'Remove personal locks and re-energize',
    text: 'Each worker removes their own lock — never another worker’s, even if absent (OSHA 1910.147(e)(3) has a strict exception process for absent workers). Restore energy in reverse order of isolation. Notify affected employees that the equipment is back in service.',
  },
];

export default function ElectricalSafetyPage() {
  return (
    <>
      <HowToSchema
        path="/guides/electrical-safety"
        name="How to Perform Electrical Lockout / Tagout (LOTO) per OSHA 1910.147"
        description="Ten-step OSHA-compliant lockout/tagout procedure for de-energizing electrical equipment before service or maintenance. Aligns with OSHA 29 CFR 1910.147 and NFPA 70E voltage-verification practices."
        totalTime="PT15M"
        steps={HOWTO_LOTO_STEPS}
      />
      <GuideClient {...getArticleDates('src/app/guides/electrical-safety/GuideClient.tsx')} />
    </>
  );
}
