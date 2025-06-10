/** A game character */
export interface Character {
  [x: string]: any;
  id: string;
  name: string; // → CardData.title
  team: string; // → CardData.subtitle
  modelKV: string; // → image filename
}

/** A game map */
export interface MapItem {
  id: string;
  name: string; // → CardData.title
  fileName: string; // → image filename
  firstAppeared: string; //
}

/** Game author for credits */
export interface Author {
  id: string;
  name: string;
  role: string;
}

export interface CardData {
  id: string;
  title: string;
  imageUrl?: string;
  subtitle?: string;
  details?: string[];
  name: string;
  fileName: string;
  firstAppeared: string;
  team: string;
  modelKV: string;
}
