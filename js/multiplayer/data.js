export const store = {
  actors: [],
}

export const createRoom = (roomName) => {
  const isRoomExist = !!store.actors[roomName]
  if (!isRoomExist) store.actors[roomName] = []
}

export const removeRoom = (roomName) => {
  const isRoomExist = !!store.actors[roomName]
  if (isRoomExist) delete store.actors[roomName]
}
