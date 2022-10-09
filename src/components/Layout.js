import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
	return (
		<div className='w-full h-screen flex flex-col bg-slate-100'>
			<Header />
			<div className='w-full h-full overflow-auto'>
				<div className='bg-slate-100'>{children}</div>
			</div>
		</div>
	);
};

export default Layout;
