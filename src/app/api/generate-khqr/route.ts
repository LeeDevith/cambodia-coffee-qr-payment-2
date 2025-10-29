import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

// Generate CRC16-CCITT checksum for KHQR
function crc16(data: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  crc = crc & 0xFFFF;
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Format TLV (Tag-Length-Value) for KHQR
function formatTLV(tag: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${tag}${length}${value}`;
}

// Validate Bakong account format
function validateBakongAccount(account: string): { valid: boolean; error?: string } {
  // Format should be: phonenumber@bank (e.g., 010925463@acleda)
  const bakongRegex = /^0\d{8,9}@(acleda|aba|wing|truemoney|cellcard|pipay|vattanac|canadia|campu|prince|cambodia|ftb|khqr)$/i;
  
  if (!bakongRegex.test(account)) {
    return {
      valid: false,
      error: `Invalid Bakong account format. Should be: 0XXXXXXXXX@bank (e.g., 010925463@acleda)`
    };
  }
  
  return { valid: true };
}

// Generate proper KHQR string following EMVCo standard for Bakong
function generateKHQR(accountId: string, amount: number, orderId: string): string {
  // Payload Format Indicator
  const payloadFormat = formatTLV('00', '01');
  
  // Point of Initiation Method (12 = static, 11 = dynamic)
  const initiationMethod = formatTLV('01', '12');
  
  // Merchant Account Information (tag 29 for Bakong)
  // Sub-tags for Bakong format:
  // 00 = Global Unique Identifier (Bakong identifier)
  // 01 = Payment Account ID (personal account)
  const bakongIdentifier = formatTLV('00', 'kh.gov.nbc.bakong');
  const accountNumber = formatTLV('01', accountId);
  const merchantAccountData = bakongIdentifier + accountNumber;
  const merchantAccount = formatTLV('29', merchantAccountData);
  
  // Transaction Currency (116 = KHR)
  const currency = formatTLV('53', '116');
  
  // Transaction Amount
  const amountStr = amount.toFixed(0);
  const transactionAmount = formatTLV('54', amountStr);
  
  // Country Code
  const countryCode = formatTLV('58', 'KH');
  
  // Merchant Name
  const merchantName = formatTLV('59', 'Coffee Shop');
  
  // Merchant City
  const merchantCity = formatTLV('60', 'Phnom Penh');
  
  // Additional Data Field (tag 62)
  const billNumber = formatTLV('01', orderId);
  const additionalData = formatTLV('62', billNumber);
  
  // Combine all fields except CRC
  const payload = payloadFormat + initiationMethod + merchantAccount + 
                  currency + transactionAmount + countryCode + 
                  merchantName + merchantCity + additionalData;
  
  // Calculate CRC for payload + CRC tag
  const crcInput = payload + '6304';
  const crcValue = crc16(crcInput);
  const crcField = `6304${crcValue}`;
  
  return payload + crcField;
}

export async function POST(req: NextRequest) {
  try {
    const { amount, orderId } = await req.json();

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: 'Amount and order ID are required' },
        { status: 400 }
      );
    }

    // Get personal Bakong account from environment
    const bakongAccount = process.env.BAKONG_PERSONAL_ACCOUNT;
    
    if (!bakongAccount) {
      return NextResponse.json(
        { 
          error: 'Bakong personal account not configured',
          message: 'Please add your BAKONG_PERSONAL_ACCOUNT to .env file (e.g., 012345678@wing or yourname@aba)'
        },
        { status: 500 }
      );
    }

    // Validate account format
    const validation = validateBakongAccount(bakongAccount);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: 'Invalid Bakong account configuration',
          message: validation.error
        },
        { status: 500 }
      );
    }

    // Generate proper KHQR string following EMVCo standard
    const khqrString = generateKHQR(bakongAccount, amount, orderId);

    // Generate QR code from the KHQR string
    const qrCodeDataURL = await QRCode.toDataURL(khqrString, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 400,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataURL,
      qrString: khqrString,
      mode: 'dynamic',
      amount: amount,
      orderId: orderId,
      merchantAccount: bakongAccount,
      message: 'KHQR generated successfully with embedded amount'
    });

  } catch (error) {
    console.error('KHQR generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate KHQR code', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}