'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import cytoscape from 'cytoscape';
import { ETheme, getTheme } from '@/_lib/providers/themeProvider';

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
  const [isDark, setIsDark] = useState<boolean>(false);
  const [visibleCompanies, setVisibleCompanies] = useState<string[]>([]);

  // Set initial theme using your theme provider.
  useEffect(() => {
    const theme = getTheme();
    setIsDark(theme === ETheme.DARK);
  }, []);

  const handleThemeChange = useCallback((e: CustomEventInit<string>) => {
    if (!e.detail) return;
    switch (e.detail) {
      case 'light':
        setIsDark(true);
        break;
      case 'dark':
        setIsDark(false);
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener(
      'theme-mode-change',
      handleThemeChange as EventListener
    );
    return () => {
      window.removeEventListener(
        'theme-mode-change',
        handleThemeChange as EventListener
      );
    };
  }, [handleThemeChange]);

  useEffect(() => {
    if (selectedCompany) {
      setVisibleCompanies([selectedCompany.name]);
    }
  }, [selectedCompany]);

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
                  averageRating: avgRating,
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
      setTimeout(() => {
        if (containerRef.current) {
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
                selector: 'node.company',
                style: {
                  shape: 'ellipse',
                  'background-image': 'data(logo)',
                  'background-fit': 'contain',
                  'background-color': themeStyles.companyNode.backgroundColor,
                  'border-color': themeStyles.companyNode.borderColor,
                  'border-width': 2,
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
                selector: 'node.politician',
                style: {
                  'background-image': 'data(profileImg)',
                  'background-fit': 'contain',
                  'background-color':
                    themeStyles.politicianNode.backgroundColor,
                  'border-color': themeStyles.politicianNode.borderColor,
                  'border-width': 2,
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
        }
      }, 300);

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

  useEffect(() => {
    if (cyInstanceRef.current) {
      const cy = cyInstanceRef.current;
      // Update company nodes.
      cy.nodes('.company').css({
        'background-color': themeStyles.companyNode.backgroundColor,
        'border-color': themeStyles.companyNode.borderColor,
        color: themeStyles.textColor,
      });
      // Update politician nodes.
      cy.nodes('.politician').css({
        'background-color': themeStyles.politicianNode.backgroundColor,
        'border-color': themeStyles.politicianNode.borderColor,
        color: themeStyles.textColor,
      });
      // Update rating edges.
      cy.edges('.rating').css({
        'line-color': themeStyles.edge.lineColor,
        'target-arrow-color': themeStyles.edge.lineColor,
      });
    }
  }, [themeStyles]);

  useEffect(() => {
    if (cyInstanceRef.current) {
      const cy = cyInstanceRef.current;
      cy.nodes('.company').forEach((node) => {
        const companyName = node.data('label') as string;
        if (visibleCompanies.includes(companyName)) {
          node.style('display', 'element');
          node.connectedEdges().forEach((edge) => {
            edge.style('display', 'element');
          });
        } else {
          node.style('display', 'none');
          node.connectedEdges().forEach((edge) => {
            edge.style('display', 'none');
          });
        }
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
        }}
        className='dark:text-white'
      >
        {selectedCompany.name}
      </h3>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '500px', border: '1px solid black' }}
      />
    </div>
  );
}
