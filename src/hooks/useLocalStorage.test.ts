import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  it('should return initial value when key does not exist', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial'),
    );

    expect(result.current[0]).toBe('initial');
  });

  it('should set and get string values', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial'),
    );

    act(() => {
      result.current[1]('new value');
    });

    expect(result.current[0]).toBe('new value');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new value'));
  });

  it('should set and get object values', () => {
    const initialValue = { name: 'test', count: 0 };
    const { result } = renderHook(() =>
      useLocalStorage('test-key', initialValue),
    );

    const newValue = { name: 'updated', count: 5 };
    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toEqual(newValue);
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify(newValue));
  });

  it('should set and get number values', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0));

    act(() => {
      result.current[1](42);
    });

    expect(result.current[0]).toBe(42);
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify(42));
  });

  it('should set and get boolean values', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', false));

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify(true));
  });

  it('should support functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
  });

  it('should retrieve existing value from localStorage', () => {
    // Pre-populate localStorage
    localStorage.setItem('test-key', JSON.stringify('existing value'));

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial'),
    );

    expect(result.current[0]).toBe('existing value');
  });

  it('should handle invalid JSON gracefully', () => {
    // Set invalid JSON in localStorage
    localStorage.setItem('test-key', 'invalid json{');

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'fallback'),
    );

    // Should fall back to initial value
    expect(result.current[0]).toBe('fallback');
  });

  it('should persist across hook re-renders', () => {
    const { result, rerender } = renderHook(() =>
      useLocalStorage('test-key', 'initial'),
    );

    act(() => {
      result.current[1]('persisted');
    });

    rerender();

    expect(result.current[0]).toBe('persisted');
  });

  it('should handle array values', () => {
    const initialArray = [1, 2, 3];
    const { result } = renderHook(() =>
      useLocalStorage('test-key', initialArray),
    );

    const newArray = [4, 5, 6];
    act(() => {
      result.current[1](newArray);
    });

    expect(result.current[0]).toEqual(newArray);
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify(newArray));
  });
});
