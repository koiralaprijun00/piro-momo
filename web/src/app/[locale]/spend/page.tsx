"use client";

import React, { useState, useRef } from "react";
import ProductCard from '@/components/ProductCard';
import SocialShare from '@/components/SocialShare';
import { getProductsByLocale } from "../../data/spend-binod-money/getProducts"; // Import utility
import { Product } from "../../data/spend-binod-money/product"; // Import Product type
import GameButton from '@/components/ui/GameButton';
import { useTranslations, useLocale } from "next-intl"; // Import useLocale
import Link from "next/link";
import Image from "next/image";

interface Purchases {
  [key: number]: number;
}

// Improved ProgressBar Component
const ProgressBar = ({ total, spent }: { total: number; spent: number }) => {
  const percentage = (spent / total * 100).toFixed(2);
  const isWarning = parseFloat(percentage) > 75;

  const t = useTranslations("Translations");

  return (
    <div className="mt-2">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{t("budgetProgress")}</span>
        <span className={`font-medium ${isWarning ? "text-red-600" : "text-blue-600"}`}>
          {percentage}%
        </span>
      </div>
      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${isWarning ? "bg-red-600" : "bg-blue-600"} transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-sm">
        <span className="text-gray-600">
          {t("totalSpent")}: <span className="font-semibold">NPR {spent.toLocaleString()}</span>
        </span>
        <span className="text-gray-600">
          {t("totalAmount")}: <span className="font-semibold">NPR {total.toLocaleString()}</span>
        </span>
      </div>
    </div>
  );
};

// Improved Header Component
interface HeaderProps {
  budget: number;
  spent: number;
  isModalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ budget, spent, isModalOpen, setModalOpen }) => {
  const t = useTranslations("Translations");

  return (
    <div className="w-full bg-white shadow-md rounded-b-lg pt-6 pb-4">
      <div className="px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start mb-4">
          <div className="flex items-center">
              <Image
                src="/binod-header.jpg"
                alt="Logo"
                width={64}
                height={64}
                object-fit="cover"
                className="w-16 h-16 rounded-md shadow-lg"
              />
              <div className="ml-4">
            <h1 className="text-3xl font-extrabold text-left bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-500">
              {t("spendBinodTitle")}
            </h1>
            <p className="text-gray-600 mt-1 max-w-2xl">{t("spendBinodDescription")}</p>
          </div>
          </div>
          <Link
            href="/about-binod"
            className="mt-2 underline md:mt-0 text-xs rounded-lg transition-colors text-gray-800 hover:text-blue-600"
          >
            {t("aboutBinod")}
          </Link>
        </div>
        <div className="mt-4">
          <ProgressBar total={budget} spent={spent} />
        </div>
      </div>
    </div>
  );
};

