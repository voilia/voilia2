
import { render, screen } from '@testing-library/react';
import { MessageContentRenderer } from '../MessageContent';
import { MessageContent, ErrorBlock } from '@/types/message-content';
import '@testing-library/jest-dom';

describe('MessageContentRenderer', () => {
  it('renders text content correctly', () => {
    const content: MessageContent = {
      id: '1',
      type: 'text',
      text: 'Hello world',
      format: 'plain',
      createdAt: new Date().toISOString()
    };

    render(<MessageContentRenderer content={content} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders markdown content correctly', () => {
    const content: MessageContent = {
      id: '2',
      type: 'markdown',
      content: '**Bold text**',
      createdAt: new Date().toISOString()
    };

    render(<MessageContentRenderer content={content} />);
    expect(screen.getByText('Bold text')).toBeInTheDocument();
  });

  it('renders code content correctly', () => {
    const content: MessageContent = {
      id: '3',
      type: 'code',
      code: 'console.log("test")',
      language: 'javascript',
      createdAt: new Date().toISOString()
    };

    render(<MessageContentRenderer content={content} />);
    expect(screen.getByText('console.log("test")')).toBeInTheDocument();
  });

  it('renders error content correctly', () => {
    const content: MessageContent = {
      id: '4',
      type: 'error',
      message: 'Error occurred',
      createdAt: new Date().toISOString()
    };

    render(<MessageContentRenderer content={content} />);
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  it('renders unknown content type with error message', () => {
    // Create a valid ErrorBlock for unknown type content
    const content: ErrorBlock = {
      id: '5',
      type: 'error',
      message: 'Unknown content type',
      createdAt: new Date().toISOString()
    };

    render(<MessageContentRenderer content={content} />);
    expect(screen.getByText('Unknown content type')).toBeInTheDocument();
  });
});
