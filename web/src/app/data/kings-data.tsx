// kings-data.tsx
export interface King {
  id: number;
  nameKey: string; // Key for name (replaces name and name_ne)
  reignStart: number;
  reignEnd: number;
  notableKey: string; // Key for notable (replaces notable and notable_ne)
  facts?: string[]; // Optional, can remain if used elsewhere
  facts_ne?: string[]; // Optional, can remain if used elsewhere
  acceptableAnswers: string[];
  imgSrc?: string;
  paragraphKey: string; // Key for paragraph (replaces paragraph and paragraph_ne)
}

export const kingsOfNepal: King[] = [
  {
    id: 1,
    nameKey: "prithvi_narayan_shah",
    imgSrc: "/kings-of-nepal/01-king-pns.jpg",
    reignStart: 1743,
    reignEnd: 1775,
    notableKey: "prithvi_narayan_shah_notable",
    paragraphKey: "prithvi_narayan_shah_paragraph",
    acceptableAnswers: [
      "Prithvi Narayan Shah",
      "Prithvi Narayan",
      "Prithvinarayan Shah",
      "Prithvi Shah",
      "King Prithvi Narayan",
      "Prithvi N Shah",
      "Prithvi Narayn Shah",
      "Pritvi Narayan Shah",
      "Prithvi Narayanshah",
      "Prithvi N. Shah"
    ]
  },
  {
    id: 2,
    nameKey: "pratap_singh_shah",
    imgSrc: "/kings-of-nepal/02-king-pss.jpg",
    reignStart: 1775,
    reignEnd: 1777,
    notableKey: "pratap_singh_shah_notable",
    paragraphKey: "pratap_singh_shah_paragraph",
    acceptableAnswers: [
      "Pratap Singh Shah",
      "Pratap Singh",
      "Pratapsingh Shah",
      "Pratap Shah",
      "King Pratap Singh",
      "Pratap S Shah",
      "Pratapsing Shah",
      "Pratap Sing Shah",
      "P. Singh Shah",
      "Pratap Singhshah"
    ]
  },
  {
    id: 3,
    nameKey: "rana_bahadur_shah",
    imgSrc: "/kings-of-nepal/03-king-rbs.jpg",
    reignStart: 1777,
    reignEnd: 1799,
    notableKey: "rana_bahadur_shah_notable",
    paragraphKey: "rana_bahadur_shah_paragraph",
    acceptableAnswers: [
      "Rana Bahadur Shah",
      "Rana Bahadur",
      "Ranabahadur Shah",
      "Rana Shah",
      "King Rana Bahadur",
      "Rana B Shah",
      "Rana Bahadurshah",
      "Ranabahadurshah",
      "Rana B. Shah",
      "Rana Bahadur S."
    ]
  },
  {
    id: 4,
    nameKey: "girvan_yuddha_bikram_shah",
    imgSrc: "/kings-of-nepal/04-king-gybs.jpg",
    reignStart: 1799,
    reignEnd: 1816,
    notableKey: "girvan_yuddha_bikram_shah_notable",
    paragraphKey: "girvan_yuddha_bikram_shah_paragraph",
    acceptableAnswers: [
      "Girvan Yuddha Bikram Shah",
      "Girvan Yuddha",
      "Girvanyuddha Shah",
      "Girvan Shah",
      "Girvan Bikram Shah",
      "King Girvan Yuddha",
      "Girvan Yuddha Shah",
      "Girvan Y. Shah",
      "Girvanyuddha Bikram Shah",
      "G. Yuddha Shah"
    ]
  },
  {
    id: 5,
    nameKey: "rajendra_bikram_shah",
    imgSrc: "/kings-of-nepal/05-king-rbs.jpg",
    reignStart: 1816,
    reignEnd: 1847,
    notableKey: "rajendra_bikram_shah_notable",
    paragraphKey: "rajendra_bikram_shah_paragraph",
    acceptableAnswers: [
      "Rajendra Bikram Shah",
      "Rajendra Shah",
      "Rajendra Bikram",
      "Rajendra B Shah",
      "King Rajendra",
      "Rajendra Bikramshah",
      "Rajendrabikram Shah",
      "Rajendra B. Shah",
      "R. Bikram Shah",
      "Rajendra Shah Bikram"
    ]
  },
  {
    id: 6,
    nameKey: "surendra_bikram_shah",
    imgSrc: "/kings-of-nepal/06-king-sbs.jpg",
    reignStart: 1847,
    reignEnd: 1881,
    notableKey: "surendra_bikram_shah_notable",
    paragraphKey: "surendra_bikram_shah_paragraph",
    acceptableAnswers: [
      "Surendra Bikram Shah",
      "Surendra Shah",
      "Surendra Bikram",
      "Surendra B Shah",
      "King Surendra",
      "Surendra Bikramshah",
      "Surendrabikram Shah",
      "Surendra B. Shah",
      "S. Bikram Shah",
      "Surendra Shah Bikram"
    ]
  },
  {
    id: 7,
    nameKey: "prithvi_bir_bikram_shah",
    imgSrc: "/kings-of-nepal/07-king-pbbs.png",
    reignStart: 1881,
    reignEnd: 1911,
    notableKey: "prithvi_bir_bikram_shah_notable",
    paragraphKey: "prithvi_bir_bikram_shah_paragraph",
    acceptableAnswers: [
      "Prithvi Bir Bikram Shah",
      "Prithvi Bir Shah",
      "Prithvibir Shah",
      "Prithvi Bikram Shah",
      "King Prithvi Bir",
      "Prithvi B Shah",
      "Prithvi Bir Bikramshah",
      "Prithvibirbikram Shah",
      "Prithvi B. Shah",
      "P. Bir Shah"
    ]
  },
  {
    id: 8,
    nameKey: "tribhuvan_bir_bikram_shah",
    imgSrc: "/kings-of-nepal/08-king-tbbs.png",
    reignStart: 1911,
    reignEnd: 1955,
    notableKey: "tribhuvan_bir_bikram_shah_notable",
    paragraphKey: "tribhuvan_bir_bikram_shah_paragraph",
    acceptableAnswers: [
      "Tribhuvan Bir Bikram Shah",
      "Tribhuvan Shah",
      "King Tribhuvan",
      "Tribhuvan Bikram Shah",
      "Tribhuvan Bir Shah",
      "Tribhuvan B Shah",
      "Tribhuvanbir Shah",
      "Tribhuvan Bikramshah",
      "Tribhuvan B. Shah",
      "T. Bir Shah"
    ]
  },
  {
    id: 9,
    nameKey: "mahendra_bir_bikram_shah",
    imgSrc: "/kings-of-nepal/10-king-mbbs.jpg",
    reignStart: 1955,
    reignEnd: 1972,
    notableKey: "mahendra_bir_bikram_shah_notable",
    paragraphKey: "mahendra_bir_bikram_shah_paragraph",
    acceptableAnswers: [
      "Mahendra Bir Bikram Shah",
      "Mahendra Shah",
      "King Mahendra",
      "Mahendra Bikram Shah",
      "Mahendra Bir Shah",
      "Mahendra B Shah",
      "Mahendrabir Shah",
      "Mahendra Bikramshah",
      "Mahendra B. Shah",
      "M. Bir Shah"
    ]
  },
  {
    id: 10,
    nameKey: "birendra_bir_bikram_shah",
    imgSrc: "/kings-of-nepal/11-king-bbs.jpg",
    reignStart: 1972,
    reignEnd: 2001,
    notableKey: "birendra_bir_bikram_shah_notable",
    paragraphKey: "birendra_bir_bikram_shah_paragraph",
    acceptableAnswers: [
      "Birendra Bir Bikram Shah",
      "Birendra Shah",
      "King Birendra",
      "Birendra Bikram Shah",
      "Birendra Bir Shah",
      "Birendra B Shah",
      "Birendrabir Shah",
      "Birendra Bikramshah",
      "Birendra B. Shah",
      "B. Bir Shah"
    ]
  },
  {
    id: 11,
    nameKey: "dipendra_bir_bikram_shah",
    imgSrc: "/kings-of-nepal/12-king-dbbs.jpg",
    reignStart: 2001,
    reignEnd: 2001,
    notableKey: "dipendra_bir_bikram_shah_notable",
    paragraphKey: "dipendra_bir_bikram_shah_paragraph",
    acceptableAnswers: [
      "Dipendra Bir Bikram Shah",
      "Dipendra Shah",
      "King Dipendra",
      "Dipendra Bikram Shah",
      "Dipendra Bir Shah",
      "Dipendra B Shah",
      "Dipendrabir Shah",
      "Dipendra Bikramshah",
      "Dipendra B. Shah",
      "D. Bir Shah"
    ]
  },
  {
    id: 12,
    nameKey: "gyanendra_bir_bikram_shah",
    imgSrc: "/kings-of-nepal/13-king-gbbs.jpg",
    reignStart: 2001,
    reignEnd: 2008,
    notableKey: "gyanendra_bir_bikram_shah_notable",
    paragraphKey: "gyanendra_bir_bikram_shah_paragraph",
    acceptableAnswers: [
      "Gyanendra Bir Bikram Shah",
      "Gyanendra Shah",
      "King Gyanendra",
      "Gyanendra Bikram Shah",
      "Gyanendra Bir Shah",
      "Gyanendra B Shah",
      "Gyanendrabir Shah",
      "Gyanendra Bikramshah",
      "Gyanendra B. Shah",
      "G. Bir Shah"
    ]
  }
];

export function getKingsInChronologicalOrder(): King[] {
  return [...kingsOfNepal].sort((a, b) => a.reignStart - b.reignStart);
}

export function isAnswerCorrect(input: string, king: King): boolean {
  if (!input.trim()) return false;
  if (input.trim().length < 3) return false;
  
  const normalizedInput = input.toLowerCase().trim();
  
  return king.acceptableAnswers.some(answer => {
    const normalizedAnswer = answer.toLowerCase().trim();
    
    if (normalizedInput === normalizedAnswer) return true;
    if (normalizedInput.includes(normalizedAnswer)) return true;
    
    if (normalizedAnswer.includes(normalizedInput)) {
      const minRequiredLength = Math.max(5, Math.floor(normalizedAnswer.length * 0.6));
      if (normalizedInput.length >= minRequiredLength) return true;
    }
    
    return false;
  });
}