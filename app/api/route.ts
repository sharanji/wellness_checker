import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server';

type ResponseData = {
    message: string
}

export function GET(req: NextRequest) {
    return NextResponse.json({
        message: "Api Service of Wellness App",
    });
}