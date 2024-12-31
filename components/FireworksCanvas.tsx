'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

class Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  acceleration: THREE.Vector3
  color: THREE.Color
  size: number
  life: number
  maxLife: number

  constructor(position: THREE.Vector3, color: THREE.Color) {
    this.position = position
    this.velocity = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ).multiplyScalar(0.05)
    this.acceleration = new THREE.Vector3(0, -0.0001, 0)
    this.color = color
    this.size = Math.random() * 2 + 1
    this.life = 0
    this.maxLife = Math.random() * 100 + 100
  }

  update() {
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)
    this.life++
    return this.life < this.maxLife
  }
}

class Firework {
  particles: Particle[]
  geometry: THREE.BufferGeometry
  material: THREE.PointsMaterial
  points: THREE.Points

  constructor(scene: THREE.Scene, position: THREE.Vector3) {
    this.particles = []
    const color = new THREE.Color(Math.random(), Math.random(), Math.random())
    for (let i = 0; i < 500; i++) {
      this.particles.push(new Particle(position.clone(), color))
    }

    this.geometry = new THREE.BufferGeometry()
    this.material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    })

    this.points = new THREE.Points(this.geometry, this.material)
    scene.add(this.points)
  }

  update() {
    const positions = []
    const colors = []
    const sizes = []

    this.particles = this.particles.filter(particle => {
      const alive = particle.update()
      if (alive) {
        positions.push(particle.position.x, particle.position.y, particle.position.z)
        colors.push(particle.color.r, particle.color.g, particle.color.b)
        sizes.push(particle.size * (1 - particle.life / particle.maxLife))
      }
      return alive
    })

    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    this.geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))

    return this.particles.length > 0
  }

  dispose(scene: THREE.Scene) {
    scene.remove(this.points)
    this.geometry.dispose()
    this.material.dispose()
  }
}

export default function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.position.z = 5

    const fireworks: Firework[] = []

    const addFirework = (x: number, y: number) => {
      const vector = new THREE.Vector3(
        (x / window.innerWidth) * 2 - 1,
        -(y / window.innerHeight) * 2 + 1,
        0.5
      )
      vector.unproject(camera)
      const dir = vector.sub(camera.position).normalize()
      const distance = -camera.position.z / dir.z
      const pos = camera.position.clone().add(dir.multiplyScalar(distance))
      fireworks.push(new Firework(scene, pos))
    }

    const animate = () => {
      requestAnimationFrame(animate)

      fireworks.forEach((firework, index) => {
        if (!firework.update()) {
          firework.dispose(scene)
          fireworks.splice(index, 1)
        }
      })

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    const handleClick = (event: MouseEvent) => {
      addFirework(event.clientX, event.clientY)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
      fireworks.forEach(firework => firework.dispose(scene))
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />
}

