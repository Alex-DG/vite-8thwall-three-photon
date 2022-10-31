class AppUI {
  constructor() {
    this.bind()
    this.init()
  }

  onChangeMenuVisibility() {
    this.action[this.isVisible]()
  }

  show() {
    console.log('🙉', '[ Show Menu ]')
    this.gameMenu.style.opacity = 1
    this.gameMenu.style.display = 'block'
    this.isVisible = true
    this.visibilityBtn.innerText = this.label[this.isVisible]
  }

  hide() {
    console.log('🙈', '[ Hide Menu ]')
    this.gameMenu.style.opacity = 0
    this.gameMenu.style.display = 'none'
    this.isVisible = false
    this.visibilityBtn.innerText = this.label[this.isVisible]
  }

  bind() {
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)

    this.onChangeMenuVisibility = this.onChangeMenuVisibility.bind(this)
  }

  init() {
    this.label = {
      true: 'Hide',
      false: 'Show',
    }

    this.action = {
      true: this.hide,
      false: this.show,
    }

    this.isVisible = true

    this.gameMenu = document.getElementById('menu-container')

    this.visibilityBtn = document.getElementById('visibility-btn')
    this.visibilityBtn.addEventListener('click', this.onChangeMenuVisibility)
  }
}

export default AppUI
