import { NextRequest, NextResponse } from 'next/server';

const middleware = async (req: NextRequest) => {
	// skip paths that are not root (/)
	if (req.nextUrl.pathname !== '/') {
		return;
	}

	const { token } = req.cookies;
	if (!token) {
		return NextResponse.redirect(req.nextUrl.origin + '/auth');
	}
};

export default middleware;
