import { coffeeProducts } from '@/lib/coffee-data';
import CoffeeCard from '@/components/CoffeeCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata = {
  title: 'Menu - Café Khmer',
  description: 'Browse our selection of authentic Cambodian coffee',
};

export default function MenuPage() {
  const categories = ['all', 'hot', 'iced', 'specialty'];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold mb-4">Our Menu</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our carefully curated selection of coffee beverages, 
            each crafted with premium Cambodian beans
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-12">
            <TabsTrigger value="all" className="capitalize">All</TabsTrigger>
            <TabsTrigger value="hot" className="capitalize">Hot</TabsTrigger>
            <TabsTrigger value="iced" className="capitalize">Iced</TabsTrigger>
            <TabsTrigger value="specialty" className="capitalize">Specialty</TabsTrigger>
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coffeeProducts
                  .filter(p => category === 'all' || p.category === category)
                  .map(product => (
                    <CoffeeCard key={product.id} product={product} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
