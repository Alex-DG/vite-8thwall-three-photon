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

    // Set custom property for model
    const { position, rotation, scale } = store.placement
    this.myActor().setCustomProperty('observer', false)
    this.myActor().setCustomProperty('pos', position)
    this.myActor().setCustomProperty('rot', rotation)
    this.myActor().setCustomProperty('scale', scale)
    this.myActor().setCustomProperty('actionWeights', [1.0, 0.0])
    this.myActor().setCustomProperty('roomModel', 1.0)

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
    console.log('onStateChange', { state })
    this.updateRoomButtons()
    this.updateRoomInfo()
  }

  PhotonLoadBalancing.prototype.objToStr = function (x) {}

  PhotonLoadBalancing.prototype.updateRoomInfo = function (data) {
    console.log('updateRoomInfo', { data })
    Menu.roomInfo({ clear: true })
  }

  PhotonLoadBalancing.prototype.onActorPropertiesChange = function (actor) {}

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
  }

  PhotonLoadBalancing.prototype.onActorJoin = function (actor) {
    console.log('🟢', 'Actor Joined', { actor })

    Object.keys(this.myRoomActors()).forEach((key) => {
      const roomActor = this.myRoomActors()[key]
      const room = roomActor.getRoom()

      const isFound = store.actors[room.name].some(
        (ra) => ra.actorNr === roomActor.actorNr
      )

      if (!isFound) {
        const isClient = this.myActor().actorNr === roomActor.actorNr
        Player.create(actor, isClient)
        store.actors[room.name].push(roomActor)
        console.log('🤖', 'Player Added!')
      }
    })

    console.log('[ Current actors ]', { actors: store.actors })

    this.updateRoomButtons()
  }

  PhotonLoadBalancing.prototype.onActorLeave = function (actor) {
    Player.remove(actor)

    const roomName = actor.getRoom().name
    store.actors[roomName] = store.actors[roomName].filter(
      (a) => a.actorNr !== actor.actorNr
    )

    console.log('[ Current actors ]', { actors: store.actors })
  }

  PhotonLoadBalancing.prototype.sendMessage = function (message) {}

  PhotonLoadBalancing.prototype.setupUI = function () {}

  PhotonLoadBalancing.prototype.output = function (str, color) {}

  PhotonLoadBalancing.prototype.updateRoomButtons = function () {
    console.log('updateRoomButtons')

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
  PhotonLoadBalancing.prototype.updateModelInfo = function (actor) {}

  return PhotonLoadBalancing
})(Photon.LoadBalancing.LoadBalancingClient)

export default PhotonLoadBalancing
