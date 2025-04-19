
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MessageContentRenderer } from '../MessageContent';
import { MessageContent, ErrorBlock, TextBlock, CodeBlock, MarkdownBlock } from '@/types/message-content';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

// Set up TypeScript React Test Library properly
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}

describe('MessageContentRenderer', () => {
  it('renders text content correctly', () => {
    const content: TextBlock = {
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
    const content: MarkdownBlock = {
      id: '2',
      type: 'markdown',
      content: '**Bold text**',
      createdAt: new Date().toISOString()
    };

    render(<MessageContentRenderer content={content} />);
    expect(screen.getByText('Bold text')).toBeInTheDocument();
  });

  it('renders code content correctly', () => {
    const content: CodeBlock = {
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
    const content: ErrorBlock = {
      id: '4',
      type: 'error',
      message: 'Error occurred',
      createdAt: new Date().toISOString()
    };

    render(<MessageContentRenderer content={content} />);
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  it('renders unknown content type with error message', () => {
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
