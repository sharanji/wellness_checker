import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server';

type ResponseData = {
    message: string
}

export function GET(req: NextApiRequest) {
    return NextResponse.json({
        message: "Api Service of Wellness App",
    });
}