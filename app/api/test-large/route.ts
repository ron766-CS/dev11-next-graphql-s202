import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mb = parseInt(searchParams.get('mb') ?? '5');
  
  // Generate ~mb MB of JSON
  const payload = {
    data: Array.from({ length: mb * 1000 }, (_, i) => ({
      id: i,
      content: 'x'.repeat(1024), // 1KB per item
    }))
  };
  
  return NextResponse.json(payload);
}
