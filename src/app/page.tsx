"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Coffee, Sparkles, MapPin } from 'lucide-react';
import CoffeeCard from '@/components/CoffeeCard';
import { coffeeProducts } from '@/lib/coffee-data';
import { motion } from 'framer-motion';

export default function Home() {
  const featuredProducts = coffeeProducts.filter(p => p.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/50" />
        </div>
        
        <div className="container mx-auto px-4 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-2 mb-6"
            >
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-primary font-medium">Authentic Cambodian Coffee</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-serif text-6xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Welcome to<br />
              <span className="text-primary">Café Khmer</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl"
            >
              Experience the rich flavors of Cambodia's finest coffee beans, 
              roasted to perfection and served with traditional Khmer hospitality.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/menu">
                <Button size="lg" className="group">
                  Order Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Coffee Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Featured Coffee
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our most popular beverages, crafted with locally sourced beans
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CoffeeCard product={product} />
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/menu">
              <Button size="lg" variant="outline">
                View Full Menu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <Coffee className="h-6 w-6 text-primary" />
                <span className="text-primary font-medium">Our Story</span>
              </div>
              
              <h2 className="font-serif text-4xl font-bold mb-6">
                Crafted with Passion,<br />Served with Pride
              </h2>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Café Khmer brings you the authentic taste of Cambodian coffee culture. 
                Our beans are sourced directly from the highlands of Mondulkiri and Ratanakiri, 
                where the unique climate and rich soil create coffee with exceptional depth and character.
              </p>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We combine traditional Cambodian brewing methods with modern techniques to create 
                a coffee experience that honors our heritage while embracing innovation.
              </p>
              
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Visit Us</p>
                  <p className="text-muted-foreground">Street 240, Phnom Penh, Cambodia</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Ready to Order?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Browse our full menu and pay easily with KHQR for fast, secure transactions
            </p>
            <Link href="/menu">
              <Button size="lg" variant="secondary" className="group">
                Explore Menu
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}