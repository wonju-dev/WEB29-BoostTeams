import React, { useState, useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import moment from 'moment';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';

import { FaTrashAlt, FaPencilAlt } from 'react-icons/fa';
import { ModalMode, ModalSchedule } from '../../../stores/calendar';

import ColorPicker from '../../common/ColorPicker';
import DropDown from '../../common/DropDown';
import Modal from '../../common/Modal';

import { createNewSchedule, deleteSchedule, ScheduleReqType } from '../../../apis/schedule';
import { ScheduleType } from '../dataStructure';
import { dateToFormatString } from '../../../utils/calendar';
import { PrimaryPalette } from '../../../utils/constants';
import { FormContainer, TitleContainer, TimeContainer, ButtonContainer } from './style';
import { ColorCircle } from '../../common/ColorPicker/style';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
	handleModalClose: () => void;
	addSchedule: (newSchedule: ScheduleType[]) => void;
	deleteScheduleById: (id: number) => void;
	updateScheduleById: (id: number, newSchedule: ScheduleType[]) => void;
}

const CalendarModal: React.FC<Props> = ({ handleModalClose, addSchedule, deleteScheduleById, updateScheduleById }) => {
	const repeatOptions: string[] = ['반복안함', '매일반복', '매주반복', '매월반복'];

	const [modalMode, setModalMode] = useRecoilState(ModalMode);
	const scheduleId = useRecoilValue(ModalSchedule).schedule_id;
	const [modalSchedule, setModalSchedule] = useRecoilState(ModalSchedule);
	const [selectedColor, setSelectedColor] = useState(0);
	const [selectedRepeat, setSelectedRepeat] = useState(0);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedStartTime, setSelectedStartTime] = useState(new Date());
	const [selectedEndTime, setSelectedEndTime] = useState(new Date());
	const [inputTitle, setInputTitle] = useState('');
	const [inputContent, setInputContent] = useState('');
	const [selectedRepeatCount, setSelectedRepeatCount] = useState(0);

	const titleRef = useRef<HTMLInputElement>(null);
	const contentRef = useRef<HTMLTextAreaElement>(null);

	const getScheduleData = (): ScheduleReqType => {
		return {
			color: selectedColor,
			title: titleRef.current?.value,
			start_date: moment(
				`${dateToFormatString(selectedDate, 'YYYY-MM-DD')} ${dateToFormatString(selectedStartTime, 'HH:mm')}`,
				'YYYY-MM-DD hh:mm',
			).toString(),
			end_date: moment(
				`${dateToFormatString(selectedDate, 'YYYY-MM-DD')} ${dateToFormatString(selectedEndTime, 'HH:mm')}`,
				'YYYY-MM-DD hh:mm',
			).toString(),
			repeat_option: selectedRepeat,
			repeat_count: !isNum(selectedRepeatCount) ? selectedRepeatCount : 1,
			content: contentRef.current?.value,
		};
	};

	const validateSchedule = (newScheduleData: ScheduleReqType): boolean => {
		const { title, content, start_date, end_date } = newScheduleData;
		if (!title) {
			toast.warn('😮 제목을 입력해주세요!');
			return false;
		}
		if (!content) {
			toast.warn('😮 설명을 입력해주세요!');
			return false;
		}
		if (new Date(start_date) >= new Date(end_date)) {
			toast.warn('😮 시작과 끝 시간이 올바르지 않습니다!');
			return false;
		}
		return true;
	};

	const checkModalMode = (mode: string): boolean => modalMode.mode === mode;

	const handleSubmit = async () => {
		const newScheduleData = getScheduleData();
		if (checkModalMode('update')) newScheduleData.schedule_id = scheduleId;
		if (validateSchedule(newScheduleData)) {
			const newSchedule = await createNewSchedule(1, newScheduleData);
			if (checkModalMode('create')) addSchedule(newSchedule);
			else updateScheduleById(scheduleId, newSchedule);
			handleModalClose();
		}
	};

	const handleDeleteButtonClick = async (e: any) => {
		e.preventDefault();
		await deleteSchedule(scheduleId);
		deleteScheduleById(scheduleId);
		handleModalClose();
	};

	const changeUpdateMode = async (e: any) => {
		e.preventDefault();
		setModalMode({ mode: 'update' });
	};

	const isNum = (num: number | string) => Number.isNaN(Number(num));

	const checkValidateRepeatCount = (e: any) => {
		if (selectedRepeat === 0 || isNum(e.target.value)) {
			e.target.value = '';
			setSelectedRepeatCount(0);
		} else {
			setSelectedRepeatCount(e.target.value);
		}
	};

	useEffect(() => {
		const { title, color, repeat_option, start_date, end_date, content } = modalSchedule;
		setSelectedColor(color);
		setSelectedRepeat(repeat_option);
		setSelectedDate(new Date(start_date));
		setSelectedStartTime(new Date(start_date));
		setSelectedEndTime(new Date(end_date));
		setInputTitle(title);
		setInputContent(content);
	}, [modalMode, modalSchedule]);

	return (
		<Modal handleModalClose={handleModalClose} handleSubmit={handleSubmit} removeSubmitButton={checkModalMode('read')}>
			<FormContainer>
				<TitleContainer>
					{checkModalMode('read') ? (
						<ColorCircle color={PrimaryPalette[selectedColor]} />
					) : (
						<ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
					)}
					<input
						ref={titleRef}
						defaultValue={inputTitle}
						placeholder='제목을 입력해 주세요.'
						readOnly={checkModalMode('read')}
					/>
				</TitleContainer>
				<TimeContainer>
					<DatePicker
						selected={selectedDate}
						onChange={(date: Date) => setSelectedDate(date)}
						readOnly={checkModalMode('read')}
					/>
					<DatePicker
						selected={selectedStartTime}
						onChange={(date: Date) => setSelectedStartTime(date)}
						showTimeSelect
						showTimeSelectOnly
						timeIntervals={30}
						timeCaption='Time'
						dateFormat='h:mm aa'
						readOnly={checkModalMode('read')}
					/>
					<span>&nbsp;~&nbsp;</span>
					<DatePicker
						selected={selectedEndTime}
						onChange={(date: Date) => setSelectedEndTime(date)}
						showTimeSelect
						showTimeSelectOnly
						timeIntervals={30}
						timeCaption='Time'
						dateFormat='h:mm aa'
						readOnly={checkModalMode('read')}
					/>
				</TimeContainer>
				{checkModalMode('read') ? (
					<span>{repeatOptions[selectedRepeat]}</span>
				) : (
					<>
						<DropDown
							options={repeatOptions}
							selectedOption={repeatOptions[selectedRepeat]}
							setSelectedOption={setSelectedRepeat}
						/>
						<input onChange={checkValidateRepeatCount} placeholder='반복횟수' readOnly={selectedRepeat === 0} />
					</>
				)}
				<textarea
					ref={contentRef}
					defaultValue={inputContent}
					readOnly={checkModalMode('read')}
					placeholder='설명을 입력해 주세요'
				/>
				{checkModalMode('read') && (
					<>
						<ButtonContainer>
							<FaPencilAlt onClick={changeUpdateMode} />
							<FaTrashAlt onClick={handleDeleteButtonClick} />
						</ButtonContainer>
					</>
				)}
			</FormContainer>
		</Modal>
	);
};

export default CalendarModal;
