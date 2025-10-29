import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    if (!orderId) {
      return NextResponse.json(
        { 
          error: 'Order ID is required',
          code: 'MISSING_ORDER_ID'
        },
        { status: 400 }
      );
    }

    const result = await db.select()
      .from(orders)
      .where(eq(orders.orderId, orderId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { 
          error: 'Order not found',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const order = result[0];

    // Parse items JSON string back to array
    const orderWithParsedItems = {
      ...order,
      items: JSON.parse(order.items)
    };

    return NextResponse.json(orderWithParsedItems, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}