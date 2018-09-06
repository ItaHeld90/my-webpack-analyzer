const fs = require('fs');
const { groupBy, prop, pickBy, head, compose, find, equals, map, tap, keys, sum, chain, forEach } = require('ramda');

const visitedModules = new Set();

const rootId = 1995;

const content = require('F:/New/G2/PyramidG2/clientx/webpack-stats.json', 'utf8');

// const getReasons = compose(prop('reasons'), head);
// const findReason = id => find(compose(equals(id), prop('moduleId')));

const modules = groupBy(prop('id'), content.modules);
const modulesByIssuerId = groupBy(prop('issuerId', content.modules));

const moduleById = id => head(modules[id]);

const isDependancy = id =>
	compose(
		equals(id),
		prop('issuerId')
	);
const getDependancies = id =>
	compose(
		keys,
		pickBy(
			compose(
				isDependancy(id),
				head
			)
		)
	);

function getModuleDependancies(moduleId, cnt) {
	if (cnt === 0) {
		return 0;
	}

	const dependencies = getDependancies(Number(moduleId))(modules);
	const unvisitedIds = dependencies.filter(d => !visitedModules.has(d));
	const unvisited = unvisitedIds.map(moduleById);
	const calcTotalDependanciesSize = compose(
		sum,
		map(prop('size'))
	);
	const totalSize = calcTotalDependanciesSize(unvisited);

	// add new unvisited
	forEach(id => visitedModules.add(id), unvisitedIds);

	return totalSize + sum(chain(id => getModuleDependancies(id, cnt - 1), unvisitedIds));
}

console.log(getModuleDependancies(rootId, 2));
