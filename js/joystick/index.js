import nipplejs from 'nipplejs'

class Joystick {
  constructor(options) {
    this.keys = options.keys
    this.color = options.color || 'red'

    this.create()
  }

  create() {
    const options = {
      zone: document.getElementById('joystick'),

      mode: 'static',
      position: { left: '20%', bottom: '15%' },

      color: this.color,
    }

    this.joyManager = nipplejs.create(options)

    this.joyManager['0'].on('move', (evt, data) => {
      switch (data.direction?.angle) {
        case 'up':
          this.keys.forward = true

          this.keys.backward = false
          this.keys.right = false
          this.keys.left = false
          break
        case 'left':
          this.keys.left = true

          this.keys.right = false
          this.keys.forward = false
          this.keys.backward = false
          break
        case 'down':
          this.keys.backward = true

          this.keys.left = false
          this.keys.forward = false
          this.keys.right = false
          break
        case 'right':
          this.keys.right = true

          this.keys.left = false
          this.keys.forward = false
          this.keys.backward = false
          break
        default:
      }
    })

    this.joyManager['0'].on('end', (evt) => {
      this.keys.forward = false
      this.keys.left = false
      this.keys.backward = false
      this.keys.right = false
      this.keys.space = false
      this.keys.shift = false
    })
  }
}

export default Joystick
