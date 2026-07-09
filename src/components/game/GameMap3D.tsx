'use client';

import React, { useRef, useState, useCallback, useMemo, Suspense } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/lib/game-store';
import { UNIT_TYPES, type UnitTypeId } from '@/lib/game-data';
import { getUnitComposition, getDominantUnit, getUnitCost } from '@/lib/game-logic';

// ========================
// Constants
// ========================
const SCALE = 0.012;
const CENTER_X = 500;
const CENTER_Y = 325;
const PLATFORM_RADIUS = 7.5;

type StructureType = 'mountain' | 'tower' | 'castle' | 'forest' | 'temple' | 'crystal' | 'port' | 'ruins' | 'fortress' | 'ice';

interface TerritoryVisualData {
  structure: StructureType;
  height: number;
  structureColor: string;
  terrainColor: string;
  terrainSideColor: string;
}

const TERRITORY_VISUAL: Record<string, TerritoryVisualData> = {
  ironhold:        { structure: 'fortress',  height: 0.35, structureColor: '#8B8682', terrainColor: '#7A8A9A', terrainSideColor: '#4A5A6A' },
  wintermere:      { structure: 'ice',       height: 0.25, structureColor: '#B0D4E8', terrainColor: '#9AB8CC', terrainSideColor: '#5A7888' },
  frostpeak:       { structure: 'mountain',  height: 0.45, structureColor: '#9E9E9E', terrainColor: '#8A9AAE', terrainSideColor: '#4A5A6E' },
  dragonspine:     { structure: 'mountain',  height: 0.40, structureColor: '#7A7A7A', terrainColor: '#7A8A9A', terrainSideColor: '#3A4A5A' },
  goldshire:       { structure: 'castle',    height: 0.20, structureColor: '#C4A882', terrainColor: '#8A9A6A', terrainSideColor: '#5A6A3A' },
  silverdale:      { structure: 'tower',     height: 0.25, structureColor: '#C0C0C0', terrainColor: '#7A9A6A', terrainSideColor: '#4A6A3A' },
  thornwall:       { structure: 'fortress',  height: 0.30, structureColor: '#8B7355', terrainColor: '#8A9A6A', terrainSideColor: '#5A6A3A' },
  ashenvale:       { structure: 'forest',    height: 0.20, structureColor: '#2D6B1E', terrainColor: '#6A8A4A', terrainSideColor: '#3A5A2A' },
  sunforge:        { structure: 'temple',    height: 0.25, structureColor: '#D4A76A', terrainColor: '#B8A46A', terrainSideColor: '#7A6A3A' },
  ravencrest:      { structure: 'tower',     height: 0.30, structureColor: '#4A3A4A', terrainColor: '#7A8A5A', terrainSideColor: '#4A5A2A' },
  stormhold:       { structure: 'fortress',  height: 0.35, structureColor: '#5A6A7A', terrainColor: '#8A8A5A', terrainSideColor: '#5A5A3A' },
  moonhaven:       { structure: 'temple',    height: 0.20, structureColor: '#8B7DB8', terrainColor: '#9A8A6A', terrainSideColor: '#6A5A3A' },
  port_brighthelm: { structure: 'port',      height: 0.15, structureColor: '#C4A882', terrainColor: '#7A9A7A', terrainSideColor: '#3A6A5A' },
  crystal_lake:    { structure: 'crystal',   height: 0.18, structureColor: '#88BBDD', terrainColor: '#6A9A8A', terrainSideColor: '#3A6A5A' },
  darkwood:        { structure: 'forest',    height: 0.28, structureColor: '#1A3A1A', terrainColor: '#3A5A2A', terrainSideColor: '#1A3A1A' },
  misthollow:      { structure: 'ruins',     height: 0.22, structureColor: '#5A5A5A', terrainColor: '#5A6A4A', terrainSideColor: '#2A3A1A' },
};

// ========================
// Utility Functions
// ========================
function parseSVGPath(pathStr: string): [number, number][] {
  const points: [number, number][] = [];
  const parts = pathStr.trim().split(/\s+/);
  let i = 0;
  while (i < parts.length) {
    const cmd = parts[i];
    if (cmd === 'M' || cmd === 'L') {
      const x = parseFloat(parts[i + 1]);
      const y = parseFloat(parts[i + 2]);
      if (!isNaN(x) && !isNaN(y)) {
        points.push([x, y]);
      }
      i += 3;
    } else if (cmd === 'Z') {
      break;
    } else {
      i++;
    }
  }
  return points;
}

