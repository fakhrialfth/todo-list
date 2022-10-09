import React from "react";

const ErrorPage = () => {
	return (
		<div className='flex justify-center items-center w-full h-screen space-x-4 text-xl bg-slate-50 dark:bg-slate-500 dark:text-slate-50'>
			<h1 className='font-bold'>404</h1>
			<p>Page not found</p>
		</div>
	);
};

export default ErrorPage;
