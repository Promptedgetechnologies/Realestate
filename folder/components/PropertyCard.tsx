import Link from 'next/link';
import { Property } from '@/lib/data-loader';
import { FiMapPin, FiHome, FiMaximize2 } from 'react-icons/fi';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)}Cr`;
    }
    return `₹${(price / 100000).toFixed(2)}L`;
  };

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer">
        <div className="relative h-48 bg-gray-200">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {property.type}
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-2xl font-bold">{formatPrice(property.price)}</p>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2 line-clamp-1">{property.title}</h3>
          <div className="flex items-center text-gray-600 mb-3">
            <FiMapPin className="h-4 w-4 mr-1" />
            <span>{property.location}, {property.city}</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-600 mb-4">
            <div className="flex items-center">
              <FiHome className="h-4 w-4 mr-1" />
              <span>{property.bedrooms} BHK</span>
            </div>
            <div className="flex items-center">
              <FiMaximize2 className="h-4 w-4 mr-1" />
              <span>{property.area} {property.areaUnit}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {property.features.slice(0, 2).map((feature, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

