/**
 * Reign dates of the 12 Shah kings of Nepal (1768–2008), for the history table.
 * AD dates: Wikipedia, "List of monarchs of Nepal" / "List of heads of state of Nepal",
 * checked 16 November 2026. BS years are worked out from those dates (Baisakh 1 falls
 * in mid-April, so dates from mid-April on are AD + 57, earlier dates AD + 56).
 */
export interface KingReign {
  id: string;
  startAd: string;
  endAd: string;
  startBs: string;
  endBs: string;
  note?: { en: string; np: string };
}

export const KING_REIGNS: KingReign[] = [
  {
    id: 'prithvi_narayan_shah', startAd: '25 Sep 1768', endAd: '11 Jan 1775', startBs: '१८२५', endBs: '१८३१',
    note: { en: 'King of Gorkha from 1743; unified Nepal', np: 'सन् १७४३ देखि गोरखाका राजा; नेपाल एकीकरण' },
  },
  { id: 'pratap_singh_shah', startAd: '11 Jan 1775', endAd: '17 Nov 1777', startBs: '१८३१', endBs: '१८३४' },
  {
    id: 'rana_bahadur_shah', startAd: '17 Nov 1777', endAd: '8 Mar 1799', startBs: '१८३४', endBs: '१८५५',
    note: { en: 'Abdicated', np: 'राजगद्दी त्याग' },
  },
  { id: 'girvan_yuddha_bikram_shah', startAd: '8 Mar 1799', endAd: '20 Nov 1816', startBs: '१८५५', endBs: '१८७३' },
  { id: 'rajendra_bikram_shah', startAd: '20 Nov 1816', endAd: '12 May 1847', startBs: '१८७३', endBs: '१९०४' },
  { id: 'surendra_bikram_shah', startAd: '12 May 1847', endAd: '17 May 1881', startBs: '१९०४', endBs: '१९३८' },
  { id: 'prithvi_bir_bikram_shah', startAd: '17 May 1881', endAd: '11 Dec 1911', startBs: '१९३८', endBs: '१९६८' },
  {
    id: 'tribhuvan_bir_bikram_shah', startAd: '11 Dec 1911', endAd: '13 Mar 1955', startBs: '१९६८', endBs: '२०११',
    note: { en: 'Briefly replaced by Gyanendra, Nov 1950 – Jan 1951', np: 'सन् १९५० नोभेम्बर–१९५१ जनवरी ज्ञानेन्द्र गद्दीमा' },
  },
  { id: 'mahendra_bir_bikram_shah', startAd: '14 Mar 1955', endAd: '31 Jan 1972', startBs: '२०११', endBs: '२०२८' },
  { id: 'birendra_bir_bikram_shah', startAd: '31 Jan 1972', endAd: '1 Jun 2001', startBs: '२०२८', endBs: '२०५८' },
  { id: 'dipendra_bir_bikram_shah', startAd: '1 Jun 2001', endAd: '4 Jun 2001', startBs: '२०५८', endBs: '२०५८' },
  {
    id: 'gyanendra_bir_bikram_shah', startAd: '4 Jun 2001', endAd: '28 May 2008', startBs: '२०५८', endBs: '२०६५',
    note: { en: 'Monarchy abolished 28 May 2008', np: 'वि.सं. २०६५ जेठ १५ मा राजतन्त्र अन्त्य' },
  },
];
