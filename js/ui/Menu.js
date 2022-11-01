import { createRoom } from '../multiplayer/data'
import Player from '../Player'

class _Menu {
  onChangeMenuVisibility() {
    this.action[this.isVisible]()
  }

  onChangeGameName(event) {
    const value = event.target.value

    if (!this.client.isJoinedToRoom()) {
      this.joinGame.disabled = !!!value
    } else {
      this.joinGame.disabled = true
    }
  }

  onSelectGameName() {
    this.gameListInput.value = ''
  }

  onCreateGame() {
    console.log('✨', '[ Create room ]')

    try {
      if (this.client.isInLobby()) {
        const roomName = `room-${this.client.availableRooms().length}` // the server will assign a GUID as name
        createRoom(roomName)
        this.client.createRoom(roomName)
        this.gameListInput.value = ''
      }
    } catch (error) {
      console.log('🔴 onCreateGame', { error })
    }
  }

  onObserveGame() {
    console.log('✨', '[ Observe room ]')

    try {
      const index = this.gameList.selectedIndex
      const roomName =
        this.gameListInput.value || this.gameList.options[index].text

      const gameIndex = [...this.gameList.children].findIndex(
        (c) => c.label === roomName
      )
      this.gameList.selectedIndex = gameIndex

      createRoom(roomName)

      this.client.myActor().setCustomProperty('observer', true)
      this.client.joinRoom(roomName)
      this.gameListInput.value = ''
    } catch (error) {
      console.log('🔴 onObserveGame', { error })
    }
  }

  onJoinGame() {
    console.log('✨', '[ Join room ]')

    try {
      const index = this.gameList.selectedIndex
      const roomName =
        this.gameListInput.value || this.gameList.options[index].text

      const gameIndex = [...this.gameList.children].findIndex(
        (c) => c.label === roomName
      )
      this.gameList.selectedIndex = gameIndex

      createRoom(roomName)

      this.client.joinRoom(roomName)
      this.gameListInput.value = ''
    } catch (error) {
      console.log('🔴 onJoinGame', { error })
    }
  }

  onLeaveGame() {
    try {
      this.gameListInput.value = ''
      this.client.leaveRoom()
    } catch (error) {
      console.log('🔴 onLeaveGame', { error })
    }
  }

  onResetPos() {
    Player.resetPosition(this.client.myActor())
  }

  //////////////////////////////////////////////////////////////////////

  roomInfo({ state, name, isObserver, clear }) {
    this.clientState.innerText = clear
      ? 'Client state: -'
      : `Client state: ${state}`
    this.clientRoom.innerText = clear ? 'Room name: -' : `Room name: ${name}`

    this.clientHeader.innerText = clear ? '🔴' : isObserver ? '🟢🤓' : '🟢🤖'
    this.clientBtns.style.display = clear ? 'none' : 'flex'
  }

  // Add a single room in the drom down list
  room({ name }) {
    const isFound = [...this.gameList.children].some(
      (opt) => opt.label === name
    )
    if (isFound) return

    const item = document.createElement('option')
    item.attributes['value'] = name
    item.textContent = name
    this.gameList.appendChild(item)
    this.gameList.selectedIndex = this.gameList.children.length - 1
    this.gameList.disabled = false
  }

  roomList({ rooms }) {
    this.gameList.disabled = rooms.length <= 0

    rooms.forEach((r, index) => {
      const isFound = [...this.gameList.children].some(
        (opt) => opt.label === r.name
      )
      if (!isFound) {
        const item = document.createElement('option')
        item.attributes['value'] = r.name
        item.textContent = r.name

        this.gameList.appendChild(item)
        this.gameList.selectedIndex = index
      }
    })
  }

  roomButtons({ canJoin, isJoinedToRoom }) {
    this.joinGame.disabled = !canJoin
    this.observeGame.disabled = !canJoin
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
    this.room = this.room.bind(this)

    this.onChangeMenuVisibility = this.onChangeMenuVisibility.bind(this)
    this.onCreateGame = this.onCreateGame.bind(this)
    this.onJoinGame = this.onJoinGame.bind(this)
    this.onLeaveGame = this.onLeaveGame.bind(this)
    this.onObserveGame = this.onObserveGame.bind(this)
    this.onResetPos = this.onResetPos.bind(this)

    this.onChangeGameName = this.onChangeGameName.bind(this)
    this.onSelectGameName = this.onSelectGameName.bind(this)
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

    this.observeGame = document.getElementById('observe-btn')
    this.observeGame.addEventListener('click', this.onObserveGame)

    this.clientBtns = document.getElementById('client-btns')
    this.resetPosBtn = document.getElementById('reset-pos-btn')
    this.resetPosBtn.addEventListener('click', this.onResetPos)

    this.clientState = document.getElementById('client-state')
    this.clientRoom = document.getElementById('client-room')
    this.clientHeader = document.getElementById('client-header')

    this.gameList = document.getElementById('game-list')
    this.gameList.addEventListener('change', this.onSelectGameName)
    this.gameListInput = document.getElementById('game-list-input')
    this.gameListInput.addEventListener('change', this.onChangeGameName)
  }
}

const Menu = new _Menu()
export default Menu
