import * as THREE from 'three'

import Stats from 'three/examples/jsm/libs/stats.module'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

import { SkeletonUtils } from './libs/SkeletonUtils'

import BasicCharacterController from './movements/BasicCharacterController'

import './multiplayer'

class Demo {
  constructor() {
    const { scene, camera } = XR8.Threejs.xrScene()
    this.scene = scene

    this.camera = camera

    this.init()
  }

  init() {
    // const client = new PhotonLoadBalancing()
    // client.start()

    this.stats = Stats()
    document.body.appendChild(this.stats.dom)

    this.time = new THREE.Clock()
    this.previousTime = 0

    // Light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3.7)
    directionalLight.position.set(25, 80, 30)
    directionalLight.target.position.set(0, 0, 0)

    this.scene.add(directionalLight)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    this.scene.add(ambientLight)

    // this.box = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshNormalMaterial()
    // )
    // this.scene.add(this.box)

    this.loadAnimatedModel()
  }

  async loadAnimatedModel() {
    const loader = new FBXLoader()
    loader.setPath('../assets/models/girl/')

    // Prep character
    const model = await loader.loadAsync('eve_j_gonzales.fbx')
    // Prep animations
    const [walk, idle, dance, run] = await Promise.all([
      loader.loadAsync('walk.fbx'),
      loader.loadAsync('idle.fbx'),
      loader.loadAsync('dance.fbx'),
      loader.loadAsync('run.fbx'),
    ])
    const animations = [
      { name: 'walk', data: walk },
      { name: 'idle', data: idle },
      { name: 'dance', data: dance },
      { name: 'run', data: run },
    ]

    this.player1 = new BasicCharacterController({
      scene: this.scene,
      model: SkeletonUtils.clone(model),
      name: 'player1',
      animations,
    })
    // this.player2 = new BasicCharacterController({
    //   player2: true,
    //   scene: this.scene,
    //   model: SkeletonUtils.clone(model),
    //   name: 'player2',
    //   animations,
    // })
  }

  render() {
    this.stats.begin()

    const elapsedTime = this.time.getElapsedTime()
    const deltaTime = elapsedTime - this.previousTime
    this.previousTime = elapsedTime

    this.player1?.update(deltaTime)
    // this.player2?.update(deltaTime)

    this.stats.end()
  }
}

// const env = process.env.NODE_ENV
// window.addEventListener('DOMContentLoaded', () => {
//   const demo = new Demo()
//   window.demo = demo
// })
export default Demo
