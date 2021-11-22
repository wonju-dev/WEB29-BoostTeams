import React, { useState, useEffect, useContext } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { SocketContext } from '@utils/socketContext';
import BoardTemplate from '@templates/BoardTemplate';
import { IPostit } from '@src/types/board';

const BoardPage: React.FC = () => {
	const [postits, setPostits] = useState<IPostit[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState('create');
	const [clickedPostit, setClickedPostit] = useState<IPostit>();
	const handleModalOpen = () => setShowModal(true);
	const handleModalClose = () => setShowModal(false);

	const socket = useContext(SocketContext);
	const socketApi = {
		createNewPostit: (newPostit: IPostit) => socket.current.emit('create new postit', newPostit),
		updatePostit: (newPostit: IPostit) => socket.current.emit('update postit', newPostit),
		dragPostit: (e: KonvaEventObject<DragEvent>) => {
			const id = e.target.id();
			const x = e.target.x();
			const y = e.target.y();
			socket.current.emit('drag postit', { id, x, y });
		},
	};

	const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
		const id = Number(e.target.id());
		const postitList = [...postits];
		const postitIdx = postitList.findIndex((postit) => postit.id === id);
		const postit = { ...postitList.splice(postitIdx, 1)[0], isDragging: true };
		postitList.push(postit);
		setPostits(postitList);
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
	};

	const handleDrag = (e: KonvaEventObject<DragEvent>) => {
		socketApi.dragPostit(e);
	};

	const updatePostits = (newPostit: IPostit) => {
		setPostits((prev: IPostit[]) => {
			const newPostits = [...prev];
			const postitIdx = newPostits.findIndex((elem) => Number(newPostit.id) === elem.id);
			newPostits.splice(postitIdx, 1);
			return [...newPostits, newPostit];
		});
	};

	useEffect(() => {
		if (socket.current) {
			socket.current.emit('join board page');
			socket.current.on('join board page', (postit: IPostit[]) => setPostits(postit));
			socket.current.on('create new postit', (postit: IPostit[]) => setPostits(postit));
			socket.current.on('update postit', (postit: IPostit) => updatePostits(postit));
			socket.current.on('drag postit', (postit: IPostit) => updatePostits(postit));
		}
		return () => {
			socket.current.emit('leave board page');
			socket.current.off('join board page');
			socket.current.off('create new postit');
			socket.current.off('update postit');
			socket.current.off('drag postit');
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
		/>
	);
};

export default BoardPage;
