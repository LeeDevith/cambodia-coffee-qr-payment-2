import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, items, totalPrice, totalUSD, totalKHR, customerInfo, customerName, customerPhone } = body;

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramBotToken || !telegramChatId) {
      console.warn('Telegram credentials not configured');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Telegram not configured. Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables.' 
        },
        { status: 400 }
      );
    }

    // Support both formats: totalPrice or totalUSD
    const finalTotalUSD = totalPrice || totalUSD || 0;
    const finalTotalKHR = totalKHR || Math.round(finalTotalUSD * 4100);

    // Support both customerInfo object and direct fields
    const customerName_final = customerInfo?.name || customerName || 'N/A';
    const customerPhone_final = customerInfo?.phone || customerPhone || 'N/A';
    const customerEmail = customerInfo?.email || 'N/A';

    // Format order details
    const itemsList = items
      .map((item: any) => `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`)
      .join('\n');

    const message = `
🔔 *NEW ORDER RECEIVED* 🔔

📋 *Order ID:* ${orderId}

☕ *Items:*
${itemsList}

💰 *Total:* $${finalTotalUSD.toFixed(2)} (≈${finalTotalKHR.toLocaleString()}៛)

👤 *Customer Info:*
Name: ${customerName_final}
Phone: ${customerPhone_final}
Email: ${customerEmail}

⏰ *Time:* ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' })}

⚠️ *Action Required:* Please confirm when payment is received
    `.trim();

    // Send message to Telegram with inline keyboard
    const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '✅ Confirm Payment Received',
                callback_data: `confirm:${orderId}`
              }
            ]
          ]
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.description || 'Failed to send Telegram message');
    }

    return NextResponse.json({
      success: true,
      message: 'Order notification sent to Telegram',
    });
  } catch (error: any) {
    console.error('Error sending Telegram message:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to send Telegram notification' 
      },
      { status: 500 }
    );
  }
}