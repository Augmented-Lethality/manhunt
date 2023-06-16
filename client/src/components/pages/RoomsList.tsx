import React, { useEffect, useState } from 'react';

export interface IRoomProps {};

const RoomList: React.FunctionComponent<IRoomListProps> = (props) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [userRoom, setUserRoom] = useState<string>('');

  useEffect(() => {
    const fetchRooms = async () => {
      // Fetch room data from the server
      const roomData: { rooms: Room[]; userRoom: string } = await ...; // Fetch room data from the server
      setRooms(roomData.rooms);
      setUserRoom(roomData.userRoom);
    };

    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter((room) => room.name === userRoom);

  return (
    <div>
      <h1>Room List</h1>
      {filteredRooms.length > 0 ? (
        <ul>
          {filteredRooms.map((room) => (
            <li key={room.id}>{room.name}</li>
          ))}
        </ul>
      ) : (
        <p>No rooms available.</p>
      )}
    </div>
  );
};

export default RoomList;
