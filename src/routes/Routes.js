import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ErrorPage from '../pages/ErrorPage';
import HomePage from '../pages/HomePage';
import { CreateActivity } from '../pages/CreateActivity';

const RouteApp = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/create-activity/:id' element={<CreateActivity />} />
				<Route path='*' element={<ErrorPage />} />
			</Routes>
		</BrowserRouter>
	);
};

export default RouteApp;
