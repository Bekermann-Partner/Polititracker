'use client';

import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';

interface Rating {
  id: number;
  company_id: number;
  politician_id: number;
  url: string;
  stars: number;
  politician?: Politician | null;
}

interface Company {
  id: number;
  name: string;
  image: string;
}

interface Politician {
  uuid: string;
  ext_abgeordnetenwatch_id: number;
  first_name: string;
  last_name: string;
  occupation?: string | null;
  party?: { short: string };
  profile_image?: string;
}

interface CytoscapeNode {
  data: {
    id: string;
    label?: string;
    averageRating?: number;
    profileImg?: string;
    logo?: string;
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

const getLogoPath = (companyName: string): string => {
  return `/logos/${companyName.replace(/\s+/g, '_')}_image.png`;
};

interface CompanyGraphProps {
  selectedCompany: Company;
}

export default function CompanyGraph({ selectedCompany }: CompanyGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyInstanceRef = useRef<cytoscape.Core | null>(null);
  const [elements, setElements] = useState<(CytoscapeNode | CytoscapeEdge)[]>(
    []
  );

  useEffect(() => {
    if (selectedCompany) {
      fetch(`/api/graph/ratings?companyId=${selectedCompany.id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load ratings for company');
          return res.json();
        })
        .then((data: Rating[]) => {
          const nodes: CytoscapeNode[] = [];
          const edges: CytoscapeEdge[] = [];

          const companyNodeId = `c-${selectedCompany.id}`;
          nodes.push({
            data: {
              id: companyNodeId,
              label: selectedCompany.name,
              logo: getLogoPath(selectedCompany.name),
            },
            classes: 'company',
          });

          const politicianRatingSums: Record<
            number,
            { sum: number; count: number; politician: Politician }
          > = {};
          data.forEach((rating) => {
            if (rating.politician) {
              const polId = rating.politician.ext_abgeordnetenwatch_id;
              if (!politicianRatingSums[polId]) {
                politicianRatingSums[polId] = {
                  sum: 0,
                  count: 0,
                  politician: rating.politician,
                };
              }
              politicianRatingSums[polId].sum += rating.stars;
              politicianRatingSums[polId].count += 1;
            }
          });

          Object.entries(politicianRatingSums).forEach(
            ([, { sum, count, politician }]) => {
              const avgRating = sum / count;
              const politicianNodeId = `p-${politician.ext_abgeordnetenwatch_id}`;
              nodes.push({
                data: {
                  id: politicianNodeId,
                  label: `${politician.first_name} ${politician.last_name}`,
                  profileImg: `/pol_profile_img/${politician.ext_abgeordnetenwatch_id}.png`,
                },
                classes: 'politician',
              });
              edges.push({
                data: {
                  id: `edge-${selectedCompany.id}-${politician.ext_abgeordnetenwatch_id}`,
                  source: companyNodeId,
                  target: politicianNodeId,
                  label: `${Math.round(avgRating)} ⭐`,
                },
                classes: 'rating',
              });
            }
          );

          setElements([...nodes, ...edges]);
        })
        .catch((err) =>
          console.error('Error loading ratings for company:', err)
        );
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (containerRef.current && elements.length > 0) {
      const cy = cytoscape({
        container: containerRef.current,
        elements,
        style: [
          {
            selector: 'node.company',
            style: {
              'background-image': 'data(logo)',
              'background-fit': 'contain',
              'background-color': '#28a745',
              label: 'data(label)',
              color: '#fff',
              'text-valign': 'bottom',
              'text-halign': 'center',
              'font-size': '10px',
              width: '80px',
              height: '80px',
            },
          },
          {
            selector: 'node.politician',
            style: {
              'background-image': 'data(profileImg)',
              'background-fit': 'contain',
              'background-color': '#007bff',
              label: 'data(label)',
              color: '#fff',
              'text-valign': 'bottom',
              'text-halign': 'center',
              'font-size': '10px',
              width: '80px',
              height: '80px',
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
              'text-margin-y': -10,
              'font-size': '10px',
              color: '#555',
            },
          },
        ],
        layout: { name: 'cose', animate: false },
      });
      cyInstanceRef.current = cy;

      return () => {
        if (cyInstanceRef.current) {
          try {
            cyInstanceRef.current.destroy();
          } catch (error) {
            console.error('Error destroying Cytoscape instance:', error);
          }
          cyInstanceRef.current = null;
        }
      };
    }
  }, [elements]);

  return (
    <div>
      <h3 style={{ textAlign: 'center' }}>{selectedCompany.name}</h3>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '500px', border: '1px solid black' }}
      />
    </div>
  );
}