// Main Home Component
export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [budget] = useState(237500000000);
  const [spent, setSpent] = useState(0);
  const [purchases, setPurchases] = useState<Purchases>({});
  const [isReceiptModalOpen, setReceiptModalOpen] = useState(false);

  const t = useTranslations("Translations");
  const locale = useLocale(); // Get current locale (en or np)
  const purchasesRef = useRef<HTMLDivElement>(null);

  // Load products based on the current locale
  const products = getProductsByLocale(locale);

  const handleBuy = (product: Product) => {
    if (spent + product.price <= budget) {
      setSpent((prevSpent) => prevSpent + product.price);
      setPurchases((prevPurchases) => ({
        ...prevPurchases,
        [product.id]: (prevPurchases[product.id] || 0) + 1,
      }));
    } else {
      alert(t("notEnoughMoney"));
    }
  };

  const handleSell = (product: Product) => {
    if (purchases[product.id] > 0) {
      setSpent((prevSpent) => prevSpent - product.price);
      setPurchases((prevPurchases) => ({
        ...prevPurchases,
        [product.id]: Math.max(prevPurchases[product.id] - 1, 0),
      }));
    }
  };

  const handleSetQuantity = (product: Product, newQuantity: number) => {
    const currentQuantity = purchases[product.id] || 0;
    const difference = newQuantity - currentQuantity;
    const newSpent = spent + difference * product.price;

    if (newSpent <= budget && newQuantity >= 0) {
      setSpent(newSpent);
      setPurchases((prevPurchases) => ({
        ...prevPurchases,
        [product.id]: newQuantity,
      }));
    } else {
      alert(t("notEnoughMoney"));
    }
  };

  const totalSpent = spent;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] h-screen px-1 md:px-16 gap-4 py-4">
      <div className="flex flex-col h-screen">
        <div className="sticky top-0 z-50 bg-white">
          <Header
            budget={budget}
            spent={spent}
            setModalOpen={setModalOpen}
            isModalOpen={isModalOpen}
          />
        </div>
        <div aria-live="polite" className="sr-only">
          {spent > budget ? t("notEnoughMoney") : ""}
        </div>

        <div
          className="grid gap-4 mt-4 pb-12 overflow-y-auto flex-grow"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onBuy={handleBuy}
              onSell={handleSell}
              onSetQuantity={handleSetQuantity}
              quantity={purchases[product.id] || 0}
            />
          ))}
        </div>
      </div>
      <div className="md:block hidden p-6 bg-white rounded-lg shadow-lg sticky top-5 h-screen overflow-y-auto">
        <div className="flex flex-col h-full">
          <SocialShare 
            summaryRef={purchasesRef} 
            totalSpent={totalSpent}
            text={`I've spent ${totalSpent} on Piro Momo! Check out my spending summary.`}
            hashtags={['piromomo', 'nepal']}
            buttonType="primary"
            className="mb-4"
          />
          <div className="flex flex-col h-full">
            <div className="py-6 mb-4 border-b-2 border-gray-600 border-dashed">
              <h1 className="text-3xl mb-4 font-bold text-left bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-500">
                {t("receipt")}
              </h1>
              <p className="flex justify-between text-xl font-bold text-right">
                <span className="block text-gray-600">{t("totalSpent")}:</span>
                <span className="text-blue-600">NPR {totalSpent.toLocaleString()}</span>
              </p>
            </div>
            <div className="overflow-y-auto flex-grow max-h-screen" ref={purchasesRef}>
              {Object.keys(purchases).length === 0 ? (
                <p className="text-gray-500">{t("noPurchases")}</p>
              ) : (
                products
                  .filter((product) => purchases[product.id])
                  .map((product) => (
                    <div key={product.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-gray-800">{product.name}</div>
                        <div className="text-gray-500">x{purchases[product.id]}</div>
                      </div>
                      <div className="text-right mt-1 text-blue-600 font-bold">
                        NPR {(purchases[product.id] * product.price).toLocaleString()}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
      <GameButton
        onClick={() => setReceiptModalOpen(true)}
        type="neutral"
        className="fixed bottom-4 right-4 md:hidden shadow-lg"
      >
        {t("viewReceipt")}
      </GameButton>

      {isReceiptModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-6">
          <div className="bg-gradient-to-br from-blue-600 to-red-500 p-1 rounded-xl shadow-lg w-full max-w-md">
            <div className="bg-white rounded-lg p-6 relative">
              <button
                onClick={() => setReceiptModalOpen(false)}
                className="absolute top-4 right-5 text-gray-500 hover:bg-gray-200 px-2 py-2 rounded-full focus:outline-none transition-colors"
                aria-label={t("close")}
              >
                X
              </button>
              <div className="py-6 mb-4 border-b-2 border-gray-600 border-dashed">
                <h1 className="text-3xl mb-4 font-bold text-left bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-500">
                  {t("receipt")}
                </h1>
                <p className="flex justify-between text-xl font-bold text-right">
                  <span className="block text-gray-600">{t("totalSpent")}:</span>
                  <span className="text-blue-600">NPR {totalSpent.toLocaleString()}</span>
                </p>
              </div>
              <div className="overflow-y-auto max-h-[60vh]">
                {Object.keys(purchases).length === 0 ? (
                  <p className="text-gray-500">{t("noPurchases")}</p>
                ) : (
                  products
                    .filter((product) => purchases[product.id])
                    .map((product) => (
                      <div key={product.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="font-medium text-gray-800">{product.name}</div>
                          <div className="text-gray-500">x{purchases[product.id]}</div>
                        </div>
                        <div className="text-right mt-1 text-blue-600 font-bold">
                          NPR {(purchases[product.id] * product.price).toLocaleString()}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}