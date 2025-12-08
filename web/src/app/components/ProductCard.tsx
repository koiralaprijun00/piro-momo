import React from "react"
import Image from "next/image"
import { Product } from "../data/spend-binod-money/product"
import { useCallback } from "react"

interface ProductCardProps {
  product: Product
  quantity: number
  onBuy: (product: Product) => void
  onSell: (product: Product) => void
  onSetQuantity: (product: Product, quantity: number) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, quantity, onBuy, onSell, onSetQuantity }) => {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : Math.max(0, Number(e.target.value))
    if (!isNaN(value)) {
      onSetQuantity(product, value)
    }
  }

  const handleSell = useCallback(() => onSell(product), [product, onSell])
  const handleBuy = useCallback(() => onBuy(product), [product, onBuy])

  return (
    <div className="border rounded p-4 transition-transform duration-300 shadow-sm grid grid-rows-[auto,1fr,auto] gap-4">
      {/* Image Section */}
      <div className="relative h-48 rounded-xl overflow-hidden">
        {product.image
          ? <Image src={product.image} alt={product.name} fill={true} objectFit="cover" placeholder="blur" blurDataURL="/images/momo.png" className="rounded-xl" />
          : <div className="absolute inset-0 flex items-center justify-center text-gray-400">No Image Available</div>}
      </div>

      {/* Details Section */}
      <div>
        <h3 className="text-lg font-semibold">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">
          {product.description}
        </p>
        <p className="text-base font-medium">
          NPR {product.price.toLocaleString()}
        </p>
      </div>

      {/* Action Section */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleSell}
          disabled={quantity === 0}
          aria-label={`Sell ${product.name}`}
          className={`text-sm font-medium rounded-md px-4 py-1 transition duration-300 flex items-center justify-center ${quantity === 0
            ? "bg-gray-200 text-gray-500 cursor-default"
            : "bg-red-500 hover:bg-red-600 text-white"}`}
        >
          <span>- Sell</span>
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          className="w-full text-gray-800 text-center text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
          min={0}
        />
        <button
          onClick={handleBuy}
          aria-label={`Buy ${product.name}`}
          className="text-sm font-medium rounded-md px-4 py-1 transition duration-300 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white"
        >
          <span>+ Buy</span>
        </button>
      </div>
    </div>
  )
}

export default ProductCard
