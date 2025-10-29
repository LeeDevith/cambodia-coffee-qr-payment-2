# Café Khmer - Setup Guide

## 🚀 Getting Started

This is a modern coffee shop website for Cambodia with KHQR payment integration and Telegram bot notifications.

### Features

✅ Beautiful Cambodian-inspired design  
✅ Full menu with product cards  
✅ Shopping cart functionality  
✅ Dual currency display (USD/KHR)  
✅ KHQR payment integration  
✅ Telegram bot notifications for orders  
✅ Responsive mobile-friendly design  
✅ Smooth animations with Framer Motion  

---

## 📱 Setting Up Telegram Bot Notifications

To receive order notifications via Telegram, follow these steps:

### Step 1: Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Start a chat and send `/newbot`
3. Follow the prompts to choose a name and username for your bot
4. BotFather will provide you with a **Bot Token** - save this!
   - Example: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

### Step 2: Get Your Chat ID

1. Search for [@userinfobot](https://t.me/userinfobot) on Telegram
2. Start a chat with the bot
3. It will send you your **Chat ID** - save this!
   - Example: `987654321`

**OR** if you want to send to a group/channel:

1. Add your bot to the group/channel
2. Make the bot an admin
3. Send a test message in the group
4. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
5. Look for the `"chat":{"id":` field to find your Chat ID

### Step 3: Configure Environment Variables

1. Create a `.env.local` file in the root of your project:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your credentials:

```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=987654321
```

3. Restart your development server

---

## 🏃 Running the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the website.

---

## 📝 How It Works

### Order Flow

1. **Browse Menu**: Users view coffee products with prices in USD and KHR
2. **Add to Cart**: Items are added to shopping cart with quantity controls
3. **Checkout**: Users enter their contact information
4. **KHQR Payment**: System generates a QR code for payment
5. **Confirmation**: After payment, order details are sent to Telegram bot
6. **Success**: User receives confirmation and order ID

### Payment Integration

The KHQR integration is simplified for this demo. For production use:

- Integrate with official BAKONG KHQR libraries
- Implement proper payment verification
- Add webhook for automatic payment confirmation
- Store orders in a database

### Telegram Notifications

When an order is confirmed, the Telegram bot sends a formatted message containing:

- Order ID
- Items ordered with quantities
- Total price in USD and KHR
- Customer information
- Timestamp

---

## 🎨 Customization

### Update Coffee Menu

Edit `src/lib/coffee-data.ts` to add/modify coffee products:

```typescript
export const coffeeProducts: CoffeeProduct[] = [
  {
    id: '1',
    name: 'Your Coffee Name',
    description: 'Description here',
    price: 3.5, // USD
    image: 'https://your-image-url.com',
    category: 'hot', // or 'iced', 'specialty'
    featured: true, // Shows on homepage
  },
  // Add more products...
];
```

### Update Exchange Rate

Modify the USD to KHR rate in `src/lib/coffee-data.ts`:

```typescript
export const USD_TO_KHR = 4100; // Update this value
```

### Change Colors

Edit `src/app/globals.css` to customize the color scheme:

```css
:root {
  --primary: oklch(0.42 0.15 35); /* Brown coffee color */
  --background: oklch(0.98 0.01 70); /* Warm beige */
  /* ... more colors */
}
```

---

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
4. Deploy!

### Important Notes

- Keep your Telegram credentials secure
- Never commit `.env.local` to version control
- Test thoroughly before accepting real payments
- For production, implement proper KHQR with BAKONG APIs

---

## 📚 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: Shadcn/UI + Tailwind CSS
- **Animations**: Framer Motion
- **QR Generation**: qrcode library
- **State Management**: React Context
- **Notifications**: Sonner (toast) + Telegram Bot API

---

## 🆘 Troubleshooting

### Telegram notifications not working

- ✅ Check if `TELEGRAM_BOT_TOKEN` is correct
- ✅ Verify `TELEGRAM_CHAT_ID` is correct
- ✅ Make sure you've started a chat with your bot
- ✅ Check browser console for errors
- ✅ Restart dev server after adding env variables

### Cart not persisting

- Items are saved to localStorage
- Clear browser cache if issues occur

### Images not loading

- Check Unsplash URLs are accessible
- Replace with your own images in production

---

## 📄 License

This project is open source and available for modification.

---

## 🙏 Support

For questions or issues, please contact the development team.

**Enjoy your Café Khmer website! ☕🇰🇭**
