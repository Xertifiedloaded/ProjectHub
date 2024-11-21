import { NextRequest, NextResponse } from 'next/server';
import * as authUtils from '@/utils/auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
  };
}

export async function authMiddleware(req: NextRequest) {
  try {
    const token = req.cookies.get('authToken')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized: No token' }, 
        { status: 401 }
      );
    }

    const decoded = authUtils.verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { message: 'Unauthorized: Invalid token' }, 
        { status: 401 }
      );
    }

    const response = NextResponse.next();
    response.headers.set('x-user-id', decoded.userId);
    response.headers.set('x-user-email', decoded.email);

    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
