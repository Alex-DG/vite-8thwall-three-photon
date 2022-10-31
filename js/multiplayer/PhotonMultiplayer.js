import Menu from '../ui/Menu'

import PhotonLoadBalancing from './PhotonLoadBalancing'

class _PhotontMultiplayer {
  init() {
    const client = new PhotonLoadBalancing()

    Menu.init({ client })

    client.start()
  }
}
const PhotontMultiplayer = new _PhotontMultiplayer()
export default PhotontMultiplayer
