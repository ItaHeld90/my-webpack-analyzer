const {
	groupBy,
	prop,
	pick,
	head,
	compose,
	map,
	sum,
	chain,
	forEach,
	mergeAll,
	filter,
	keys,
	toPairs,
	apply,
} = require('ramda');
const R = require('ramda');

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
	const visitedIds = new Set();
	const isFirstEncounter = id => !visitedIds.has(id);
	const addToVisited = id => {
		visitedIds.add(id);
	};

	function recurse(id) {
		const getDependencyIds = compose(
			filter(isFirstEncounter),
			map(prop('id')),
			getDependencies
		);
		const buildTree = compose(
			mergeAll,
			map(recurse),
			getDependencyIds
		);

		forEach(addToVisited, visitedIds);
		return { [id]: buildTree(id) };
	}

	return recurse(rootId);
}

const dependencyTree = getDependencyTree(rootId);

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

console.log(calcSizes(rootId, dependencyTree[rootId]));
console.log(result);
