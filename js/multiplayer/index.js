import { AppInfo, __extends, colors } from './config'

import { store } from './data'

import Photon, { Exitgames } from '../libs/Photon-Javascript_SDK'

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
    this.connectToRegionMaster(AppInfo.Region)

    console.log('✅', 'Photon ready')
  }

  PhotonLoadBalancing.prototype.onError = function (errorCode, errorMsg) {
    console.log('🔴', 'Photon: Error')
  }

  PhotonLoadBalancing.prototype.onEvent = function (code, content, actorNr) {}

  PhotonLoadBalancing.prototype.onStateChange = function (state) {}

  PhotonLoadBalancing.prototype.objToStr = function (x) {}

  PhotonLoadBalancing.prototype.updateRoomInfo = function () {}

  PhotonLoadBalancing.prototype.onActorPropertiesChange = function (actor) {}

  PhotonLoadBalancing.prototype.onMyRoomPropertiesChange = function () {}

  PhotonLoadBalancing.prototype.onRoomListUpdate = function (
    rooms,
    roomsUpdated,
    roomsAdded,
    roomsRemoved
  ) {}

  PhotonLoadBalancing.prototype.onRoomList = function (rooms) {}

  PhotonLoadBalancing.prototype.onJoinRoom = function () {}

  PhotonLoadBalancing.prototype.onActorJoin = function (actor) {}

  PhotonLoadBalancing.prototype.sendMessage = function (message) {}

  PhotonLoadBalancing.prototype.setupUI = function () {}

  PhotonLoadBalancing.prototype.output = function (str, color) {}

  PhotonLoadBalancing.prototype.updateRoomButtons = function () {}

  /**
   * Update Model position in space
   * @param {*} actor
   */
  PhotonLoadBalancing.prototype.updateModelInfo = function (actor) {}

  return PhotonLoadBalancing
})(Photon.LoadBalancing.LoadBalancingClient)

const client = new PhotonLoadBalancing()
client.start()
