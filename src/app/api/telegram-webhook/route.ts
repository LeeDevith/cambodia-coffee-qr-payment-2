import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle callback query (button press)
    if (body.callback_query) {
      const callbackQuery = body.callback_query;
      const data = callbackQuery.data; // Format: "confirm:ORDER_ID"
      const chatId = callbackQuery.message.chat.id;
      const messageId = callbackQuery.message.message_id;

      if (data.startsWith('confirm:')) {
        const orderId = data.replace('confirm:', '');

        // Update order status in database
        const confirmResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/orders/${orderId}/confirm`, {
          method: 'PATCH',
        });

        if (confirmResponse.ok) {
          // Edit the message to show confirmation
          const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
          const editUrl = `https://api.telegram.org/bot${telegramBotToken}/editMessageText`;

          const originalMessage = callbackQuery.message.text;
          const updatedMessage = originalMessage + `\n\n✅ *PAYMENT CONFIRMED* ✅\n⏰ Confirmed at: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' })}`;

          await fetch(editUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: messageId,
              text: updatedMessage,
              parse_mode: 'Markdown',
            }),
          });

          // Answer callback query to remove loading state
          const answerUrl = `https://api.telegram.org/bot${telegramBotToken}/answerCallbackQuery`;
          await fetch(answerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              callback_query_id: callbackQuery.id,
              text: '✅ Payment confirmed!',
            }),
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ ok: true }); // Always return ok to Telegram
  }
}
