export const createRoomeStorage = (storage: DurableObjectStorage) => {
  return {
    getRoomName: () => storage.get("ROOM_NAME"),
    setRoomName: (name: string) => storage.put("ROOM_NAME", name),
  };
};

export type RoomStorage = ReturnType<typeof createRoomeStorage>;
