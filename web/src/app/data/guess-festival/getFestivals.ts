import { festivalsEn } from "./data-guess-festival.en";
import { festivalsNp } from "./data-guess-festival.np";
import { Festival } from "./festival";

export const getFestivalsByLocale = (locale: string): Festival[] => {
  switch (locale) {
    case "np":
      return festivalsNp;
    case "en":
    default:
      return festivalsEn;
  }
};