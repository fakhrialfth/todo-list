import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { MdKeyboardArrowLeft, MdModeEdit } from 'react-icons/md';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { BiSortAlt2 } from 'react-icons/bi';
import { TbSortDescending, TbSortAscending, TbSortAscendingLetters, TbSortDescendingLetters } from 'react-icons/tb';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import emptyItem from '../assets/images/empty-item.a0b4b794.png';
import Layout from '../components/Layout';
import { FiAlertTriangle } from 'react-icons/fi';

export const CreateActivity = () => {
	const params = useParams();
	const [isEdit, setIsEdit] = useState(false);
	const [activityTitle, setActivityTitle] = useState('');
	const [openMenuDropdown, setOpenMenuDropdown] = useState(false);
	const [data, setData] = useState([]);
	const [updateTitleItems, setUpdateTitleItems] = useState('');
	const [titleItems, setTitleItems] = useState('');
	const [todoId, setTodoId] = useState(null);
	const [open, setOpen] = useState(false);
	const [openModalUpdate, setOpenModalUpdate] = useState(false);
	const [openModalDelete, setOpenModalDelete] = useState(false);
	const [selectPriority, setSelectPriority] = useState(false);
	const [choosePriority, setChoosePriority] = useState('very-high');
	const [priorityTitle, setPriorityTitle] = useState('Very High');
	const [isItemMarkDone, setIsItemMarkDone] = useState(1);
	const [isChecked, setIsChecked] = useState(false);

	const menuDropdown = [
		{
			id: 1,
			title: 'Terbaru',
			icon: <TbSortDescending />,
			data_cy: 'sort-latest',
		},
		{
			id: 2,
			title: 'Terlama',
			icon: <TbSortAscending />,
			data_cy: 'sort-oldest',
		},
		{
			id: 3,
			title: 'A-Z',
			icon: <TbSortAscendingLetters />,
			data_cy: 'sort-az',
		},
		{
			id: 4,
			title: 'Z-A',
			icon: <TbSortDescendingLetters />,
			data_cy: 'sort-za',
		},
		{
			id: 5,
			title: 'Belum Selesai',
			icon: <BiSortAlt2 />,
			data_cy: 'sort-unfinished',
		},
	];

	const requestApi = async () => {
		const { id } = params;
		await axios({
			method: 'get',
			url: `https://todo.api.devcode.gethired.id/activity-groups/${id}`,
		})
			.then((response) => {
				const { data } = response;
				setData(data.todo_items);
				setIsItemMarkDone(data.is_active);
				setActivityTitle(data.title);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const addItems = async () => {
		const { id } = params;
		await axios({
			method: 'post',
			url: `https://todo.api.devcode.gethired.id/todo-items`,
			data: {
				activity_group_id: id,
				priority: choosePriority,
				title: titleItems,
			},
		})
			.then(() => {})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => requestApi());
	};

	const updateItems = async () => {
		await axios({
			method: 'patch',
			url: `https://todo.api.devcode.gethired.id/todo-items/${todoId}`,
			data: {
				is_active: isItemMarkDone,
				priority: choosePriority,
				title: updateTitleItems,
			},
		})
			.then(() => {
				setTitleItems('');
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => requestApi());
	};

	const deleteItems = async () => {
		await axios({
			method: 'delete',
			url: `https://todo.api.devcode.gethired.id/todo-items/${todoId}`,
		})
			.then(() => {})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => requestApi());
	};

	const isItemDone = async (id) => {
		if (isChecked) {
			setIsItemMarkDone(0);
		}
		if (!isChecked) {
			setIsItemMarkDone(1);
		}
		await axios({
			method: 'patch',
			url: `https://todo.api.devcode.gethired.id/todo-items/${id}`,
			data: {
				is_active: isItemMarkDone,
				priority: choosePriority,
			},
		})
			.then(() => {})
			.catch((error) => {
				console.log(error);
			});
	};

	const updateTitleActivity = async () => {
		const { id } = params;
		await axios({
			method: 'patch',
			url: `https://todo.api.devcode.gethired.id/activity-groups/${id}`,
			data: {
				title: activityTitle,
			},
		})
			.then(() => {})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		requestApi();
	}, []);

	return (
		<Layout>
			<div className='w-full flex justify-center'>
				<div className='w-full max-w-7xl'>
					<div className='flex justify-between my-10'>
						<div className='space-x-5 flex items-center w-full'>
							<Link to='/' data-cy='todo-back-button'>
								<MdKeyboardArrowLeft className='text-4xl font-bold' />
							</Link>
							{isEdit ? (
								<input type='text' className='focus:outline-none border-b border-black flex bg-slate-100 text-2xl sm:text-4xl font-bold pb-2' value={activityTitle} onChange={(e) => setActivityTitle(e.target.value)} />
							) : (
								<h1 data-cy='todo-title' className='flex text-2xl sm:text-4xl font-bold pb-2'>
									{activityTitle}
								</h1>
							)}
							<button data-cy='todo-title-edit-button' className='pr-5 text-lg sm:text-2xl' onClick={() => [isEdit === true ? updateTitleActivity() : null, setIsEdit(!isEdit)]}>
								<MdModeEdit />
							</button>
						</div>
						<div className='flex space-x-6 items-center'>
							<div>
								<button data-cy='todo-sort-button' className='text-lg sm:text-2xl border rounded-full p-4' onClick={() => setOpenMenuDropdown(!openMenuDropdown)}>
									<BiSortAlt2 />
								</button>
								{openMenuDropdown ? (
									<ul className='absolute mt-3 border border-slate-100 bg-white'>
										{menuDropdown.map((item) => (
											<li data-cy={item.data_cy} className='flex items-center space-x-5 py-4 px-8 cursor-pointer hover:bg-slate-100'>
												<div className='text-sky-400 text-base sm:text-xl'>{item.icon}</div>
												<p className='text-base sm:text-xl'>{item.title}</p>
											</li>
										))}
									</ul>
								) : null}
							</div>
							<div>
								<button data-cy='todo-add-button' onClick={() => setOpen(!open)} className='bg-sky-500 rounded-full py-2 sm:py-4 px-4 sm:px-8 flex items-center space-x-3 text-white hover:bg-sky-600 active:bg-sky-700'>
									<FaPlus className='text-lg sm:text-2xl' />
									<p className='text-lg sm:text-2xl'>Tambah</p>
								</button>
							</div>
						</div>
					</div>
					<div className='w-full'>
						{data.length < 1 ? (
							<div data-cy='todo-empty-state' className='h-full w-full flex justify-center items-center'>
								<img src={emptyItem} alt='empty-activity' className='cursor-pointer' onClick={() => setOpen(true)} />
							</div>
						) : (
							<div className='space-y-4 px-4 lg:px-0'>
								{data &&
									data.map((item, index) => {
										return (
											<div data-cy={`todo-item-${index + 1}`} className='w-full flex items-center bg-white px-8 py-4' key={item.id}>
												<input data-cy='todo-item-checkbox' type='checkbox' onClick={() => [setIsChecked(!isChecked), isItemDone(item.id)]} />
												<div className='flex items-center flex-grow space-x-5 pl-8'>
													<span
														data-cy='todo-item-priority-indicator'
														className={`w-4 h-4 rounded-full ${
															item.priority === 'very-high' ? 'bg-red-500' : item.priority === 'high' ? 'bg-yellow-400' : item.priority === 'normal' ? 'bg-emerald-500' : item.priority === 'low' ? 'bg-sky-500' : 'bg-violet-500'
														}`}></span>
													<p data-cy='todo-item-title' className={`${isChecked ? 'text-slate-300 line-through' : 'text-black'}`}>
														{item.title}
													</p>
													<button data-cy='todo-item-edit-button' onClick={() => [setUpdateTitleItems(item.title), setTodoId(item.id), setIsItemMarkDone(item.is_active), setOpenModalUpdate(true)]}>
														<MdModeEdit />
													</button>
												</div>
												<button data-cy='todo-item-delete-button' onClick={() => [setTitleItems(item.title), setTodoId(item.id), setOpenModalDelete(true)]}>
													<FaTrash />
												</button>
											</div>
										);
									})}
								<Modal open={openModalDelete} onClose={() => setOpenModalDelete(false)} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
									<Box className='absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 shadow-xl bg-white w-full max-w-xl p-8'>
										<div className='text-7xl text-red-500 w-full flex justify-center mb-10'>
											<FiAlertTriangle data-cy='modal-delete-icon' />
										</div>
										<h1 data-cy='modal-delete-title'>
											Apakah anda yakin menghapus List Item items <span className='font-bold'>“{titleItems}”?</span>
										</h1>
										<div className='flex space-x-5 items-center justify-end mt-8'>
											<button data-cy='modal-delete-cancel-button' className='bg-slate-100 hover:bg-slate-200 active:bg-slate-300 px-6 py-2 rounded-full' onClick={() => setOpenModalDelete(false)}>
												Batal
											</button>
											<button data-cy='modal-delete-confirm-button' className='bg-red-500 hover:bg-red-600 active:bg-red-700 px-6 py-2 text-white rounded-full' onClick={() => [deleteItems(), setOpenModalDelete(false)]}>
												Hapus
											</button>
										</div>
									</Box>
								</Modal>
							</div>
						)}
						<Modal data-cy='modal-add' open={open} onClose={() => setOpen(false)} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
							<Box className='absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 shadow-xl bg-white w-full max-w-2xl rounded-lg'>
								<div>
									<div className='flex justify-between py-6 px-9 border-b'>
										<h1 data-cy='modal-add-title' className='text-2xl'>
											Tambah List Item
										</h1>
										<button data-cy='modal-add-close-button' className='rotate-45 text-2xl' onClick={() => setOpen(false)}>
											<FaPlus />
										</button>
									</div>
									<div className='p-9 space-y-3'>
										<div className='space-y-3'>
											<label data-cy='modal-add-name-title' htmlFor='item-name' className='uppercase'>
												Nama List Item
											</label>
											<input
												data-cy='modal-add-name-input'
												type='text'
												id='item-name'
												placeholder='Tambahkan nama Activity'
												onChange={(e) => setTitleItems(e.target.value)}
												className='py-2 px-3 w-full focus:outline-none focus:ring focus:ring-sky-300 border rounded-md'
											/>
										</div>
										<div className='space-y-3'>
											<h1 data-cy='modal-add-priority-title' className='uppercase'>
												Priority
											</h1>
											<div>
												<div data-cy='modal-add-priority-dropdown' className='flex space-x-4 items-center border w-fit px-4 py-2 rounded-md cursor-pointer select-none' onClick={() => setSelectPriority(!selectPriority)}>
													<div
														className={`w-4 h-4 rounded-full ${
															choosePriority === 'very-high' ? 'bg-red-500' : choosePriority === 'high' ? 'bg-yellow-500' : choosePriority === 'normal' ? 'bg-emerald-500' : choosePriority === 'low' ? 'bg-sky-500' : 'bg-violet-500'
														}`}></div>
													<p>{priorityTitle}</p>
												</div>
												{selectPriority ? (
													<div className='absolute border mt-3 bg-white'>
														<div
															data-cy='modal-add-priority-very-high'
															className={`flex space-x-4 items-center px-4 py-3 cursor-pointer ${choosePriority === 'very-high' ? 'bg-blue-500' : 'hover:bg-blue-200'}`}
															onClick={() => [setChoosePriority('very-high'), setPriorityTitle('Very High'), setSelectPriority(false)]}>
															<div className='w-4 h-4 rounded-full bg-red-500'></div>
															<p>Very High</p>
														</div>
														<div
															data-cy='modal-add-priority-high'
															className={`flex space-x-4 items-center px-4 py-3 cursor-pointer ${choosePriority === 'high' ? 'bg-blue-500' : 'hover:bg-blue-200'}`}
															onClick={() => [setChoosePriority('high'), setPriorityTitle('High'), setSelectPriority(false)]}>
															<div className='w-4 h-4 rounded-full bg-yellow-500'></div>
															<p>High</p>
														</div>
														<div
															data-cy='modal-add-priority-medium'
															className={`flex space-x-4 items-center px-4 py-3 cursor-pointer ${choosePriority === 'normal' ? 'bg-blue-500' : 'hover:bg-blue-200'}`}
															onClick={() => [setChoosePriority('normal'), setPriorityTitle('Medium'), setSelectPriority(false)]}>
															<div className='w-4 h-4 rounded-full bg-emerald-500'></div>
															<p>Medium</p>
														</div>
														<div
															data-cy='modal-add-priority-low'
															className={`flex space-x-4 items-center px-4 py-3 cursor-pointer ${choosePriority === 'low' ? 'bg-blue-500' : 'hover:bg-blue-200'}`}
															onClick={() => [setChoosePriority('low'), setPriorityTitle('Low'), setSelectPriority(false)]}>
															<div className='w-4 h-4 rounded-full bg-sky-500'></div>
															<p>Low</p>
														</div>
														<div
															data-cy='modal-add-priority-very-low'
															className={`flex space-x-4 items-center px-4 py-3 cursor-pointer ${choosePriority === 'very-low' ? 'bg-blue-500' : 'hover:bg-blue-200'}`}
															onClick={() => [setChoosePriority('very-low'), setPriorityTitle('Very Low'), setSelectPriority(false)]}>
															<div className='w-4 h-4 rounded-full bg-violet-500'></div>
															<p>Very Low</p>
														</div>
													</div>
												) : (
													false
												)}
											</div>
										</div>
									</div>
									<div className='border-t w-full'>
										<div className='p-7 flex justify-end items-center'>
											<button data-cy='modal-add-save-button' className='text-white py-3 px-6 rounded-full bg-sky-500 hover:bg-sky-600 active:bg-sky-700' onClick={() => [addItems(), setOpen(false)]}>
												Simpan
											</button>
										</div>
									</div>
								</div>
							</Box>
						</Modal>
						<Modal data-cy='modal-add' open={openModalUpdate} onClose={() => setOpenModalUpdate(false)} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
							<Box className='absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 shadow-xl bg-white w-full max-w-2xl rounded-lg'>
								<div>
									<div className='flex justify-between py-6 px-9 border-b'>
										<h1 data-cy='modal-add-title' className='text-2xl'>
											Tambah List Item
										</h1>
										<button data-cy='modal-add-close-button' className='rotate-45 text-2xl' onClick={() => setOpenModalUpdate(false)}>
											<FaPlus />
										</button>
									</div>
									<div className='p-9 space-y-3'>
										<div className='space-y-3'>
											<label data-cy='modal-add-name-title' htmlFor='item-name' className='uppercase'>
												Nama List Item
											</label>
											<input
												data-cy='modal-add-name-input'
												type='text'
												id='item-name'
												value={updateTitleItems}
												placeholder='Tambahkan nama Activity'
												onChange={(e) => setUpdateTitleItems(e.target.value)}
												className='py-2 px-3 w-full focus:outline-none focus:ring focus:ring-sky-300 border rounded-md'
											/>
										</div>
										<div className='space-y-3'>
											<h1 data-cy='modal-add-priority-title' className='uppercase'>
												Priority
											</h1>
											<div>
												<div className='flex space-x-4 items-center border w-fit px-4 py-2 rounded-md cursor-pointer select-none' onClick={() => setSelectPriority(!selectPriority)}>
													<div
														data-cy='modal-add-priority-dropdown'
														className={`w-4 h-4 rounded-full ${
															choosePriority === 'very-high' ? 'bg-red-500' : choosePriority === 'high' ? 'bg-yellow-500' : choosePriority === 'normal' ? 'bg-emerald-500' : choosePriority === 'low' ? 'bg-sky-500' : 'bg-violet-500'
														}`}></div>
													<p>{priorityTitle}</p>
												</div>
												{selectPriority ? (
													<div className='absolute border mt-3 bg-white'>
														<div
															data-cy='modal-add-priority-very-high'
															className={`flex space-x-4 items-center px-4 py-3 cursor-pointer ${choosePriority === 'very-high' ? 'bg-blue-500' : 'hover:bg-blue-200'}`}
															onClick={() => [setChoosePriority('very-high'), setPriorityTitle('Very High'), setSelectPriority(false)]}>
															<div className='w-4 h-4 rounded-full bg-red-500'></div>
															<p>Very High</p>
														</div>
														<div
															data-cy='modal-add-priority-high'
															className={`flex space-x-4 items-center px-4 py-3 cursor-pointer ${choosePriority === 'high' ? 'bg-blue-500' : 'hover:bg-blue-200'}`}
															onClick={() => [setChoosePriority('high'), setPriorityTitle('High'), setSelectPriority(false)]}>
															<div className='w-4 h-4 rounded-full bg-yellow-500'></div>
															<p>High</p>
														</div>
														<div
															data-cy='modal-add-priority-medium'
															className={`flex space-x-4 items-center px-4 py-3 cursor-pointer ${choosePriority === 'normal' ? 'bg-blue-500' : 'hover:bg-blue-200'}`}
															onClick={() => [setChoosePriority('normal'), setPriorityTitle('Medium'), setSelectPriority(false)]}>
															<div className='w-4 h-4 rounded-full bg-emerald-500'></div>
															<p>Medium</p>
														</div>
														<div
															data-cy='modal-add-priority-low'
															className={`flex space-x-4 items-center px-4 py-3 cursor-pointer ${choosePriority === 'low' ? 'bg-blue-500' : 'hover:bg-blue-200'}`}
															onClick={() => [setChoosePriority('low'), setPriorityTitle('Low'), setSelectPriority(false)]}>
															<div className='w-4 h-4 rounded-full bg-sky-500'></div>
															<p>Low</p>
														</div>
														<div
															data-cy='modal-add-priority-very-low'
															className={`flex space-x-4 items-center px-4 py-3 cursor-pointer ${choosePriority === 'very-low' ? 'bg-blue-500' : 'hover:bg-blue-200'}`}
															onClick={() => [setChoosePriority('very-low'), setPriorityTitle('Very Low'), setSelectPriority(false)]}>
															<div className='w-4 h-4 rounded-full bg-violet-500'></div>
															<p>Very Low</p>
														</div>
													</div>
												) : (
													false
												)}
											</div>
										</div>
									</div>
									<div className='border-t w-full'>
										<div className='p-7 flex justify-end items-center'>
											<button data-cy='modal-add-save-button' className='text-white py-3 px-6 rounded-full bg-sky-500' onClick={() => [updateItems(), setOpenModalUpdate(false)]}>
												Simpan
											</button>
										</div>
									</div>
								</div>
							</Box>
						</Modal>
					</div>
				</div>
			</div>
		</Layout>
	);
};
