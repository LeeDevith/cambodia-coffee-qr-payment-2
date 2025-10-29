import { Coffee, Heart, Leaf, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'About Us - Café Khmer',
  description: 'Learn about our story and commitment to Cambodian coffee',
};

export default function AboutPage() {
  const values = [
    {
      icon: Coffee,
      title: 'Quality First',
      description: 'We source only the finest beans from Cambodian highlands, ensuring exceptional taste in every cup.'
    },
    {
      icon: Heart,
      title: 'Community Focused',
      description: 'Supporting local farmers and contributing to sustainable coffee farming practices in Cambodia.'
    },
    {
      icon: Leaf,
      title: 'Sustainable',
      description: 'Committed to environmentally friendly practices from farm to cup.'
    },
    {
      icon: Users,
      title: 'Traditional Methods',
      description: 'Honoring Cambodian coffee traditions while embracing modern brewing techniques.'
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl font-bold mb-4">About Café Khmer</h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            A celebration of Cambodian coffee culture, bringing you authentic flavors 
            and warm hospitality in every cup
          </p>
        </div>

        {/* Story */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="relative h-96 mb-8 rounded-2xl overflow-hidden">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="font-serif text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Founded in 2020, Café Khmer was born from a passion for showcasing Cambodia's 
              incredible coffee heritage to the world. Our journey began in the misty highlands 
              of Mondulkiri, where we discovered the unique characteristics of Cambodian robusta 
              and arabica beans.
            </p>
            <p className="text-muted-foreground mb-4">
              Working directly with local farmers, we've built relationships based on trust, 
              fair trade, and a shared commitment to quality. Every bean tells a story of 
              Cambodia's rich soil, skilled cultivation, and centuries-old coffee traditions.
            </p>
            <p className="text-muted-foreground">
              Today, we're proud to serve our community in Phnom Penh, offering a space where 
              tradition meets innovation, and every cup celebrates the spirit of Cambodia.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-serif font-semibold text-xl mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
