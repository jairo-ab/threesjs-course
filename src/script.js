import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'

// Debug
const gui = new GUI({
    width: 340,
    title: 'Depurador'
})

window.addEventListener('keydown', (event) => {
    if(event.key === 'h') {
        gui.show(gui._hidden)
    }
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Textures
const textureLoader = new THREE.TextureLoader()
const gradient = textureLoader.load('/textures/gradients/3.jpg')
gradient.magFilter = THREE.NearestFilter

// Scene
const scene = new THREE.Scene()

/**
 * Parameters
 */

const parameters = {
    color: '#ffeded'
}

/**
 * Material
 */
const material = new THREE.MeshToonMaterial({
    color: parameters.color,
    gradientMap: gradient
})

/**
 * Meshes
 */
const objectDistance = 4

const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 50),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh1.position.y = -objectDistance * 0
mesh2.position.y = -objectDistance * 1
mesh3.position.y = -objectDistance * 2

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * Particles
 */
// Geometry
const particlesCount = 300
const positions = new Float32Array(particlesCount * 3)

for (let index = 0; index < particlesCount; index++) {
    const i3 = index * 3

    positions[i3 + 0] = (Math.random() - 0.5) * 10
    positions[i3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * sectionMeshes.length
    positions[i3 + 2] = (Math.random() - 0.5) * 10
}

const particleGeometry = new THREE.BufferGeometry()
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particleMaterial = new THREE.PointsMaterial({
    color: parameters.color,
    sizeAttenuation: true,
    size: 0.03
})

const particles = new THREE.Points(
    particleGeometry,
    particleMaterial
)

scene.add(particles)

/**
 * Luzes para a cena
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 2)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

gui.addColor(parameters, 'color')
    .onChange(e => {
        particleMaterial.color = new THREE.Color(e)
        material.color = new THREE.Color(e)
    })

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Atualização do tamanho da tela caso redimensionar
    sizes.width =  window.innerWidth
    sizes.height = window.innerHeight

    // Atualização da câmera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Atualização do renderizador
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// base camera
const aspecRatio = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(35, aspecRatio, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)


//Render
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

document.addEventListener('scroll', () => {
    scrollY = window.scrollY

    const newSection = Math.round(scrollY / sizes.height)

    if(newSection != currentSection) {
        currentSection = newSection

        gsap.to(sectionMeshes[currentSection].rotation, {
                duration: 3,
                ease: 'power2.inOut',
                y: '+=6',
                x: '+=3',
                z: '+=1.5'
            }
        )
    }
})

// Cursor event
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
})

// Clock
const clock = new THREE.Clock()
let previousTime = 0

//Animations
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate meshes
    for(const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
