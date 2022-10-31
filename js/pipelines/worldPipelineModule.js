import Demo from '../demo'

export const initWorldPipelineModule = () => {
  let demo
  const init = () => {
    demo = new Demo()

    console.log('✅', 'World ready')
  }

  const updateWorld = () => {
    demo?.render()
  }

  return {
    name: 'world',

    onStart: () => init(),

    onUpdate: () => updateWorld(),
  }
}
