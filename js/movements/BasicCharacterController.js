import * as THREE from 'three'

import CharacterFSM from '../fsm/CharacterFSM'

import BasicCharacterControllerInput from './BasicCharacterControllerInput'
import BasicCharacterControllerProxy from './BasicCharacterControllerProxy'

class BasicCharacterController {
  constructor(params) {
    this.params = params // <=> { camera, scene, path }
    this.name = params.name
    this.model = params.model
    this.modelAnimations = params.animations

    this.animations = {}

    this.decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0)
    this.acceleration = new THREE.Vector3(1.0, 0.25, 50.0)
    this.velocity = new THREE.Vector3(0, 0, 0)
    this._position = new THREE.Vector3()

    this.input = new BasicCharacterControllerInput()
    this.stateMachine = new CharacterFSM(
      new BasicCharacterControllerProxy(this.animations)
    )

    this.isRunning = false

    this.init()
  }

  init() {
    const fbx = this.model

    fbx.name = this.name
    fbx.scale.setScalar(0.1)
    fbx.traverse((child) => {
      child.castShadow = true
    })

    this.target = fbx

    this.params.scene.add(fbx)

    this.mixer = new THREE.AnimationMixer(fbx)

    this.modelAnimations.forEach(({ name, data }) => {
      const clip = data.animations[0]
      const action = this.mixer.clipAction(clip)
      this.animations[name] = {
        clip,
        action,
      }
    })

    this.stateMachine.setState('idle')

    this.isRunning = true
  }

  dispose() {
    Object.keys(this.animations).forEach((key) => {
      const action = this.animations[key].action
      action.stop()
    })

    this.mixer.uncacheRoot(this.target)

    this.model?.traverse((o) => {
      if (o.material) o.material.dispose()
      if (o.geometry) o.geometry.dispose()
      if (o.texture) o.texture.dispose()
    })

    this.input.dispose()
  }

  /**
   * Apply movement to the character
   *
   * @param time - seconds
   */
  update(time) {
    if (!this.target || !this.isRunning) return

    this.stateMachine.update(time, this.input)

    const velocity = this.velocity

    const frameDecceleration = new THREE.Vector3(
      velocity.x * this.decceleration.x,
      velocity.y * this.decceleration.y,
      velocity.z * this.decceleration.z
    )

    frameDecceleration.multiplyScalar(time)
    frameDecceleration.z =
      Math.sign(frameDecceleration.z) *
      Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z))

    velocity.add(frameDecceleration)

    const controlObject = this.target
    const Q = new THREE.Quaternion()
    const A = new THREE.Vector3()
    const R = controlObject.quaternion.clone()

    const acc = this.acceleration.clone()

    if (this.input.keys.shift) {
      acc.multiplyScalar(2.0)
    }
    if (this.stateMachine.currentState?.name == 'dance') {
      acc.multiplyScalar(0.0)
    }
    if (this.input.keys.forward) {
      velocity.z += acc.z * time
    }
    if (this.input.keys.backward) {
      velocity.z -= acc.z * time
    }
    if (this.input.keys.left) {
      A.set(0, 1, 0)
      Q.setFromAxisAngle(A, 4.0 * Math.PI * time * this.acceleration.y)
      R.multiply(Q)
    }
    if (this.input.keys.right) {
      A.set(0, 1, 0)
      Q.setFromAxisAngle(A, 4.0 * -Math.PI * time * this.acceleration.y)
      R.multiply(Q)
    }

    controlObject.quaternion.copy(R)

    // const oldPosition = new THREE.Vector3()
    // oldPosition.copy(controlObject.position)

    const forward = new THREE.Vector3(0, 0, 1)
    forward.applyQuaternion(controlObject.quaternion)
    forward.normalize()

    const sideways = new THREE.Vector3(1, 0, 0)
    sideways.applyQuaternion(controlObject.quaternion)
    sideways.normalize()

    sideways.multiplyScalar(velocity.x * time)
    forward.multiplyScalar(velocity.z * time)

    controlObject.position.add(forward)
    controlObject.position.add(sideways)

    this._position.copy(controlObject.position)

    this.mixer?.update(time)
  }

  /**
   * Getter
   */
  get rotation() {
    if (!this.target) return new THREE.Quaternion()
    return this.target.quaternion
  }

  get position() {
    return this._position
  }
}

export default BasicCharacterController
