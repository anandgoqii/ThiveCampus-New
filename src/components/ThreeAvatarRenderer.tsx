import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 3D Model component that draws the customizer segments and handles math-driven skeletal animations.
interface AvatarModelProps {
  customization: {
    skinTone: string;
    hairStyle: string;
    hairColor: string;
    eyeStyle: string;
    eyeColor: string;
    eyebrows: string;
    smile: string;
    faceAccessory: string;
    glasses: string;
    top: string;
    jacket: string;
    hoodie: string;
    bottom: string;
    shoes: string;
    socks: string;
    cap: string;
    backpack: string;
    watch: string;
    waterBottle: string;
    rewardAccessory: string;
    activeAnimation: string;
  };
}

const Avatar3DModel: React.FC<AvatarModelProps> = ({ customization }) => {
  const {
    skinTone,
    hairStyle,
    hairColor,
    eyeStyle,
    eyeColor,
    eyebrows,
    smile,
    faceAccessory,
    glasses,
    top,
    jacket,
    hoodie,
    bottom,
    shoes,
    socks,
    cap,
    backpack,
    watch,
    waterBottle,
    rewardAccessory,
    activeAnimation,
  } = customization;

  // Refs for character joints to drive animations
  const characterGroupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const armLRef = useRef<THREE.Group>(null);
  const armRRef = useRef<THREE.Group>(null);
  const legLRef = useRef<THREE.Group>(null);
  const legRRef = useRef<THREE.Group>(null);
  const wingsRef = useRef<THREE.Group>(null);
  const swordRef = useRef<THREE.Group>(null);
  const deskRef = useRef<THREE.Group>(null);
  const bookRef = useRef<THREE.Group>(null);
  const [zzzParticles, setZzzParticles] = useState<{ id: number; pos: [number, number, number]; scale: number }[]>([]);

  // Periodically generate Zzz particles when sleeping
  useEffect(() => {
    if (activeAnimation !== 'Sleep') {
      setZzzParticles([]);
      return;
    }
    const interval = setInterval(() => {
      setZzzParticles((prev) => [
        ...prev.slice(-5),
        {
          id: Math.random(),
          pos: [
            0.1 + (Math.random() - 0.5) * 0.1,
            1.1 + Math.random() * 0.1,
            0.1 + (Math.random() - 0.5) * 0.1,
          ],
          scale: 0.2 + Math.random() * 0.15,
        },
      ]);
    }, 1200);
    return () => clearInterval(interval);
  }, [activeAnimation]);

  // Frame animations loop
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Reset default positions/rotations for bones
    if (headRef.current) {
      headRef.current.position.set(0, 0.95, 0);
      headRef.current.rotation.set(0, 0, 0);
    }
    if (torsoRef.current) {
      torsoRef.current.position.set(0, 0.15, 0);
      torsoRef.current.rotation.set(0, 0, 0);
      torsoRef.current.scale.set(1, 1, 1);
    }
    if (armLRef.current) {
      armLRef.current.position.set(-0.32, 0.7, 0);
      armLRef.current.rotation.set(0, 0, 0.08);
    }
    if (armRRef.current) {
      armRRef.current.position.set(0.32, 0.7, 0);
      armRRef.current.rotation.set(0, 0, -0.08);
    }
    if (legLRef.current) {
      legLRef.current.position.set(-0.16, -0.2, 0);
      legLRef.current.rotation.set(0, 0, 0);
    }
    if (legRRef.current) {
      legRRef.current.position.set(0.16, -0.2, 0);
      legRRef.current.rotation.set(0, 0, 0);
    }
    if (wingsRef.current) {
      wingsRef.current.rotation.y = Math.sin(t * 3) * 0.15;
    }
    if (swordRef.current) {
      swordRef.current.rotation.set(0, 0, 0);
    }

    // Dynamic animation triggers
    switch (activeAnimation) {
      case 'Wave':
        if (armRRef.current) {
          // Wave right arm
          armRRef.current.rotation.z = Math.PI - 0.4;
          armRRef.current.rotation.x = Math.sin(t * 8) * 0.35;
        }
        if (headRef.current) {
          headRef.current.rotation.y = Math.sin(t * 2) * 0.08;
        }
        break;

      case 'Celebrate':
        if (torsoRef.current) {
          // Jump and sway
          torsoRef.current.position.y = 0.15 + Math.max(0, Math.sin(t * 8) * 0.35);
        }
        if (armLRef.current && armRRef.current) {
          armLRef.current.rotation.z = -Math.PI / 2.5 + Math.sin(t * 10) * 0.25;
          armRRef.current.rotation.z = Math.PI / 2.5 + Math.sin(t * 10) * 0.25;
          armLRef.current.rotation.x = Math.sin(t * 12) * 0.15;
          armRRef.current.rotation.x = -Math.sin(t * 12) * 0.15;
        }
        break;

      case 'Dance':
        if (torsoRef.current) {
          torsoRef.current.position.y = 0.15 + Math.abs(Math.sin(t * 4)) * 0.08;
          torsoRef.current.rotation.y = Math.sin(t * 4) * 0.3;
          torsoRef.current.rotation.z = Math.sin(t * 2) * 0.12;
        }
        if (armLRef.current && armRRef.current) {
          armLRef.current.rotation.x = Math.sin(t * 5) * 0.5;
          armRRef.current.rotation.x = -Math.sin(t * 5) * 0.5;
          armLRef.current.rotation.z = -0.3 + Math.sin(t * 3) * 0.2;
          armRRef.current.rotation.z = 0.3 - Math.sin(t * 3) * 0.2;
        }
        if (legLRef.current && legRRef.current) {
          legLRef.current.rotation.x = Math.sin(t * 4) * 0.2;
          legRRef.current.rotation.x = -Math.sin(t * 4) * 0.2;
        }
        break;

      case 'Run':
        if (torsoRef.current) {
          torsoRef.current.position.y = 0.1 + Math.abs(Math.sin(t * 12)) * 0.12;
          torsoRef.current.rotation.x = 0.18;
          torsoRef.current.rotation.y = Math.sin(t * 12) * 0.1;
        }
        if (legLRef.current && legRRef.current) {
          legLRef.current.rotation.x = Math.sin(t * 12) * 0.7;
          legRRef.current.rotation.x = -Math.sin(t * 12) * 0.7;
        }
        if (armLRef.current && armRRef.current) {
          armLRef.current.rotation.x = -Math.sin(t * 12) * 0.6;
          armRRef.current.rotation.x = Math.sin(t * 12) * 0.6;
          armLRef.current.rotation.z = -0.15;
          armRRef.current.rotation.z = 0.15;
        }
        break;

      case 'Walk':
        if (torsoRef.current) {
          torsoRef.current.position.y = 0.15 + Math.abs(Math.sin(t * 6)) * 0.05;
          torsoRef.current.rotation.x = 0.05;
          torsoRef.current.rotation.y = Math.sin(t * 6) * 0.05;
        }
        if (legLRef.current && legRRef.current) {
          legLRef.current.rotation.x = Math.sin(t * 6) * 0.45;
          legRRef.current.rotation.x = -Math.sin(t * 6) * 0.45;
        }
        if (armLRef.current && armRRef.current) {
          armLRef.current.rotation.x = -Math.sin(t * 6) * 0.35;
          armRRef.current.rotation.x = Math.sin(t * 6) * 0.35;
        }
        break;

      case 'High Five':
        if (armRRef.current) {
          armRRef.current.rotation.x = -Math.PI / 2.3;
          armRRef.current.rotation.y = -0.15;
          armRRef.current.rotation.z = -0.1;
        }
        if (torsoRef.current) {
          torsoRef.current.rotation.x = 0.06;
        }
        break;

      case 'Meditate':
        if (torsoRef.current) {
          // Floating
          torsoRef.current.position.y = 0.35 + Math.sin(t * 1.8) * 0.08;
        }
        if (legLRef.current && legRRef.current) {
          // Cross legs
          legLRef.current.rotation.set(0.5, 0, 0.8);
          legRRef.current.rotation.set(0.5, 0, -0.8);
        }
        if (armLRef.current && armRRef.current) {
          armLRef.current.rotation.set(0.1, 0, -0.4);
          armRRef.current.rotation.set(0.1, 0, 0.4);
        }
        if (wingsRef.current) {
          wingsRef.current.rotation.y = Math.sin(t * 4) * 0.25;
        }
        break;

      case 'Study':
        if (torsoRef.current) {
          torsoRef.current.position.set(0, -0.05, 0);
          torsoRef.current.rotation.x = 0.28;
        }
        if (headRef.current) {
          headRef.current.rotation.x = 0.35;
        }
        if (armLRef.current) {
          armLRef.current.rotation.set(-0.5, 0, 0.1);
        }
        if (armRRef.current) {
          // Writing motion
          armRRef.current.rotation.set(-0.6 + Math.sin(t * 8) * 0.08, Math.cos(t * 8) * 0.05, -0.2);
        }
        if (legLRef.current && legRRef.current) {
          // Sit pose
          legLRef.current.rotation.set(-1.1, 0, 0);
          legRRef.current.rotation.set(-1.1, 0, 0);
        }
        break;

      case 'Read Book':
        if (torsoRef.current) {
          torsoRef.current.position.set(0, -0.05, 0);
          torsoRef.current.rotation.x = 0.12;
        }
        if (headRef.current) {
          headRef.current.rotation.x = 0.3;
        }
        if (armLRef.current && armRRef.current) {
          // Holding book
          armLRef.current.rotation.set(-0.7, 0.3, 0.3);
          armRRef.current.rotation.set(-0.7, -0.3, -0.3);
        }
        if (legLRef.current && legRRef.current) {
          legLRef.current.rotation.set(-1.1, 0, 0);
          legRRef.current.rotation.set(-1.1, 0, 0);
        }
        break;

      case 'Sleep':
        if (torsoRef.current) {
          torsoRef.current.position.set(0, -0.1, 0.05);
          torsoRef.current.rotation.set(0.12, 0, 0.18);
          // Breathing scale effect
          torsoRef.current.scale.set(1, 1 + Math.sin(t * 2) * 0.02, 1);
        }
        if (headRef.current) {
          headRef.current.rotation.set(0.2, 0, -0.1);
        }
        if (armLRef.current && armRRef.current) {
          armLRef.current.rotation.set(0.1, 0, -0.05);
          armRRef.current.rotation.set(0.1, 0, 0.05);
        }
        if (legLRef.current && legRRef.current) {
          legLRef.current.rotation.set(-1.1, 0, 0);
          legRRef.current.rotation.set(-1.1, 0, 0);
        }
        break;

      default:
        break;
    }
  });

  // Color Mapping Helper
  const getSkinColorHex = (id: string) => {
    const tones: Record<string, string> = {
      'skin-1': '#f5c69d',
      'skin-2': '#e0a370',
      'skin-3': '#bc804c',
      'skin-4': '#8d5524',
      'skin-5': '#563312',
    };
    return tones[id] || '#f5c69d';
  };

  const getHairColorHex = (id: string) => {
    const colors: Record<string, string> = {
      'hair-black': '#2b2d31',
      'hair-brown': '#593e25',
      'hair-blonde': '#e3ad5d',
      'hair-red': '#b83b27',
      'hair-blue': '#3173e6',
    };
    return colors[id] || '#2b2d31';
  };

  const skinColor = getSkinColorHex(skinTone);
  const hairHex = getHairColorHex(hairColor);

  return (
    <group ref={characterGroupRef} position={[0, -0.4, 0]}>
      {/* 3D SCENE BACKGROUND HELPER (Optional, can be toggled or just plain 3D) */}

      {/* RENDER DESK OR BOOK ACCORDING TO STATE */}
      {activeAnimation === 'Study' && (
        <group ref={deskRef} position={[0, -0.2, 0.4]}>
          {/* Desk Surface */}
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[1, 0.04, 0.5]} />
            <meshStandardMaterial color="#8b5a2b" roughness={0.7} />
          </mesh>
          {/* Left leg */}
          <mesh position={[-0.45, 0.17, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.35]} />
            <meshStandardMaterial color="#404040" />
          </mesh>
          {/* Right leg */}
          <mesh position={[0.45, 0.17, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.35]} />
            <meshStandardMaterial color="#404040" />
          </mesh>
          {/* Notebook */}
          <mesh position={[0, 0.37, 0.05]} rotation={[0, -0.05, 0]}>
            <boxGeometry args={[0.3, 0.01, 0.22]} />
            <meshStandardMaterial color="#fafafa" />
          </mesh>
        </group>
      )}

      {activeAnimation === 'Read Book' && (
        <group ref={bookRef} position={[0, 0.45, 0.28]} rotation={[-0.2, 0, 0]}>
          {/* Open Book spine */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.02, 0.24, 0.01]} />
            <meshStandardMaterial color="#b91c1c" />
          </mesh>
          {/* Left Page */}
          <mesh position={[-0.12, 0, 0.02]} rotation={[0, 0.3, 0]}>
            <boxGeometry args={[0.22, 0.22, 0.005]} />
            <meshStandardMaterial color="#fffff0" roughness={0.9} />
          </mesh>
          {/* Right Page */}
          <mesh position={[0.12, 0, 0.02]} rotation={[0, -0.3, 0]}>
            <boxGeometry args={[0.22, 0.22, 0.005]} />
            <meshStandardMaterial color="#fffff0" roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* SLEEP PARTICLES (Zzz) */}
      {zzzParticles.map((p) => (
        <mesh key={p.id} position={p.pos} scale={p.scale}>
          <boxGeometry args={[0.08, 0.08, 0.02]} /> {/* Simple particle shape */}
          <meshStandardMaterial color="#93c5fd" emissive="#1d4ed8" emissiveIntensity={0.5} transparent opacity={0.8} />
        </mesh>
      ))}

      {/* CORE HUMAN CHARACTER BODY SEGMENTS */}
      <group ref={torsoRef} position={[0, 0.15, 0]}>
        {/* Torso Box */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.5, 0.6, 0.25]} />
          {/* Color torso according to clothing tops/hoodies/jackets */}
          <meshStandardMaterial 
            color={
              top === 'top-scholar' ? '#1e3a8a' :
              top === 'top-champion' ? '#dc2626' :
              top === 'top-gold' ? '#fbbf24' :
              top === 'top-aqua' ? '#06b6d4' :
              '#14b8a6' // default teal
            } 
            roughness={0.5} 
          />
        </mesh>

        {/* Jacket Layer overlay */}
        {jacket !== 'none' && (
          <mesh position={[0, 0.45, 0]} scale={[1.04, 1.02, 1.08]}>
            <boxGeometry args={[0.5, 0.58, 0.25]} />
            <meshStandardMaterial 
              color={jacket === 'jacket-varsity' ? '#4b5563' : jacket === 'jacket-leather' ? '#1f2937' : '#ea580c'} 
              transparent 
              opacity={0.95} 
            />
          </mesh>
        )}

        {/* Hoodie overlay */}
        {hoodie !== 'none' && (
          <group>
            <mesh position={[0, 0.45, 0]} scale={[1.05, 1.05, 1.05]}>
              <boxGeometry args={[0.5, 0.6, 0.25]} />
              <meshStandardMaterial color={hoodie === 'hoodie-gamer' ? '#8b5cf6' : '#0891b2'} />
            </mesh>
            {/* Hood Mesh behind Neck */}
            <mesh position={[0, 0.72, -0.15]} rotation={[0.4, 0, 0]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial color={hoodie === 'hoodie-gamer' ? '#8b5cf6' : '#0891b2'} />
            </mesh>
          </group>
        )}

        {/* Neck */}
        <mesh position={[0, 0.78, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.1]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>

        {/* HEAD */}
        <group ref={headRef} position={[0, 0.95, 0]}>
          <mesh>
            <sphereGeometry args={[0.26, 32, 32]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>

          {/* EYES */}
          <group position={[0, 0, 0.2]}>
            {/* Left Eye */}
            <mesh position={[-0.09, 0.04, 0.06]}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshStandardMaterial 
                color={activeAnimation === 'Sleep' ? skinColor : eyeColor === 'blue' ? '#3b6fd4' : eyeColor === 'green' ? '#10b981' : eyeColor === 'purple' ? '#8b5cf6' : '#1e293b'} 
              />
            </mesh>
            {/* Right Eye */}
            <mesh position={[0.09, 0.04, 0.06]}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshStandardMaterial 
                color={activeAnimation === 'Sleep' ? skinColor : eyeColor === 'blue' ? '#3b6fd4' : eyeColor === 'green' ? '#10b981' : eyeColor === 'purple' ? '#8b5cf6' : '#1e293b'} 
              />
            </mesh>

            {/* Sparkle effect on eyes */}
            {eyeStyle === 'sparkle' && activeAnimation !== 'Sleep' && (
              <>
                <mesh position={[-0.09, 0.07, 0.08]}>
                  <boxGeometry args={[0.015, 0.015, 0.01]} />
                  <meshStandardMaterial color="#fff" emissive="#fff" />
                </mesh>
                <mesh position={[0.09, 0.07, 0.08]}>
                  <boxGeometry args={[0.015, 0.015, 0.01]} />
                  <meshStandardMaterial color="#fff" emissive="#fff" />
                </mesh>
              </>
            )}

            {/* EYEBROWS */}
            {eyebrows !== 'none' && (
              <>
                <mesh 
                  position={[-0.09, 0.11, 0.06]} 
                  rotation={[0, 0, eyebrows === 'angled' ? 0.2 : eyebrows === 'sad' ? -0.2 : 0]}
                >
                  <boxGeometry args={[0.08, eyebrows === 'thick' ? 0.025 : 0.012, 0.01]} />
                  <meshStandardMaterial color={hairHex} />
                </mesh>
                <mesh 
                  position={[0.09, 0.11, 0.06]} 
                  rotation={[0, 0, eyebrows === 'angled' ? -0.2 : eyebrows === 'sad' ? 0.2 : 0]}
                >
                  <boxGeometry args={[0.08, eyebrows === 'thick' ? 0.025 : 0.012, 0.01]} />
                  <meshStandardMaterial color={hairHex} />
                </mesh>
              </>
            )}

            {/* SMILE / MOUTH */}
            {smile !== 'none' && (
              <mesh position={[0, -0.06, 0.07]} rotation={[0, 0, smile === 'silly' ? 0.1 : 0]}>
                {smile === 'determined' ? (
                  <boxGeometry args={[0.08, 0.015, 0.01]} />
                ) : (
                  <torusGeometry args={[0.05, 0.01, 8, 8, Math.PI]} />
                )}
                <meshStandardMaterial color="#7f1d1d" />
              </mesh>
            )}

            {/* FACE ACCESSORIES (blush or bandaid) */}
            {faceAccessory === 'blush' && (
              <>
                <mesh position={[-0.15, -0.01, 0.04]}>
                  <planeGeometry args={[0.06, 0.03]} />
                  <meshStandardMaterial color="#fca5a5" transparent opacity={0.6} />
                </mesh>
                <mesh position={[0.15, -0.01, 0.04]}>
                  <planeGeometry args={[0.06, 0.03]} />
                  <meshStandardMaterial color="#fca5a5" transparent opacity={0.6} />
                </mesh>
              </>
            )}
            {faceAccessory === 'bandaid' && (
              <mesh position={[0.08, -0.02, 0.07]} rotation={[0, 0, 0.3]}>
                <boxGeometry args={[0.08, 0.025, 0.01]} />
                <meshStandardMaterial color="#eab308" />
              </mesh>
            )}
          </group>

          {/* GLASSES */}
          {glasses !== 'none' && (
            <group position={[0, 0.04, 0.18]}>
              {/* Left Lens ring */}
              <mesh position={[-0.1, 0, 0.06]}>
                <torusGeometry args={[0.08, 0.01, 8, 24]} />
                <meshStandardMaterial color={glasses === 'stars' ? '#ec4899' : glasses === 'happy' ? '#fbbf24' : '#111827'} roughness={0.1} />
              </mesh>
              {/* Right Lens ring */}
              <mesh position={[0.1, 0, 0.06]}>
                <torusGeometry args={[0.08, 0.01, 8, 24]} />
                <meshStandardMaterial color={glasses === 'stars' ? '#ec4899' : glasses === 'happy' ? '#fbbf24' : '#111827'} roughness={0.1} />
              </mesh>
              {/* Bridge */}
              <mesh position={[0, 0, 0.06]}>
                <boxGeometry args={[0.12, 0.015, 0.015]} />
                <meshStandardMaterial color="#111827" />
              </mesh>
              {/* Temple stems */}
              <mesh position={[-0.18, 0, -0.1]} rotation={[0, -0.1, 0]}>
                <boxGeometry args={[0.01, 0.01, 0.22]} />
                <meshStandardMaterial color="#111827" />
              </mesh>
              <mesh position={[0.18, 0, -0.1]} rotation={[0, 0.1, 0]}>
                <boxGeometry args={[0.01, 0.01, 0.22]} />
                <meshStandardMaterial color="#111827" />
              </mesh>
            </group>
          )}

          {/* HAIR STYLE */}
          {hairStyle !== 'none' && (
            <group position={[0, 0.1, -0.05]}>
              {hairStyle === 'hair-short' && (
                <mesh position={[0, 0.12, 0.05]}>
                  <sphereGeometry args={[0.27, 16, 16]} />
                  <meshStandardMaterial color={hairHex} roughness={0.8} />
                </mesh>
              )}
              {hairStyle === 'hair-long' && (
                <group>
                  <mesh position={[0, 0.12, 0.05]}>
                    <sphereGeometry args={[0.27, 16, 16]} />
                    <meshStandardMaterial color={hairHex} roughness={0.8} />
                  </mesh>
                  {/* Left Shoulder tail */}
                  <mesh position={[-0.18, -0.16, -0.08]}>
                    <cylinderGeometry args={[0.06, 0.03, 0.34]} />
                    <meshStandardMaterial color={hairHex} roughness={0.8} />
                  </mesh>
                  {/* Right Shoulder tail */}
                  <mesh position={[0.18, -0.16, -0.08]}>
                    <cylinderGeometry args={[0.06, 0.03, 0.34]} />
                    <meshStandardMaterial color={hairHex} roughness={0.8} />
                  </mesh>
                </group>
              )}
              {hairStyle === 'hair-spike' && (
                <group>
                  <mesh position={[0, 0.12, 0.05]}>
                    <sphereGeometry args={[0.26, 16, 16]} />
                    <meshStandardMaterial color={hairHex} />
                  </mesh>
                  {/* Spikes */}
                  {Array.from({ length: 9 }).map((_, i) => (
                    <mesh 
                      key={i} 
                      position={[(i % 3 - 1) * 0.1, 0.26, -0.08 + Math.floor(i / 3) * 0.08]} 
                      rotation={[0.1, 0, (i % 3 - 1) * 0.35]}
                    >
                      <coneGeometry args={[0.06, 0.16, 4]} />
                      <meshStandardMaterial color={hairHex} />
                    </mesh>
                  ))}
                </group>
              )}
              {hairStyle === 'hair-bun' && (
                <group>
                  <mesh position={[0, 0.12, 0.05]}>
                    <sphereGeometry args={[0.27, 16, 16]} />
                    <meshStandardMaterial color={hairHex} />
                  </mesh>
                  {/* High Top Bun Ball */}
                  <mesh position={[0, 0.32, 0]}>
                    <sphereGeometry args={[0.12, 16, 16]} />
                    <meshStandardMaterial color={hairHex} />
                  </mesh>
                </group>
              )}
            </group>
          )}

          {/* CAP / HEADWEAR */}
          {cap !== 'none' && (
            <group position={[0, 0.18, 0.02]} rotation={[-0.08, 0, 0]}>
              <mesh position={[0, 0.06, 0]}>
                <sphereGeometry args={[0.27, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
                <meshStandardMaterial color={cap === 'cap-moon' ? '#312e81' : cap === 'cap-beanie' ? '#f43f5e' : '#1d4ed8'} />
              </mesh>
              {/* Visor for Cap */}
              {cap !== 'cap-beanie' && (
                <mesh position={[0, 0.02, 0.18]} rotation={[0.1, 0, 0]}>
                  <boxGeometry args={[0.28, 0.02, 0.18]} />
                  <meshStandardMaterial color={cap === 'cap-moon' ? '#fbbf24' : '#1d4ed8'} />
                </mesh>
              )}
            </group>
          )}
        </group>

        {/* BACKPACK */}
        {backpack !== 'none' && (
          <group position={[0, 0.45, -0.18]} rotation={[0.05, 0, 0]}>
            {backpack === 'backpack-jetpack' ? (
              <group>
                {/* Left Cylinder Jet */}
                <mesh position={[-0.14, 0, 0]}>
                  <cylinderGeometry args={[0.08, 0.08, 0.38]} />
                  <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.15} />
                </mesh>
                {/* Right Cylinder Jet */}
                <mesh position={[0.14, 0, 0]}>
                  <cylinderGeometry args={[0.08, 0.08, 0.38]} />
                  <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.15} />
                </mesh>
                {/* Flame effect */}
                <mesh position={[-0.14, -0.26, 0]} rotation={[Math.PI, 0, 0]}>
                  <coneGeometry args={[0.05, 0.16, 4]} />
                  <meshStandardMaterial color="#f97316" emissive="#ea580c" />
                </mesh>
                <mesh position={[0.14, -0.26, 0]} rotation={[Math.PI, 0, 0]}>
                  <coneGeometry args={[0.05, 0.16, 4]} />
                  <meshStandardMaterial color="#f97316" emissive="#ea580c" />
                </mesh>
              </group>
            ) : backpack === 'backpack-shell' ? (
              <mesh position={[0, 0, 0]} scale={[1, 1, 0.5]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color="#16a34a" roughness={0.9} />
              </mesh>
            ) : (
              /* Scholar Orange Backpack */
              <mesh>
                <boxGeometry args={[0.3, 0.4, 0.15]} />
                <meshStandardMaterial color="#ea580c" />
              </mesh>
            )}
          </group>
        )}

        {/* LEFT ARM */}
        <group ref={armLRef} position={[-0.32, 0.7, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.065, 0.055, 0.48]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
          {/* Hand Ball */}
          <mesh position={[0, -0.48, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
          {/* Sleeve overlap */}
          <mesh position={[0, -0.1, 0]} scale={[1.1, 1.1, 1.1]}>
            <cylinderGeometry args={[0.068, 0.068, 0.2]} />
            <meshStandardMaterial 
              color={
                top === 'top-scholar' ? '#1e3a8a' :
                top === 'top-champion' ? '#dc2626' :
                top === 'top-gold' ? '#fbbf24' :
                top === 'top-aqua' ? '#06b6d4' :
                '#14b8a6'
              } 
            />
          </mesh>
        </group>

        {/* RIGHT ARM & HAND */}
        <group ref={armRRef} position={[0.32, 0.7, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.065, 0.055, 0.48]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
          {/* Hand Ball */}
          <mesh position={[0, -0.48, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
          {/* Sleeve overlap */}
          <mesh position={[0, -0.1, 0]} scale={[1.1, 1.1, 1.1]}>
            <cylinderGeometry args={[0.068, 0.068, 0.2]} />
            <meshStandardMaterial 
              color={
                top === 'top-scholar' ? '#1e3a8a' :
                top === 'top-champion' ? '#dc2626' :
                top === 'top-gold' ? '#fbbf24' :
                top === 'top-aqua' ? '#06b6d4' :
                '#14b8a6'
              } 
            />
          </mesh>

          {/* WATCH ON RIGHT WRIST */}
          {watch !== 'none' && (
            <mesh position={[0, -0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.065, 0.015, 6, 16]} />
              <meshStandardMaterial color={watch === 'watch-gold' ? '#fbbf24' : watch === 'watch-smart' ? '#1f2937' : '#22c55e'} metalness={watch === 'watch-gold' ? 0.9 : 0.2} />
            </mesh>
          )}

          {/* RENDER SWORD IF EQUIPPED IN HAND */}
          {rewardAccessory === 'reward-sword' && (
            <group ref={swordRef} position={[0, -0.56, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
              {/* Sword Handle */}
              <mesh position={[0, -0.1, 0]}>
                <boxGeometry args={[0.03, 0.2, 0.03]} />
                <meshStandardMaterial color="#78350f" />
              </mesh>
              {/* Sword Guard */}
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.18, 0.03, 0.05]} />
                <meshStandardMaterial color="#ea580c" />
              </mesh>
              {/* Sword Blade */}
              <mesh position={[0, 0.35, 0]}>
                <boxGeometry args={[0.05, 0.58, 0.015]} />
                <meshStandardMaterial color="#38bdf8" emissive="#0369a1" emissiveIntensity={0.6} />
              </mesh>
            </group>
          )}
        </group>

        {/* REWARD ACCESSORIES - ANGEL WINGS ATTACHED TO BACK */}
        {rewardAccessory === 'reward-wings' && (
          <group ref={wingsRef} position={[0, 0.45, -0.18]}>
            {/* Left Wing */}
            <mesh position={[-0.32, 0.1, -0.05]} rotation={[0.1, -0.4, -0.2]}>
              <boxGeometry args={[0.5, 0.25, 0.02]} />
              <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={0.5} transparent opacity={0.9} />
            </mesh>
            {/* Right Wing */}
            <mesh position={[0.32, 0.1, -0.05]} rotation={[0.1, 0.4, 0.2]}>
              <boxGeometry args={[0.5, 0.25, 0.02]} />
              <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={0.5} transparent opacity={0.9} />
            </mesh>
          </group>
        )}

        {/* REWARD ACCESSORIES - HALO FLOATING ABOVE HEAD */}
        {rewardAccessory === 'reward-halo' && (
          <mesh position={[0, 1.34, 0]} rotation={[Math.PI / 2.3, 0, 0]}>
            <torusGeometry args={[0.18, 0.02, 8, 24]} />
            <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={1.5} />
          </mesh>
        )}

        {/* WATER BOTTLE ATTACHED OR FLOATING NEXT TO IT */}
        {waterBottle !== 'none' && (
          <mesh position={[0.42, 0.05, 0.2]} rotation={[0, 0, -0.1]}>
            <cylinderGeometry args={[0.06, 0.06, 0.22]} />
            <meshStandardMaterial color={waterBottle === 'bottle-flask' ? '#2563eb' : waterBottle === 'bottle-jug' ? '#0891b2' : '#dc2626'} />
          </mesh>
        )}
      </group>

      {/* LOWER BODY: BOTTOMS / PANTS */}
      <group position={[0, 0.15, 0]}>
        {/* LEFT LEG */}
        <group ref={legLRef} position={[-0.16, -0.2, 0]}>
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.075, 0.065, 0.54]} />
            <meshStandardMaterial 
              color={
                bottom === 'bottom-scholar' ? '#1e293b' :
                bottom === 'bottom-shorts' ? '#4b5563' :
                bottom === 'bottom-gold' ? '#ca8a04' :
                '#1d4ed8' // denim default
              } 
            />
          </mesh>

          {/* SOCKS */}
          {socks !== 'none' && (
            <mesh position={[0, -0.4, 0]} scale={[1.1, 1.1, 1.1]}>
              <cylinderGeometry args={[0.07, 0.07, 0.12]} />
              <meshStandardMaterial color={socks === 'socks-athletic' ? '#e2e8f0' : socks === 'socks-pink' ? '#f472b6' : '#ffffff'} />
            </mesh>
          )}

          {/* SHOES */}
          <mesh position={[0, -0.55, 0.05]}>
            <boxGeometry args={[0.11, 0.1, 0.22]} />
            <meshStandardMaterial 
              color={
                shoes === 'shoes-slides' ? '#14b8a6' :
                shoes === 'shoes-gold' ? '#facc15' :
                '#dc2626' // runners default red
              } 
              metalness={shoes === 'shoes-gold' ? 0.9 : 0.1}
            />
          </mesh>
        </group>

        {/* RIGHT LEG */}
        <group ref={legRRef} position={[0.16, -0.2, 0]}>
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.075, 0.065, 0.54]} />
            <meshStandardMaterial 
              color={
                bottom === 'bottom-scholar' ? '#1e293b' :
                bottom === 'bottom-shorts' ? '#4b5563' :
                bottom === 'bottom-gold' ? '#ca8a04' :
                '#1d4ed8' // denim default
              } 
            />
          </mesh>

          {/* SOCKS */}
          {socks !== 'none' && (
            <mesh position={[0, -0.4, 0]} scale={[1.1, 1.1, 1.1]}>
              <cylinderGeometry args={[0.07, 0.07, 0.12]} />
              <meshStandardMaterial color={socks === 'socks-athletic' ? '#e2e8f0' : socks === 'socks-pink' ? '#f472b6' : '#ffffff'} />
            </mesh>
          )}

          {/* SHOES */}
          <mesh position={[0, -0.55, 0.05]}>
            <boxGeometry args={[0.11, 0.1, 0.22]} />
            <meshStandardMaterial 
              color={
                shoes === 'shoes-slides' ? '#14b8a6' :
                shoes === 'shoes-gold' ? '#facc15' :
                '#dc2626' // runners default red
              } 
              metalness={shoes === 'shoes-gold' ? 0.9 : 0.1}
            />
          </mesh>
        </group>
      </group>

      {/* PET SLIME BOUNCING NEXT TO AVATAR */}
      {rewardAccessory === 'reward-pet' && (
        <mesh position={[-0.56, -0.4, 0.1]} scale={[1, 0.8 + Math.abs(Math.sin(THREE.MathUtils.degToRad(360) * Date.now() * 0.002)) * 0.2, 1]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#22c55e" roughness={0.1} transparent opacity={0.8} />
          {/* Eyes for pet */}
          <mesh position={[0.04, 0.03, 0.1]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial color="#000" />
          </mesh>
          <mesh position={[-0.04, 0.03, 0.1]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial color="#000" />
          </mesh>
        </mesh>
      )}
    </group>
  );
};

interface ThreeAvatarRendererProps {
  customization: AvatarModelProps['customization'];
  rotationY: number;
  zoom: number;
}

export const ThreeAvatarRenderer: React.FC<ThreeAvatarRendererProps> = ({ customization, rotationY, zoom }) => {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (controlsRef.current) {
      // Update camera zoom and rotations externally
      controlsRef.current.target.set(0, 0.4, 0);
    }
  }, []);

  return (
    <div className="w-full h-full min-h-[300px] cursor-grab active:cursor-grabbing relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] border border-neutral-200">
      <Canvas
        camera={{ position: [0, 0.6, 1.8 * zoom], fov: 45 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 4]} intensity={1.2} castShadow />
        <directionalLight position={[-2, 1, -1]} intensity={0.4} />
        <pointLight position={[0, 1.5, 1]} intensity={0.5} />

        <group rotation={[0, rotationY, 0]}>
          <Avatar3DModel customization={customization} />
        </group>

        {/* Floor Grid Decoration */}
        <gridHelper args={[10, 10, '#cbd5e1', '#f1f5f9']} position={[0, -0.8, 0]} />

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={0.8}
          maxDistance={3.5}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {/* Compass helper badge */}
      <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm border border-neutral-200/50 rounded-lg px-2.5 py-1 text-[9px] font-bold text-neutral-500 pointer-events-none select-none uppercase tracking-wider">
        3D View Enabled
      </div>
    </div>
  );
};
