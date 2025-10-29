"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/coffee-data';
import { Minus, Plus, Trash2, Loader2, CheckCircle2, QrCode, AlertCircle, ShoppingCart, User, CreditCard, Check, Coffee, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Static KHQR image URL
const STATIC_KHQR_IMAGE = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1761630578792.png?width=8000&height=8000&resize=contain';

const steps = [
  { id: 'cart', label: 'Cart', icon: ShoppingCart },
  { id: 'info', label: 'Information', icon: User },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'success', label: 'Complete', icon: Check }
];

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
    }, 3000);

    return () => {
      clearInterval(pollInterval);
      setIsPolling(false);
    };
  }, [orderId, paymentStep, clearCart]);

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
  const currentStepIndex = steps.findIndex(s => s.id === paymentStep);

  return (
    <div className="min-h-screen py-8 md:py-16 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header with Step Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Checkout
          </h1>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8 relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-muted -z-10">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-primary/70"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
            
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === paymentStep;
              const isCompleted = index < currentStepIndex;
              
              return (
                <motion.div
                  key={step.id}
                  className="flex flex-col items-center relative"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/50' 
                        : isActive 
                        ? 'bg-primary/10 border-primary text-primary shadow-md' 
                        : 'bg-background border-muted-foreground/30 text-muted-foreground'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </motion.div>
                  <span className={`text-xs md:text-sm font-medium hidden md:block ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {paymentStep === 'cart' && (
              <motion.div
                key="cart"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <Card className="backdrop-blur-sm bg-card/80 border-2 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        Shopping Cart ({items.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {items.length === 0 ? (
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-center py-16"
                        >
                          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                            <Coffee className="h-12 w-12 text-muted-foreground/50" />
                          </div>
                          <p className="text-muted-foreground mb-6 text-lg">Your cart is empty</p>
                          <Link href="/menu">
                            <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                              <Coffee className="mr-2 h-4 w-4" />
                              Browse Menu
                            </Button>
                          </Link>
                        </motion.div>
                      ) : (
                        <div className="space-y-4">
                          <AnimatePresence>
                            {items.map((item, index) => {
                              const itemPrices = formatPrice(item.price);
                              return (
                                <motion.div
                                  key={`${item.id}-${item.size}`}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, x: -100 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex gap-4 pb-4 border-b last:border-0 group"
                                >
                                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fill
                                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    {item.size && (
                                      <p className="text-sm text-muted-foreground capitalize flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-primary/50" />
                                        {item.size}
                                      </p>
                                    )}
                                    <p className="text-sm text-primary font-semibold mt-1">
                                      {itemPrices.usd} <span className="text-muted-foreground font-normal">/ {itemPrices.khr}</span>
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end justify-between">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveItem(item.id, item.size)}
                                      className="hover:bg-destructive/10 hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-primary/10 hover:border-primary"
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.size)}
                                      >
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                      <span className="w-10 text-center font-semibold text-lg">{item.quantity}</span>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-primary/10 hover:border-primary"
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.size)}
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Order Summary */}
                <div>
                  <Card className="sticky top-24 backdrop-blur-sm bg-card/80 border-2 shadow-xl">
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium">{prices.usd}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal (KHR)</span>
                          <span className="font-medium">{prices.khr}</span>
                        </div>
                      </div>
                      <Separator />
                      <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">Total</span>
                          <div className="text-right">
                            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                              {prices.usd}
                            </div>
                            <div className="text-sm text-muted-foreground font-normal">{prices.khr}</div>
                          </div>
                        </div>
                      </div>
                      <Button 
                        className="w-full shadow-lg hover:shadow-xl transition-all" 
                        size="lg"
                        onClick={handleProceedToInfo}
                        disabled={items.length === 0}
                      >
                        Proceed to Checkout
                        <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {paymentStep === 'info' && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto"
              >
                <Card className="backdrop-blur-sm bg-card/80 border-2 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Label htmlFor="name" className="text-base font-semibold">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Enter your name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                          className="h-12 text-base"
                        />
                      </motion.div>
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label htmlFor="phone" className="text-base font-semibold">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+855 12 345 678"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                          className="h-12 text-base"
                        />
                      </motion.div>
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Label htmlFor="email" className="text-base font-semibold">Email (Optional)</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          className="h-12 text-base"
                        />
                      </motion.div>
                    </div>

                    <Separator />

                    <motion.div 
                      className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 p-6 rounded-xl border-2 border-primary/20"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">Total Amount:</span>
                        <div className="text-right">
                          <div className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            {prices.usd}
                          </div>
                          <div className="text-sm text-muted-foreground">{totalKHR.toLocaleString()}៛</div>
                        </div>
                      </div>
                    </motion.div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        className="flex-1 h-12"
                        onClick={() => setPaymentStep('cart')}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Cart
                      </Button>
                      <Button
                        className="flex-1 h-12 shadow-lg hover:shadow-xl transition-all"
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
                key="payment"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto"
              >
                <Card className="backdrop-blur-sm bg-card/80 border-2 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
                      <CreditCard className="h-6 w-6 text-primary" />
                      Scan to Pay with KHQR
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <motion.div 
                      className="text-center"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-muted-foreground mb-6 text-lg">
                        Scan this QR code with your <span className="font-semibold text-primary">ACLEDA</span> or <span className="font-semibold text-primary">Bakong</span> app
                      </p>
                      <div className="flex justify-center">
                        <motion.div 
                          className="bg-white p-6 rounded-2xl shadow-2xl inline-block ring-4 ring-primary/10"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Image
                            src={STATIC_KHQR_IMAGE}
                            alt="KHQR Payment Code - KHA DAVID"
                            width={300}
                            height={300}
                            className="rounded-xl"
                          />
                        </motion.div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="bg-gradient-to-br from-muted/80 to-muted/40 p-6 rounded-xl space-y-3 border"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">Order ID:</span>
                        <span className="font-mono font-bold text-lg bg-background px-3 py-1 rounded">{orderId}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground font-medium text-lg">Amount to Pay:</span>
                        <div className="text-right">
                          <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            {totalKHR.toLocaleString()}៛
                          </div>
                          <div className="text-sm text-muted-foreground">({prices.usd})</div>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">Pay to:</span>
                        <span className="font-bold text-lg">KHA DAVID</span>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="bg-muted/30 p-6 rounded-xl"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="font-semibold mb-3 text-center text-lg">Payment Steps:</p>
                      <ol className="space-y-2 text-sm">
                        {[
                          'Open your ACLEDA or Bakong banking app',
                          'Scan the QR code above',
                          `Enter the exact amount: ${totalKHR.toLocaleString()}៛`,
                          'Complete the payment in your banking app',
                          'Wait for shop owner to confirm your payment'
                        ].map((step, index) => (
                          <motion.li 
                            key={index}
                            className="flex items-start gap-3"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            <span className="text-muted-foreground pt-0.5">{step}</span>
                          </motion.li>
                        ))}
                      </ol>
                    </motion.div>

                    <AnimatePresence mode="wait">
                      {orderStatus === 'pending' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-300 dark:border-blue-700 rounded-xl p-5 flex items-center gap-4 shadow-lg"
                        >
                          <Loader2 className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 animate-spin" />
                          <div className="text-sm">
                            <p className="font-bold text-blue-900 dark:text-blue-100 mb-1">Waiting for confirmation...</p>
                            <p className="text-blue-700 dark:text-blue-300">The shop owner will confirm your payment shortly. This usually takes 1-2 minutes.</p>
                          </div>
                        </motion.div>
                      )}

                      {orderStatus === 'confirmed' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-300 dark:border-green-700 rounded-xl p-5 flex items-center gap-4 shadow-lg"
                        >
                          <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-bold text-green-900 dark:text-green-100 mb-1">Payment Successful!</p>
                            <p className="text-green-700 dark:text-green-300">Thank you for your order. We will prepare your coffee shortly.</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {paymentStep === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl mx-auto"
              >
                <Card className="text-center backdrop-blur-sm bg-card/80 border-2 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-primary/5 pointer-events-none" />
                  <CardContent className="pt-16 pb-16 relative">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl" />
                      <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-8 relative" />
                    </motion.div>
                    
                    <motion.h2 
                      className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Order Confirmed!
                    </motion.h2>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="text-muted-foreground mb-2 text-lg">
                        Thank you for your order, <span className="font-semibold text-foreground">{customerInfo.name}</span>!
                      </p>
                      <div className="inline-block bg-muted/50 px-4 py-2 rounded-lg mb-8">
                        <p className="text-sm text-muted-foreground">
                          Order ID: <span className="font-mono font-bold text-foreground">{orderId}</span>
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.p 
                      className="text-muted-foreground mb-10 max-w-md mx-auto text-lg leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      We've received your payment and our team has been notified. 
                      Your delicious coffee will be ready soon!
                    </motion.p>
                    
                    <motion.div 
                      className="flex gap-4 justify-center flex-wrap"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Link href="/menu">
                        <Button variant="outline" size="lg" className="shadow-lg hover:shadow-xl transition-all">
                          <Coffee className="mr-2 h-4 w-4" />
                          Order More
                        </Button>
                      </Link>
                      <Link href="/">
                        <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
                          Back to Home
                          <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                        </Button>
                      </Link>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}