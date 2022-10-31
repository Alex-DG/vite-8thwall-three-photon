export const store = {
  actors: [],

  // OLD
  connectOnStart: false,
  isMyObjectCreated: false,
  isDebug: true,
  observer: false,
  roomModelNumber: -1,
  models: [],
  placement: {
    position: {
      x: 0.0,
      y: 0.0,
      z: 0.0,
    },
    rotation: {
      x: 0.0,
      y: 0.0,
      z: 0.0,
    },
    scale: {
      x: 1.0,
      y: 1.0,
      z: 1.0,
    },
  },
  roomModelSynchInfo: [],
  animationInfoPerModel: [],
  posSmoothing: {
    friction: {
      x: 0.1,
      y: 0.1,
      z: 0.1,
    },
    velocity: {
      x: 0.0,
      y: 0.0,
      z: 0.0,
    },
    acceleration: {
      x: 0.0,
      y: 0.0,
      z: 0.0,
    },
  },
  actionWeights: [1.0, 0.0],
}

export const createRoom = (roomName) => {
  const isRoomExist = !!store.actors[roomName]
  if (!isRoomExist) store.actors[roomName] = []
}

export const removeRoom = (roomName) => {
  const isRoomExist = !!store.actors[roomName]
  if (isRoomExist) delete store.actors[roomName]
}
