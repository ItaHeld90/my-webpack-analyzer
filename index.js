const { groupBy, prop, pick, head, compose, map, sum, chain, forEach, mergeAll, filter } = require('ramda');

const rootId = 1995;

const content = require('F:/New/G2/PyramidG2/clientx/webpack-stats.json');

const modules = map(pick(['id', 'name', 'issuerId', 'size']), content.modules);
const modulesById = compose(
	map(head),
	groupBy(prop('id'))
)(modules);
const modulesByIssuerId = groupBy(prop('issuerId'), modules);

const getDependancies = id => modulesByIssuerId[id] || [];

const visitedModules = new Set();
const result = {};

function getDependencyTree(rootId) {
    const visitedIds = new Set();
    const isFirstEncounter = id => !visitedIds.has(id);

	function recurse(id) {
        const getDependencyIds = compose(filter(isFirstEncounter), map(prop('id')), getDependancies);
        const buildTree = compose(mergeAll , map(recurse), getDependencyIds);

        return { [id]: buildTree(id) };
    }
    
    return recurse(rootId);
}

console.log(getDependencyTree(rootId));

function calcSizes(moduleId) {
	const dependencies = getDependancies(Number(moduleId));
	const unvisited = dependencies.filter(d => !visitedModules.has(d.id));
	const unvisitedIds = unvisited.map(prop('id'));
	const calcTotalDependanciesSize = compose(
		sum,
		map(prop('size'))
	);
	const dependenciesSize = calcTotalDependanciesSize(unvisited);

	// add new unvisited
	forEach(id => visitedModules.add(id), unvisitedIds);

	const totalSize = dependenciesSize + sum(chain(calcSizes, unvisitedIds));

	if (totalSize > 0) {
		result[moduleId] = totalSize;
	}

	return totalSize;
}

console.log(calcSizes(rootId));
console.log(result);
