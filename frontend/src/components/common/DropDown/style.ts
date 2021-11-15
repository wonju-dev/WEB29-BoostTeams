import styled from 'styled-components';
import { ColorCode, Font } from '@utils/constants';

export const Container = styled.div`
	font-size: ${Font.SMALL};
	position: relative;
	display: inline-block;
	div {
		cursor: pointer;
		span {
			font-weight: bold;
		}
		svg {
			margin-left: 0.2rem;
		}
	}
`;

export const OptionsWrapper = styled.div`
	position: absolute;
	top: 1.5rem;
	left: -1rem;
	background-color: ${ColorCode.WHITE};
	border-radius: 8px;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
	div {
		padding: 0.7rem 1rem;
		cursor: pointer;
		:hover {
			background-color: ${ColorCode.LINE1};
			overflow: hidden;
		}
	}
`;
