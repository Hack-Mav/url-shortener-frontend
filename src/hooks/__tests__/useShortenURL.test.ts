import { renderHook, act } from '@testing-library/react';
import { useShortenURL } from '../useShortenURL';
import * as api from '../../api';

// Mock the API module
jest.mock('../../api');
const mockShortenURL = api.shortenURL as jest.MockedFunction<typeof api.shortenURL>;
const mockShortenURLWithAlias = api.shortenURLWithAlias as jest.MockedFunction<typeof api.shortenURLWithAlias>;

describe('useShortenURL', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useShortenURL());

    expect(result.current.shortUrl).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle successful URL shortening', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          shortUrl: 'https://short.ly/abc123',
          originalUrl: 'https://example.com',
          alias: 'abc123',
          createdAt: '2024-01-01T00:00:00Z'
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };
    mockShortenURL.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useShortenURL());

    await act(async () => {
      await result.current.shortenUrl('https://example.com');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.shortUrl).toBe('https://short.ly/abc123');
    expect(result.current.error).toBe(null);
    expect(mockShortenURL).toHaveBeenCalledWith('https://example.com', undefined);
  });

  it('should handle URL shortening with alias', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          shortUrl: 'https://short.ly/myalias',
          originalUrl: 'https://example.com',
          alias: 'myalias',
          createdAt: '2024-01-01T00:00:00Z'
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };
    mockShortenURLWithAlias.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useShortenURL());

    await act(async () => {
      await result.current.shortenUrl('https://example.com', undefined, 'myalias');
    });

    expect(result.current.shortUrl).toBe('https://short.ly/myalias');
    expect(mockShortenURLWithAlias).toHaveBeenCalledWith('https://example.com', 'myalias', undefined);
  });

  it('should handle empty URL validation', async () => {
    const { result } = renderHook(() => useShortenURL());

    await act(async () => {
      await result.current.shortenUrl('');
    });

    expect(result.current.error).toBe('Please enter a valid URL');
    expect(result.current.loading).toBe(false);
    expect(mockShortenURL).not.toHaveBeenCalled();
  });

  it('should handle API errors', async () => {
    const mockError = {
      response: {
        data: {
          message: 'URL already exists'
        }
      }
    };
    mockShortenURL.mockRejectedValue(mockError);

    const { result } = renderHook(() => useShortenURL());

    await act(async () => {
      await result.current.shortenUrl('https://example.com');
    });

    expect(result.current.error).toBe('URL already exists');
    expect(result.current.loading).toBe(false);
    expect(result.current.shortUrl).toBe('');
  });

  it('should reset state correctly', () => {
    const { result } = renderHook(() => useShortenURL());

    // Set some state
    act(() => {
      result.current.reset();
    });

    expect(result.current.shortUrl).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
