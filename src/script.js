import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

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

const debbugObject = {}

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
// Modo manual

// const image = new Image()
// const texture = new THREE.Texture(image)
// texture.colorSpace = THREE.SRGBColorSpace

// image.onload = () => {
//     texture.needsUpdate = true
// }
// image.src = 'door.jpg'

// Modo automático utilizando o carregador de texturas
// do Three.js
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
const metalTexture = textureLoader.load('/textures/Metal_Mesh_009_basecolor.png')
const minecraftTexture = textureLoader.load('/textures/minecraft.png')
const tableTexture = textureLoader.load('/textures/checkerboard-1024x1024.png')
const table8Texture = textureLoader.load('/textures/checkerboard-8x8.png')
const colorTexture = textureLoader.load('/textures/door/color.jpg')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const matCaps2Texture = textureLoader.load('/textures/matcaps/3.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')

normalTexture.colorSpace = THREE.SRGBColorSpace
colorTexture.colorSpace = THREE.SRGBColorSpace
table8Texture.colorSpace = THREE.SRGBColorSpace
minecraftTexture.colorSpace = THREE.SRGBColorSpace
metalTexture.colorSpace = THREE.SRGBColorSpace
matCaps2Texture.colorSpace = THREE.SRGBColorSpace
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.wrapS = THREE.MirroredRepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping

// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5

// colorTexture.rotation = Math.PI / 4
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5

// tableTexture.minFilter = THREE.NearestFilter
colorTexture.minFilter = THREE.NearestFilter
// table8Texture.minFilter = THREE.NearestFilter
table8Texture.magFilter = THREE.NearestFilter
minecraftTexture.generateMipmaps = false
minecraftTexture.minFilter = THREE.NearestFilter
minecraftTexture.magFilter = THREE.NearestFilter

metalTexture.magFilter = THREE.NearestFilter
matCaps2Texture.magFilter = THREE.NearestFilter

// Scene
const scene = new THREE.Scene()

// Object
debbugObject.color = '#00ff1e'

// Custom geometry
const customGeometry = new THREE.BufferGeometry()

const count = 500
const positionsArray = new Float32Array(count * 3 * 3)

for (let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 4
}

const positionAttribute = new THREE.BufferAttribute(positionsArray, 3)
customGeometry.setAttribute('position', positionAttribute)

const group = new THREE.Group()
scene.add(group)

// MeshBasiMaterial
// const meshBasicMaterial = texture => {
//     if(texture) {
//         return new THREE.MeshMatcapMaterial({ matcap: texture })
//     } else {
//         return new THREE.MeshMatcapMaterial()
//     }
// }

// MeshMatcapMaterial
// const meshBasicMaterial = new THREE.MeshMatcapMaterial()
// cubeGeometry.material.flatShading = true

// MeshDepthMaterial
// const meshBasicMaterial = new THREE.MeshDepthMaterial()

// MeshLambertMaterial
// const meshBasicMaterial = new THREE.MeshLambertMaterial()

// MeshPhongMaterial
// const meshBasicMaterial = new THREE.MeshPhongMaterial()
// meshBasicMaterial.shininess = 10
// meshBasicMaterial.specular = new THREE.Color(rgb(255, 0, 0))

// MeshToonMaterial
// const meshBasicMaterial = new THREE.MeshToonMaterial()
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.minFilter = THREE.NearestFilter
// meshBasicMaterial.gradientMap = gradientTexture

// MeshStandardMaterial
// const meshBasicMaterial = new THREE.MeshStandardMaterial()
// meshBasicMaterial.metalness = 1
// meshBasicMaterial.roughness = 1
// meshBasicMaterial.map = colorTexture
// meshBasicMaterial.aoMap = ambientOcclusionTexture
// meshBasicMaterial.aoMapIntensity = 1
// meshBasicMaterial.displacementMap = heightTexture
// meshBasicMaterial.displacementScale = 0.1
// meshBasicMaterial.metalnessMap = metalTexture
// meshBasicMaterial.roughnessMap = roughnessTexture
// meshBasicMaterial.normalMap = normalTexture
// meshBasicMaterial.normalScale.set(0.5, 0.5)
// meshBasicMaterial.transparent = true
// meshBasicMaterial.alphaMap = alphaTexture

// gui.add(meshBasicMaterial, 'metalness').min(0).max(1).step(0.001)
// gui.add(meshBasicMaterial, 'roughness').min(0).max(1).step(0.001)