function svgTo3D(sx: number, sy: number): [number, number] {
  return [(sx - CENTER_X) * SCALE, -(sy - CENTER_Y) * SCALE];
}

function createTerritoryGeometry(pathStr: string, height: number): THREE.ExtrudeGeometry {
  const points = parseSVGPath(pathStr);
  if (points.length < 3) {
    return new THREE.ExtrudeGeometry(new THREE.Shape(), { depth: 0.1 });
  }
  const shape = new THREE.Shape();
  const [x0, z0] = svgTo3D(points[0][0], points[0][1]);
  shape.moveTo(x0, z0);
  for (let i = 1; i < points.length; i++) {
    const [x, z] = svgTo3D(points[i][0], points[i][1]);
    shape.lineTo(x, z);
  }
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    steps: 1,
    depth: height,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelOffset: 0,
    bevelSegments: 2,
  });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, 0.05, 0);
  return geo;
}

// ========================
// 3D Structure Components
// ========================

function MountainStructure({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      {/* Main peak */}
      <mesh position={[0, 0.3, 0]}>
        <coneGeometry args={[0.25, 0.6, 7]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* Snow cap */}
      <mesh position={[0, 0.55, 0]}>
        <coneGeometry args={[0.1, 0.15, 7]} />
        <meshStandardMaterial color="#E8E8F0" roughness={0.4} />
      </mesh>
      {/* Secondary peak */}
      <mesh position={[0.15, 0.18, 0.08]} scale={[0.6, 0.7, 0.6]}>
        <coneGeometry args={[0.25, 0.6, 6]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  );
}

function CastleStructure({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      {/* Main keep */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.18, 0.36, 0.18]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 0.42, 0]}>
        <coneGeometry args={[0.13, 0.14, 4]} />
        <meshStandardMaterial color="#8B1A1A" roughness={0.6} />
      </mesh>
      {/* Corner towers */}
      {[[-0.12, 0.1, -0.12], [0.12, 0.1, -0.12], [-0.12, 0.1, 0.12], [0.12, 0.1, 0.12]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh>
            <cylinderGeometry args={[0.03, 0.035, 0.24, 8]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <coneGeometry args={[0.04, 0.08, 8]} />
            <meshStandardMaterial color="#6A1515" roughness={0.6} />
          </mesh>
        </group>
      ))}
      {/* Gate */}
      <mesh position={[0, 0.05, -0.1]}>
        <boxGeometry args={[0.06, 0.1, 0.01]} />
        <meshStandardMaterial color="#1a1008" roughness={0.9} />
      </mesh>
    </group>
  );
}

