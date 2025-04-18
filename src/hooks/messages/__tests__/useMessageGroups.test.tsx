
import { renderHook } from '@testing-library/react-hooks';
import { useMessageGroups } from '../useMessageGroups';
import { RoomMessage } from '@/types/room-messages';

describe('useMessageGroups', () => {
  const mockMessages: RoomMessage[] = [
    {
      id: '1',
      room_id: 'room1',
      user_id: 'user1',
      agent_id: null,
      message_text: 'Hello',
      created_at: '2025-04-18T00:00:00.000Z',
      updated_at: null,
      transaction_id: 'tx1',
      messageType: 'user'
    },
    {
      id: '2',
      room_id: 'room1',
      user_id: null,
      agent_id: 'agent1',
      message_text: 'Hi there',
      created_at: '2025-04-18T00:00:01.000Z',
      updated_at: null,
      transaction_id: 'tx2',
      messageType: 'agent'
    }
  ];

  it('should group messages by sender', () => {
    const currentUserId = 'user1';
    const { result } = renderHook(() => useMessageGroups(mockMessages, currentUserId));

    expect(result.current).toHaveLength(2);
    expect(result.current[0].userId).toBe(currentUserId);
    expect(result.current[0].messages).toHaveLength(1);
    expect(result.current[1].userId).toBe('agent1');
  });

  it('should handle empty messages array', () => {
    const { result } = renderHook(() => useMessageGroups([], 'user1'));
    expect(result.current).toHaveLength(0);
  });

  it('should skip messages with empty content', () => {
    const messagesWithEmpty: RoomMessage[] = [
      ...mockMessages,
      {
        id: '3',
        room_id: 'room1',
        user_id: 'user1',
        agent_id: null,
        message_text: '   ',
        created_at: '2025-04-18T00:00:02.000Z',
        updated_at: null,
        transaction_id: 'tx3',
        messageType: 'user'
      }
    ];

    const { result } = renderHook(() => useMessageGroups(messagesWithEmpty, 'user1'));
    expect(result.current[0].messages).toHaveLength(1);
  });
});
