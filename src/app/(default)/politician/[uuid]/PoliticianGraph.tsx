'use client';

import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { findPolitician } from '@/_actions/findPolitician';
import { useDebounce } from '@/_lib/hooks/useDebounce';

interface Rating {
  id: number;
  politician_id: number;
  url: string;
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

interface Politician {
  uuid: string;
  ext_abgeordnetenwatch_id: number;
  first_name: string;
  last_name: string;
  occupation?: string;
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

export default function PoliticianGraph({ 
  politicianId ,
}: PoliticianGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyInstanceRef = useRef<cytoscape.Core | null>(null);

  const [elements, setElements] = useState<(CytoscapeNode | CytoscapeEdge)[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [visibleCompanies, setVisibleCompanies] = useState<string[]>([]);
  const [originalRatings, setOriginalRatings] = useState<Record<string, number>>({});

  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);
  const [searchResults, setSearchResults] = useState<Politician[]>([]);
  const [additionalPoliticians, setAdditionalPoliticians] = useState<AdditionalPolitician[]>([]);

  useEffect(() => {
    fetch(`/api/graph/ratings?politicianId=${politicianId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load ratings');
        return res.json();
      })
      .then((data: Rating[]) => {
        const nodes: CytoscapeNode[] = [];
        const edges: CytoscapeEdge[] = [];
        const ratingsDict: Record<string, number> = {};

        data.forEach((rating: Rating) => {
          const politicianNodeId = `p-${rating.politician_id}`;
          const companyNodeId = `c-${rating.company}`;

          if (!nodes.some((n) => n.data.id === politicianNodeId)) {
            nodes.push({
              data: { 
                id: politicianNodeId, 
                label: `Politician ${rating.politician_id}` },
              classes: 'politician',
            });
          }

          if (!nodes.some((n) => n.data.id === companyNodeId)) {
            nodes.push({
              data: { id: companyNodeId, label: rating.company },
              classes: 'company',
            });
          }

          edges.push({
            data: { 
              id: `edge-${rating.id}`, 
              source: politicianNodeId, 
              target: companyNodeId, 
              label: `${rating.stars} ⭐` 
            },
            classes: 'rating',
          });

          if (!(rating.company in ratingsDict)) {
            ratingsDict[rating.company] = rating.stars;
          }
        });

        setElements([...nodes, ...edges]);
        const uniqueCompanies = Array.from(new Set(data.map((r) => r.company)));
        setCompanies(uniqueCompanies);
        setVisibleCompanies(uniqueCompanies);
        setOriginalRatings(ratingsDict);
      })
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
          {
            // Additional politicians get a different color.
            selector: 'node.additional',
            style: {
              'background-color': '#d63384',
              label: 'data(label)',
              color: '#fff',
              'text-valign': 'center',
              'text-halign': 'center',
              'font-size': '12px',
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

  //Update the visibility of company nodes when visibleCompanies changes.
  useEffect(() => {
    if (cyInstanceRef.current) {
      const cy = cyInstanceRef.current;
      cy.nodes('.company').forEach((node) => {
        const companyName = node.data('label');
        if (visibleCompanies.includes(companyName)) {
          node.show();
          node.connectedEdges().forEach((edge) => edge.show());
        } else {
          node.hide();
          node.connectedEdges().forEach((edge) => edge.hide());
        }
      });
    }
  }, [visibleCompanies]);

  //Search for additional politicians
  useEffect(() => {
    if (debouncedSearch.trim().length > 0) {
      findPolitician(debouncedSearch)
        .then((results: Politician[]) => setSearchResults(results))
        .catch((err) => console.error('Search error:', err));
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch]);

  //Function to add an additional politician to the graph.
  const addAdditionalPolitician = async (pol: Politician) => {
    const newPolId = pol.ext_abgeordnetenwatch_id;
    const newPolLabel = `${pol.first_name} ${pol.last_name}`;
    try {
      const resRatings = await fetch(
        `/api/graph/ratings?politicianId=${newPolId}`
      );
      if (!resRatings.ok)
        throw new Error('Failed to load ratings for additional politician');
      const ratingsData: Rating[] = await resRatings.json();

      //Only include ratings for companies already in the original graph.
      const filteredRatings = ratingsData.filter((rating) =>
        companies.includes(rating.company)
      );
      if (filteredRatings.length === 0) {
        alert(
          'This politician has no connection to the companies in the original graph.'
        );
        return;
      }

      //Calculate similarity with the original politician.
      let agreements = 0;
      filteredRatings.forEach((rating) => {
        if (originalRatings[rating.company] === rating.stars) {
          agreements++;
        }
      });
      const similarity = Math.round(
        (agreements / filteredRatings.length) * 100
      );

      if (cyInstanceRef.current) {
        const cy = cyInstanceRef.current;
        //Add the additional politician node if not already added.
        if (cy.getElementById(`p-${newPolId}`).empty()) {
          cy.add({
            group: 'nodes',
            data: { id: `p-${newPolId}`, label: newPolLabel, similarity },
            classes: 'additional',
          });
        }
        //Add edges for each connection.
        filteredRatings.forEach((rating) => {
          const edgeId = `edge-${newPolId}-${rating.company}`;
          if (cy.getElementById(edgeId).empty()) {
            cy.add({
              group: 'edges',
              data: {
                id: edgeId,
                source: `p-${newPolId}`,
                target: `c-${rating.company}`,
                label: `${rating.stars} ⭐`,
              },
              classes: 'rating',
            });
          }
        });
      }

      // Update the UI list.
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
      <h2 style={{ textAlign: 'center' }}>Graph of Ratings</h2>

      {/* Company Filter */}
      <div style={{ marginBottom: '10px', textAlign: 'center' }}>
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
                      : [...prev, company]
                  )
                }
              />{' '}
              {company}
            </label>
          ))}
        </div>
      </div>

      {/*Search Bar for Additional Politicians*/}
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
            //stop any ongoing Cytoscape animations and force a resize.
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

      {/*Display Added Politicians and Similarity*/}
      {additionalPoliticians.length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3>Added Politicians &amp; Agreement Percentage</h3>
          {additionalPoliticians.map((pol) => (
            <div key={pol.id} style={{ marginBottom: '10px' }}>
              <strong>{pol.name}</strong>
              <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={pol.similarity}
                  disabled
                  style={{ width: '200px' }}
                />
                <span style={{ marginLeft: '5px' }}>{pol.similarity}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/*Cytoscape Graph Container*/}
      <div
        ref={containerRef}
        style={{ width: '100%', height: '500px', border: '1px solid black' }}
      />
    </div>
  );
}