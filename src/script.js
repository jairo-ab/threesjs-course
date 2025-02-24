import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
// import CANNON from 'cannon'
import * as CANNON from 'cannon-es'
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
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png',
])

/**
 * Physics
 */
// World
const world = new CANNON.World()
// melhor para perfomance
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true

world.gravity.set(0, -9.82, 0)

// Material
// V1
// const concreteMaterial = new CANNON.Material('concrete')
// const plasticMaterial = new CANNON.Material('plastic')

// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//     concreteMaterial, plasticMaterial, {
//         friction: 0.1,
//         restitution: 0.7
//     }
// )

// world.addContactMaterial(concretePlasticContactMaterial)

// V2
const defaultMaterial = new CANNON.Material('default')

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial, defaultMaterial, {
        friction: 0.1,
        restitution: 0.7
    }
)

world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// Flor (Chão)
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
world.addBody(floorBody)

// Scene
const scene = new THREE.Scene()

/**
 * Floor (chão)
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
// floor.rotation.x = -Math.PI * 0.5
floor.quaternion.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI * 0.5)
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionLight.castShadow = true
directionLight.shadow.mapSize.set(1024, 1024)
directionLight.shadow.camera.far = 15
directionLight.shadow.camera.left = -7
directionLight.shadow.camera.top = 7
directionLight.shadow.camera.right = 7
directionLight.shadow.camera.bottom = -7
directionLight.position.set(5, 5, 5)
scene.add(directionLight)

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Atualização do tamanho da tela caso redimensionar
    sizes.width = window.innerWidth
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
camera.position.set(-3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// Para que o amortecimento aconteça, é necessário atualizar
// depois da atualização do próximo quadro
controls.enableDamping = true

//Render
const renderer = new THREE.WebGLRenderer({
  canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = collision => {
    const impact = collision.contact.getImpactVelocityAlongNormal()

    if (impact > 1.5) {
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play()
    }
}

/**
 * Utils
 */
const objectsToUpdate = []

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.1,
    roughness: 0.4,
    envMap: environmentMapTexture
})

const createSphere = (radius, position) => {
    // Three.js mesh
    const mesh = new THREE.Mesh(
        sphereGeometry,
        sphereMaterial
    )
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon body
    const shape = new CANNON.Sphere(radius)

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: defaultMaterial
    })
    body.position.copy(position)

    body.addEventListener('collide', playHitSound)

    world.addBody(body)

    objectsToUpdate.push({ mesh, body })
}

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.1,
    roughness: 0.3,
    envMap: environmentMapTexture
})

const createBox = (width, height, depth, position) => {
    // Three.js box
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
    mesh.castShadow = true
    mesh.scale.set(width, height, depth)
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon box
    const halfExtents = new CANNON.Vec3(width * 0.5, height * 0.5, height * 0.5)
    const shape = new CANNON.Box(halfExtents)

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: defaultMaterial
    })

    body.position.copy(position)

    body.addEventListener('collide', playHitSound)

    world.addBody(body)

    objectsToUpdate.push({ mesh, body })
}

createSphere(0.5, { x: 0, y: 3, z: 0 })
// createBox(1, 1, 1, { x: 0, y: 3, z: 0 })

const debugObject = {}
debugObject.createSphere = () => {
    createSphere(Math.random() * 0.5, {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3
    })
}
debugObject.createBox = () => {
    createBox(
        Math.random(),
        Math.random(),
        Math.random(), {
        x: (Math.random() - 0.5) * 10,
        y: 3,
        z: (Math.random() - 0.5) * 3
    })
}

gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')

debugObject.resetScene = () => {
    objectsToUpdate.forEach(object => {
        // Remove body
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.body)

        // Remove mesh
        scene.remove(object.mesh)
    })

    objectsToUpdate.splice(0, objectsToUpdate.length)
}

gui.add(debugObject, 'resetScene')

// Clock
const clock = new THREE.Clock()
let oldElapsedTime = 0

//Animations
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Update physic world
    // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)

    // objectsToUpdate.forEach(item => {
    //     item.body.applyForce(new CANNON.Vec3(-0.5, 0, 0), item.body.position)
    // })

    world.step(1 / 60, deltaTime, 3)

    // sphere.position.copy(sphereBody.position)
    objectsToUpdate.forEach(item => {
        item.mesh.position.copy(item.body.position)
        item.mesh.quaternion.copy(item.body.quaternion)
    })

    // Atualização do controle
    controls.update()
 
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
