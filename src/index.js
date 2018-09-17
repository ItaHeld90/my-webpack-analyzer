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
	pickBy,
	isEmpty,
	complement,
	tap,
	filter,
} = require('ramda');

const rootId = 1995;

const content = require('F:/New/G2/PyramidG2/clientx/webpack-stats.json');

const modules = map(pick(['id', 'name', 'issuerId', 'size']), content.modules);

const groupModulesById = compose(
	map(head),
	groupBy(prop('id'))
);
const modulesById = groupModulesById(modules);
const modulesByIssuerId = groupBy(prop('issuerId'), modules);

const getDependencies = id => modulesByIssuerId[id] || [];

function getDependencyTree(rootId) {
	function recurse(id) {
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

function getDependencyMap(rootId) {
	function recurse(id) {
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
const dependencyMap = getDependencyMap(rootId);

const result = {};

function calcSizes(rootId, dependencies) {
	const getDependenciesSize = compose(
		sum,
		map(apply(calcSizes)),
		toPairs
	);

	const root = modulesById[rootId];
	const totalSize = root.size + getDependenciesSize(dependencies);

	if (totalSize > 0) {
		result[rootId] = totalSize;
	}

	return totalSize;
}

// Get all module sizes
const sizes = calcSizes(rootId, dependencyTree[rootId]);

console.log(dependencyMap);
