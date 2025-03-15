import React from 'react';
import ReactFlow, { Node, Edge, Handle, Position } from 'react-flow-renderer';
import { allCards, CardSlug } from '../collections/cards';
import { CardType } from '../collections/types';

const TechTreeNode = ({ data }: { data: { slug: CardSlug } }) => {
  const card = allCards[data.slug];

  return (
    <div style={{ width: 150, textAlign: 'center', border: '1px solid #777', borderRadius: 4, padding: 10 }}>
      <img src={card.imageUrl} style={{ width: '100%', height: 'auto' }} />
      <div>{card.name}</div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};


const nodeTypes = {
  techNode: TechTreeNode,
};

const getCardDependencies = (card: CardType): CardType[] => {
  const dependencies: CardType[] = [];

  if (card.spawnInfo) {
    card.spawnInfo.forEach((spawn) => {
      if (spawn.inputStack) {
        const stack = spawn.inputStack.map(slug => allCards[slug]);
        dependencies.push(...stack);
      }
    });
  }

  // Include other dependency extraction logic as necessary

  return dependencies;
};

const TechTree = () => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const cardSlugs = Object.keys(allCards) as Array<keyof typeof allCards>;

  // Generate nodes and edges based on card dependencies
  cardSlugs.forEach((slug) => {
    const card = {
      slug: slug,
      ...allCards[slug]
    }

    nodes.push({
      id: slug,
      type: 'techNode',
      data: { slug },
      position: { x: 0, y: 0 },
    });

    const dependencies = getCardDependencies(card);
    dependencies.forEach((dep) => {
      if (dep) {
        edges.push({
          id: `${dep}-${slug}`,
          source: card.slug,
          target: slug,
        });
      }
    });
  });

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView />
    </div>
  );
};

export default TechTree; 