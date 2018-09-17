import * as React from 'react';
import { Tree } from 'antd';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import { ModuleData } from '..';
import { getFileName } from '../utils/helper-utils';

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
		const { dependencyMap, modulesById } = this.props;

		return (
			<TreeNode key={moduleId.toString()} title={getFileName(modulesById[moduleId].name)}>
				{dependencyMap[moduleId] && dependencyMap[moduleId].map(this.loop)}
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
