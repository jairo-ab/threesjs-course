import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
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

// Texture
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {
    console.log('onStart')
}
loadingManager.onProgress = () => {
    console.log('onProgress')
}
loadingManager.onLoad = () => {
    console.log('onLoad')
}
loadingManager.onError = (error) => {
    console.log('onError: ', error)
}

const textureLoader = new THREE.TextureLoader(loadingManager)
const textureMaterial = textureLoader.load('/textures/metaMesh009/Material_1914.png')
const textureColor = textureLoader.load('/textures/metaMesh009/Metal_Mesh_009_basecolor.png')
const textureAmbienteOcclusion = textureLoader.load('/textures/metaMesh009/Metal_Mesh_009_ambientOcclusion.png')
const textureHeight = textureLoader.load('/textures/metaMesh009/Metal_Mesh_009_height.png')
const textureMetallic = textureLoader.load('/textures/metaMesh009/Metal_Mesh_009_metallic.png')
const textureNormal = textureLoader.load('/textures/metaMesh009/Metal_Mesh_009_normal.png')
const textureOpacity = textureLoader.load('/textures/metaMesh009/Metal_Mesh_009_opacity.png')
const textureRoughness = textureLoader.load('/textures/metaMesh009/Metal_Mesh_009_roughness.png')

textureColor.colorSpace = THREE.SRGBColorSpace
textureAmbienteOcclusion.colorSpace = THREE.SRGBColorSpace
textureHeight.colorSpace = THREE.SRGBColorSpace
textureMetallic.colorSpace = THREE.SRGBColorSpace
textureNormal.colorSpace = THREE.SRGBColorSpace
textureOpacity.colorSpace = THREE.SRGBColorSpace
textureRoughness.colorSpace = THREE.SRGBColorSpace

textureColor.minFilter = THREE.NearestFilter
// textureAmbienteOcclusion.minFilter = THREE.NearestFilter
textureHeight.minFilter = THREE.NearestFilter
textureMetallic.minFilter = THREE.NearestFilter
textureNormal.minFilter = THREE.NearestFilter
textureOpacity.minFilter = THREE.NearestFilter
textureRoughness.minFilter = THREE.NearestFilter

const cubeMaterial = new THREE.MeshStandardMaterial()

cubeMaterial.metalness = 0
cubeMaterial.roughness = 0
cubeMaterial.map = textureColor
cubeMaterial.normalMap = textureNormal
cubeMaterial.aoMap = textureAmbienteOcclusion
cubeMaterial.aoMapIntensity = 1
cubeMaterial.displacementMap = textureHeight
cubeMaterial.displacementScale = 0.1
// cubeMaterial.metalnessMap = textureMetallic
cubeMaterial.roughnessMap = textureRoughness
cubeMaterial.normalScale.set(0.5, 0.5)
cubeMaterial.alphaMap = textureMetallic
// cubeMaterial.transparent = true

gui.add(cubeMaterial, 'metalness').min(0).max(1).step(0.001)
gui.add(cubeMaterial, 'roughness').min(0).max(1).step(0.001)

const cubeGeometry = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    cubeMaterial
)

// Light
const ambientLight = new THREE.AmbientLight()
scene.add(ambientLight)

const pointerLight = new THREE.PointLight(0xffffff , 30)
pointerLight.position.x = 2
pointerLight.position.y = 3
pointerLight.position.z = 4

scene.add(cubeGeometry)

// const rgbeLoader = new RGBELoader()
// rgbeLoader.load('/textures/environmentMap/2k.hdr', environmentMap => {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping

//     scene.background = environmentMap
//     scene.environment = environmentMap
// })

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

    cubeGeometry.rotation.y = 0.15 * elapsedTime

    // Atualização do controle
    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
