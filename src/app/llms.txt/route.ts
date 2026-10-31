import { getLlmsOverview } from '@/lib/llms-content';

export const dynamic = 'force-static';

export function GET() {
  return new Response(getLlmsOverview(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
