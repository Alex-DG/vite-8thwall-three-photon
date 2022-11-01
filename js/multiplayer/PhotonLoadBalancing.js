import { AppInfo, __extends, colors } from './config'

import { store } from './data'

import Photon, { Exitgames } from '../libs/Photon-Javascript_SDK'

import Menu from '../ui/Menu'
import Player from '../Player'

const PhotonLoadBalancing = (function (_super) {
  __extends(PhotonLoadBalancing, _super)
  function PhotonLoadBalancing() {
    _super.call(
      this,
      AppInfo.Wss
        ? Photon.ConnectionProtocol.Wss
        : Photon.ConnectionProtocol.Ws,
      AppInfo.AppId,
      AppInfo.AppVersion
    ) || this

    this.logger = new Exitgames.Common.Logger('App:')
    this.USERCOLORS = colors

    this.output(
      this.logger.format(
        'Init',
        this.getNameServerAddress(),
        AppInfo.AppId,
        AppInfo.AppVersion
      )
    )

    this.logger.info(
      'Init',
      this.getNameServerAddress(),
      AppInfo.AppId,
      AppInfo.AppVersion
    )

    this.setLogLevel(Exitgames.Common.Logger.Level.INFO)

    this.myActor().setCustomProperty('color', this.USERCOLORS[0])

    return this
  }

  PhotonLoadBalancing.prototype.start = function () {
    this.setupUI()
    this.connectToRegionMaster(AppInfo.Region)
    console.log('✅', 'Photon ready')
  }

  PhotonLoadBalancing.prototype.onError = function (errorCode, errorMsg) {
    console.log('🔴', 'Photon: Error')
  }

  PhotonLoadBalancing.prototype.onEvent = function (code, content, actorNr) {
    console.log('onEvent', { code, content, actorNr })
  }

  PhotonLoadBalancing.prototype.onStateChange = function (state) {
    this.updateRoomButtons()
    this.updateRoomInfo()
  }

  PhotonLoadBalancing.prototype.objToStr = function (x) {}

  PhotonLoadBalancing.prototype.updateRoomInfo = function (data) {
    Menu.roomInfo({ clear: true })
  }

  PhotonLoadBalancing.prototype.onActorPropertiesChange = function (actor) {
    this.updateModelInfo(actor)
  }

  PhotonLoadBalancing.prototype.onMyRoomPropertiesChange = function () {}

  PhotonLoadBalancing.prototype.onRoomListUpdate = function (
    rooms,
    roomsUpdated,
    roomsAdded,
    roomsRemoved
  ) {
    Menu.roomList({ rooms })
    this.updateRoomButtons()
  }

  PhotonLoadBalancing.prototype.onRoomList = function (rooms) {
    Menu.roomList({ rooms })
    this.updateRoomButtons()
  }

  PhotonLoadBalancing.prototype.onJoinRoom = function (data) {
    const state = this.isJoinedToRoom() ? 'Joined' : 'none'
    const name = this.myRoom().name
    Menu.roomInfo({ state, name })
    Menu.room({ name })
  }

  PhotonLoadBalancing.prototype.onActorJoin = function (actor) {
    if (actor.actorNr !== this.myActor().actorNr) {
      // Check if the room menu needs an update
      Menu.room({ name: actor.getRoom().name })
    }

    Object.keys(this.myRoomActors()).forEach((key) => {
      const roomActor = this.myRoomActors()[key]

      const room = roomActor.getRoom()

      const isFound = store.actors[room.name].some(
        (storeActor) => storeActor.actorNr === roomActor.actorNr
      )

      if (!isFound) {
        const client = this
        Player.create(roomActor, client)
        store.actors[room.name].push(roomActor)
        console.log('🤖', 'Player Added!', roomActor.actorNr)
      }
    })

    this.updateRoomButtons()
  }

  PhotonLoadBalancing.prototype.onActorLeave = function (actor) {
    Player.remove(actor)

    const roomName = actor.getRoom().name
    store.actors[roomName] = store.actors[roomName].filter(
      (a) => a.actorNr !== actor.actorNr
    )
  }

  PhotonLoadBalancing.prototype.sendMessage = function (message) {}

  PhotonLoadBalancing.prototype.setupUI = function () {}

  PhotonLoadBalancing.prototype.output = function (str, color) {}

  PhotonLoadBalancing.prototype.updateRoomButtons = function () {
    const canJoin =
      this.isInLobby() &&
      !this.isJoinedToRoom() &&
      this.availableRooms()?.length > 0

    Menu.roomButtons({ canJoin, isJoinedToRoom: this.isJoinedToRoom() })
  }

  /**
   * Update Model position in space
   * @param {*} actor
   */
  PhotonLoadBalancing.prototype.updateModelInfo = function (actor) {
    if (this.isJoinedToRoom()) {
      Player?.players?.forEach((p) => {
        const model = p.model
        if (model.userData.actorNr === actor.actorNr) {
          const position = actor.getCustomProperty('position')
          const rotation = actor.getCustomProperty('rotation')
          const scale = actor.getCustomProperty('scale')

          model.position.copy(position)
          model.rotation.copy(rotation)
          model.scale.copy(scale)

          const input = actor.getCustomProperty('input')
          p.animateFromRemote(input)
        }
      })
    }
  }

  return PhotonLoadBalancing
})(Photon.LoadBalancing.LoadBalancingClient)

export default PhotonLoadBalancing
