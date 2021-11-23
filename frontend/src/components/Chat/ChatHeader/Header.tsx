import React from 'react';
import { useRecoilValue } from 'recoil';

import { currentChatRoomState, chatRoomsSelector, chatRoomUsersSelector } from '@stores/chat';
import { ChatRoomsType } from '@src/types/chat';

import { FaUserPlus, FaPen } from 'react-icons/fa';
import { ProfileIcon } from '@components/common';
import { HeaderContainer, ChatRoomInfoContainer, InvitationBtn } from './style';

interface Props {
	teamId: number;
	handleModalOpen: () => void;
}

const Header: React.FC<Props> = ({ teamId, handleModalOpen }) => {
	const { currChatRoomId } = useRecoilValue(currentChatRoomState);
	const chatRooms = useRecoilValue<ChatRoomsType>(chatRoomsSelector(teamId));
	const chatRoomUsers = useRecoilValue(chatRoomUsersSelector).userList;

	return (
		<HeaderContainer>
			<ChatRoomInfoContainer>
				<ProfileIcon
					name={chatRooms[currChatRoomId].chatRoomName}
					color={chatRooms[currChatRoomId].chatRoomId % 6}
					status='none'
					width={3.2}
					isHover={false}
				/>
				<h2>{chatRooms[currChatRoomId].chatRoomName}</h2>
				<FaPen onClick={handleModalOpen} />
			</ChatRoomInfoContainer>
			<InvitationBtn>
				<FaUserPlus />
				<span>{chatRoomUsers.length}</span>
			</InvitationBtn>
		</HeaderContainer>
	);
};

export default Header;