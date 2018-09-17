import * as React from 'react';
import { Tree } from 'antd';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { compose, prop, sortWith, descend } from 'ramda';

import { calcPercantage, trace } from '../utils/helper-utils';
import { ModuleData } from '..';
import { DependencyTreeTitle } from './dependency-tree-title';

import 'antd/lib/tree/style/css';

const TreeNode = Tree.TreeNode;

export interface DependencyTreeProps {
	dependencyMap: { [id: number]: number[] };
	sizesMap: { [id: number]: number };
	modulesById: { [id: number]: ModuleData };
	rootId: number;
}

@observer
export class DependencyTree extends React.Component<DependencyTreeProps> {
	@observable
	expandedKeys: string[] = [];

	render() {
		const { rootId } = this.props;

		return (
			<Tree expandedKeys={this.expandedKeys} autoExpandParent={false} onExpand={this.onExpand}>
				{this.loop(rootId)}
			</Tree>
		);
	}

	loop = (moduleId: number): JSX.Element => {
		const { dependencyMap, modulesById, sizesMap } = this.props;
		const moduleData = modulesById[moduleId];
		const calculatedSize = sizesMap[moduleId];

		const getTotalSizeById = (id: number) => sizesMap[id];
		const getParentTotalSize = compose(
			getTotalSizeById,
			prop('issuerId')
		);

		const parentSize = getParentTotalSize(moduleData);
		const percentage = parentSize != null ? calcPercantage(parentSize, calculatedSize) : 100;

		const getDependenciesById = (id: number) => dependencyMap[id] || [];
		const getSortedDependencies: (id: number) => number[] = compose(
			sortWith([descend(getTotalSizeById)]),
			getDependenciesById
		);
		const dependencies: number[] = getSortedDependencies(moduleId);

		return (
			<TreeNode
				key={moduleId.toString()}
				title={
					<DependencyTreeTitle
						moduleData={moduleData}
						calculatedSize={calculatedSize}
						percentage={percentage}
					/>
				}
			>
				{dependencies.map(this.loop)}
			</TreeNode>
		);
	};

	onExpand = (expandedKeys: string[]) => {
		this.setExpandedKeys(expandedKeys);
	};

	@action
	setExpandedKeys = (expandedKeys: string[]) => {
		this.expandedKeys = expandedKeys;
	};
}
