#!/usr/bin/env node
// Curated seed dataset -> politicians-dataset.csv
//
// Authoring source of truth for the bundled standard draft classes. Each row
// has an accurate birthYear; draftYear is COMPUTED as the draft year (multiple
// of 4) nearest the person's 25th birthday, clamped to >= 1772 (the earliest
// scenario / the 1772 inaugural draft) so the founding generation enters at
// game start.
//
// Columns written: draftYear,firstName,lastName,state,ideology,birthYear,age,
//   admin,legislative,judicial,military,governing,backroom,command,traits,
//   party,wikiUrl   (party + wikiUrl are review-only; the in-app importer
//   ignores unknown columns.)
//
// Usage: node scripts/seedDataset.mjs   (then run csvToDefaults.mjs on output)

import { writeFileSync } from 'node:fs';

const FLOOR = 1772; // earliest draft (1772 inaugural)
const draftYearFor = (birth) => {
  const y = Math.round((birth + 25) / 4) * 4;
  return Math.max(FLOOR, y);
};
const wiki = (first, last) =>
  'https://en.wikipedia.org/wiki/' +
  encodeURIComponent((first + ' ' + last).replace(/\s+/g, '_'));

// [first,last,state,ideology,birthYear,[adm,leg,jud,mil,gov,bck],command,[traits],party]
const ROWS = [
  // ===== 1772 scenario in-game roster (founding generation) =====
  ['Samuel','Adams','ma','LW Populist',1722,[2,3,1,0,2,4],1,['Orator'],'BLUE'],
  ['Thomas','Jefferson','va','RW Populist',1743,[3,4,2,0,2,2],1,['Egghead'],'BLUE'],
  ['Patrick','Henry','va','Traditionalist',1736,[1,4,2,1,3,3],1,['Orator','Debater'],'BLUE'],
  ['John','Hancock','ma','Moderate',1737,[3,2,1,0,3,3],1,['Celebrity'],'BLUE'],
  ['George','Clinton','ny','Moderate',1739,[2,3,1,1,3,3],0,[],'BLUE'],
  ['Richard Henry','Lee','va','Conservative',1732,[2,4,2,0,2,3],0,['Debater'],'BLUE'],
  ['John','Dickinson','de','Conservative',1732,[3,4,3,0,2,2],0,['Egghead'],'BLUE'],
  ['Thomas','Paine','pa','Progressive',1737,[1,2,0,0,0,1],0,['Propagandist','Obscure'],'BLUE'],
  ['Elias','Boudinot','nj','Progressive',1740,[2,2,2,0,1,2],0,[],'BLUE'],
  ['George','Mason','va','Traditionalist',1725,[2,3,2,0,2,3],0,[],'BLUE'],
  ['Francis','Marion','sc','Traditionalist',1732,[0,0,0,4,0,1],0,['Military'],'BLUE'],
  ['Ethan','Allen','nh','Moderate',1738,[0,0,0,3,0,2],0,['Celebrity'],'BLUE'],
  ['Horatio','Gates','va','Moderate',1727,[1,0,0,3,0,1],0,['Military'],'BLUE'],
  ['Daniel','Boone','nc','Traditionalist',1734,[0,0,0,2,0,0],0,['Celebrity'],'BLUE'],
  ['Elbridge','Gerry','ma','Moderate',1744,[2,2,1,0,1,3],0,['Manipulative'],'BLUE'],
  ['George','Washington','va','Moderate',1732,[2,1,0,4,2,2],1,['Leadership'],'RED'],
  ['John','Adams','ma','Moderate',1735,[3,3,3,0,2,2],1,['Egghead','Debater'],'RED'],
  ['Benjamin','Franklin','pa','Moderate',1706,[4,3,1,0,2,4],1,['Celebrity','Egghead'],'RED'],
  ['John','Jay','ny','Moderate',1745,[3,3,3,0,2,3],0,[],'RED'],
  ['Henry','Laurens','sc','Traditionalist',1724,[3,2,1,1,2,3],0,[],'RED'],
  ['Samuel','Huntington','ct','Conservative',1731,[2,3,2,0,3,2],0,['Efficient'],'RED'],
  ['Roger','Sherman','ct','Moderate',1721,[2,3,3,0,2,2],0,[],'RED'],
  ['James','Wilson','pa','Moderate',1742,[3,3,4,0,1,2],0,['Egghead'],'RED'],
  ['Caesar','Rodney','de','Moderate',1728,[2,2,1,1,2,2],0,[],'RED'],
  ['Israel','Putnam','ct','Moderate',1718,[1,0,0,3,0,1],0,['Military'],'RED'],
  ['Nathanael','Greene','ri','Progressive',1742,[1,0,0,3,0,1],0,['Military'],'RED'],
  ['Benedict','Arnold','ct','Moderate',1741,[1,0,0,3,0,1],0,['Military','Traitor'],'RED'],
  ['Daniel','Morgan','va','Conservative',1736,[0,0,0,3,0,0],0,['Military'],'RED'],
  ['George','Wythe','va','Liberal',1726,[2,3,4,0,1,2],0,['Egghead'],'RED'],
  ['Robert Treat','Paine','ma','Progressive',1731,[2,2,3,0,1,1],0,[],'RED'],
  ['Benjamin','Rush','pa','Progressive',1746,[2,2,1,0,1,2],0,['Egghead','Reformist'],'RED'],
  ['Thomas','McKean','de','Progressive',1734,[2,3,3,0,2,2],0,[],'RED'],
  ['Oliver','Ellsworth','ct','Progressive',1745,[2,2,3,0,1,2],0,[],'RED'],
  ['Benjamin','Lincoln','ma','Conservative',1733,[2,1,0,3,2,1],0,['Military'],'RED'],
  ['John Paul','Jones','va','Moderate',1747,[1,0,0,3,0,0],0,['Naval'],'BLUE'],
  ['John','Barry','pa','Moderate',1745,[1,0,0,2,0,0],0,['Naval'],'RED'],
  ['Esek','Hopkins','ri','Moderate',1718,[1,0,0,3,0,0],0,['Naval'],'RED'],
  ['William','Moultrie','sc','Conservative',1730,[1,0,0,3,1,1],0,['Military'],'RED'],
  ['Arthur','St. Clair','pa','Conservative',1737,[1,0,0,2,1,1],0,['Military'],'RED'],
  ['Philip','Schuyler','ny','Conservative',1733,[2,1,0,2,1,2],0,[],'RED'],
  ['Timothy','Pickering','ma','Conservative',1745,[2,1,1,1,1,1],0,['Puritan'],'RED'],

  // ===== Founding-era arrivals (1st Congress / Convention / Cabinet) =====
  ['James','Madison','va','Liberal',1751,[3,4,3,0,2,3],1,['Egghead','Reformist'],'BLUE'],
  ['Alexander','Hamilton','ny','Conservative',1755,[4,3,2,2,1,3],1,['Egghead'],'RED'],
  ['Aaron','Burr','ny','Moderate',1756,[2,2,2,1,1,4],0,['Manipulative'],'BLUE'],
  ['Rufus','King','ny','Conservative',1755,[3,3,2,0,2,2],0,['Debater'],'RED'],
  ['Robert','Morris','pa','Conservative',1734,[4,2,1,0,2,3],0,['Economics'],'RED'],
  ['Gouverneur','Morris','ny','Conservative',1752,[3,3,3,0,1,3],0,['Egghead','Orator'],'RED'],
  ['Charles Cotesworth','Pinckney','sc','Conservative',1746,[2,2,2,2,1,2],0,[],'RED'],
  ['Thomas','Mifflin','pa','Moderate',1744,[2,2,0,2,3,2],0,[],'RED'],
  ['Fisher','Ames','ma','Conservative',1758,[2,4,2,0,1,2],0,['Orator'],'RED'],
  ['Theodore','Sedgwick','ma','Conservative',1746,[2,3,2,0,1,2],0,[],'RED'],
  ['Jonathan','Trumbull','ct','Conservative',1740,[2,3,1,0,2,2],0,[],'RED'],
  ['Frederick','Muhlenberg','pa','Moderate',1750,[2,3,1,0,2,2],0,[],'RED'],
  ['Abraham','Baldwin','ga','Liberal',1754,[2,3,2,0,1,2],0,['Education'],'BLUE'],
  ['James','Jackson','ga','LW Populist',1757,[1,3,1,2,1,2],0,['Orator'],'BLUE'],
  ['William','Maclay','pa','Progressive',1737,[2,3,1,0,1,2],0,['Reformist'],'BLUE'],
  ['Robert','Livingston','ny','Liberal',1746,[3,2,3,0,2,3],0,[],'BLUE'],
  ['Edmund','Randolph','va','Moderate',1753,[3,3,3,0,2,2],0,[],'BLUE'],
  ['Henry','Knox','ma','Moderate',1750,[2,1,0,4,1,1],0,['Military'],'RED'],
  ['Pierce','Butler','sc','Traditionalist',1744,[2,2,1,1,2,2],0,[],'BLUE'],
  ['Ralph','Izard','sc','Conservative',1742,[2,2,1,0,1,2],0,[],'RED'],
  ['William','Few','ga','Moderate',1748,[2,2,1,0,2,2],0,[],'BLUE'],
  ['Richard','Bassett','de','Moderate',1745,[2,2,1,0,2,1],0,[],'RED'],
  ['George','Read','de','Conservative',1733,[2,3,3,0,2,1],0,[],'RED'],
  ['John','Langdon','nh','Moderate',1741,[2,2,0,0,3,2],0,[],'BLUE'],
  ['Paine','Wingate','nh','Conservative',1739,[1,2,1,0,1,1],0,[],'RED'],
  ['Caleb','Strong','ma','Conservative',1745,[2,3,2,0,2,1],0,[],'RED'],
  ['Tristram','Dalton','ma','Moderate',1738,[2,2,1,0,2,1],0,[],'RED'],
  ['William Samuel','Johnson','ct','Conservative',1727,[2,3,3,0,1,2],0,['Egghead'],'RED'],
  ['Charles','Carroll','md','Conservative',1737,[3,2,1,0,2,3],0,['Economics'],'RED'],
  ['John','Henry','md','Moderate',1750,[2,2,1,0,1,2],0,[],'BLUE'],
  ['William','Grayson','va','Progressive',1740,[2,3,1,1,1,2],0,['Debater'],'BLUE'],
  ['Samuel','Johnston','nc','Conservative',1733,[2,3,2,0,2,2],0,[],'RED'],
  ['Benjamin','Hawkins','nc','Moderate',1754,[2,2,1,0,2,2],0,[],'BLUE'],
  ['Joseph','Stanton','ri','Progressive',1739,[1,2,0,1,1,2],0,[],'BLUE'],
  ['Theodore','Foster','ri','Moderate',1752,[2,2,2,0,1,1],0,[],'RED'],
  ['John','Walker','va','Moderate',1744,[1,2,1,0,1,1],0,[],'BLUE'],
  ['John','Beckley','va','Moderate',1757,[1,2,1,0,1,3],0,['Manipulative'],'BLUE'],

  // ===== 1856 scenario in-game roster =====
  ['James','Buchanan','pa','Conservative',1791,[4,3,2,0,3,3],4,['Efficient'],'BLUE'],
  ['John C.','Breckinridge','ky','Conservative',1821,[3,3,1,1,2,3],3,['Orator'],'BLUE'],
  ['Jefferson','Davis','ms','Traditionalist',1808,[4,3,1,4,2,3],4,['Nationalist','Military'],'BLUE'],
  ['James M.','Mason','va','Traditionalist',1798,[2,3,2,0,2,3],2,['Nationalist'],'BLUE'],
  ['Robert','Toombs','ga','Traditionalist',1810,[2,4,1,1,2,3],3,['Orator','Debater'],'BLUE'],
  ['Howell','Cobb','ga','Conservative',1815,[3,3,1,0,3,3],3,['Economics'],'BLUE'],
  ['John B.','Floyd','va','Conservative',1806,[2,1,0,2,3,1],2,['Corrupt'],'BLUE'],
  ['James L.','Orr','sc','Conservative',1822,[2,3,1,0,1,2],2,[],'BLUE'],
  ['Stephen A.','Douglas','il','Moderate',1813,[3,4,2,0,2,4],4,['Orator','Debater'],'BLUE'],
  ['Lewis','Cass','mi','Moderate',1782,[3,3,2,1,3,2],3,['Globalist'],'BLUE'],
  ['William L.','Marcy','ny','Moderate',1786,[3,2,1,1,3,3],2,[],'BLUE'],
  ['Franklin','Pierce','nh','Moderate',1804,[2,2,1,1,2,2],2,['Passive'],'BLUE'],
  ['Daniel S.','Dickinson','ny','Moderate',1800,[2,3,1,0,2,3],2,[],'BLUE'],
  ['Andrew','Johnson','tn','Conservative',1808,[2,3,1,0,2,2],2,['Unlikable'],'BLUE'],
  ['John','Bell','tn','Moderate',1796,[3,3,2,0,2,3],3,['Crisis Manager'],'BLUE'],
  ['Edward','Everett','ma','Moderate',1794,[3,2,2,0,2,2],2,['Orator','Education'],'BLUE'],
  ['Sam','Houston','tx','Moderate',1793,[2,2,1,4,3,2],4,['Celebrity','Military'],'BLUE'],
  ['James K.','Polk','tn','Liberal',1795,[3,3,1,1,2,3],3,['Efficient'],'BLUE'],
  ['Thomas H.','Benton','mo','Liberal',1782,[3,4,1,1,2,3],4,['Orator','Reformist'],'BLUE'],
  ['David','Wilmot','pa','Progressive',1814,[2,3,2,0,1,2],2,['Reformist'],'BLUE'],
  ['Martin','Van Buren','ny','Liberal',1782,[4,3,1,0,3,5],4,['Manipulative','Magician'],'BLUE'],
  ['John A.','Dix','ny','Liberal',1798,[3,2,1,2,3,2],2,[],'BLUE'],
  ['John J.','Crittenden','ky','Conservative',1787,[3,4,3,0,2,3],3,['Crisis Manager'],'RED'],
  ['Edward','Bates','mo','Conservative',1793,[3,2,4,0,2,2],2,['Integrity'],'RED'],
  ['Orville H.','Browning','il','Moderate',1806,[2,3,2,0,1,2],2,[],'RED'],
  ['Abraham','Lincoln','il','Moderate',1809,[2,3,2,0,1,2],2,['Orator','Integrity'],'RED'],
  ['William P.','Fessenden','me','Moderate',1806,[3,4,2,0,2,2],3,['Economics'],'RED'],
  ['Lyman','Trumbull','il','Moderate',1813,[3,4,3,0,1,2],3,['Integrity'],'RED'],
  ['Hannibal','Hamlin','me','Moderate',1809,[3,3,1,0,3,2],2,[],'RED'],
  ['John A.','Andrew','ma','Liberal',1818,[3,3,2,0,4,2],3,['Reformist','Integrity'],'RED'],
  ['William H.','Seward','ny','Liberal',1801,[3,4,2,0,3,4],5,['Manipulative','Magician'],'RED'],
  ['Salmon P.','Chase','oh','Progressive',1808,[3,3,3,0,4,2],3,['Integrity','Reformist'],'RED'],
  ['John C.','Frémont','ca','Liberal',1813,[2,1,0,3,1,1],3,['Celebrity'],'RED'],
  ['Henry','Wilson','ma','Progressive',1812,[2,3,1,0,1,3],2,['Reformist'],'RED'],
  ['Schuyler','Colfax','in','Liberal',1823,[2,3,1,0,2,3],2,['Charismatic'],'RED'],
  ['Charles','Sumner','ma','LW Populist',1811,[2,4,3,0,2,1],4,['Orator','Reformist','Puritan'],'RED'],
  ['Thaddeus','Stevens','pa','LW Populist',1792,[2,5,3,0,1,4],4,['Orator','Reformist','Manipulative'],'RED'],
  ['Benjamin','Wade','oh','LW Populist',1800,[2,4,2,0,1,2],3,['Reformist'],'RED'],
  ['Joshua','Giddings','oh','LW Populist',1795,[2,3,2,0,1,1],2,['Reformist'],'RED'],
  ['Owen','Lovejoy','il','LW Populist',1811,[2,3,1,0,1,1],2,['Reformist'],'RED'],
  ['Millard','Fillmore','ny','Conservative',1800,[3,2,1,0,2,2],2,['Passive'],'RED'],
  ['Nathaniel P.','Banks','ma','Moderate',1816,[2,3,1,1,2,3],3,['Charismatic'],'RED'],
  ['Anson','Burlingame','ma','Moderate',1820,[2,2,1,0,1,2],2,['Globalist'],'RED'],
  ['Winfield','Scott','va','Moderate',1786,[2,0,0,5,0,1],3,['Military','Celebrity'],'RED'],
  ['Robert E.','Lee','va','Conservative',1807,[2,0,0,5,1,1],3,['Military'],'RED'],
  ['Ulysses S.','Grant','oh','Moderate',1822,[1,0,0,4,0,0],1,['Military'],'RED'],
  ['William T.','Sherman','oh','Moderate',1820,[1,0,0,4,0,0],1,['Military'],'RED'],
  ['George B.','McClellan','pa','Conservative',1826,[2,0,0,3,0,0],2,['Military','Passive'],'BLUE'],
  ['Roger B.','Taney','md','Traditionalist',1777,[3,2,5,0,0,2],3,[],'BLUE'],
  ['John','Catron','tn','Conservative',1786,[2,1,4,0,0,1],1,[],'BLUE'],
  ['Peter V.','Daniel','va','Traditionalist',1784,[2,1,4,0,0,1],1,[],'BLUE'],
  ['Samuel','Nelson','ny','Conservative',1792,[2,1,4,0,0,1],1,[],'BLUE'],
  ['Robert C.','Grier','pa','Conservative',1794,[2,1,4,0,0,1],1,[],'BLUE'],
  ['Benjamin R.','Curtis','ma','Liberal',1809,[2,1,4,0,0,1],2,['Integrity'],'RED'],
  ['John A.','Campbell','al','Traditionalist',1811,[2,1,4,0,0,1],1,[],'BLUE'],
  ['James M.','Wayne','ga','Conservative',1790,[2,1,4,0,0,1],1,[],'BLUE'],
  ['John','McLean','oh','Liberal',1785,[2,1,4,0,0,1],2,['Integrity'],'RED'],
];