function TowerStructure({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.5, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 0.55, 0]}>
        <coneGeometry args={[0.08, 0.14, 8]} />
        <meshStandardMaterial color="#4A3728" roughness={0.6} />
      </mesh>
      {/* Battlements ring */}
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.04, 12]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Flag pole */}
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.2, 4]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
      {/* Flag */}
      <mesh position={[0.04, 0.72, 0]}>
        <planeGeometry args={[0.06, 0.035]} />
        <meshStandardMaterial color="#DC2626" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function ForestStructure({ position, color }: { position: [number, number, number]; color: string }) {
  const trees = useMemo(() => [
    { x: 0, z: 0, s: 1, h: 0.2 },
    { x: 0.1, z: 0.06, s: 0.75, h: 0.16 },
    { x: -0.08, z: -0.05, s: 0.6, h: 0.13 },
    { x: 0.05, z: -0.09, s: 0.85, h: 0.18 },
    { x: -0.12, z: 0.04, s: 0.5, h: 0.11 },
    { x: 0.13, z: -0.03, s: 0.65, h: 0.14 },
  ], []);
  return (
    <group position={position}>
      {trees.map((tree, i) => (
        <group key={i} position={[tree.x, 0, tree.z]} scale={tree.s}>
          {/* Trunk */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.012, 0.018, 0.12, 5]} />
            <meshStandardMaterial color="#5C4033" roughness={0.95} />
          </mesh>
          {/* Foliage layers */}
          <mesh position={[0, 0.15, 0]}>
            <coneGeometry args={[0.065, 0.12, 6]} />
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <coneGeometry args={[0.05, 0.1, 6]} />
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function TempleStructure({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.3, 0.04, 0.25]} />
        <meshStandardMaterial color="#D2B48C" roughness={0.6} />
      </mesh>
      {/* Main building */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.22, 0.22, 0.18]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Pyramidal roof */}
      <mesh position={[0, 0.32, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.17, 0.15, 4]} />
        <meshStandardMaterial color="#D4A017" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Pillars */}
      {[[-0.09, 0, -0.08], [0.09, 0, -0.08], [-0.09, 0, 0.08], [0.09, 0, 0.08]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.012, 0.014, 0.22, 6]} />
          <meshStandardMaterial color="#E8D8B8" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function CrystalStructure({ position }: { position: [number, number, number] }) {
  const crystalsRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (crystalsRef.current) {
      crystalsRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });
  return (
    <group position={position} ref={crystalsRef}>
      {[
        { x: 0, z: 0, ry: 0, s: 1, h: 0.18 },
        { x: 0.08, z: 0.04, ry: 0.5, s: 0.65, h: 0.13 },
        { x: -0.06, z: -0.06, ry: 1.2, s: 0.5, h: 0.1 },
        { x: 0.03, z: -0.08, ry: 2, s: 0.4, h: 0.08 },
      ].map((c, i) => (
        <mesh key={i} position={[c.x, c.h / 2 + 0.02, c.z]} rotation={[0.15, c.ry, 0.1]} scale={c.s}>
          <octahedronGeometry args={[0.05, 0]} />
          <meshStandardMaterial
            color="#88CCFF"
            transparent
            opacity={0.75}
            roughness={0.05}
            metalness={0.6}
            emissive="#2244AA"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function PortStructure({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      {/* Main building */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.18, 0.2, 0.14]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 0.24, 0]}>
        <boxGeometry args={[0.2, 0.02, 0.16]} />
        <meshStandardMaterial color="#8B4513" roughness={0.7} />
      </mesh>
      {/* Second building */}
      <mesh position={[0.15, 0.07, 0.05]}>
        <boxGeometry args={[0.1, 0.14, 0.1]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* Mast */}
      <mesh position={[0.12, 0.2, 0.05]}>
        <cylinderGeometry args={[0.006, 0.006, 0.3, 4]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>
      {/* Sail */}
      <mesh position={[0.15, 0.28, 0.05]} rotation={[0, 0.3, 0]}>
        <planeGeometry args={[0.06, 0.08]} />
        <meshStandardMaterial color="#E8D8B8" side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function RuinsStructure({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      {/* Broken wall 1 */}
      <mesh position={[-0.06, 0.07, 0]}>
        <boxGeometry args={[0.04, 0.14, 0.14]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      {/* Broken wall 2 */}
      <mesh position={[0.07, 0.09, 0.03]} scale={[1, 1.2, 1]}>
        <boxGeometry args={[0.035, 0.15, 0.12]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      {/* Broken column */}
      <mesh position={[0, 0.04, -0.08]}>
        <cylinderGeometry args={[0.02, 0.025, 0.08, 8]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* Fallen column */}
      <mesh position={[0.08, 0.015, -0.07]} rotation={[0, 0.5, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.02, 0.12, 8]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      {/* Rubble */}
      <mesh position={[-0.03, 0.012, 0.06]} rotation={[0.2, 0.8, 0.3]}>
        <dodecahedronGeometry args={[0.025, 0]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <mesh position={[0.1, 0.01, -0.03]}>
        <boxGeometry args={[0.03, 0.02, 0.035]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
    </group>
  );
}

function FortressStructure({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      {/* Main building */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.2, 0.3, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Battlement top */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[0.22, 0.03, 0.22]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Corner towers */}
      {[[-0.12, 0.1, -0.12], [0.12, 0.1, -0.12], [-0.12, 0.1, 0.12], [0.12, 0.1, 0.12]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh>
            <cylinderGeometry args={[0.028, 0.032, 0.24, 8]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <coneGeometry args={[0.038, 0.08, 8]} />
            <meshStandardMaterial color="#3A2A1A" roughness={0.6} />
          </mesh>
        </group>
      ))}
      {/* Gate */}
      <mesh position={[0, 0.06, -0.11]}>
        <boxGeometry args={[0.06, 0.12, 0.01]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
      {/* Gate arch */}
      <mesh position={[0, 0.12, -0.11]}>
        <cylinderGeometry args={[0.03, 0.03, 0.01, 12, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
    </group>
  );
}

function IceStructure({ position }: { position: [number, number, number] }) {
  const iceRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (iceRef.current) {
      iceRef.current.children.forEach((child, i) => {
        child.position.y = (i === 0 ? 0.2 : i === 1 ? 0.1 : 0.04) + Math.sin(state.clock.elapsedTime * 1.5 + i) * 0.008;
      });
    }
  });
  return (
    <group position={position} ref={iceRef}>
      {/* Ice spire 1 */}
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.05, 0.4, 6]} />
        <meshStandardMaterial color="#B0D4E8" transparent opacity={0.8} roughness={0.08} metalness={0.15} />
      </mesh>
      {/* Ice spire 2 */}
      <mesh position={[0.08, 0.1, 0.05]} scale={[0.6, 0.7, 0.6]}>
        <coneGeometry args={[0.05, 0.35, 5]} />
        <meshStandardMaterial color="#C8E0F0" transparent opacity={0.7} roughness={0.05} metalness={0.2} />
      </mesh>
      {/* Ice chunk */}
      <mesh position={[-0.06, 0.04, -0.05]} rotation={[0.3, 0.7, 0.1]}>
        <dodecahedronGeometry args={[0.045, 0]} />
        <meshStandardMaterial color="#D0E8F8" transparent opacity={0.6} roughness={0.03} metalness={0.25} />
      </mesh>
    </group>
  );
}

function StructureRenderer({ type, position, color }: { type: StructureType; position: [number, number, number]; color: string }) {
  switch (type) {
    case 'mountain': return <MountainStructure position={position} color={color} />;
    case 'castle': return <CastleStructure position={position} color={color} />;
    case 'tower': return <TowerStructure position={position} color={color} />;
    case 'forest': return <ForestStructure position={position} color={color} />;
    case 'temple': return <TempleStructure position={position} color={color} />;
    case 'crystal': return <CrystalStructure position={position} />;
    case 'port': return <PortStructure position={position} color={color} />;
    case 'ruins': return <RuinsStructure position={position} color={color} />;
    case 'fortress': return <FortressStructure position={position} color={color} />;
    case 'ice': return <IceStructure position={position} />;
  }
}

// ========================
// Territory Mesh
// ========================

interface TerritoryMeshProps {
  territoryId: string;
  path: string;
  labelX: number;
  labelY: number;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}

function TerritoryMesh({ territoryId, path, labelX, labelY, onHover, onClick }: TerritoryMeshProps) {
  const territories = useGameStore(s => s.territories);
  const selectedTerritory = useGameStore(s => s.selectedTerritory);
  const targetTerritory = useGameStore(s => s.targetTerritory);
  const phase = useGameStore(s => s.phase);
  const players = useGameStore(s => s.players);
  const reinforcementsLeft = useGameStore(s => s.reinforcementsLeft);
  const deployUnitType = useGameStore(s => s.deployUnitType);
  const currentPlayerIndex = useGameStore(s => s.currentPlayerIndex);
  const selectTerritory = useGameStore(s => s.selectTerritory);
  const deployArmy = useGameStore(s => s.deployArmy);

  const territory = territories[territoryId];
  if (!territory) return null;

  const visual = TERRITORY_VISUAL[territoryId] || { structure: 'tower' as StructureType, height: 0.2, structureColor: '#8B7355', terrainColor: '#5A5A3A', terrainSideColor: '#3A3A2A' };
  const playerColorMap = useMemo(() => {
    const map: Record<string, { color: string; colorLight: string }> = {};
    players.forEach(p => { map[p.id] = { color: p.color, colorLight: p.colorLight }; });
    return map;
  }, [players]);

  const owner = territory.ownerId ? playerColorMap[territory.ownerId] : null;
  const currentPlayerId = phase !== 'setup' && phase !== 'gameover' ? players[currentPlayerIndex]?.id : null;

  const isSelected = territoryId === selectedTerritory;
  const isTarget = territoryId === targetTerritory;

  const geometry = useMemo(() => createTerritoryGeometry(path, visual.height), [path, visual.height]);
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry, 25), [geometry]);

  const [cx, cz] = svgTo3D(labelX, labelY);
  const structY = 0.05 + visual.height;
  const dominant = getDominantUnit(territory.units);

  const isSelectable = useMemo(() => {
    if (phase === 'deploy') {
      const cost = getUnitCost(deployUnitType, players[currentPlayerIndex]?.characterClass || '');
      return territory.ownerId === currentPlayerId && reinforcementsLeft >= cost;
    }
    if (phase === 'attack') {
      if (selectedTerritory === null) return territory.ownerId === currentPlayerId && territory.units.length > 1;
      if (territoryId === selectedTerritory) return true;
      if (territory.ownerId !== currentPlayerId) return territory.adjacentTo.includes(selectedTerritory);
      return territory.ownerId === currentPlayerId && territory.units.length > 1;
    }
    if (phase === 'fortify') {
      if (selectedTerritory === null) return territory.ownerId === currentPlayerId && territory.units.length > 1;
      if (territoryId === selectedTerritory) return true;
      if (territory.ownerId === currentPlayerId && selectedTerritory !== null) return territory.adjacentTo.includes(selectedTerritory);
      return false;
    }
    return false;
  }, [phase, territory, selectedTerritory, currentPlayerId, reinforcementsLeft, deployUnitType, players, currentPlayerIndex]);

  const topColor = owner ? owner.colorLight : visual.terrainColor;
  const sideColor = owner ? owner.color + 'AA' : visual.terrainSideColor;

  const emissiveColor = isSelected ? '#FFD700' : isTarget ? '#FF0000' : '#000000';

  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      if (isSelected) {
        mat.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
      } else if (isTarget) {
        mat.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      } else {
        mat.emissiveIntensity = 0;
      }
    }
    if (edgesRef.current) {
      const mat = edgesRef.current.material as THREE.LineBasicMaterial;
      if (isSelected) {
        mat.color.set('#FFD700');
        mat.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      } else if (isTarget) {
        mat.color.set('#FF0000');
        mat.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
      } else {
        mat.color.set('#3D2B1F');
        mat.opacity = 0.8;
      }
    }
  });

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (phase === 'deploy') {
      const cost = getUnitCost(deployUnitType, players[currentPlayerIndex]?.characterClass || '');
      if (territory.ownerId === currentPlayerId && reinforcementsLeft >= cost) {
        deployArmy(territoryId, deployUnitType);
      }
    } else if (phase === 'attack' || phase === 'fortify') {
      selectTerritory(territoryId);
    }
  }, [phase, territory, currentPlayerId, reinforcementsLeft, deployUnitType, players, currentPlayerIndex, selectTerritory, deployArmy, territoryId]);

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isSelectable) {
      document.body.style.cursor = 'pointer';
    }
    onHover(territoryId);
  }, [isSelectable, territoryId, onHover]);

  const handlePointerOut = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    onHover(null);
  }, [onHover]);

  return (
    <group>
      {/* Territory extruded shape */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshStandardMaterial
          color={topColor}
          roughness={0.75}
          metalness={0.05}
          emissive={emissiveColor}
          emissiveIntensity={0}
          transparent={!isSelectable}
          opacity={isSelectable ? 1 : (phase === 'attack' || phase === 'fortify') ? 0.6 : 0.85}
        />
      </mesh>

      {/* Territory border edges */}
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial color="#3D2B1F" transparent opacity={0.8} />
      </lineSegments>

      {/* 3D Structure */}
      <StructureRenderer type={visual.structure} position={[cx, structY, cz]} color={visual.structureColor} />

      {/* Territory label and unit badge */}
      <Html position={[cx, structY + (visual.structure === 'mountain' ? 0.75 : visual.structure === 'tower' ? 0.8 : visual.structure === 'fortress' ? 0.45 : 0.35), cz]} center>
        <div style={{ pointerEvents: 'none', userSelect: 'none', textAlign: 'center' }}>
          <div style={{
            fontSize: '9px',
            fontFamily: 'var(--font-cinzel), serif',
            color: 'rgba(255,255,255,0.9)',
            textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.6)',
            whiteSpace: 'nowrap',
            letterSpacing: '1px',
          }}>
            {territory.name}
          </div>
          {territory.units.length > 0 && dominant && (
            <div style={{
              marginTop: '2px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              background: 'rgba(0,0,0,0.6)',
              borderRadius: '8px',
              padding: '1px 5px',
              border: `1px solid ${owner ? owner.color + '66' : 'rgba(139,115,85,0.3)'}`,
            }}>
              <span style={{ fontSize: '9px' }}>{UNIT_TYPES[dominant].icon}</span>
              <span style={{
                fontSize: '8px',
                fontWeight: 'bold',
                color: owner ? owner.colorLight : '#ccc',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)',
              }}>
                {territory.units.length}
              </span>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

// ========================
// Connection Lines
// ========================
function ConnectionLines() {
  const territories = useGameStore(s => s.territories);

  const lines = useMemo(() => {
    const result: { start: [number, number, number]; end: [number, number, number] }[] = [];
    const drawn = new Set<string>();
    for (const t of Object.values(territories)) {
      const vis = TERRITORY_VISUAL[t.id];
      const h = (vis?.height || 0.2) + 0.1;
      for (const adjId of t.adjacentTo) {
        const key = [t.id, adjId].sort().join('-');
        if (!drawn.has(key)) {
          drawn.add(key);
          const adj = territories[adjId];
          if (adj) {
            const [x1, z1] = svgTo3D(t.labelX, t.labelY);
            const [x2, z2] = svgTo3D(adj.labelX, adj.labelY);
            const adjVis = TERRITORY_VISUAL[adjId];
            const h2 = (adjVis?.height || 0.2) + 0.1;
            const avgH = (h + h2) / 2 + 0.08;
            result.push({ start: [x1, avgH, z1], end: [x2, avgH, z2] });
          }
        }
      }
    }
    return result;
  }, [territories]);

  return (
    <group>
      {lines.map((line, i) => (
        <Line
          key={`conn-${i}`}
          points={[line.start, line.end]}
          color="#8B735544"
          lineWidth={1}
          dashed
          dashSize={0.08}
          gapSize={0.08}
        />
      ))}
    </group>
  );
}

// ========================
// Floating Platform
// ========================
function FloatingPlatform() {
  const platformRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (platformRef.current) {
      platformRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.03 - 0.2;
    }
  });

  return (
    <group ref={platformRef}>
      {/* Main disc top */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[7.8, 8.2, 0.3, 64]} />
        <meshStandardMaterial color="#3D2B1F" roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Surface layer */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[7.7, 7.7, 0.04, 64]} />
        <meshStandardMaterial color="#4A3828" roughness={0.85} metalness={0.02} />
      </mesh>
      {/* Top edge ring */}
      <mesh position={[0, 0.19, 0]}>
        <torusGeometry args={[7.75, 0.08, 8, 64]} />
        <meshStandardMaterial color="#5A4A3A" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Bottom taper - upper section */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[8.2, 5.5, 1.2, 64]} />
        <meshStandardMaterial color="#2A1A0E" roughness={1} />
      </mesh>
      {/* Bottom taper - lower section */}
      <mesh position={[0, -2.0, 0]}>
        <cylinderGeometry args={[5.5, 2.5, 1.8, 64]} />
        <meshStandardMaterial color="#1A0E06" roughness={1} />
      </mesh>
      {/* Bottom point */}
      <mesh position={[0, -3.2, 0]}>
        <coneGeometry args={[2.5, 1.2, 64]} />
        <meshStandardMaterial color="#150A04" roughness={1} />
      </mesh>
      {/* Rocky protrusions on the bottom */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        const r = 6.5 + Math.sin(i * 2.3) * 1.2;
        const y = -1.5 - Math.random() * 1.5;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, y, Math.sin(angle) * r]} rotation={[Math.random(), Math.random(), Math.random()]}>
            <dodecahedronGeometry args={[0.3 + Math.random() * 0.4, 0]} />
            <meshStandardMaterial color="#2A1A0E" roughness={1} />
          </mesh>
        );
      })}
    </group>
  );
}

