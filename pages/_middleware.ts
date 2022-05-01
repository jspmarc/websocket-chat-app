import { NextRequest, NextResponse } from 'next/server';

const middleware = (req: NextRequest) => {
	if (req.nextUrl.pathname !== '/') {
		return;
	}
	const { token } = req.cookies;
	if (!token) {
		return NextResponse.redirect(req.nextUrl.origin + '/auth');
	}
};

export default middleware;
