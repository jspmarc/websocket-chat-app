import { FC, ReactNode } from 'react';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<main className="bg-gray-900 min-h-screen w-screen text-white">
			{children}
		</main>
	);
};

export default Layout;