// ========================
// Ocean
// ========================
function Ocean() {
  const waterRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.position.y = -3.5 + Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
    }
  });

  return (
    <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]}>
      <planeGeometry args={[60, 60, 32, 32]} />
      <meshStandardMaterial
        color="#0A2A3A"
        transparent
        opacity={0.75}
        roughness={0.15}
        metalness={0.4}
      />
    </mesh>
  );
}

// ========================
// Magical Particles
// ========================
function MagicalParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 150;

  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 5 + 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  });

  const [sizes] = useState(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = Math.random() * 0.04 + 0.01;
    }
    return s;
  });

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.0005;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#D4A017"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ========================
// Lighting
// ========================
function SceneLighting() {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    if (dirLightRef.current) {
      const t = state.clock.elapsedTime * 0.1;
      dirLightRef.current.position.x = Math.sin(t) * 3;
      dirLightRef.current.position.z = Math.cos(t) * 3;
    }
  });

  return (
    <>
      {/* Ambient light - cool moonlight */}
      <ambientLight intensity={0.25} color="#4466AA" />
      {/* Hemisphere light - sky/ground */}
      <hemisphereLight args={['#2A3A5A', '#3A2A1A', 0.3]} />
      {/* Main directional - slowly orbiting moonlight */}
      <directionalLight
        ref={dirLightRef}
        position={[3, 8, 3]}
        intensity={0.6}
        color="#C0C8E0"
        castShadow={false}
      />
      {/* Warm accent light - from below the platform */}
      <pointLight position={[0, -2, 0]} intensity={0.4} color="#FF8844" distance={12} decay={2} />
      {/* Secondary fill light */}
      <pointLight position={[-4, 4, -2]} intensity={0.15} color="#6688CC" distance={15} decay={2} />
      <pointLight position={[4, 3, 3]} intensity={0.1} color="#CC8844" distance={12} decay={2} />
    </>
  );
}

