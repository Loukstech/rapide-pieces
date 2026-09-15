import { Star, ShoppingCart, Clock, Truck, BadgeCheck, Wrench, Settings, Lightbulb, Snowflake, Droplets, Gauge, Car, Cpu, CircuitBoard } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../lib/i18n/LanguageContext';

const categoryIcons: Record<string, React.ReactNode> = {
  'car': <Car />,
  'cpu': <Cpu />,
  'circuit-board': <CircuitBoard />,
  'gauge': <Gauge />,
  'snowflake': <Snowflake />,
  'droplets': <Droplets />,
  'lightbulb': <Lightbulb />,
  'settings': <Settings />,
  'truck': <Truck />,
  'clock': <Clock />,
  'star': <Star />,
  'shopping-cart': <ShoppingCart />,
  'badge-check': <BadgeCheck />,
  'wrench': <Wrench />,
};

export default function ProductCard({
  id, name, brand, vehicle, price, oldPrice, quality, seller,
  sellerBadge, rating, reviews, delivery, deliveryTime, inStock, category, image
}: ProductCardProps) {
  const { t } = useLanguage();
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/product/${id}`}>
      <div className="flex flex-col items-center gap-4 p-4 border border-gray-200 rounded-lg shadow-sm">
        {/* Image */}
        <div className="relative w-full h-48 overflow-hidden rounded-lg">
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full"
            onError={(e) => setImgError(true)}
          />
          {imgError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-500 text-white">
              <span>{name}</span>
            </div>
          )}
        </div>

        {/* Product details */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-lg font-bold">{name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{brand}</p>
          </div>

          {/* Price */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg font-bold">{price}</span>
              {oldPrice && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {oldPrice} ({discount}%)</span>
              )}
            </div>
          </div>

          {/* Quality */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">{quality}</span>
          </div>

          {/* Seller */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">{seller}</span>
            {sellerBadge && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {sellerBadge}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">{rating}</span>
            {reviews && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {reviews}
              </span>
            )}
          </div>

          {/* Delivery */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">{delivery}</span>
            {deliveryTime && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {deliveryTime}
              </span>
            )}
          </div>

          {/* Stock status */}
          <div className="mt-2">
            {inStock ? (
              <span className="text-[10px] text-green-600 dark:text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> {t('common.inStock')}
              </span>
            ) : (
              <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> {t('common.onOrder')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}