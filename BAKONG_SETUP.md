# Bakong KHQR Setup Guide

## Why Your KHQR Failed with ACLEDA Bank

The previous implementation used **placeholder/demo credentials** (`cafe_khmer@aba`) which don't work with real banking apps. To accept real payments through KHQR with ACLEDA or any Cambodian bank, you need **real merchant credentials** from the Bakong system.

## What is Bakong KHQR?

Bakong is Cambodia's national payment system managed by the National Bank of Cambodia. KHQR (Khmer QR) is the standard QR payment system that works across all Cambodian banks including ACLEDA, ABA, Wing, Pi Pay, etc.

## How to Get Bakong Merchant Credentials

### Option 1: Register with ACLEDA Bank (Recommended for your case)

Since you're testing with ACLEDA bank app, register directly with them:

1. **Visit ACLEDA Branch**
   - Go to your nearest ACLEDA Bank branch
   - Bring your business registration documents or personal ID

2. **Request Bakong Merchant Account**
   - Ask to register as a Bakong merchant
   - Tell them you want to accept KHQR payments for your business
   - They may call it "ACLEDA QR Merchant" or "Bakong Merchant Services"

3. **Provide Business Information**
   - Business name: Cafe Khmer (or your actual business name)
   - Business type: Café/Restaurant
   - Business location: Your address
   - Expected transaction volume

4. **Receive Your Credentials**
   After approval (usually 1-3 business days), you'll receive:
   - **Bakong Account ID**: Your unique account identifier (e.g., `cafekm@acleda` or `012345678@acleda`)
   - **Merchant ID**: Your merchant identification number
   - **Acquiring Bank Code**: For ACLEDA, this is typically `acleda` or their specific code
   - Optional: API access credentials if you need webhook notifications

### Option 2: Register with Other Banks

You can also register with:
- **ABA Bank**: Popular for businesses, good API documentation
- **Wing Bank**: Widely used in Cambodia
- **Pi Pay**: Digital wallet with merchant services
- **Sathapana Bank**: Good for small businesses

The process is similar - visit a branch and request Bakong merchant registration.

### Option 3: Bakong Direct Registration (For larger businesses)

For established businesses, you can register directly with NBC:
- Visit: [https://bakong.nbc.org.kh](https://bakong.nbc.org.kh)
- Contact National Bank of Cambodia for merchant onboarding

## Required Environment Variables

Once you have your credentials, update your `.env` file:

```bash
# Bakong KHQR Configuration
BAKONG_ACCOUNT_ID=your_account@acleda        # Your Bakong account ID from the bank
BAKONG_MERCHANT_ID=CAFE001                   # Merchant ID provided by the bank
BAKONG_ACQUIRING_BANK=acleda                 # Bank code (acleda, aba, wing, etc.)
BAKONG_MERCHANT_NAME=Cafe Khmer              # Your business display name
BAKONG_MERCHANT_CITY=Phnom Penh              # Your business city
```

### Example with Real Format:

```bash
BAKONG_ACCOUNT_ID=012345678@acleda
BAKONG_MERCHANT_ID=CAFEKM001
BAKONG_ACQUIRING_BANK=acleda
BAKONG_MERCHANT_NAME=Cafe Khmer
BAKONG_MERCHANT_CITY=Phnom Penh
```

## Common Bakong Bank Codes

- `acleda` - ACLEDA Bank
- `aba` - ABA Bank
- `wing` - Wing Bank
- `ppcb` - Phnom Penh Commercial Bank
- `canadia` - Canadia Bank
- `sathapana` - Sathapana Bank

## Testing Your Integration

### Before You Have Real Credentials

The app will show an error: "Bakong credentials not configured" - this is expected until you add real credentials.

### After Adding Real Credentials

1. Add an item to cart ($0.001 Cambodian Robusta for testing)
2. Proceed to checkout
3. Enter customer information
4. Generate KHQR code
5. Scan with your ACLEDA banking app
6. The payment should go through successfully!

## Costs and Fees

- **Setup Fee**: Usually FREE for small businesses
- **Monthly Fee**: FREE to ~$5-10 depending on bank
- **Transaction Fee**: ~0.5% - 1.5% per transaction (negotiable)
- **Settlement**: Usually T+1 or T+2 (next business day)

## Webhook Notifications (Optional)

Some banks provide webhook APIs to automatically verify payments. Ask your bank about:
- Payment confirmation webhooks
- Transaction status APIs
- Settlement reports

This would allow you to automatically confirm payments instead of manual confirmation.

## Important Notes

⚠️ **Security**:
- Never share your merchant credentials publicly
- Keep your `.env` file secure and never commit it to git
- The `.env` file is already in `.gitignore`

⚠️ **Testing**:
- Use small amounts (like $0.001) for testing
- Real money will be transferred during testing
- You can refund test transactions through your merchant portal

⚠️ **Production**:
- Update prices back to real values before going live
- Consider adding payment verification webhooks
- Set up proper accounting and reconciliation

## Support

- **ACLEDA Business Support**: 023 994 444
- **Bakong Helpline**: 023 969 696
- **National Bank of Cambodia**: [https://www.nbc.org.kh](https://www.nbc.org.kh)

## Next Steps

1. ✅ Visit your bank to register as a Bakong merchant
2. ✅ Receive your credentials (1-3 business days)
3. ✅ Update your `.env` file with real credentials
4. ✅ Test the payment flow with a small amount
5. ✅ Go live with real pricing!

---

**Current Status**: Your app is now properly configured to use real Bakong KHQR once you add your merchant credentials. The `bakong-khqr` library is already installed and the API is ready to generate valid QR codes that work with all Cambodian banking apps! 🎉
