
import { parseRoomMessage } from '../messageContentParser';
import { RoomMessage } from '@/types/room-messages';
import { TextBlock, CodeBlock, MarkdownBlock } from '@/types/message-content';

describe('messageContentParser', () => {
  it('parses plain text message correctly', () => {
    const message: RoomMessage = {
      id: '1',
      room_id: 'room1',
      user_id: 'user1',
      agent_id: null,
      message_text: 'Hello world',
      created_at: new Date().toISOString(),
      updated_at: null,
      isPending: false,
      transaction_id: 'tx1',
      messageType: 'user'
    };

    const result = parseRoomMessage(message);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('text');
    // Type assertion to access the text property safely
    expect((result[0] as TextBlock).text).toBe('Hello world');
  });

  it('parses code blocks correctly', () => {
    const message: RoomMessage = {
      id: '2',
      room_id: 'room1',
      user_id: 'user1',
      agent_id: null,
      message_text: 'Here is some code:\n```javascript\nconsole.log("test")\n```',
      created_at: new Date().toISOString(),
      updated_at: null,
      isPending: false,
      transaction_id: 'tx1',
      messageType: 'user'
    };

    const result = parseRoomMessage(message);
    expect(result).toHaveLength(2);
    expect(result[0].type).toBe('text');
    expect(result[1].type).toBe('code');
    // Type assertion to access code-specific properties safely
    const codeBlock = result[1] as CodeBlock;
    expect(codeBlock.language).toBe('javascript');
    expect(codeBlock.code).toBe('console.log("test")');
  });

  it('parses markdown content correctly', () => {
    const message: RoomMessage = {
      id: '3',
      room_id: 'room1',
      user_id: 'user1',
      agent_id: null,
      message_text: '# Title\n**Bold text**\n- List item',
      created_at: new Date().toISOString(),
      updated_at: null,
      isPending: false,
      transaction_id: 'tx1',
      messageType: 'user'
    };

    const result = parseRoomMessage(message);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('markdown');
    // Type assertion to access markdown-specific properties safely
    const markdownBlock = result[0] as MarkdownBlock;
    expect(markdownBlock.content).toContain('# Title');
  });

  it('handles empty messages', () => {
    const message: RoomMessage = {
      id: '4',
      room_id: 'room1',
      user_id: 'user1',
      agent_id: null,
      message_text: '',
      created_at: new Date().toISOString(),
      updated_at: null,
      isPending: false,
      transaction_id: 'tx1',
      messageType: 'user'
    };

    const result = parseRoomMessage(message);
    expect(result).toHaveLength(0);
  });
});
