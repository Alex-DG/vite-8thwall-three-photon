import PhotontMultiplayer from '../multiplayer/PhotonMultiplayer'
import Player from '../Player'

export const initWorldPipelineModule = () => {
  const init = () => {
    Player.init()
    PhotontMultiplayer.init()

    console.log('✅', 'World ready')
  }

  const updateWorld = () => {
    Player?.render()
  }

  return {
    name: 'world',

    onStart: () => init(),

    onUpdate: () => updateWorld(),
  }
}
