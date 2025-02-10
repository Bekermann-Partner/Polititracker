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
  company?: Company | null;
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
  const [visibleCompanies, setVisibleCompanies] = useState<string[]>([]);

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

  useEffect(() => {
    fetch(`/api/graph/ratings?politicianId=${politicianId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load ratings for politician');
        return res.json();
      })
      .then((ratings: Rating[]) => {
        let politicianInfo: Politician | null = null;
        for (const rating of ratings) {
          if (rating.politician && rating.politician.first_name) {
            politicianInfo = rating.politician;
            break;
          }
        }
        if (!politicianInfo) {
          return fetch(`/api/politician/${politicianId}`)
            .then((res) => {
              if (!res.ok) throw new Error('Failed to load politician info');
              return res.json();
            })
            .then((polData: Politician) => ({
              ratings,
              politicianInfo: polData,
            }));
        }
        return { ratings, politicianInfo };
      })
      .then(({ ratings, politicianInfo }) => {
        const nodes: CytoscapeNode[] = [];
        const edges: CytoscapeEdge[] = [];

        const politicianLabel = politicianInfo
          ? `${politicianInfo.first_name} ${politicianInfo.last_name}`
          : `Politician ${politicianId}`;
        const politicianNodeId = politicianInfo
          ? `p-${politicianInfo.ext_abgeordnetenwatch_id}`
          : `p-${politicianId}`;

        nodes.push({
          data: {
            id: politicianNodeId,
            label: politicianLabel,
            profileImg: `/pol_profile_img/${politicianId}.png`,
          },
          classes: 'politician',
        });

        const companyRatingSums: Record<
          number,
          { sum: number; count: number; company: Company }
        > = {};
        ratings.forEach((rating) => {
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
                id: `edge-${politicianNodeId}-${company.id}`,
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
  }, [elements]);

  useEffect(() => {
    if (cyInstanceRef.current) {
      const cy = cyInstanceRef.current;
      cy.nodes('.politician').css({
        'background-color': themeStyles.politicianNode.backgroundColor,
        'border-color': themeStyles.politicianNode.borderColor,
        color: themeStyles.textColor,
      });
      cy.nodes('.company').css({
        'background-color': themeStyles.companyNode.backgroundColor,
        'border-color': themeStyles.companyNode.borderColor,
        color: themeStyles.textColor,
      });
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
        node.style('display', 'element');
        node.connectedEdges().forEach((edge) => {
          edge.style('display', 'element');
        });
      });
    }
  }, [visibleCompanies]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="w-full h-[500px] border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-md mb-6 dark:bg-gray-900"
      />
    </div>
  );
}
