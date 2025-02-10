'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import cytoscape from 'cytoscape';

interface Rating {
  id: number;
  company_id: number;
  politician_id: number;
  url: string;
  stars: number;
  company?: {
    id: number;
    name: string;
    image: string;
  } | null;
  politician?: Politician | null;
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

interface PoliticianGraphProps {
  politicianId: number;
}

export default function PoliticianGraph({
  politicianId,
}: PoliticianGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyInstanceRef = useRef<cytoscape.Core | null>(null);
  const [elements, setElements] = useState<(CytoscapeNode | CytoscapeEdge)[]>(
    []
  );
  const [isDark, setIsDark] = useState<boolean>(false);
  // For filtering companies in the graph
  const [visibleCompanies, setVisibleCompanies] = useState<string[]>([]);

  // Dark mode detection.
  useEffect(() => {
    const html = document.documentElement;
    setIsDark(!html.classList.contains('dark'));
    function handleThemeChange() {
      setIsDark(!document.documentElement.classList.contains('dark'));
    }
    window.addEventListener('theme-mode-change', handleThemeChange);
    return () =>
      window.removeEventListener('theme-mode-change', handleThemeChange);
  }, []);

  useEffect(() => {
    setVisibleCompanies([]);
  }, []);

  const themeStyles = useMemo(() => {
    if (isDark) {
      return {
        containerBackground: 'transparent',
        companyNode: { backgroundColor: '#d1d1d1', borderColor: '#388e3c' },
        politicianNode: { backgroundColor: '#42a5f5', borderColor: '#1e88e5' },
        edge: { lineColor: '#90a4ae' },
        textColor: '#fff',
      };
    } else {
      return {
        containerBackground: 'transparent',
        companyNode: { backgroundColor: '#d1d1d1', borderColor: '#1b4332' },
        politicianNode: { backgroundColor: '#1d3557', borderColor: '#457b9d' },
        edge: { lineColor: '#a8dadc' },
        textColor: '#000',
      };
    }
  }, [isDark]);

  // Fetch ratings for the politician and build nodes/edges.
  useEffect(() => {
    fetch(`/api/graph/ratings?politicianId=${politicianId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load ratings for politician');
        return res.json();
      })
      .then((data: Rating[]) => {
        const nodes: CytoscapeNode[] = [];
        const edges: CytoscapeEdge[] = [];

        const politicianNodeId = `p-${politicianId}`;
        nodes.push({
          data: {
            id: politicianNodeId,
            label: `Politician ${politicianId}`,
            profileImg: `/pol_profile_img/${politicianId}.png`,
          },
          classes: 'politician',
        });

        // Aggregate ratings by company.
        const companyRatingSums: Record<
          number,
          {
            sum: number;
            count: number;
            company: { id: number; name: string; image: string };
          }
        > = {};
        data.forEach((rating) => {
          if (rating.company) {
            const companyId = rating.company.id;
            if (!companyRatingSums[companyId]) {
              companyRatingSums[companyId] = {
                sum: 0,
                count: 0,
                company: rating.company,
              };
            }
            companyRatingSums[companyId].sum += rating.stars;
            companyRatingSums[companyId].count += 1;
          }
        });

        Object.entries(companyRatingSums).forEach(
          ([, { sum, count, company }]) => {
            const avgRating = sum / count;
            const companyNodeId = `c-${company.id}`;
            nodes.push({
              data: {
                id: companyNodeId,
                label: company.name,
                logo: getLogoPath(company.name),
              },
              classes: 'company',
            });
            edges.push({
              data: {
                id: `edge-${politicianId}-${company.id}`,
                source: politicianNodeId,
                target: companyNodeId,
                label: `${Math.round(avgRating)} ⭐`,
              },
              classes: 'rating',
            });
          }
        );

        setElements([...nodes, ...edges]);
      })
      .catch((err) =>
        console.error('Error loading ratings for politician:', err)
      );
  }, [politicianId]);

  // Initialize Cytoscape.
  useEffect(() => {
    if (containerRef.current && elements.length > 0) {
      if (cyInstanceRef.current) {
        try {
          cyInstanceRef.current.destroy();
        } catch (error) {
          console.error('Error destroying Cytoscape instance:', error);
        }
        cyInstanceRef.current = null;
      }

      const cy = cytoscape({
        container: containerRef.current,
        elements,
        style: [
          {
            selector: 'node.politician',
            style: {
              shape: 'ellipse',
              'background-image': 'data(profileImg)',
              'background-fit': 'contain',
              'background-color': themeStyles.politicianNode.backgroundColor,
              label: 'data(label)',
              color: themeStyles.textColor,
              'text-valign': 'bottom',
              'text-halign': 'center',
              'font-size': '10px',
              width: '80px',
              height: '80px',
            },
          },
          {
            selector: 'node.company',
            style: {
              shape: 'ellipse',
              'background-image': 'data(logo)',
              'background-fit': 'contain',
              'background-color': themeStyles.companyNode.backgroundColor,
              label: 'data(label)',
              color: themeStyles.textColor,
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
              'line-color': themeStyles.edge.lineColor,
              'target-arrow-shape': 'triangle',
              'target-arrow-color': themeStyles.edge.lineColor,
              label: 'data(label)',
              'text-margin-y': -10,
              'font-size': '10px',
              color: '#555',
            },
          },
        ],
        layout: { name: 'cose', animate: false },
        userZoomingEnabled: true,
        userPanningEnabled: true,
        minZoom: 0.4,
        maxZoom: 5.0,
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
  }, [elements, themeStyles]);

  useEffect(() => {
    if (cyInstanceRef.current) {
      const cy = cyInstanceRef.current;
      cy.nodes('.company').forEach((node) => {
        node.style('display', 'element');
        node.connectedEdges().forEach((edge) => {
          edge.style('display', 'element');
        });
      });
    }
  }, [visibleCompanies]);

  return (
    <div style={{ position: 'relative' }}>
      <h3
        style={{
          textAlign: 'center',
          fontFamily: 'Helvetica, Arial, sans-serif',
          marginBottom: '10px',
          color: themeStyles.textColor,
        }}
      >
        Politician Graph
      </h3>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '500px', border: '1px solid black' }}
      />
    </div>
  );
}
