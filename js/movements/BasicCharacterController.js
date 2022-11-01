import * as THREE from 'three'

import CharacterFSM from '../fsm/CharacterFSM'

import BasicCharacterControllerInput from './BasicCharacterControllerInput'
import BasicCharacterControllerProxy from './BasicCharacterControllerProxy'

class BasicCharacterController {
  constructor(params) {
    const { scene } = XR8.Threejs.xrScene()
    this.scene = scene

    this.name = params.name
    this.model = params.model
    this.modelAnimations = params.animations
    this.isClient = params.model.userData.isClient
    this.client = params.client

    this.animations = {}

    this.decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0)
    this.acceleration = new THREE.Vector3(1.0, 0.25, 50.0)
    this.velocity = new THREE.Vector3(0, 0, 0)

    if (this.isClient) {
      // Create Joystick
      this.input = new BasicCharacterControllerInput()

      // Store movement
      this._position = new THREE.Vector3()
      this._rotation = new THREE.Euler()
      this._scale = new THREE.Vector3()
    }

    this.stateMachine = new CharacterFSM(
      new BasicCharacterControllerProxy(this.animations)
    )

    this.init()
  }

  init() {
    const character = this.model
    character.name = this.name
    character.scale.setScalar(0.1)
    character.traverse((child) => {
      child.castShadow = true
    })

    this.scene.add(character)
    this.mixer = new THREE.AnimationMixer(character)
    this.modelAnimations.forEach(({ name, data }) => {
      const clip = data.animations[0]
      const action = this.mixer.clipAction(clip)
      this.animations[name] = {
        clip,
        action,
      }
    })

    this.stateMachine.setState('idle')

    this.intialPosition = new THREE.Vector3()
    this.intialRotation = new THREE.Euler()

    this.target = character

    this.intialPosition.copy(this.target.position)
    this.intialRotation.copy(this.target.rotation)
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

    if (this.isClient) this.input?.dispose()
  }

  resetPosition() {
    this.target?.position.copy(this.intialPosition)
    this.target?.rotation.copy(this.intialRotation)
  }

  /**
   * Set current movement values on the current client's actor
   * to be available to all the remote client(s) connected to
   * the same room
   */
  updateRemote() {
    this.client.myActor().setCustomProperty('position', this._position)
    this.client.myActor().setCustomProperty('rotation', this._rotation)
    this.client.myActor().setCustomProperty('scale', this._scale)
    this.client.myActor().setCustomProperty('input', this.input)
  }

  /**
   * Set the input(s) received from the remote clients
   * to animate the other(s) player(s)
   */
  animateFromRemote(input) {
    if (!this.isClient) this.input = input
  }

  /**
   * Apply movement to the character
   *
   * @param time - seconds
   */
  update(time) {
    if (!this.target) return

    this.mixer?.update(time)

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

    if (this.input?.keys.shift) {
      acc.multiplyScalar(2.0)
    }
    if (this.stateMachine.currentState?.name == 'dance') {
      acc.multiplyScalar(0.0)
    }
    if (this.input?.keys.forward) {
      velocity.z += acc.z * time
    }
    if (this.input?.keys.backward) {
      velocity.z -= acc.z * time
    }
    if (this.input?.keys.left) {
      A.set(0, 1, 0)
      Q.setFromAxisAngle(A, 4.0 * Math.PI * time * this.acceleration.y)
      R.multiply(Q)
    }
    if (this.input?.keys.right) {
      A.set(0, 1, 0)
      Q.setFromAxisAngle(A, 4.0 * -Math.PI * time * this.acceleration.y)
      R.multiply(Q)
    }
    controlObject.quaternion.copy(R)

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

    if (this.isClient) {
      this._position.copy(controlObject.position)
      this._rotation.copy(controlObject.rotation)
      this._scale.copy(controlObject.scale)
      this.updateRemote()
    }
  }
}

export default BasicCharacterController
