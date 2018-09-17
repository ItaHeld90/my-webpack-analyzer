import { compose, split, last } from "ramda";

// @ts-ignore
export const getFileName = compose(last, split('/'));