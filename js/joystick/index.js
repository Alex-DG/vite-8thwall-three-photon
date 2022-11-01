import nipplejs from 'nipplejs'
import Player from '../Player'

class Joystick {
  constructor(options) {
    this.keys = options.keys
    this.color = options.color || 'red'
    this.id = `joystick-${Player.players.length}`

    const zone = document.createElement('div')
    zone.setAttribute('id', this.id)
    zone.setAttribute('class', 'no-select disable-doubletap-to-zoom')
    document.body.appendChild(zone)

    this.options = {
      zone,

      mode: 'static',
      position: { left: '20%', bottom: '15%' },
      color: this.color,
    }

    this.create()
  }

  remove() {
    document.getElementById(this.id)?.remove()
  }

  create() {
    this.joyManager = nipplejs.create(this.options)

    this.joyManager['0'].on('move', (evt, data) => {
      console.log({ data })
      const force = data.force
      this.keys.shift = force > 1.8

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
