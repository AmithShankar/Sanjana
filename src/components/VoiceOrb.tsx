'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbState } from '@/types'
import { cn } from '@/lib/utils'

interface VoiceOrbProps {
  state: OrbState
  audioLevel?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const vertexShader = `
  uniform float uTime;
  uniform float uAmplitude;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vNoise;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  void main() {
    vNormal = normal;
    vPosition = position;
    float speed = uTime * 0.35;
    float n1 = snoise(position * 1.2 + speed);
    float n2 = snoise(position * 2.5 - speed * 0.7);
    float noise = n1 * 0.6 + n2 * 0.4;
    vNoise = noise;
    vec3 displaced = position + normal * noise * uAmplitude;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`

const fragmentShader = `
  uniform vec3 uColorCore;
  uniform vec3 uColorMid;
  uniform vec3 uColorEdge;
  uniform float uTime;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vNoise;

  void main() {
    vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0) - vPosition);
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), viewDir)), 2.5);
    float t = (vNoise + 1.0) * 0.5;
    vec3 color = mix(uColorCore, uColorMid, t);
    color = mix(color, uColorEdge, fresnel * 0.85);
    float alpha = uOpacity * (0.88 + fresnel * 0.12);
    gl_FragColor = vec4(color, alpha);
  }
`

const STATE_CONFIG = {
  idle:       { amplitude: 0.08, speed: 1.0,  colorA: [0.36, 0.22, 0.75] as [number,number,number], colorB: [0.55, 0.35, 0.95] as [number,number,number], colorC: [0.8, 0.7, 1.0] as [number,number,number] },
  listening:  { amplitude: 0.22, speed: 2.2,  colorA: [0.13, 0.78, 0.83] as [number,number,number], colorB: [0.36, 0.22, 0.75] as [number,number,number], colorC: [0.9, 0.95, 1.0] as [number,number,number] },
  responding: { amplitude: 0.15, speed: 1.6,  colorA: [0.55, 0.20, 0.90] as [number,number,number], colorB: [0.25, 0.50, 1.00] as [number,number,number], colorC: [1.0, 0.85, 1.0] as [number,number,number] },
}

const SIZE_MAP = { sm: 80, md: 200, lg: 340 }

export default function VoiceOrb({ state, audioLevel = 0, size = 'lg', className }: VoiceOrbProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const uniformsRef = useRef<Record<string, THREE.IUniform> | null>(null)
  const frameRef = useRef<number>(0)
  const clockRef = useRef(new THREE.Clock())
  const stateRef = useRef(state)
  const audioRef = useRef(audioLevel)

  stateRef.current = state
  audioRef.current = audioLevel

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const px = SIZE_MAP[size]

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
    camera.position.z = 2.2

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(px, px)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const geo = new THREE.IcosahedronGeometry(0.85, 64)
    const cfg = STATE_CONFIG[state]
    const uniforms: Record<string, THREE.IUniform> = {
      uTime:      { value: 0 },
      uAmplitude: { value: cfg.amplitude },
      uColorCore: { value: new THREE.Color(...cfg.colorA) },
      uColorMid:  { value: new THREE.Color(...cfg.colorB) },
      uColorEdge: { value: new THREE.Color(...cfg.colorC) },
      uOpacity:   { value: 0.92 },
    }
    uniformsRef.current = uniforms

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      side: THREE.FrontSide,
    })
    const orb = new THREE.Mesh(geo, mat)
    scene.add(orb)

    const coreGeo = new THREE.SphereGeometry(0.5, 32, 32)
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.5, 0.3, 1.0),
      transparent: true,
      opacity: 0.18,
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    scene.add(core)

    const partCount = size === 'sm' ? 60 : 180
    const partGeo = new THREE.BufferGeometry()
    const partPos = new Float32Array(partCount * 3)
    const partPhases = new Float32Array(partCount)
    for (let i = 0; i < partCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.05 + Math.random() * 0.35
      partPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      partPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      partPos[i * 3 + 2] = r * Math.cos(phi)
      partPhases[i] = Math.random() * Math.PI * 2
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3))
    const partMat = new THREE.PointsMaterial({
      color: new THREE.Color(0.75, 0.6, 1.0),
      size: size === 'sm' ? 0.012 : 0.018,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(partGeo, partMat)
    scene.add(particles)

    scene.add(new THREE.AmbientLight(0xffffff, 0.3))
    const light1 = new THREE.PointLight(0x8b5cf6, 2.5, 10)
    light1.position.set(2, 2, 2)
    scene.add(light1)
    const light2 = new THREE.PointLight(0x06b6d4, 1.8, 10)
    light2.position.set(-2, -1, 1)
    scene.add(light2)

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      const s = stateRef.current
      const al = audioRef.current
      const u = uniformsRef.current!
      const cfg2 = STATE_CONFIG[s]
      const t = clockRef.current.getElapsedTime()

      u.uTime.value = t * cfg2.speed
      const targetAmp = cfg2.amplitude + al * 0.18
      u.uAmplitude.value += (targetAmp - u.uAmplitude.value) * 0.08

      const targetCore = new THREE.Color(...cfg2.colorA)
      const targetMid  = new THREE.Color(...cfg2.colorB)
      const targetEdge = new THREE.Color(...cfg2.colorC)
      ;(u.uColorCore.value as THREE.Color).lerp(targetCore, 0.04)
      ;(u.uColorMid.value  as THREE.Color).lerp(targetMid,  0.04)
      ;(u.uColorEdge.value as THREE.Color).lerp(targetEdge, 0.04)

      orb.rotation.y = t * 0.12
      orb.rotation.x = Math.sin(t * 0.08) * 0.1

      const positions = partGeo.attributes.position.array as Float32Array
      for (let i = 0; i < partCount; i++) {
        const phase = partPhases[i]
        const pulse = 1.0 + Math.sin(t * 1.5 + phase) * (0.04 + al * 0.08)
        const base = 1.05 + (i / partCount) * 0.35
        const r = base * pulse
        const theta = (i / partCount) * Math.PI * 2 + t * 0.08
        const phi = Math.acos(2 * (i / partCount) - 1)
        positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
        positions[i * 3 + 2] = r * Math.cos(phi)
      }
      partGeo.attributes.position.needsUpdate = true
      particles.rotation.y = t * 0.05

      const pcol = s === 'listening'
        ? new THREE.Color(0.1, 0.9, 0.95)
        : s === 'responding'
          ? new THREE.Color(0.7, 0.4, 1.0)
          : new THREE.Color(0.75, 0.6, 1.0)
      ;(partMat.color as THREE.Color).lerp(pcol, 0.05)

      const glowScale = 1 + Math.sin(t * 1.2) * 0.04 + al * 0.06
      particles.scale.setScalar(glowScale)

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameRef.current)
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size])

  const px = SIZE_MAP[size]

  return (
    <div
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: px, height: px }}
    >
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            state === 'listening'
              ? 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)'
              : state === 'responding'
                ? 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          transition: 'background 1s ease',
          transform: 'scale(1.3)',
        }}
      />
      <div ref={mountRef} className="relative z-10" />
      <div
        className="absolute inset-0 rounded-full border pointer-events-none"
        style={{
          borderColor:
            state === 'listening'
              ? 'rgba(6,182,212,0.3)'
              : state === 'responding'
                ? 'rgba(139,92,246,0.35)'
                : 'rgba(139,92,246,0.15)',
          transition: 'border-color 0.6s ease',
          animation: state !== 'idle' ? 'pulseRing 2s ease-in-out infinite' : 'none',
        }}
      />
    </div>
  )
}
