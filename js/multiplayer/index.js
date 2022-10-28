import { AppInfo, __extends, colors } from './config'

const AppLoadBalancing = (function (_super) {
  __extends(AppLoadBalancing, _super)

  function AppLoadBalancing() {
    var _this =
      _super.call(
        this,
        AppInfo.Wss
          ? Photon.ConnectionProtocol.Wss
          : Photon.ConnectionProtocol.Ws,
        AppInfo.AppId,
        AppInfo.AppVersion
      ) || this
    _this.logger = new Exitgames.Common.Logger('App:')
    _this.USERCOLORS = colors
    // uncomment to use Custom Authentication
    // this.setCustomAuthentication("username=" + "yes" + "&token=" + "yes");
    _this.output(
      _this.logger.format(
        'Init',
        _this.getNameServerAddress(),
        AppInfo.AppId,
        AppInfo.AppVersion
      )
    )
    _this.logger.info(
      'Init',
      _this.getNameServerAddress(),
      AppInfo.AppId,
      AppInfo.AppVersion
    )
    _this.setLogLevel(Exitgames.Common.Logger.Level.INFO)
    _this.myActor().setCustomProperty('color', _this.USERCOLORS[0])

    let { position, rotation, scale } = store.placement

    // Set custom property for model
    _this.myActor().setCustomProperty('observer', false)
    _this.myActor().setCustomProperty('pos', position)
    _this.myActor().setCustomProperty('rot', rotation)
    _this.myActor().setCustomProperty('scale', scale)
    _this.myActor().setCustomProperty('actionWeights', [1.0, 0.0])
    _this.myActor().setCustomProperty('roomModel', 1.0)

    return _this
  }
})(Photon.LoadBalancing.LoadBalancingClient)
