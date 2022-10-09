import React from 'react';
import moment from 'moment';
import { FaTrash } from 'react-icons/fa';

export const TodoCard = ({ title, created_at, navigateCreateTodo, deleteActivity, data_cy }) => {
	return (
		<div data-cy={`activity_item_${data_cy}`} className='bg-white p-4 border h-[40vh] rounded-lg hover:shadow-lg flex flex-col'>
			<h1 data-cy='activity-item-title' className='font-bold  text-2xl flex flex-grow cursor-pointer' onClick={navigateCreateTodo}>
				{title}
			</h1>
			<div className='mt-auto flex justify-between'>
				<p data-cy='activity-item-date'>{moment(created_at).format('DD MMMM YYYY')}</p>
				<button data-cy='activity-item-delete-button' onClick={deleteActivity}>
					<FaTrash />
				</button>
			</div>
		</div>
	);
};