// MeshPhysicalMaterial
const meshBasicMaterial = new THREE.MeshPhysicalMaterial()
meshBasicMaterial.metalness = 0
meshBasicMaterial.roughness = 0
// meshBasicMaterial.map = colorTexture
// meshBasicMaterial.aoMap = ambientOcclusionTexture
// meshBasicMaterial.aoMapIntensity = 1
// meshBasicMaterial.displacementMap = heightTexture
// meshBasicMaterial.displacementScale = 0.1
// meshBasicMaterial.metalnessMap = metalTexture
// meshBasicMaterial.roughnessMap = roughnessTexture
// meshBasicMaterial.normalMap = normalTexture
// meshBasicMaterial.normalScale.set(0.5, 0.5)
// meshBasicMaterial.transparent = true
// meshBasicMaterial.alphaMap = alphaTexture

gui.add(meshBasicMaterial, 'metalness').min(0).max(1).step(0.001)
gui.add(meshBasicMaterial, 'roughness').min(0).max(1).step(0.001)

// Clearcoart (verniz)
// meshBasicMaterial.clearcoat = 1
// meshBasicMaterial.clearcoatRoughness = 1

// gui.add(meshBasicMaterial, 'clearcoat').min(0).max(1).step(0.001)
// gui.add(meshBasicMaterial, 'clearcoatRoughness').min(0).max(1).step(0.001)

// Sheen
// meshBasicMaterial.sheen = 1
// meshBasicMaterial.sheenRoughness = 0.25
// meshBasicMaterial.sheenColor.set(1, 1, 1)

// gui.add(meshBasicMaterial, 'sheen').min(0).max(1).step(0.001)
// gui.add(meshBasicMaterial, 'sheenRoughness').min(0).max(1).step(0.001)

// Iridescence
// meshBasicMaterial.iridescence = 1
// meshBasicMaterial.iridescenceIOR = 1
// meshBasicMaterial.iridescenceThicknessRange = [100, 800]

// gui.add(meshBasicMaterial, 'iridescence').min(0).max(1).step(0.001)
// gui.add(meshBasicMaterial, 'iridescenceIOR').min(0).max(2.333).step(0.001)
// gui.add(meshBasicMaterial.iridescenceThicknessRange, '0').min(1).max(1000).step(1)
// gui.add(meshBasicMaterial.iridescenceThicknessRange, '1').min(1).max(1000).step(1)

// Transmission
meshBasicMaterial.transmission = 1
meshBasicMaterial.ior = 1.5
meshBasicMaterial.thickness = 1.5

gui.add(meshBasicMaterial, 'transmission').min(0).max(1).step(0.001)
gui.add(meshBasicMaterial, 'ior').min(1).max(10).step(0.001)
gui.add(meshBasicMaterial, 'thickness').min(0).max(1).step(0.001)

// Geometry Material
const cube_geometry = new THREE.BoxGeometry(1, 1, 1, 100, 100, 2)
const cone_geometry = new THREE.ConeGeometry(0.5, 1, 64, 64)
const sphere_geometry = new THREE.SphereGeometry(0.5, 64, 64)
const torus_geometry = new THREE.TorusGeometry(0.4, 0.2, 64, 128)

const cubeGeometry = new THREE.Mesh(
    cube_geometry,
    meshBasicMaterial
)

const coneGeometry = new THREE.Mesh(
    cone_geometry,
    meshBasicMaterial
)

const sphereGeometry = new THREE.Mesh(
    sphere_geometry,
    meshBasicMaterial
)

const torusGeometry = new THREE.Mesh(
    torus_geometry,
    meshBasicMaterial
)

// Alterando posição nos 3 eixos
// coneGeometry.position.set(-1.5, 0, 0)
// sphereGeometry.position.set(1.5, 0, 0)
// torusGeometry.position.set(3.5, 0, 0)

// Alterando posição em um eixo especifico
coneGeometry.position.x = -1.5
sphereGeometry.position.x = 1.5
torusGeometry.position.x = 3.5
// sphereGeometry.rotation.set(1.5, 3.1415, 0)
// sphereGeometry.scale.set(1.5, 0, 0)

