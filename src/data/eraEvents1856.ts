import type { EraEvent } from '../types';
import { uid } from '../rng';

export function buildEraEventsForYear(year: number): EraEvent[] {
  const out: EraEvent[] = [];
  if (year >= 1856 && year <= 1858) {
    out.push({
      id: uid('era'),
      year: 1856,
      title: 'Bleeding Kansas',
      description: 'Pro- and anti-slavery factions are at war over the Kansas Territory. Federal authority is needed to restore order.',
      decider: 'president',
      responses: [
        {
          id: 'r1', label: 'Send Federal Troops', description: 'Restore order with the U.S. Army. Risks alienating both sides.',
          effect: { text: 'Order is restored, but bitterness deepens.', meters: { domestic: -1, military: 0 }, partyPreference: -0.3, enthusiasm: [{ ideology: 'LW Populist', party: 'RED', delta: 1 }, { ideology: 'Traditionalist', party: 'BLUE', delta: -1 }], interestGroups: [{ id: 'LawAndOrder', delta: 2 }] },
        },
        {
          id: 'r2', label: 'Let Popular Sovereignty Decide', description: 'Stand back. Let Kansas settlers decide their own fate.',
          effect: { text: 'The territory remains in chaos. The pro-slavery faction takes initiative.', meters: { domestic: -2 }, partyPreference: -0.5, enthusiasm: [{ ideology: 'Conservative', party: 'BLUE', delta: 1 }, { ideology: 'Liberal', party: 'RED', delta: 2 }, { ideology: 'Progressive', party: 'RED', delta: 2 }], interestGroups: [{ id: 'Settlers', delta: 1 }, { id: 'Abolitionists', delta: -2 }] },
        },
        {
          id: 'r3', label: 'Support Free-State Settlers', description: 'Lend federal weight to the anti-slavery faction.',
          effect: { text: 'Free-staters gain ground. Southern states are furious.', meters: { domestic: -3 }, partyPreference: 0.6, enthusiasm: [{ ideology: 'LW Populist', party: 'RED', delta: 2 }, { ideology: 'Liberal', party: 'RED', delta: 1 }, { ideology: 'Traditionalist', party: 'BLUE', delta: -2 }], interestGroups: [{ id: 'Abolitionists', delta: 3 }, { id: 'Planters', delta: -3 }] },
        },
      ],
    });
  }

  if (year >= 1856 && year <= 1858) {
    out.push({
      id: uid('era'),
      year: 1857,
      title: 'Dred Scott Decision',
      description: 'The Supreme Court has ruled that African Americans cannot be citizens and that Congress cannot prohibit slavery in territories. The nation reels.',
      decider: 'cabinet',
      responses: [
        {
          id: 'r1', label: 'Endorse the Ruling', description: 'Stand behind the Court.',
          effect: { text: 'The South cheers. The North seethes.', partyPreference: -0.4, meters: { domestic: -1 }, enthusiasm: [{ ideology: 'Traditionalist', party: 'BLUE', delta: 2 }, { ideology: 'Conservative', party: 'BLUE', delta: 1 }, { ideology: 'Liberal', party: 'RED', delta: 2 }, { ideology: 'Progressive', party: 'RED', delta: 2 }, { ideology: 'LW Populist', party: 'RED', delta: 3 }], interestGroups: [{ id: 'Planters', delta: 3 }, { id: 'Abolitionists', delta: -2 }] },
        },
        {
          id: 'r2', label: 'Express Concerns But Comply', description: 'A measured response.',
          effect: { text: 'A measured response satisfies few.', meters: { domestic: -1 }, partyPreference: -0.1, enthusiasm: [{ ideology: 'Moderate', party: 'BLUE', delta: 0 }] },
        },
        {
          id: 'r3', label: 'Quietly Resist', description: 'Encourage states to find ways to limit the ruling.',
          effect: { text: 'Northern states announce defiance. Southern fury grows.', meters: { domestic: -2 }, partyPreference: 0.3, enthusiasm: [{ ideology: 'LW Populist', party: 'RED', delta: 2 }, { ideology: 'Traditionalist', party: 'BLUE', delta: -2 }], interestGroups: [{ id: 'Abolitionists', delta: 2 }, { id: 'Planters', delta: -3 }] },
        },
      ],
    });
  }

  if (year >= 1856 && year <= 1858) {
    out.push({
      id: uid('era'),
      year: 1857,
      title: 'Panic of 1857',
      description: 'A financial crisis triggered by the failure of the Ohio Life Insurance and Trust Company has spread to banks across the North. Unemployment is rising.',
      decider: 'president',
      responses: [
        {
          id: 'r1', label: 'Federal Aid to Banks', description: 'Provide emergency funds to stabilize the financial system.',
          effect: { text: 'Some banks survive but the deficit grows.', meters: { economic: 1, revenue: -2 }, interestGroups: [{ id: 'WallStreet', delta: 2 }, { id: 'Workers', delta: -1 }] },
        },
        {
          id: 'r2', label: 'Free Market Recovery', description: 'Let the banks fail. The market will recover.',
          effect: { text: 'Hundreds of banks collapse. Unemployment soars.', meters: { economic: -2, quality: -1 }, interestGroups: [{ id: 'Workers', delta: -2 }, { id: 'WallStreet', delta: -1 }] },
        },
        {
          id: 'r3', label: 'Public Works Program', description: 'Direct federal funds to infrastructure.',
          effect: { text: 'Construction projects employ thousands. The Treasury strains.', meters: { economic: 0, quality: 1, revenue: -3 }, interestGroups: [{ id: 'Workers', delta: 2 }, { id: 'Manufacturers', delta: 1 }] },
        },
      ],
    });
  }

  if (year >= 1858 && year <= 1860) {
    out.push({
      id: uid('era'),
      year: 1859,
      title: "John Brown's Raid on Harpers Ferry",
      description: "The abolitionist John Brown has led an armed raid on the federal arsenal at Harpers Ferry, Virginia, hoping to spark a slave uprising. He has been captured.",
      decider: 'president',
      responses: [
        {
          id: 'r1', label: 'Execute Brown Swiftly', description: 'Make an example of him.',
          effect: { text: 'Brown becomes a martyr in the North.', meters: { domestic: -2 }, partyPreference: 0.3, enthusiasm: [{ ideology: 'LW Populist', party: 'RED', delta: 3 }, { ideology: 'Liberal', party: 'RED', delta: 2 }, { ideology: 'Traditionalist', party: 'BLUE', delta: 2 }], interestGroups: [{ id: 'Abolitionists', delta: 4 }, { id: 'Planters', delta: 2 }] },
        },
        {
          id: 'r2', label: 'Treat as Common Criminal', description: 'A standard trial, no spectacle.',
          effect: { text: 'A quieter resolution, though the nation still trembles.', meters: { domestic: -1 }, partyPreference: 0.1 },
        },
        {
          id: 'r3', label: 'Use as Pretext to Crack Down on Abolitionists', description: 'Investigate his Northern backers.',
          effect: { text: 'Northern outrage flares. Abolitionists go underground but multiply.', meters: { domestic: -3, honest: -1 }, partyPreference: 0.5, enthusiasm: [{ ideology: 'LW Populist', party: 'RED', delta: 3 }, { ideology: 'Progressive', party: 'RED', delta: 2 }], interestGroups: [{ id: 'Abolitionists', delta: 5 }, { id: 'CivilRights', delta: 3 }] },
        },
      ],
    });
  }

  if (year >= 1860) {
    out.push({
      id: uid('era'),
      year: 1860,
      title: 'Southern Secession Threat',
      description: 'Multiple Southern states have declared they will secede from the Union if a Republican is elected. South Carolina is moving first.',
      decider: 'president',
      responses: [
        {
          id: 'r1', label: 'Mobilize the Military', description: 'Reinforce federal forts. Prepare for conflict.',
          effect: { text: 'War seems inevitable. Both sides arm.', meters: { military: 2, domestic: -3 }, partyPreference: 0, enthusiasm: [{ ideology: 'LW Populist', party: 'RED', delta: 1 }], startWar: { name: 'American Civil War', against: 'Confederate States' } },
        },
        {
          id: 'r2', label: 'Seek Compromise', description: 'A new Missouri Compromise. Concessions to the South.',
          effect: { text: 'Talks drag on but the Union holds for now.', meters: { domestic: -1 }, partyPreference: -0.3, enthusiasm: [{ ideology: 'LW Populist', party: 'RED', delta: -1 }, { ideology: 'Conservative', party: 'BLUE', delta: 1 }] },
        },
        {
          id: 'r3', label: 'Let Them Go', description: 'A peaceful separation.',
          effect: { text: 'The Confederate States of America is born without bloodshed. For now.', meters: { domestic: -2, military: -1 }, partyPreference: -1, enthusiasm: [{ ideology: 'LW Populist', party: 'RED', delta: -3 }, { ideology: 'Traditionalist', party: 'BLUE', delta: 3 }], interestGroups: [{ id: 'Abolitionists', delta: -3 }, { id: 'Planters', delta: 4 }] },
        },
      ],
    });
  }
  return out;
}
