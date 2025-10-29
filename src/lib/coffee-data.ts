export interface CoffeeProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'hot' | 'iced' | 'specialty';
  featured?: boolean;
}

export const coffeeProducts: CoffeeProduct[] = [
  {
    id: '1',
    name: 'Cambodian Robusta',
    description: 'Rich and bold, locally sourced from Mondulkiri highlands',
    price: 0.0244,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80',
    category: 'hot',
    featured: true
  },
  {
    id: '2',
    name: 'Iced Kampot Latte',
    description: 'Smooth espresso with condensed milk, Kampot pepper hint',
    price: 0.0244,
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&q=80',
    category: 'iced',
    featured: true
  },
  {
    id: '3',
    name: 'Cappuccino',
    description: 'Classic Italian espresso with steamed milk foam',
    price: 0.0244,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80',
    category: 'hot',
    featured: true
  },
  {
    id: '4',
    name: 'Vietnamese Drip Coffee',
    description: 'Traditional phin filter coffee with sweet condensed milk',
    price: 0.0244,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    category: 'hot'
  },
  {
    id: '5',
    name: 'Iced Mocha',
    description: 'Espresso, chocolate, milk over ice',
    price: 0.0244,
    image: 'https://images.unsplash.com/photo-1578374173703-149664e5e1d4?w=800&q=80',
    category: 'iced'
  },
  {
    id: '6',
    name: 'Coconut Cold Brew',
    description: 'Smooth cold brew with coconut milk and palm sugar',
    price: 0.0244,
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&q=80',
    category: 'specialty',
    featured: true
  },
  {
    id: '7',
    name: 'Espresso',
    description: 'Double shot of pure Cambodian robusta',
    price: 0.0244,
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80',
    category: 'hot'
  },
  {
    id: '8',
    name: 'Pandan Latte',
    description: 'Aromatic pandan-infused milk with espresso',
    price: 0.0244,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
    category: 'specialty'
  }
];

export const USD_TO_KHR = 4100;

export function formatPrice(usd: number) {
  const khr = Math.round(usd * USD_TO_KHR);
  return {
    usd: `$${usd.toFixed(2)}`,
    khr: `${khr.toLocaleString()}៛`
  };
}