import styled from 'styled-components';
import { ColorCode } from '../../../../utils/constants';

export const Container = styled.header`
	display: flex;
	align-items: center;
	height: 4.5rem;
	background-color: ${ColorCode.BACKGROUND1};
	border-bottom: solid 1px ${ColorCode.LINE2};
	padding-left: 4.5rem;
	box-sizing: border-box;
`;

export const DayContainer = styled.div`
	height: 100%;
	border-left: solid 1px ${ColorCode.LINE2};
	flex-grow: 1;
	flex-shrink: 0;
	padding: 0.5rem;
	box-sizing: border-box;
	color: ${ColorCode.FONT1};
	b {
		display: block;
		font-size: 1.5rem;
	}
	span {
		font-size: 0.8rem;
	}
`;