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

// Textures
const loadTexture = new THREE.TextureLoader()
const simpleShadow = loadTexture.load('/textures/simpleShadow.jpg')
const bakedShadow = loadTexture.load('/textures/bakedShadow.jpg')

simpleShadow.colorSpace = THREE.SRGBColorSpace
bakedShadow.colorSpace = THREE.SRGBColorSpace

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, -1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(directionalLight)

// Se o objeto é renderizado em mapa de sombra.
// Irei ativar, porque eu quero que lance luzes de sombra
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
// Se utilizar no render shadowMap.type 'PCFSoftShadowMap'
// shadow.radius não funcionará, então pode permanecer com
// 'PCFShadowMap' que é o padrão.
// directionalLight.shadow.radius = 10
// gui.add(directionalLight.shadow, 'radius').min(0).max(20).step(0.01)

// Directional Camera helper
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)

// Spot light
const spotLight = new THREE.SpotLight(0xffffff, 3, 10, Math.PI * 0.3)
spotLight.castShadow = true
spotLight.position.set(0, 2, 2)
scene.add(spotLight)
scene.add(spotLight.target)

spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 30
gui.add(spotLight.shadow.camera, 'fov').min(0).max(100).step(0.01)
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

// SpotLight Camera Helper
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
scene.add(spotLightCameraHelper)

// Point Light
const pointLight = new THREE.PointLight(0xffffff, 2.7)
pointLight.castShadow = true
pointLight.position.set(-1, 1, 0)
scene.add(pointLight)

pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

//PointLight Camera Helper
const pointLighthelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLighthelper.visible = false
scene.add(pointLighthelper)

// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

const sphereGeometry = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphereGeometry.castShadow = true
gui.add(sphereGeometry.position, 'y').min(0).max(3).step(0.01)
gui.add(sphereGeometry.position, 'x').min(0).max(3).step(0.01)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.receiveShadow = true

plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.5

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow
    })
)
sphereShadow.rotation.x = -Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01

scene.add(sphereGeometry, sphereShadow, plane)

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
camera.position.y = 2
camera.position.z = 2
camera.lookAt(sphereGeometry.position)
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
renderer.shadowMap.enabled = false
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Clock
const clock = new THREE.Clock()

//Animations
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    sphereGeometry.position.x = Math.cos(elapsedTime) * 1.5
    sphereGeometry.position.z = Math.sin(elapsedTime)
    sphereGeometry.position.y = Math.abs(Math.sin(elapsedTime * 3))

    // Atualização da sombra
    sphereShadow.position.x = sphereGeometry.position.x
    sphereShadow.position.z = sphereGeometry.position.z
    sphereShadow.material.opacity = (1 - Math.abs(sphereGeometry.position.y)) * 0.3

    // Atualização do controle
    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