// ========================
// Main Scene
// ========================

function WorldScene({ onTerritoryHover }: { onTerritoryHover: (id: string | null) => void }) {
  const territories = useGameStore(s => s.territories);
  const territoryList = useMemo(() => Object.values(territories), [territories]);

  return (
    <>
      <color attach="background" args={['#060810']} />
      <fog attach="fog" args={['#060810', 14, 35]} />

      <SceneLighting />
      <OrbitControls
        enablePan={true}
        minDistance={4}
        maxDistance={22}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.1}
        enableDamping
        dampingFactor={0.08}
      />

      <FloatingPlatform />
      <Ocean />

      {territoryList.map(t => (
        <TerritoryMesh
          key={t.id}
          territoryId={t.id}
          path={t.path}
          labelX={t.labelX}
          labelY={t.labelY}
          onHover={onTerritoryHover}
          onClick={() => {}}
        />
      ))}

      <ConnectionLines />
      <MagicalParticles />

      {/* Map title in 3D space */}
      <Html position={[0, -0.1, 4.2]} center>
        <div style={{
          pointerEvents: 'none',
          fontSize: '10px',
          fontFamily: 'var(--font-cinzel), serif',
          color: 'rgba(212,160,23,0.4)',
          letterSpacing: '4px',
          whiteSpace: 'nowrap',
        }}>
          THE CONTINENT OF AETHERMOOR
        </div>
      </Html>
    </>
  );
}

// ========================
// Loading Screen
// ========================
function LoadingScreen() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#060810',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{
        fontSize: '14px',
        fontFamily: 'var(--font-cinzel), serif',
        color: '#D4A017',
        letterSpacing: '3px',
        animation: 'pulse 2s ease-in-out infinite',
      }}>
        ENTERING AETHERMOOR...
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ========================
// Exported Component
// ========================

interface GameMap3DProps {
  onTerritoryHover?: (id: string | null) => void;
}

export default function GameMap3D({ onTerritoryHover = () => {} }: GameMap3DProps) {
  const handleHover = useCallback((id: string | null) => {
    onTerritoryHover(id);
  }, [onTerritoryHover]);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Canvas
        camera={{ position: [0, 10, 10], fov: 42, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        style={{ background: '#060810' }}
        onPointerMissed={() => {
          useGameStore.getState().clearSelection();
        }}
      >
        <WorldScene onTerritoryHover={handleHover} />
      </Canvas>
    </Suspense>
  );
}