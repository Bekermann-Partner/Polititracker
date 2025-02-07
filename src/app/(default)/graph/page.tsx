'use client';

import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';

const GraphPage = () => {
  const cyRef = useRef<HTMLDivElement | null>(null);
  const [elements, setElements] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/graph/ratings')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        console.log('Fetched Data:', data);

        if (!data || data.length === 0) {
          console.warn('No data received from API.');
          return;
        }

        const nodes: any[] = [];
        const edges: any[] = [];

        data.forEach((rating: any) => {
          const politicianId = `p-${rating.politician_id}`;
          const companyId = `c-${rating.company}`;

          // Add Nodes (Politician)
          if (!nodes.find((n) => n.data.id === politicianId)) {
            nodes.push({
              data: {
                id: politicianId,
                label: `Politician ${rating.politician_id}`,
              },
              classes: 'politician',
            });
          }

          // add Nodes (Company)
          if (!nodes.find((n) => n.data.id === companyId)) {
            nodes.push({
              data: { id: companyId, label: rating.company },
              classes: 'company',
            });
          }

          // Add Edge (Rating)
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

        console.log('Generated Elements:', [...nodes, ...edges]); // Debugging: Check elements before rendering
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
