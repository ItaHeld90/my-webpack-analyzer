const { groupBy, prop, pick, head, compose, find, equals, map, tap, keys, sum, chain, forEach } = require('ramda');

const rootId = 1995;

const content = require('F:/New/G2/PyramidG2/clientx/webpack-stats.json');

// const getReasons = compose(prop('reasons'), head);
// const findReason = id => find(compose(equals(id), prop('moduleId')));

const modules = map(pick(['id', 'name', 'issuerId', 'size']), content.modules);
const modulesById = compose(map(head), groupBy(prop('id')))(modules);
const modulesByIssuerId = groupBy(prop('issuerId'), modules);
const getDependancies = id => modulesByIssuerId[id] || [];

const visitedModules = new Set();

function getModuleDependencies(moduleId) {
    const dependencies = getDependancies(Number(moduleId));
    const unvisited = dependencies.filter(d => !visitedModules.has(d.id));
    const unvisitedIds = unvisited.map(prop('id'));
	const calcTotalDependanciesSize = compose(
		sum,
		map(prop('size'))
	);
	const totalSize = calcTotalDependanciesSize(unvisited);

	// add new unvisited
	forEach(id => visitedModules.add(id), unvisitedIds);

	return totalSize + sum(chain(getModuleDependencies, unvisitedIds));
}

console.log(getModuleDependencies(rootId));
