class _Menu {
  onChangeMenuVisibility() {
    this.action[this.isVisible]()
  }

  onCreateGame() {
    console.log('✨', '[ Create room ]')

    try {
      if (this.client.isInLobby()) {
        const roomName = undefined // the server will assign a GUID as name
        this.client.createRoom(roomName)
      }
    } catch (error) {
      console.log('🔴 onCreateGame', { error })
    }
  }

  onJoinGame() {
    console.log('✨', '[ Join room ]')

    try {
      const index = this.gameList.selectedIndex
      const roomName = this.gameList.options[index].text
      this.client.joinRoom(roomName)
    } catch (error) {
      console.log('🔴 onJoinGame', { error })
    }
  }

  onLeaveGame() {
    try {
      this.client.leaveRoom()
    } catch (error) {
      console.log('🔴 onLeaveGame', { error })
    }
  }

  //////////////////////////////////////////////////////////////////////

  roomInfo({ state, name, clear }) {
    this.clientState.innerText = clear ? 'state: none' : state
    this.clientRoom.innerText = clear ? 'room: none' : name
  }

  roomList({ rooms }) {
    this.gameList.disabled = rooms.length <= 0

    rooms.forEach((r, index) => {
      const item = document.createElement('option')
      item.attributes['value'] = r.name
      item.textContent = r.name

      this.gameList.appendChild(item)
      this.gameList.selectedIndex = index
    })
  }

  roomButtons({ canJoin, isJoinedToRoom }) {
    this.joinGame.disabled = !canJoin
    this.leaveGame.disabled = !isJoinedToRoom
  }

  //////////////////////////////////////////////////////////////////////

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

  //////////////////////////////////////////////////////////////////////

  bind() {
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)

    this.onChangeMenuVisibility = this.onChangeMenuVisibility.bind(this)
    this.onCreateGame = this.onCreateGame.bind(this)
    this.onJoinGame = this.onJoinGame.bind(this)
    this.onLeaveGame = this.onLeaveGame.bind(this)
  }

  init(options) {
    this.bind()

    this.client = options.client

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

    this.createGame = document.getElementById('create-btn')
    this.createGame.addEventListener('click', this.onCreateGame)

    this.joinGame = document.getElementById('join-btn')
    this.joinGame.addEventListener('click', this.onJoinGame)

    this.leaveGame = document.getElementById('leave-btn')
    this.leaveGame.addEventListener('click', this.onLeaveGame)

    this.clientState = document.getElementById('client-state')
    this.clientRoom = document.getElementById('client-room')

    this.gameList = document.getElementById('game-list')
  }
}

const Menu = new _Menu()
export default Menu
