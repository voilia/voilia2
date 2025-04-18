
import { renderHook } from '@testing-library/react-hooks';
import { useWebhookHandler } from '../useWebhookHandler';
import { act } from '@testing-library/react';
import { toast } from 'sonner';

jest.mock('sonner');

describe('useWebhookHandler', () => {
  const mockAddLocalMessage = jest.fn();
  const mockRoomId = 'room1';
  const mockProjectId = 'project1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful AI response', async () => {
    const { result } = renderHook(() => 
      useWebhookHandler(mockRoomId, mockProjectId, mockAddLocalMessage)
    );

    const mockResponse = {
      message: 'AI Response',
      agent_id: '123e4567-e89b-12d3-a456-426614174000'
    };

    await act(async () => {
      await result.current(mockResponse, 'tx1');
    });

    expect(mockAddLocalMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        message_text: 'AI Response',
        agent_id: '123e4567-e89b-12d3-a456-426614174000',
        isPending: true
      })
    );
  });

  it('should handle error response', async () => {
    const { result } = renderHook(() => 
      useWebhookHandler(mockRoomId, mockProjectId, mockAddLocalMessage)
    );

    const mockErrorResponse = {
      error: 'Something went wrong'
    };

    await act(async () => {
      await result.current(mockErrorResponse, 'tx1');
    });

    expect(toast.error).toHaveBeenCalled();
    expect(mockAddLocalMessage).not.toHaveBeenCalled();
  });

  it('should handle invalid agent_id format', async () => {
    const { result } = renderHook(() => 
      useWebhookHandler(mockRoomId, mockProjectId, mockAddLocalMessage)
    );

    const mockResponse = {
      message: 'AI Response',
      agent_id: 'invalid-uuid'
    };

    await act(async () => {
      await result.current(mockResponse, 'tx1');
    });

    expect(mockAddLocalMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        agent_id: null
      })
    );
  });
});
