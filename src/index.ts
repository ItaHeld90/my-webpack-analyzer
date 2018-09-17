const {
	groupBy,
	prop,
	pick,
	head,
	compose,
	map,
	sum,
	mergeAll,
	toPairs,
	apply,
	isEmpty,
	complement,
	filter,
} = require('ramda');

const rootId = 1995;

const content = require('F:/New/G2/PyramidG2/clientx/webpack-stats.json');

const modules = map(pick(['id', 'name', 'issuerId', 'size']), content.modules);

const groupModulesById = compose(
	map(head),
	groupBy(prop('id'))
);

export const modulesById = groupModulesById(modules);
const modulesByIssuerId = groupBy(prop('issuerId'), modules);

const getDependencies = (id: number) => modulesByIssuerId[id] || [];

function getDependencyTree(rootId: number) {
	function recurse(id: number) {
		const getDependencyIds = compose(
			map(prop('id')),
			getDependencies
		);
		const buildTree = compose(
			mergeAll,
			map(recurse),
			getDependencyIds
		);

		// TODO: addToVisited
		return { [id]: buildTree(id) };
	}

	return recurse(rootId);
}

// Get dependency tree
const dependencyTree = getDependencyTree(rootId);

function getDependencyMap(rootId: number) {
	function recurse(id: number) {
		const getDependencyIds = compose(
			map(prop('id')),
			getDependencies
		);

		const dependencyIds = getDependencyIds(id);

		return mergeAll([{ [id]: dependencyIds }, ...map(recurse, dependencyIds)]);
	}

	return compose(
		filter(complement(isEmpty)),
		recurse
	)(rootId);
}

// Get dependency map
export const dependencyMap = getDependencyMap(rootId);

function calcSizes(rootId: number, dependencies: number[]) {
	const result: { [id: number]: number } = {};

	function recurse(rootId: number, dependencies: number[]) {
		const getDependenciesSize = compose(
			sum,
			map(apply(recurse)),
			toPairs
		);

		const root = modulesById[rootId];
		const totalSize = root.size + getDependenciesSize(dependencies);

		if (totalSize > 0) {
			result[rootId] = totalSize;
		}
	}

	recurse(rootId, dependencies);
	return result;
}

// Get all module sizes
export const sizesMap = calcSizes(rootId, dependencyTree[rootId]);
