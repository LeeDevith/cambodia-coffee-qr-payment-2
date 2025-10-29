import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    if (!orderId) {
      return NextResponse.json(
        { 
          error: "Order ID is required",
          code: "MISSING_ORDER_ID" 
        },
        { status: 400 }
      );
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const updatedOrder = await db
      .update(orders)
      .set({
        status: 'confirmed',
        confirmedAt: currentTimestamp
      })
      .where(eq(orders.orderId, orderId))
      .returning();

    if (updatedOrder.length === 0) {
      return NextResponse.json(
        { 
          error: "Order not found",
          code: "NOT_FOUND" 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedOrder[0], { status: 200 });

  } catch (error) {
    console.error('PATCH /api/orders/[orderId]/confirm error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}