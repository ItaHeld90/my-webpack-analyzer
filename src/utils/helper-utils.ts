import { compose, split, last, multiply, curry, flip, divide } from 'ramda';
import * as numeral from 'numeral';

export const trace = (x: any) => {
	console.log(x);
	return x;
};

export const getFileName = compose(
	last,
	// @ts-ignore
	split('/')
);

const toFixed = curry((precision: number, num: number) => Number(num.toFixed(precision)));
const numericToPercentage = compose(
	toFixed(2),
	multiply(100)
);

export const calcPercantage = compose(
	numericToPercentage,
	// @ts-ignore
	flip(divide)
);

const formatNumber = curry((format: string, number) => numeral(number).format(format));
export const formatSize = formatNumber('0a');