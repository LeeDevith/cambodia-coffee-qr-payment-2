import { Coffee, MapPin, Clock, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Coffee className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl font-serif">Café Khmer</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Authentic Cambodian coffee experience in the heart of Phnom Penh.
              Serving locally sourced beans with traditional and modern brewing methods.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4 font-serif">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Street 240, Phnom Penh, Cambodia
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">+855 12 345 678</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">hello@cafekhmer.com</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-lg mb-4 font-serif">Opening Hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-muted-foreground">
                  <p className="font-medium text-foreground">Monday - Friday</p>
                  <p>7:00 AM - 8:00 PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 ml-6">
                <div className="text-muted-foreground">
                  <p className="font-medium text-foreground">Saturday - Sunday</p>
                  <p>8:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Café Khmer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
