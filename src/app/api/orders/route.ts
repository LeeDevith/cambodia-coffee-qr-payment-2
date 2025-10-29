import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerEmail, items, totalPrice, totalKhr } = body;

    // Validate required fields
    if (!customerName || !customerPhone || !items || !totalPrice || !totalKhr) {
      return NextResponse.json(
        { 
          error: 'Required fields missing: customerName, customerPhone, items, totalPrice, totalKhr',
          code: 'MISSING_FIELDS' 
        },
        { status: 400 }
      );
    }

    // Validate items is an array
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { 
          error: 'Items must be a non-empty array',
          code: 'INVALID_ITEMS' 
        },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (typeof totalPrice !== 'number' || totalPrice <= 0) {
      return NextResponse.json(
        { 
          error: 'totalPrice must be a positive number',
          code: 'INVALID_TOTAL_PRICE' 
        },
        { status: 400 }
      );
    }

    if (typeof totalKhr !== 'number' || totalKhr <= 0) {
      return NextResponse.json(
        { 
          error: 'totalKhr must be a positive number',
          code: 'INVALID_TOTAL_KHR' 
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedCustomerName = customerName.trim();
    const sanitizedCustomerPhone = customerPhone.trim();
    const sanitizedCustomerEmail = customerEmail ? customerEmail.trim().toLowerCase() : null;

    // Validate sanitized required fields are not empty
    if (!sanitizedCustomerName || !sanitizedCustomerPhone) {
      return NextResponse.json(
        { 
          error: 'customerName and customerPhone cannot be empty',
          code: 'EMPTY_REQUIRED_FIELDS' 
        },
        { status: 400 }
      );
    }

    // Generate orderId
    const timestamp = Date.now();
    const orderId = `ORD-${timestamp}`;

    // Generate createdAt as Unix timestamp
    const createdAt = Math.floor(timestamp / 1000);

    // Stringify items array
    const itemsJson = JSON.stringify(items);

    // Insert order into database
    const newOrder = await db.insert(orders)
      .values({
        orderId,
        customerName: sanitizedCustomerName,
        customerPhone: sanitizedCustomerPhone,
        customerEmail: sanitizedCustomerEmail,
        items: itemsJson,
        totalPrice,
        totalKhr,
        status: 'pending',
        createdAt,
        confirmedAt: null
      })
      .returning();

    return NextResponse.json(newOrder[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}