import React from 'react';
import { createPortal } from 'react-dom';
import { MODAL_THEME } from '@utils/constants';
import { Background } from './style';
import PrimaryModal from './Primary';
import SecondaryModal from './Secondary';

export interface Props {
	theme?: string;
	children: React.ReactNode;
	handleModalClose: () => void;
	handleSubmit: () => void;
	removeSubmitButton: boolean;
	title: string | undefined;
	submitBtnName?: string;
	closeBtnName?: string;
}

const Modal: React.FC<Props> = ({
	theme = MODAL_THEME.PRIMARY,
	children,
	handleModalClose,
	handleSubmit,
	removeSubmitButton = false,
	title,
	submitBtnName = '저장',
	closeBtnName = '닫기',
}) => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const MODAL: Element = document.getElementById('modal')!;
	return createPortal(
		<>
			<Background onClick={handleModalClose} />
			{theme === MODAL_THEME.PRIMARY && (
				<PrimaryModal
					title={title}
					handleModalClose={handleModalClose}
					handleSubmit={handleSubmit}
					removeSubmitButton={removeSubmitButton}
					submitBtnName={submitBtnName}
					closeBtnName={closeBtnName}
				>
					{children}
				</PrimaryModal>
			)}
			{theme === MODAL_THEME.SECONDARY && (
				<SecondaryModal
					title={title}
					handleModalClose={handleModalClose}
					handleSubmit={handleSubmit}
					removeSubmitButton={removeSubmitButton}
					submitBtnName={submitBtnName}
					closeBtnName={closeBtnName}
				>
					{children}
				</SecondaryModal>
			)}
		</>,
		MODAL,
	);
};
export default Modal;
