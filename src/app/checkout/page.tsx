"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/coffee-data';
import { Minus, Plus, Trash2, Loader2, CheckCircle2, QrCode, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Static KHQR image URL
const STATIC_KHQR_IMAGE = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1761630578792.png?width=8000&height=8000&resize=contain';

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'cart' | 'info' | 'payment' | 'success'>('cart');
  const [orderId, setOrderId] = useState<string>('');
  const [orderStatus, setOrderStatus] = useState<'pending' | 'confirmed' | 'completed'>('pending');
  const [isPolling, setIsPolling] = useState(false);

  // Poll order status
  useEffect(() => {
    if (!orderId || paymentStep !== 'payment') return;

    setIsPolling(true);
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          const order = await response.json();
          setOrderStatus(order.status);
          
          if (order.status === 'confirmed') {
            setIsPolling(false);
            clearInterval(pollInterval);
            toast.success('Payment confirmed!');
            setTimeout(() => {
              setPaymentStep('success');
              clearCart();
            }, 1500);
          }
        }
      } catch (error) {
        console.error('Error polling order status:', error);
      }
    }, 3000); // Poll every 3 seconds

    return () => {
      clearInterval(pollInterval);
      setIsPolling(false);
    };
  }, [orderId, paymentStep, clearCart]);

  useEffect(() => {
    if (items.length === 0 && paymentStep === 'cart') {
      // Cart is empty
    }
  }, [items, paymentStep]);

  const handleUpdateQuantity = (id: string, newQuantity: number, size?: string) => {
    updateQuantity(id, newQuantity, size);
  };

  const handleRemoveItem = (id: string, size?: string) => {
    removeItem(id, size);
    toast.success('Item removed from cart');
  };

  const handleProceedToInfo = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setPaymentStep('info');
  };

  const handleGeneratePayment = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    try {
      const totalKHR = Math.round(totalPrice * 4100);
      
      // Create order in database
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerInfo.name,
          customerPhone: customerInfo.phone,
          customerEmail: customerInfo.email || null,
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
          })),
          totalPrice,
          totalKhr: totalKHR,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const order = await orderResponse.json();
      setOrderId(order.orderId);
      setOrderStatus('pending');

      // Send notification to Telegram with confirmation button
      await fetch('/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.orderId,
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalPrice,
          totalKHR,
          customerInfo,
        }),
      });

      setPaymentStep('payment');
      toast.success('Ready to pay! Scan the QR code');
    } catch (error) {
      console.error('Payment generation error:', error);
      toast.error('Failed to proceed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const prices = formatPrice(totalPrice);
  const totalKHR = Math.round(totalPrice * 4100);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="font-serif text-4xl font-bold mb-8 text-center">Checkout</h1>

        <div className="max-w-6xl mx-auto">
          {paymentStep === 'cart' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Shopping Cart ({items.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {items.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">Your cart is empty</p>
                        <Link href="/menu">
                          <Button>Browse Menu</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {items.map((item) => {
                          const itemPrices = formatPrice(item.price);
                          return (
                            <div key={`${item.id}-${item.size}`} className="flex gap-4 pb-4 border-b last:border-0">
                              <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold">{item.name}</h3>
                                {item.size && (
                                  <p className="text-sm text-muted-foreground capitalize">{item.size}</p>
                                )}
                                <p className="text-sm text-primary font-medium mt-1">
                                  {itemPrices.usd} <span className="text-muted-foreground">/ {itemPrices.khr}</span>
                                </p>
                              </div>
                              <div className="flex flex-col items-end justify-between">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveItem(item.id, item.size)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.size)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.size)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{prices.usd}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal (KHR)</span>
                        <span>{prices.khr}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <div className="text-right">
                        <div>{prices.usd}</div>
                        <div className="text-sm text-muted-foreground font-normal">{prices.khr}</div>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleProceedToInfo}
                      disabled={items.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {paymentStep === 'info' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-2xl mx-auto"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+855 12 345 678"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    />
                  </div>

                  <Separator />

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Total Amount:</span>
                      <div className="text-right">
                        <div className="font-bold text-lg">{prices.usd}</div>
                        <div className="text-sm text-muted-foreground">{totalKHR.toLocaleString()}៛</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setPaymentStep('cart')}
                    >
                      Back to Cart
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleGeneratePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <QrCode className="mr-2 h-4 w-4" />
                          Generate KHQR
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {paymentStep === 'payment' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Scan to Pay with KHQR</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Scan this QR code with your ACLEDA or Bakong app
                    </p>
                    <div className="flex justify-center">
                      <div className="bg-white p-4 rounded-xl shadow-lg inline-block">
                        <Image
                          src={STATIC_KHQR_IMAGE}
                          alt="KHQR Payment Code - KHA DAVID"
                          width={300}
                          height={300}
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span className="font-mono font-semibold">{orderId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Amount to Pay:</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{totalKHR.toLocaleString()}៛</div>
                        <div className="text-sm text-muted-foreground">({prices.usd})</div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pay to:</span>
                      <span className="font-semibold">KHA DAVID</span>
                    </div>
                  </div>

                  <div className="text-center text-sm text-muted-foreground space-y-1">
                    <p className="font-semibold">Payment Steps:</p>
                    <ol className="text-left space-y-1 max-w-md mx-auto">
                      <li>1. Open your ACLEDA or Bakong banking app</li>
                      <li>2. Scan the QR code above</li>
                      <li>3. Enter the exact amount: <strong className="text-foreground">{totalKHR.toLocaleString()}៛</strong></li>
                      <li>4. Complete the payment in your banking app</li>
                      <li>5. Wait for shop owner to confirm your payment</li>
                    </ol>
                  </div>

                  {orderStatus === 'pending' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center gap-3"
                    >
                      <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 animate-spin" />
                      <div className="text-sm">
                        <p className="font-semibold text-blue-900 dark:text-blue-100">Please wait...</p>
                        <p className="text-blue-700 dark:text-blue-300">Waiting for shop owner to confirm your payment. This usually takes 1-2 minutes.</p>
                      </div>
                    </motion.div>
                  )}

                  {orderStatus === 'confirmed' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-semibold text-green-900 dark:text-green-100">Your payment is successful!</p>
                        <p className="text-green-700 dark:text-green-300">Thank you for your order. We will prepare your coffee shortly.</p>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {paymentStep === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="text-center">
                <CardContent className="pt-12 pb-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
                  </motion.div>
                  <h2 className="font-serif text-3xl font-bold mb-4">Order Confirmed!</h2>
                  <p className="text-muted-foreground mb-2">
                    Thank you for your order, {customerInfo.name}!
                  </p>
                  <p className="text-sm text-muted-foreground mb-8">
                    Order ID: <span className="font-mono font-semibold">{orderId}</span>
                  </p>
                  <p className="text-muted-foreground mb-8">
                    We've received your payment and our team has been notified. 
                    Your delicious coffee will be ready soon!
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link href="/menu">
                      <Button variant="outline">Order More</Button>
                    </Link>
                    <Link href="/">
                      <Button>Back to Home</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}