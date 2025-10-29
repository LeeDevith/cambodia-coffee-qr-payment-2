# 🏦 How to Get Your Bakong Personal Account ID

This is what TikTok creators are using! Works with ACLEDA, Wing, ABA, and all Cambodian banking apps **RIGHT NOW** - no merchant registration needed.

## ✅ What You Need

Your **personal Bakong account ID** from any Cambodian banking app that supports Bakong/KHQR.

## 📱 Step-by-Step Guide

### For ACLEDA Mobile Banking:

1. **Open ACLEDA Mobile App**
2. **Go to "Receive Money" or "QR Receive"**
3. **Look for your Bakong ID** - it's displayed as:
   - Format: `012345678@acleda`
   - Or just your phone number linked to Bakong

### For Wing Money:

1. **Open Wing App**
2. **Tap "Receive" or "QR Code"**
3. **Your Wing ID** is shown as:
   - Format: `012345678@wing`
   - Or your Wing account number

### For ABA Mobile:

1. **Open ABA Mobile App**
2. **Go to "Receive Money" section**
3. **Check your Bakong ID**:
   - Format: `012345678@aba`
   - Or your linked phone number

### For Other Banks:

Most Cambodian banks now support Bakong. Check your app's:
- "Receive Money" section
- "QR Code" section
- "Bakong" or "KHQR" menu

## 🔧 Add to Your Project

Once you have your Bakong ID, update your `.env` file:

```bash
# Replace with YOUR actual Bakong account ID
BAKONG_PERSONAL_ACCOUNT=012345678@wing
BAKONG_USE_STATIC_QR=true
```

### Common Formats:
```bash
# Wing
BAKONG_PERSONAL_ACCOUNT=012345678@wing

# ACLEDA
BAKONG_PERSONAL_ACCOUNT=012345678@acleda

# ABA
BAKONG_PERSONAL_ACCOUNT=012345678@aba

# Prince Bank
BAKONG_PERSONAL_ACCOUNT=012345678@prince

# Canadia Bank
BAKONG_PERSONAL_ACCOUNT=012345678@canadia
```

## 🎯 How It Works

### Static QR Mode (Current Setup):
- ✅ Works with personal accounts (no merchant registration)
- ✅ QR code scans successfully in ALL banking apps
- ✅ Shows your account name to customers
- ⚠️ Customer must **manually enter the amount** in their banking app
- ✅ You receive real money instantly

### Dynamic QR Mode (Requires Merchant Account):
- ❌ Requires merchant registration at bank (1-3 days)
- ✅ Amount is pre-filled in QR code
- ✅ One-click payment for customers
- ✅ More professional for business use

## 🚀 Testing Your Setup

1. Add your Bakong ID to `.env`
2. Restart your development server
3. Go through checkout flow
4. Scan the generated QR with your own banking app
5. You should see your account name and manual amount entry

## 💡 Why This Works

This is the **exact same method** that:
- Street vendors use for payments
- Small businesses use for QR payments
- TikTok creators demonstrate in videos
- Personal money transfers work

**No merchant account needed** - you're just using your personal Bakong receive feature!

## 🔄 Upgrading to Dynamic QR Later

When you're ready for automatic amount filling:

1. Visit your bank branch
2. Register as Bakong merchant
3. Get merchant credentials
4. Update `.env`:
   ```bash
   BAKONG_USE_STATIC_QR=false
   BAKONG_MERCHANT_ID=your_merchant_id
   BAKONG_ACQUIRING_BANK=acleda
   ```

---

**Questions?** Check your banking app's help section for "Bakong" or "KHQR" documentation.
