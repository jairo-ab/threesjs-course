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

// Scene
const scene = new THREE.Scene()

//Lights
/**
 * Se adicionarmo somente o AmbientLight
 * a cena ficará estranha, pois a luz aplicada é de uma omnilateral.
 * Ou seja, a luz é aplicada em tudo, como se estivesse aplicando o BasicMaterial.
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

const sphereGeometry = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphereGeometry.position.x = -1.5

const cubeGeometry = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torusGeometry = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torusGeometry.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotateX(-Math.PI * 0.5)
plane.position.y = -0.65

scene.add(plane)
scene.add(sphereGeometry)
scene.add(cubeGeometry)
scene.add(torusGeometry)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
camera.lookAt(cubeGeometry.position)
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

    // cubeGeometry.rotation.y = 0.15 * elapsedTime

    // Atualização do controle
    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
