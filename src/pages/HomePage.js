import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FiAlertTriangle } from 'react-icons/fi';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import emptyActivity from '../assets/images/empty-activity.75ec54ee.png';
import Layout from '../components/Layout';
import { TodoCard } from '../components/Card';

import '../styles/index.css'

const HomePage = () => {
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const [open, setOpen] = useState(false);
	const [selectedActivity, setSelectedActivity] = useState(null);
	const [selectedId, setSelectedId] = useState(null);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const requestApi = async () => {
		await axios({
			method: 'get',
			url: 'https://todo.api.devcode.gethired.id/activity-groups?email=alfatahfakhri02@gmail.com',
		})
			.then((response) => {
				const { data } = response.data;
				setData(data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const createActivity = async () => {
		await axios({
			method: 'post',
			url: 'https://todo.api.devcode.gethired.id/activity-groups?email=alfatahfakhri02@gmail.com',
			data: {
				title: 'New Activity',
				email: 'alfatahfakhri02@gmail.com',
			},
		})
			.then(() => {})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => requestApi());
	};

	const deleteActivity = async () => {
		await axios({
			method: 'delete',
			url: `https://todo.api.devcode.gethired.id/activity-groups/${selectedId}?email=alfatahfakhri02@gmail.com`,
		})
			.then(() => {})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				handleClose();
				requestApi();
			});
	};

	useEffect(() => {
		requestApi();
	}, []);

	return (
		<Layout>
			<div className='w-full flex justify-center items-center'>
				<div className='w-full max-w-7xl my-10 px-4 xl:px-0 space-y-12'>
					<div className='flex justify-between items-center'>
						<h1 data-cy='activity-title' className='font-bold text-2xl sm:text-5xl'>
							Activity
						</h1>
						<button data-cy='activity-add-button' onClick={() => createActivity()} className='bg-sky-500 rounded-full py-2 sm:py-4 px-4 sm:px-8 flex items-center space-x-3 text-white hover:bg-sky-600 active:bg-sky-700'>
							<FaPlus className='text-base sm:text-xl' />
							<p className='text-lg sm:text-2xl'>Tambah</p>
						</button>
					</div>
					<div className='w-full'>
						{data.length < 1 ? (
							<div data-cy='activity-empty-state' className='h-full w-full flex justify-center items-center'>
								<img src={emptyActivity} alt='empty-activity' onClick={() => createActivity()} className='cursor-pointer' />
							</div>
						) : (
							<div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
								{data &&
									data.map((item, index) => {
										return (
											<TodoCard
												key={item.id}
												data_cy={index + 1}
												title={item.title}
												created_at={item.created_at}
												navigateCreateTodo={() => navigate(`/create-activity/${item.id}`)}
												deleteActivity={() => [handleOpen(), setSelectedActivity(item.title), setSelectedId(item.id)]}
											/>
										);
									})}
								<Modal data-cy='modal-delete' open={open} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
									<Box className='absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 shadow-xl bg-white w-full max-w-xl p-8'>
										<div className='text-7xl text-red-500 w-full flex justify-center mb-10'>
											<FiAlertTriangle data-cy='modal-delete-icon' />
										</div>
										<Typography data-cy='modal-delete-title' id='modal-modal-title' variant='h6' component='h2'>
											Apakah anda yakin menghapus activity <span className='font-bold'>“{selectedActivity}”?</span>
										</Typography>
										<div className='flex space-x-5 items-center justify-end mt-8'>
											<button data-cy='modal-delete-cancel-button' className='bg-slate-100 hover:bg-slate-200 active:bg-slate-300 px-6 py-2 rounded-full' onClick={() => handleClose()}>
												Batal
											</button>
											<button data-cy='modal-delete-confirm-button' className='bg-red-500 hover:bg-red-600 active:bg-red-700 px-6 py-2 text-white rounded-full' onClick={() => deleteActivity()}>
												Hapus
											</button>
										</div>
									</Box>
								</Modal>
							</div>
						)}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default HomePage;
