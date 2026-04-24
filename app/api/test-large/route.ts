// app/api/test-large/route.ts — streams data instead of building array in memory
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mb = parseInt(searchParams.get('mb') ?? '5');

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode('{"data":"'));
      // Stream mb×1MB of 'x' chars in 64KB chunks
      const totalBytes = mb * 1024 * 1024;
      const chunk = 'x'.repeat(65536);
      let sent = 0;
      while (sent < totalBytes) {
        controller.enqueue(encoder.encode(chunk));
        sent += chunk.length;
      }
      controller.enqueue(encoder.encode('"}'));
      controller.close();
    }
  });

  return new NextResponse(stream, {
    headers: { 'Content-Type': 'application/json' }
  });
}
