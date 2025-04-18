
import { renderHook } from '@testing-library/react-hooks';
import { useMessageSender } from '../useMessageSender';
import { act } from '@testing-library/react';
import { toast } from 'sonner';
import { submitSmartBarMessage } from '@/services/webhook/webhookService';

jest.mock('sonner');
jest.mock('@/services/webhook/webhookService');
jest.mock('@/components/auth/AuthProvider', () => ({
  useAuth: () => ({ user: { id: 'user1' } })
}));

describe('useMessageSender', () => {
  const mockAddLocalMessage = jest.fn();
  const mockHandleWebhookResponse = jest.fn();
  const mockRoomId = 'room1';
  const mockProjectId = 'project1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful message sending', async () => {
    (submitSmartBarMessage as jest.Mock).mockResolvedValue({ success: true });

    const { result } = renderHook(() => 
      useMessageSender(mockRoomId, mockProjectId, mockAddLocalMessage, mockHandleWebhookResponse)
    );

    const mockText = 'Hello, world!';

    await act(async () => {
      await result.current.handleSendMessage(mockText);
    });

    expect(mockAddLocalMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        message_text: mockText,
        isPending: true
      })
    );
    expect(submitSmartBarMessage).toHaveBeenCalled();
  });

  it('should handle message sending failure', async () => {
    const mockError = new Error('Failed to send');
    (submitSmartBarMessage as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => 
      useMessageSender(mockRoomId, mockProjectId, mockAddLocalMessage, mockHandleWebhookResponse)
    );

    await act(async () => {
      await result.current.handleSendMessage('test message');
    });

    expect(toast.error).toHaveBeenCalled();
  });

  it('should handle file attachments', async () => {
    (submitSmartBarMessage as jest.Mock).mockResolvedValue({ success: true });

    const { result } = renderHook(() => 
      useMessageSender(mockRoomId, mockProjectId, mockAddLocalMessage, mockHandleWebhookResponse)
    );

    const mockFiles = [
      new File(['test'], 'test.txt', { type: 'text/plain' })
    ];

    await act(async () => {
      await result.current.handleSendMessage('test with file', mockFiles);
    });

    expect(submitSmartBarMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        uploadedFiles: expect.arrayContaining([
          expect.objectContaining({
            name: 'test.txt',
            type: 'text/plain'
          })
        ])
      })
    );
  });
});
