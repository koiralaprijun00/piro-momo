import { initialProductsEn } from "./product.en";
import { initialProductsNp } from "./products.np";
import { Product } from "./product";

export const getProductsByLocale = (locale: string): Product[] => {
  switch (locale) {
    case "np":
      return initialProductsNp;
    case "en":
    default:
      return initialProductsEn;
  }
};