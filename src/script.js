import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { Timer } from 'three/examples/jsm/Addons.js'

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

////////// Textures //////////
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
loadingManager.onError = () => {
    console.log('onError')
}

const loaderTexture = new THREE.TextureLoader(loadingManager)

// Textura do chão (floor)
// Importante: Quando se usa Alpha, é preciso informar que o material
// suporta transparência
const alphaFloorTexture = loaderTexture.load('/textures/floor/alpha.jpg')
const normalFloorTexture = loaderTexture.load('/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg')
const armFloorTexture = loaderTexture.load('/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg')
const colorFloorTexture = loaderTexture.load('/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg')
const displacementFloorTexture = loaderTexture.load('/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg')

colorFloorTexture.colorSpace = THREE.SRGBColorSpace

colorFloorTexture.repeat.set(8, 8)
normalFloorTexture.repeat.set(8, 8)
armFloorTexture.repeat.set(8, 8)
displacementFloorTexture.repeat.set(8, 8)

colorFloorTexture.wrapS = THREE.RepeatWrapping
normalFloorTexture.wrapS = THREE.RepeatWrapping
armFloorTexture.wrapS = THREE.RepeatWrapping
displacementFloorTexture.wrapS = THREE.RepeatWrapping

colorFloorTexture.wrapT = THREE.RepeatWrapping
normalFloorTexture.wrapT = THREE.RepeatWrapping
armFloorTexture.wrapT = THREE.RepeatWrapping
displacementFloorTexture.wrapT = THREE.RepeatWrapping

// Deslocamento da textura, utilizar gui para encontrar o melhor valor
// displacementMap: <texture>
// displacementScale: 0.35
// displacementBias: -0.2

// Textura da parede (wall)
// const colorWallMossyBrick = loaderTexture.load('/textures/wall/mossy_brick_1k/mossy_brick_diff_1k.jpg')
// const armWallMossyBrick = loaderTexture.load('/textures/wall/mossy_brick_1k/mossy_brick_arm_1k.jpg')
// const normalWallMossyBrick = loaderTexture.load('/textures/wall/mossy_brick_1k/mossy_brick_arm_1k.jpg')

const colorWallMossyBrick = loaderTexture.load('/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg')
const armWallMossyBrick = loaderTexture.load('/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg')
const normalWallMossyBrick = loaderTexture.load('/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg')

colorWallMossyBrick.colorSpace = THREE.SRGBColorSpace

colorWallMossyBrick.repeat.set(2, 2)
armWallMossyBrick.repeat.set(2, 2)
normalWallMossyBrick.repeat.set(2, 2)

colorWallMossyBrick.wrapS = THREE.RepeatWrapping
armWallMossyBrick.wrapS = THREE.RepeatWrapping
normalWallMossyBrick.wrapS = THREE.RepeatWrapping

colorWallMossyBrick.wrapT = THREE.RepeatWrapping
armWallMossyBrick.wrapT = THREE.RepeatWrapping
normalWallMossyBrick.wrapT = THREE.RepeatWrapping

// Telhado da casa (roof)
const colorRoofTexture = loaderTexture.load('/textures/roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg')
const armRoofTexture = loaderTexture.load('/textures/roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg')
const normalRoofTexture = loaderTexture.load('/textures/roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg')

colorRoofTexture.colorSpace = THREE.SRGBColorSpace

colorRoofTexture.repeat.set(3, 1)
armRoofTexture.repeat.set(3, 1)
normalRoofTexture.repeat.set(3, 1)

colorRoofTexture.wrapS = THREE.RepeatWrapping
armRoofTexture.wrapS = THREE.RepeatWrapping
normalRoofTexture.wrapS = THREE.RepeatWrapping

// Arbustos (Bush)
const colorBushTexture = loaderTexture.load('/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg')
const armBushTexture = loaderTexture.load('/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg')
const normalBushTexture = loaderTexture.load('/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg')

colorBushTexture.colorSpace = THREE.SRGBColorSpace

colorBushTexture.repeat.set(2, 1)
armBushTexture.repeat.set(2, 1)
normalBushTexture.repeat.set(2, 1)

colorBushTexture.wrapS = THREE.RepeatWrapping
armBushTexture.wrapS = THREE.RepeatWrapping
normalBushTexture.wrapS = THREE.RepeatWrapping

// Tumulos (Grave)
const colorGraveTexture = loaderTexture.load('/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg')
const armGraveTexture = loaderTexture.load('/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg')
const normalGraveTexture = loaderTexture.load('/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg')

colorGraveTexture.colorSpace = THREE.SRGBColorSpace

colorGraveTexture.repeat.set(0.3, 0.4)
armGraveTexture.repeat.set(0.3, 0.4)
normalGraveTexture.repeat.set(0.3, 0.4)

colorGraveTexture.wrapS = THREE.RepeatWrapping
armGraveTexture.wrapS = THREE.RepeatWrapping
normalGraveTexture.wrapS = THREE.RepeatWrapping

colorGraveTexture.wrapT = THREE.RepeatWrapping
armGraveTexture.wrapT = THREE.RepeatWrapping
normalGraveTexture.wrapT = THREE.RepeatWrapping