// cubeGeometry.material.wireframe = true
// cubeGeometry.material.color = new THREE.Color('red')
// cubeGeometry.material.map = minecraftTexture
// cubeGeometry.material.transparent = true
// cubeGeometry.material.opacity = 0.5
// cubeGeometry.material.side = THREE.BackSide
// cubeGeometry.material.flatShading = true

group.add(cubeGeometry)
group.add(coneGeometry)
group.add(sphereGeometry)
group.add(torusGeometry)

// Lights (Luzes)
// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// group.add(ambientLight)

// const pointerLight = new THREE.PointLight(0xffffff , 30)
// pointerLight.position.x = 2
// pointerLight.position.y = 3
// pointerLight.position.z = 4
// group.add(pointerLight)

// Environment Map
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/textures/environmentMap/2k.hdr', environmentMap => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap
})

const cube = gui.addFolder('Cubo')

cube
    .add(cubeGeometry.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('Elevação')

cube.add(cubeGeometry, 'visible')

cube.add(cubeGeometry.material, 'wireframe')

cube
    .addColor(debbugObject, 'color')
    .onChange(e => {
        cubeGeometry.material.color.set(debbugObject.color)
    })

// Custom function
debbugObject.spin = () => {
    gsap.to(cubeGeometry.rotation, { duration: 1, y: cubeGeometry.rotation.y + Math.PI * 4 })
}

cube
    .add(debbugObject, 'spin')
    .name('Animation')

debbugObject.subdivision = 2
cube
    .add(debbugObject, 'subdivision')
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange(() => {
        cubeGeometry.geometry.dispose()
        cubeGeometry.geometry = new THREE.BoxGeometry(
            1, 1, 1,
            debbugObject.subdivision, debbugObject.subdivision, debbugObject.subdivision
        )
    })

// Cone
const cone = gui.addFolder('Cone')

cone
    .add(coneGeometry.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('Elevação')

cone.add(coneGeometry, 'visible')

cone.add(coneGeometry.material, 'wireframe')

cone
    .addColor(debbugObject, 'color')
    .onChange(e => {
        coneGeometry.material.color.set(debbugObject.color)
    })

// Custom function
// debbugObject.spin = () => {
//     gsap.to(coneGeometry.rotation, { duration: 1, y: coneGeometry.rotation.y + Math.PI * 4 })
// }

// cone
//     .add(debbugObject, 'spin')
//     .name('Animation')

//Axes helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

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

// window.addEventListener('dblclick', () => {
//     const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

//     if (!fullscreenElement) {
//         if (canvas.requestFullscreen) {
//             canvas.requestFullscreen()
//         } else if (canvas.webkitRequestFullscreen) {
//             canvas.webkitRequestFullscreen()
//         }
//     } else {
//         if(document.exitFullscreen) {
//             document.exitFullscreen()
//         } else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen()
//         }
//     }
// })

// Camera
const aspecRatio = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, aspecRatio, 0.1, 100)
// Camera Ortográfica - Pode utiliza-la para efeitos
// const camera = new THREE.OrthographicCamera(-1 * aspecRatio, 1 * aspecRatio, 1, -1, 0.1, 100)
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
camera.lookAt(cubeGeometry.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// controls.target.y = -1
// controls.update()
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
// let time = Date.now()
const clock = new THREE.Clock()

// gsap.to(cubeGeometry.position, { duration: 1, delay: 1, x: 2 })
// gsap.to(cubeGeometry.position, { duration: 1, delay: 2, x: 0 })

//Animations
const tick = () => {
    // console.log('tick')
    // const currentTime = Date.now()
    // const delta = currentTime - time
    // time = currentTime

    // cubeGeometry.rotation.y += 0.001 * delta

    const elapsedTime = clock.getElapsedTime()

    // camera.position.x = cursor.x * 3
    // camera.position.y = cursor.y * 3
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
    // camera.position.y = cursor.y * 3

    // camera.lookAt(cubeGeometry.position)

    cubeGeometry.rotation.y = 0.15 * elapsedTime
    cubeGeometry.rotation.x = 0.15 * elapsedTime
    // cubeGeometry.rotation.z = elapsedTime
    coneGeometry.rotation.x = 0.15 * elapsedTime - 1
    sphereGeometry.position.y = 0.15 * Math.cos(Math.PI * elapsedTime)
    sphereGeometry.rotation.y = 0.15 * elapsedTime
    torusGeometry.rotation.y = 0.15 * elapsedTime

    // Atualização do controle
    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
