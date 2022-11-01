import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

import { SkeletonUtils } from './libs/SkeletonUtils'

import BasicCharacterController from './movements/BasicCharacterController'

class _Player {
  init() {
    const { scene, camera } = XR8.Threejs.xrScene()
    this.scene = scene
    this.camera = camera

    this.players = []
    this.isRunning = false

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

    this.loadAssets()
  }

  resetPosition(actor) {
    const player = this.players.find(
      (p) => p.name === this.getName(actor.actorNr)
    )
    player?.resetPosition()
  }

  async loadAssets() {
    const loader = new FBXLoader()
    loader.setPath('../assets/models/girl/')

    // Character
    this.model = await loader.loadAsync('eve_j_gonzales.fbx')

    // Animations
    const [walk, idle, dance, run] = await Promise.all([
      loader.loadAsync('walk.fbx'),
      loader.loadAsync('idle.fbx'),
      loader.loadAsync('dance.fbx'),
      loader.loadAsync('run.fbx'),
    ])
    this.animations = [
      { name: 'walk', data: walk },
      { name: 'idle', data: idle },
      { name: 'dance', data: dance },
      { name: 'run', data: run },
    ]

    this.isRunning = true
  }

  getName(actorNr) {
    const name = `player-${actorNr}`
    return name
  }

  create(actor, client) {
    const animations = this.animations
    const name = this.getName(actor.actorNr)
    const model = SkeletonUtils.clone(this.model)

    model.userData.actorNr = actor.actorNr
    model.userData.isClient = client.myActor().actorNr === actor.actorNr

    const player = new BasicCharacterController({
      name,
      model,
      animations,
      client,
    })

    this.players.push(player)
  }

  remove(actor) {
    const actorNr = actor.actorNr
    const name = this.getName(actorNr)

    this.players = this.players.filter((p) => {
      if (p.model.name === name) {
        p.dispose()
        this.scene.remove(p.model)

        return false
      }
      return true
    })
  }

  render() {
    if (!this.isRunning) return

    this.stats.begin()

    const elapsedTime = this.time.getElapsedTime()
    const deltaTime = elapsedTime - this.previousTime
    this.previousTime = elapsedTime

    this.players?.forEach((p) => p?.update(deltaTime))

    this.stats.end()
  }
}

const Player = new _Player()
export default Player
