# KHQR Account Setup Guide

## Problem: "Account Not Found" Error When Scanning QR Code

If your QR code scans successfully and shows the amount, but ACLEDA shows "មិនឃើញគណនី" (Account not found), your Bakong account is **not properly set up to receive KHQR payments**.

---

## Solution: Set Up Your ACLEDA Account for KHQR

### Step 1: Verify Your Bakong Account Exists

1. Open your **ACLEDA Unity mobile app**
2. Go to **Profile** or **Settings**
3. Look for **Bakong ID** or **QR Code** section
4. Your Bakong ID should look like: `010925463@acleda`

### Step 2: Enable KHQR Receiving (CRITICAL)

**Option A: Through ACLEDA Unity App**
1. Open ACLEDA Unity app
2. Go to **QR Code** menu
3. Select **My QR Code** or **Receive Money**
4. You should see your personal KHQR code
5. If you can generate this, your account is enabled

**Option B: Register at Bank Branch**
1. Visit any ACLEDA bank branch
2. Request to **activate Bakong KHQR merchant receiving**
3. Provide your account number
4. They will enable KHQR receiving for your account

### Step 3: Get Your Correct Bakong ID

Your Bakong ID format must be **EXACT**:

```
Format: [phone_number]@[bank]
Example: 010925463@acleda
```

**To find your correct Bakong ID:**

1. Open ACLEDA Unity app
2. Go to **QR Code** → **My QR Code**
3. Look for text like "Bakong ID" or scan your own QR code with another phone
4. The format should show: `0XXXXXXXXX@acleda`

### Step 4: Test Your Account

1. Get a friend to scan YOUR personal QR code from ACLEDA app
2. Have them try to send you a small amount (100៛)
3. If it works, your account is properly set up
4. Copy that exact Bakong ID to your `.env` file

---

## Update Your .env File

Once you have your **correct and verified** Bakong ID:

```env
# Replace with YOUR actual verified Bakong ID
BAKONG_PERSONAL_ACCOUNT=010925463@acleda
```

**Important Notes:**

- The phone number should be the one registered with your ACLEDA account
- It must match EXACTLY what's in your Bakong profile
- The account must be **enabled to receive** KHQR payments

---

## Alternative: Use Different Bank

If ACLEDA doesn't work, try these banks that support personal KHQR:

```env
# Wing Bank
BAKONG_PERSONAL_ACCOUNT=010925463@wing

# ABA Bank  
BAKONG_PERSONAL_ACCOUNT=010925463@aba

# TrueMoney
BAKONG_PERSONAL_ACCOUNT=010925463@truemoney
```

---

## Testing Checklist

✅ Your Bakong ID is visible in your banking app  
✅ You can generate your own personal QR code in the app  
✅ Someone else can scan your personal QR and see your account  
✅ The Bakong ID format is: `0XXXXXXXXX@bank`  
✅ The phone number matches your registered account  

---

## Common Issues

### Issue 1: "Account Not Found"
**Cause:** Account not registered with Bakong or KHQR receiving not enabled  
**Solution:** Visit bank branch to enable Bakong KHQR receiving

### Issue 2: "Invalid QR Code"
**Cause:** Wrong QR code format  
**Solution:** Code is correct now, check your account setup instead

### Issue 3: "Cannot Select Payment Account"
**Cause:** Your receiving account doesn't exist in Bakong system  
**Solution:** Verify your Bakong ID in your banking app matches `.env` file exactly

---

## Need Help?

1. **Call ACLEDA Hotline:** 023 994 444
2. **Visit ACLEDA Branch:** Ask to enable "Bakong KHQR merchant receiving"
3. **Check Bakong Website:** https://bakong.nbc.org.kh

---

## After Setup

Once your account is properly registered:

1. Update `.env` with correct Bakong ID
2. Restart your development server
3. Generate a new QR code
4. Test with your own phone
5. You should see your account available for payment

The QR code format in your application is **already correct** - you just need to ensure your receiving account is properly set up with your bank! 🎯