// Porta (Door)
const alphaDoorTexture = loaderTexture.load('/textures/door/alpha.jpg')
const colorDoorTexture = loaderTexture.load('/textures/door/color.jpg')
const ambientOcclusionDoorTexture = loaderTexture.load('/textures/door/ambientOcclusion.jpg')
const heightDoorTexture = loaderTexture.load('/textures/door/height.jpg')
const metalDoorTexture = loaderTexture.load('/textures/door/metalness.jpg')
const roughnessDoorTexture = loaderTexture.load('/textures/door/roughness.jpg')
const normalDoorTexture = loaderTexture.load('/textures/door/normal.jpg')

colorDoorTexture.colorSpace = THREE.SRGBColorSpace

////////// End Textures //////////

// Light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Direction Light
const directionLight = new THREE.DirectionalLight('#86cdff', 1)
directionLight.position.set(3, 2, -8)
scene.add(directionLight)

// Chão da cena
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        alphaMap: alphaFloorTexture,
        transparent: true,
        map: colorFloorTexture,
        aoMap: armFloorTexture,
        roughnessMap: armFloorTexture,
        metalnessMap: armFloorTexture,
        normalMap: normalFloorTexture,
        displacementMap: displacementFloorTexture,
        displacementScale: 0.35,
        displacementBias: -0.2
    })
)
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.01).name('floorDisplacementScale')
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.01).name('floorDisplacementBias')

// House container (Criando um grupo da casa)
const house = new THREE.Group()
scene.add(house)

// Luz da porta (Door light)
const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)

// Fantasmas (Ghosts)
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
scene.add(ghost1, ghost2, ghost3)

gui.add(doorLight.position, 'x').min(0).max(5).step(0.01)
gui.add(doorLight.position, 'y').min(0).max(5).step(0.01)
gui.add(doorLight.position, 'z').min(-8).max(5).step(0.01)

// Paredes da casa
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4, 100, 100),
    new THREE.MeshStandardMaterial({
        map: colorWallMossyBrick,
        aoMap: armWallMossyBrick,
        roughnessMap: armWallMossyBrick,
        metalnessMap: armWallMossyBrick,
        normalMap: normalWallMossyBrick
    })
)
walls.position.y += 1.25
house.add(walls)

// Telhado da casa
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        map: colorRoofTexture,
        aoMap: armRoofTexture,
        roughnessMap: armRoofTexture,
        metalnessMap: armRoofTexture,
        normalMap: normalRoofTexture
    })
)
roof.position.y = 2.5 + 0.75
roof.rotation.y = Math.PI / 4 // Ou: Math.PI * 0.25
house.add(roof)

// Porta da casa
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        alphaMap: alphaDoorTexture,
        transparent: true,
        map: colorDoorTexture,
        aoMap: ambientOcclusionDoorTexture,
        displacementMap: heightDoorTexture,
        roughnessMap: roughnessDoorTexture,
        metalnessMap: metalDoorTexture,
        normalMap: normalDoorTexture,
        displacementScale: 0.15,
        displacementBias: -0.04
    })
)
door.position.z = 2 + 0.01
door.position.y = 1
house.add(door)

// Arbustos
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: colorBushTexture,
    aoMap: armBushTexture,
    roughnessMap: armBushTexture,
    metalnessMap: armBushTexture,
    normalMap: normalBushTexture
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
// bush1.scale.set(0.5, 0.5, 0.5)
/**
 * setScalar é o mesmo que set, só que
 * adicione o valor para os 3 eixos (x, y e z).
 */
bush1.scale.setScalar(0.5)
bush1.position.set(0.8, 0.2, 2.2)
bush1.rotation.x = -0.75

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)
bush2.rotation.x = -0.75

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.rotation.x = -0.75

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)
bush4.rotation.x = -0.75

house.add(bush1, bush2, bush3, bush4)

// Sepulturas
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: colorGraveTexture,
    aoMap: armGraveTexture,
    roughnessMap: armGraveTexture,
    metalnessMap: armGraveTexture,
    normalMap: normalGraveTexture
})

const graves = new THREE.Group()
scene.add(graves)

for (let index = 0; index < 30; index++) {
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)

    // Position
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 4
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    const y = Math.random() * 0.4

    grave.position.set(x, y, z)

    // Rotation
    grave.rotation.x = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4

    graves.add(grave)
}

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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

/**
 * Sombras (Shadows)
 */
// Renderer
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Cast and receive
directionLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true

for(const grave of graves.children) {
    grave.castShadow = true
    grave.receiveShadow = true
}

// Mapping

// Timer
const timer = new Timer()

//Animations
const tick = () => {
    // timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // sphereGeometry.rotation.y = 0.15 * elapsedTime

    // Animação dos fantasmas (Animations ghosts)
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)

    const ghost2Angle = -elapsedTime * 0.38
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45)

    const ghost3Angle = elapsedTime * 0.23
    ghost3.position.x = Math.cos(ghost3Angle) * 6
    ghost3.position.z = Math.sin(ghost3Angle) * 6
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45)

    // Atualização do controle
    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
