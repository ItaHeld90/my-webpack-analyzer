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

const dependencyTree = getDependencyTree(rootId);
console.log(dependencyTree);

function getDependencyMap(rootId) {
	function recurse(id) {
		const getDependencyIds = compose(
			map(prop('id')),
			getDependencies
		);

		const dependencyIds = getDependencyIds(id);

		return mergeAll([{ [id]: dependencyIds }, ...map(recurse, dependencyIds)]);
	}

	return recurse(rootId);
}

const dependencyMap = getDependencyMap(rootId);
console.log(dependencyMap);

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

const sizes = calcSizes(rootId, dependencyTree[rootId]);
console.log(sizes);
console.log(result);
