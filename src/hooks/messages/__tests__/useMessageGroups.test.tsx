
import { renderHook } from '@testing-library/react-hooks';
import { useMessageGroups } from '../useMessageGroups';
import { RoomMessage } from '@/types/room-messages';

const mockMessages: RoomMessage[] = [
  {
    id: '1',
    room_id: 'room1',
    user_id: 'user1',
    agent_id: null,
    message_text: 'Hello',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: null,
    transaction_id: 'tx1',
    messageType: 'user',
    isPending: false
  },
  {
    id: '2',
    room_id: 'room1',
    user_id: null,
    agent_id: 'agent1',
    message_text: 'Hi there',
    created_at: '2024-01-01T00:00:01Z',
    updated_at: null,
    transaction_id: 'tx2',
    messageType: 'agent',
    isPending: false
  }
];

describe('useMessageGroups', () => {
  it('should group messages by sender', () => {
    const { result } = renderHook(() => useMessageGroups(mockMessages, 'user1'));
    
    expect(result.current).toHaveLength(2);
    expect(result.current[0].userId).toBe('user1');
    expect(result.current[0].messages).toContainEqual({
      id: '1',
      room_id: 'room1',
      user_id: 'user1',
      agent_id: null,
      message_text: 'Hello',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: null,
      transaction_id: 'tx1',
      messageType: 'user',
      isPending: false
    });
  });
});
