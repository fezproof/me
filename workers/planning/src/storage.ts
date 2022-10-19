const ROOM_KEY = "ROOM_NAME";
const PLAYER_PREFIX = "PLAYER|";

interface Player {
  id: string;
  name: string;
  here?: boolean;
}

export const createRoomeStorage = (storage: DurableObjectStorage) => {
  return {
    getRoomName: () => storage.get<string>(ROOM_KEY),
    setRoomName: (name: string) => storage.put(ROOM_KEY, name),

    putPlayer: (id: string, name: string) =>
      storage.put<Player>(PLAYER_PREFIX.concat(id), { id, name, here: true }),
    deletePlayer: (id: string) => storage.delete(PLAYER_PREFIX.concat(id)),
    getPlayerList: () =>
      storage.list<Player>({
        prefix: PLAYER_PREFIX,
        limit: 100,
      }),
    setPlayerStatus: async (id: string, status: boolean) => {
      const player = await storage.get<Player>(PLAYER_PREFIX.concat(id));

      if (!player) throw new Error("Player does not exist");

      return storage.put<Player>(PLAYER_PREFIX.concat(id), {
        ...player,
        here: status,
      });
    },
  };
};

export type RoomStorage = ReturnType<typeof createRoomeStorage>;
