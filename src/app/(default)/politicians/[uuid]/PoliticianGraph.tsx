'use client';

import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { findPolitician } from '@/_actions/findPolitician';
import { useDebounce } from '@/_lib/hooks/useDebounce';

interface Rating {
  id: number;
  politician_id: number;
  url: string;
  stars: number;
  company?: {
    id: number;
    name: string;
    image: string;
  } | null;
}

interface CytoscapeNode {
  data: {
    id: string;
    label?: string;
    similarity?: number;
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

interface Politician {
  uuid: string;
  ext_abgeordnetenwatch_id: number;
  first_name: string;
  last_name: string;
  occupation?: string | null;
  party?: { short: string };
  profile_image?: string;
}

interface AdditionalPolitician {
  id: number;
  name: string;
  similarity: number;
}

interface PoliticianGraphProps {
  politicianId: number;
}

const getLogoPath = (companyName: string): string => {
  return `/logos/${companyName.replace(/\s+/g, '_')}_image.png`;
};

export default function PoliticianGraph({
                                          politicianId,
                                        }: PoliticianGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyInstanceRef = useRef<cytoscape.Core | null>(null);

  const [elements, setElements] = useState<(CytoscapeNode | CytoscapeEdge)[]>(
    [],
  );
  const [companies, setCompanies] = useState<string[]>([]);
  const [visibleCompanies, setVisibleCompanies] = useState<string[]>([]);
  const [originalRatings, setOriginalRatings] = useState<
    Record<string, number>
  >({});

  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);
  const [searchResults, setSearchResults] = useState<Politician[]>([]);
  const [additionalPoliticians, setAdditionalPoliticians] = useState<
    AdditionalPolitician[]
  >([]);

  useEffect(() => {
    fetch(`/api/graph/ratings?politicianId=${politicianId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load ratings');
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

        const companyRatingSums: Record<
          string,
          { sum: number; count: number; companyId: number }
        > = {};

        data.forEach((rating: Rating) => {
          if (rating.company) {
            const companyName = rating.company.name;
            if (!companyRatingSums[companyName]) {
              companyRatingSums[companyName] = {
                sum: 0,
                count: 0,
                companyId: rating.company.id,
              };
            }
            companyRatingSums[companyName].sum += rating.stars;
            companyRatingSums[companyName].count += 1;
          }
        });

        const avgRatings: Record<string, number> = {};
        Object.entries(companyRatingSums).forEach(
          ([companyName, { sum, count }]) => {
            avgRatings[companyName] = sum / count;
          },
        );
        setOriginalRatings(avgRatings);

        Object.entries(companyRatingSums).forEach(
          ([companyName, { companyId }]) => {
            const companyNodeId = `c-${companyId}`;
            nodes.push({
              data: {
                id: companyNodeId,
                label: companyName,
                logo: getLogoPath(companyName),
              },
              classes: 'company',
            });
            edges.push({
              data: {
                id: `edge-${politicianId}-${companyId}`,
                source: politicianNodeId,
                target: companyNodeId,
                label: `${Math.round(avgRatings[companyName])} ⭐`,
              },
              classes: 'rating',
            });
          },
        );

        const uniqueCompanies = Object.keys(avgRatings);
        setCompanies(uniqueCompanies);
        setVisibleCompanies(uniqueCompanies);

        setElements([...nodes, ...edges]);
      })
      .catch((err) => console.error('Error loading original ratings:', err));
  }, [politicianId]);

  useEffect(() => {
    if (containerRef.current && elements.length > 0) {
      const cy = cytoscape({
        container: containerRef.current,
        elements,
        style: [
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
              width: '60px',
              height: '60px',
            },
          },
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
              'text-margin-y': 5,
              width: '60px',
              height: '60px',
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
          {
            selector: 'node.additional',
            style: {
              'background-image': 'data(profileImg)',
              'background-fit': 'contain',
              'background-color': '#d63384',
              label: 'data(label)',
              color: '#fff',
              'text-valign': 'bottom',
              'text-halign': 'center',
              'font-size': '10px',
              width: '60px',
              height: '60px',
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

  useEffect(() => {
    if (cyInstanceRef.current) {
      const cy = cyInstanceRef.current;
      cy.nodes('.company').forEach((node: cytoscape.NodeSingular) => {
        const companyName = node.data('label') as string;
        if (visibleCompanies.includes(companyName)) {
          node.style('display', 'element');
          node.connectedEdges().forEach((edge: cytoscape.EdgeSingular) => {
            edge.style('display', 'element');
          });
        } else {
          node.style('display', 'none');
          node.connectedEdges().forEach((edge: cytoscape.EdgeSingular) => {
            edge.style('display', 'none');
          });
        }
      });
    }
  }, [visibleCompanies]);

  useEffect(() => {
    if (debouncedSearch.trim().length > 0) {
      findPolitician(debouncedSearch)
        .then((results: Politician[]) => setSearchResults(results))
        .catch((err) => console.error('Search error:', err));
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch]);

  const addAdditionalPolitician = async (pol: Politician) => {
    const newPolId = pol.ext_abgeordnetenwatch_id;
    const newPolLabel = `${pol.first_name} ${pol.last_name}`;
    try {
      const resRatings = await fetch(
        `/api/graph/ratings?politicianId=${newPolId}`,
      );
      if (!resRatings.ok)
        throw new Error('Failed to load ratings for additional politician');
      const ratingsData: Rating[] = await resRatings.json();

      const additionalSums: Record<
        string,
        { sum: number; count: number; companyId: number }
      > = {};
      ratingsData.forEach((rating) => {
        if (rating.company && companies.includes(rating.company.name)) {
          const compName = rating.company.name;
          if (!additionalSums[compName]) {
            additionalSums[compName] = {
              sum: 0,
              count: 0,
              companyId: rating.company.id,
            };
          }
          additionalSums[compName].sum += rating.stars;
          additionalSums[compName].count += 1;
        }
      });
      const additionalAverages: Record<string, number> = {};
      Object.entries(additionalSums).forEach(([compName, { sum, count }]) => {
        additionalAverages[compName] = sum / count;
      });

      let agreements = 0;
      let commonCompanies = 0;
      Object.keys(additionalAverages).forEach((compName) => {
        if (compName in originalRatings) {
          commonCompanies++;
          if (
            Math.round(additionalAverages[compName]) ===
            Math.round(originalRatings[compName])
          ) {
            agreements++;
          }
        }
      });
      const similarity =
        commonCompanies > 0
          ? Math.round((agreements / commonCompanies) * 100)
          : 0;

      if (cyInstanceRef.current) {
        const cy = cyInstanceRef.current;
        if (cy.getElementById(`p-${newPolId}`).empty()) {
          cy.add({
            group: 'nodes',
            data: {
              id: `p-${newPolId}`,
              label: newPolLabel,
              similarity,
              profileImg: `/pol_profile_img/${newPolId}.png`,
            },
            classes: 'additional',
          });
        }
        Object.entries(additionalSums).forEach(([compName, { companyId }]) => {
          const edgeId = `edge-${newPolId}-${companyId}`;
          if (cy.getElementById(edgeId).empty()) {
            const avg = additionalAverages[compName];
            cy.add({
              group: 'edges',
              data: {
                id: edgeId,
                source: `p-${newPolId}`,
                target: `c-${companyId}`,
                label: `${Math.round(avg)} ⭐`,
              },
              classes: 'rating',
            });
          }
        });
      }

      setAdditionalPoliticians((prev) => [
        ...prev,
        { id: newPolId, name: newPolLabel, similarity },
      ]);
    } catch (err) {
      console.error('Error adding additional politician:', err);
      alert('Error adding politician.');
    }
  };

  return (
    <div>
      <h2 className="dark:text-white" style={{ textAlign: 'center' }}>
        Graph of Ratings
      </h2>

      {/* Company Filter */}
      <div
        className="dark:text-white"
        style={{ marginBottom: '10px', textAlign: 'center' }}
      >
        <strong>Filter Companies:</strong>
        <div style={{ display: 'inline-block', marginLeft: '10px' }}>
          {companies.map((company) => (
            <label key={company} style={{ marginRight: '10px' }}>
              <input
                type="checkbox"
                checked={visibleCompanies.includes(company)}
                onChange={() =>
                  setVisibleCompanies((prev) =>
                    prev.includes(company)
                      ? prev.filter((c) => c !== company)
                      : [...prev, company],
                  )
                }
              />{' '}
              {company}
            </label>
          ))}
        </div>
      </div>

      {/* Search Bar for Additional Politicians */}
      <div
        style={{
          position: 'relative',
          marginBottom: '10px',
          textAlign: 'center',
          zIndex: 1000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="text"
          className="h-12 w-full border rounded-xl pl-4"
          placeholder="Search for a politician"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ position: 'relative', zIndex: 1000 }}
          onFocus={() => {
            if (cyInstanceRef.current) {
              try {
                cyInstanceRef.current.stop();
                cyInstanceRef.current.resize();
              } catch (err) {
                console.error('Error on search input focus:', err);
              }
            }
          }}
        />
        {search.length > 0 && searchResults.length > 0 && (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: '4px',
              zIndex: 1010,
              marginTop: '2px',
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            {searchResults.map((result) => (
              <div
                key={result.uuid}
                onClick={() => {
                  addAdditionalPolitician(result);
                  setSearch('');
                  setSearchResults([]);
                }}
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <strong>
                  {result.first_name} {result.last_name} &bull;{' '}
                  {result.party?.short}
                </strong>
                <div>{result.occupation}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Display Added Politicians and Similarity */}
      {additionalPoliticians.length > 0 && (
        <div
          className="dark:text-white"
          style={{ textAlign: 'center', marginBottom: '20px' }}
        >
          <h3>Added Politicians &amp; Agreement Percentage</h3>
          {additionalPoliticians.map((pol) => (
            <div key={pol.id}>
              <div className="inline-block">
                <div className="flex items-center space-x-2 justify-center">
                  <strong>{pol.name}</strong>
                  <progress
                    value={pol.similarity}
                    max="100"
                    className="h-2 w-96 rounded-lg [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:bg-blue-500"
                  />
                  <span>{pol.similarity}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cytoscape Graph Container */}
      <div
        ref={containerRef}
        className="w-full h-[500px] border border-black dark:border-gray-700 bg-white dark:bg-gray-900 mb-8"
      />
    </div>
  );
}
