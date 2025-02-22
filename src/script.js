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

// Cursor event
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Textures
const textureLoader = new THREE.TextureLoader()
const textureCustom = textureLoader.load('/textures/particles/2.png')

// Scene
const scene = new THREE.Scene()

/**
 * Particulas
 */
// Geometry
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)
const particlesGeometry = new THREE.BufferGeometry()
const count = 5000

// Cria uma matriz unidimensional
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let index = 0; index < count * 3; index++) {
    positions[index] = (Math.random() - 0.5) * 10
    colors[index] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    // sizeAttenuation cria a pespectiva de longe e perto
    sizeAttenuation: true
})

// particlesMaterial.color = new THREE.Color('#fff000')
particlesMaterial.transparent = true
particlesMaterial.alphaMap = textureCustom
// particlesMaterial.alphaTest = 0.001
// particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending
particlesMaterial.vertexColors = true

// Points
const partciles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(partciles)


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

// Camera
const aspecRatio = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, aspecRatio, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// Para que o amortecimento aconteça, é necessário atualizar
// depois da atualização do próximo quadro
controls.enableDamping = true

controls.enabled = true

//Render
const renderer = new THREE.WebGLRenderer({
  canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Clock
const clock = new THREE.Clock()

//Animations
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Atualização das particulas
    // partciles.rotation.y = elapsedTime * 0.2

    for (let index = 0; index < count; index++) {
        const i3 = index * 3

        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }

    particlesGeometry.attributes.position.needsUpdate = true

    // Atualização do controle
    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
