'use client';

import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';

interface Rating {
  id: string;
  politician_id: number;
  company: string;
  stars: number;
}

interface CytoscapeNode {
  data: {
    id: string;
    label?: string;
  };
  classes: string;
}

interface CytoscapeEdge {
  data: {
    id: string;
    source: string;
    target: string;
    label?: string;
  };
  classes: string;
}

const GraphPage = () => {
  const cyRef = useRef<HTMLDivElement | null>(null);
  const [elements, setElements] = useState<(CytoscapeNode | CytoscapeEdge)[]>(
    []
  );

  useEffect(() => {
    fetch('/api/graph/ratings')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: Rating[]) => {
        // Specify the expected API response type
        console.log('Fetched Data:', data);

        if (!data || data.length === 0) {
          console.warn('No data received from API.');
          return;
        }

        const nodes: CytoscapeNode[] = [];
        const edges: CytoscapeEdge[] = [];

        data.forEach((rating: Rating) => {
          const politicianId = `p-${rating.politician_id}`;
          const companyId = `c-${rating.company}`;

          if (!nodes.find((n) => n.data.id === politicianId)) {
            nodes.push({
              data: {
                id: politicianId,
                label: `Politician ${rating.politician_id}`,
              },
              classes: 'politician',
            });
          }

          if (!nodes.find((n) => n.data.id === companyId)) {
            nodes.push({
              data: { id: companyId, label: rating.company },
              classes: 'company',
            });
          }

          edges.push({
            data: {
              id: `edge-${rating.id}`,
              source: politicianId,
              target: companyId,
              label: `${rating.stars} ⭐`,
            },
            classes: 'rating',
          });
        });

        setElements([...nodes, ...edges]);
      })
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  // Initialize Cytoscape
  useEffect(() => {
    if (cyRef.current && elements.length > 0) {
      console.log('Initializing Cytoscape with Elements:', elements);

      const cy = cytoscape({
        container: cyRef.current,
        elements,
        style: [
          {
            selector: 'node.politician',
            style: {
              'background-color': '#007bff',
              label: 'data(label)',
              color: '#fff',
              'text-valign': 'center',
              'text-halign': 'center',
              'font-size': '12px',
            },
          },
          {
            selector: 'node.company',
            style: {
              'background-color': '#28a745',
              label: 'data(label)',
              color: '#fff',
              'text-valign': 'center',
              'text-halign': 'center',
              'font-size': '12px',
            },
          },
          {
            selector: 'edge.rating',
            style: {
              width: 2,
              'line-color': '#aaa',
              'target-arrow-shape': 'triangle',
              'target-arrow-color': '#aaa',
              label: 'data(label)',
              'text-margin-y': '-10px',
              'font-size': '10px',
              color: '#555',
            },
          },
        ],
        layout: { name: 'cose' }, // Force-directed layout
      });

      return () => cy.destroy();
    } else {
      console.warn('Cytoscape not initialized. No elements found.');
    }
  }, [elements]);

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Politician Ratings Graph</h1>
      <div
        ref={cyRef}
        style={{ width: '100%', height: '600px', border: '1px solid black' }}
      />
    </>
  );
};

export default GraphPage;
