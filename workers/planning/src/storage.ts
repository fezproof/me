const ROOM_KEY = "ROOM_NAME";
const PLAYER_PREFIX = "PLAYER|";

export const createRoomeStorage = (storage: DurableObjectStorage) => {
  return {
    getRoomName: () => storage.get<string>(ROOM_KEY),
    setRoomName: (name: string) => storage.put(ROOM_KEY, name),

    putPlayer: (id: string, name: string) =>
      storage.put(PLAYER_PREFIX.concat(id), { id, name }),
    deletePlayer: (id: string) => storage.delete(PLAYER_PREFIX.concat(id)),
    getPlayerList: () =>
      storage.list<{ id: string; name: string }>({
        prefix: PLAYER_PREFIX,
        limit: 100,
      }),
  };
};

export type RoomStorage = ReturnType<typeof createRoomeStorage>;
