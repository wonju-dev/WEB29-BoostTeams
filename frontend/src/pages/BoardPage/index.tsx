import React, { useState, useEffect, useContext } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { SocketContext } from '@utils/socketContext';
import BoardTemplate from '@templates/BoardTemplate';
import { toast } from 'react-toastify';
import { IPostit } from '@src/types/board';

const BoardPage: React.FC = () => {
	const [postits, setPostits] = useState<IPostit[]>([]);

	const [showModal, setShowModal] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [modalType, setModalType] = useState('create');
	const [clickedPostit, setClickedPostit] = useState<IPostit>();
	const handleModalOpen = () => setShowModal(true);
	const handleModalClose = () => setShowModal(false);

	const socket = useContext(SocketContext);
	const socketApi = {
		setUpdatedPostitList: (initPoistList: IPostit[]) => setPostits(initPoistList),
		createNewPostit: (newPostit: IPostit) => socket.current.emit('create new postit', newPostit),
		updatePostit: (newPostit: IPostit) => socket.current.emit('update postit', newPostit),
		deletePostit: (targetId: number) => socket.current.emit('delete postit', targetId),
		dragPostit: (e: KonvaEventObject<DragEvent>) => {
			const id = e.target.id();
			const x = e.target.x();
			const y = e.target.y();
			socket.current.emit('drag postit', { id, x, y });
		},
		setUpdatedPostit: (newPostit: IPostit) => {
			setPostits((previousPostitList: IPostit[]) => {
				const postitIdx = previousPostitList.findIndex((elem) => Number(newPostit.id) === Number(elem.id));
				if (postitIdx !== -1) previousPostitList.splice(postitIdx, 1);
				return [...previousPostitList, newPostit];
			});
		},
	};

	const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
		const id = Number(e.target.id());
		const postitList = [...postits];
		const postitIdx = postitList.findIndex((postit) => postit.id === id);
		const postit = { ...postitList.splice(postitIdx, 1)[0], isDragging: true };
		postitList.push(postit);
		setPostits(postitList);
		setShowDelete(true);
	};

	const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
		const id = Number(e.target.id());
		const postitList = [...postits];
		const postitIdx = postitList.findIndex((postit) => postit.id === id);
		postitList[postitIdx] = {
			...postitList[postitIdx],
			x: e.target.x(),
			y: e.target.y(),
			isDragging: false,
		};
		setPostits(postitList);
		setShowDelete(false);
		if (e.evt.offsetY > (window.innerHeight / 10) * 9 && e.evt.offsetY < window.innerHeight) {
			socketApi.deletePostit(Number(e.target.id()));
		}
	};

	const handleDrag = (e: KonvaEventObject<DragEvent>) => socketApi.dragPostit(e);

	useEffect(() => {
		if (socket.current) {
			socket.current.emit('join board page');
			socket.current.on('join board page', (postits: IPostit[]) => socketApi.setUpdatedPostitList(postits));
			socket.current.on('delete postit', (postits: IPostit[]) => socketApi.setUpdatedPostitList(postits));
			socket.current.on('create new postit', (postits: IPostit) => socketApi.setUpdatedPostit(postits));
			socket.current.on('update postit', (postit: IPostit) => socketApi.setUpdatedPostit(postit));
			socket.current.on('drag postit', (postit: IPostit) => socketApi.setUpdatedPostit(postit));
		}
		return () => {
			socket.current.emit('leave board page');
			socket.current.off('join board page');
			socket.current.off('create new postit');
			socket.current.off('delete postit');
			socket.current.off('update postit');
			socket.current.off('drag postit');
			socket.current.off('team board error');
		};
	}, [socket]);

	return (
		<BoardTemplate
			postits={postits}
			showModal={showModal}
			modalType={modalType}
			clickedPostit={clickedPostit}
			setModalType={setModalType}
			setClickedPostit={setClickedPostit}
			handleModalOpen={handleModalOpen}
			handleModalClose={handleModalClose}
			handleDrag={handleDrag}
			handleDragStart={handleDragStart}
			handleDragEnd={handleDragEnd}
			socketApi={socketApi}
			showDelete={showDelete}
		/>
	);
};

export default BoardPage;