const header = ['draftYear','firstName','lastName','state','ideology','birthYear','age','admin','legislative','judicial','military','governing','backroom','command','traits','party','wikiUrl'];

// Normalized curated rows (consumed by legislatorsToDataset.mjs as overrides).
const seen = new Set();
export const CURATED_ROWS = [];
for (const [first, last, state, ideo, birth, sk, cmd, traits, party] of ROWS) {
  const key = (first + ' ' + last).toLowerCase();
  if (seen.has(key)) continue;
  seen.add(key);
  const draftYear = draftYearFor(birth);
  CURATED_ROWS.push({
    draftYear, firstName: first, lastName: last, state, ideology: ideo,
    birthYear: birth, age: draftYear - birth,
    skills: { admin: sk[0], legislative: sk[1], judicial: sk[2], military: sk[3], governing: sk[4], backroom: sk[5] },
    command: cmd, traits, party, wikiUrl: wiki(first, last),
  });
}

// Only write the standalone curated CSV when executed directly.
if (process.argv[1] && process.argv[1].endsWith('seedDataset.mjs')) {
  const lines = [header.join(',')];
  for (const r of CURATED_ROWS) {
    lines.push([
      r.draftYear, r.firstName, r.lastName, r.state, r.ideology, r.birthYear, '',
      r.skills.admin, r.skills.legislative, r.skills.judicial, r.skills.military, r.skills.governing, r.skills.backroom,
      r.command, r.traits.join('|'), r.party, r.wikiUrl,
    ].join(','));
  }
  writeFileSync(new URL('../politicians-dataset.csv', import.meta.url), lines.join('\n') + '\n');
  console.log(`Wrote ${CURATED_ROWS.length} curated politicians to politicians-dataset.csv`);
}
