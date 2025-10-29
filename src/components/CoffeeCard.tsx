"use client";

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { CoffeeProduct, formatPrice } from '@/lib/coffee-data';
import { useCart } from '@/lib/cart-context';
import { toast } from 'sonner';

interface CoffeeCardProps {
  product: CoffeeProduct;
}

export default function CoffeeCard({ product }: CoffeeCardProps) {
  const { addItem } = useCart();
  const prices = formatPrice(product.price);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <Badge className="absolute top-4 right-4 capitalize">
          {product.category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-serif font-semibold text-xl mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-primary">{prices.usd}</span>
          <span className="text-sm text-muted-foreground">{prices.khr}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full group/btn"
        >
          <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
