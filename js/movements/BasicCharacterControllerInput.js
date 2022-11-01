import Joystick from '../joystick'

/**
 * Keyboard listeners on press keys up and down
 */
class BasicCharacterControllerInput {
  constructor() {
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
    }

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)

    document.addEventListener('keydown', this.onKeyDown, false)
    document.addEventListener('keyup', this.onKeyUp, false)

    this.skillBtn = document.createElement('button')
    this.skillBtn.classList.add('skill-btn', 'no-select')
    this.skillBtn.innerText = '💃'
    document.body.appendChild(this.skillBtn)
    this.skillBtn.addEventListener('touchstart', this.onTouchStart, false)
    this.skillBtn.addEventListener('touchend', this.onTouchEnd, false)

    this.josytick = new Joystick({
      keys: this.keys,
    })
  }

  dispose() {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
    this.skillBtn?.removeEventListener('touchend', this.onTouchEnd)
    this.skillBtn?.removeEventListener('touchstart', this.onTouchStart)

    this.josytick?.remove()
    this.skillBtn?.remove()
  }

  onTouchEnd() {
    this.keys.space = false
  }

  onTouchStart() {
    this.keys.space = true
  }

  onKeyDown({ keyCode }) {
    switch (keyCode) {
      case 87: // w
        this.keys.forward = true
        break
      case 65: // a
        this.keys.left = true
        break
      case 83: // s
        this.keys.backward = true
        break
      case 68: // d
        this.keys.right = true
        break
      case 32: // SPACE
        this.keys.space = true
        break
      case 16: // SHIFT
        this.keys.shift = true
        break
    }
  }

  onKeyUp({ keyCode }) {
    switch (keyCode) {
      case 87: // w
        this.keys.forward = false
        break
      case 65: // a
        this.keys.left = false
        break
      case 83: // s
        this.keys.backward = false
        break
      case 68: // d
        this.keys.right = false
        break
      case 32: // SPACE
        this.keys.space = false
        break
      case 16: // SHIFT
        this.keys.shift = false
        break
    }
  }
}

export default BasicCharacterControllerInput
