import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { useKeyboard } from './useKeyboard';
import type { CalculatorAction } from '../types/calculator';

describe('useKeyboard', () => {
  describe('number key input', () => {
    it('should dispatch DIGIT action for number keys 0-9', () => {
      const dispatch = vi.fn();
      renderHook(() => useKeyboard({ dispatch }));

      // Test each digit
      for (let i = 0; i <= 9; i++) {
        fireEvent.keyDown(window, { key: i.toString() });
        expect(dispatch).toHaveBeenCalledWith({
          type: 'DIGIT',
          payload: i.toString(),
        });
      }

      expect(dispatch).toHaveBeenCalledTimes(10);
    });

    it('should dispatch DIGIT action for specific number key', () => {
      const dispatch = vi.fn();
      renderHook(() => useKeyboard({ dispatch }));

      fireEvent.keyDown(window, { key: '5' });

      expect(dispatch).toHaveBeenCalledWith({
        type: 'DIGIT',
        payload: '5',
      });
    });
  });

  describe('operator keys', () => {
    it('should dispatch OPERATOR action for + key', () => {
      const dispatch = vi.fn();
      renderHook(() => useKeyboard({ dispatch }));

      fireEvent.keyDown(window, { key: '+' });

      expect(dispatch).toHaveBeenCalledWith({
        type: 'OPERATOR',
        payload: '+',
      });
    });

    it('should dispatch OPERATOR action for - key', () => {
      const dispatch = vi.fn();
      renderHook(() => useKeyboard({ dispatch }));

      fireEvent.keyDown(window, { key: '-' });

      expect(dispatch).toHaveBeenCalledWith({
        type: 'OPERATOR',
        payload: '-',
      });
    });

    it('should dispatch OPERATOR action for * key', () => {
      const dispatch = vi.fn();
      renderHook(() => useKeyboard({ dispatch }));

      fireEvent.keyDown(window, { key: '*' });

      expect(dispatch).toHaveBeenCalledWith({
        type: 'OPERATOR',
        payload: '*',
      });
    });

    it('should dispatch OPERATOR action for / key', () => {
      const dispatch = vi.fn();
      renderHook(() => useKeyboard({ dispatch }));

      fireEvent.keyDown(window, { key: '/' });

      expect(dispatch).toHaveBeenCalledWith({
        type: 'OPERATOR',
        payload: '/',
      });
    });
  });

  describe('special keys', () => {
    it('should dispatch EQUALS action for Enter key', () => {
      const dispatch = vi.fn();
      renderHook(() => useKeyboard({ dispatch }));

      fireEvent.keyDown(window, { key: 'Enter' });

      expect(dispatch).toHaveBeenCalledWith({
        type: 'EQUALS',
      });
    });

    it('should dispatch EQUALS action for = key', () => {
      const dispatch = vi.fn();
      renderHook(() => useKeyboard({ dispatch }));

      fireEvent.keyDown(window, { key: '=' });

      expect(dispatch).toHaveBeenCalledWith({
        type: 'EQUALS',
      });
    });

    it('should dispatch CLEAR action for Escape key', () => {
      const dispatch = vi.fn();
      renderHook(() => useKeyboard({ dispatch }));

      fireEvent.keyDown(window, { key: 'Escape' });

      expect(dispatch).toHaveBeenCalledWith({
        type: 'CLEAR',
      });
    });

    it('should dispatch BACKSPACE action for Backspace key', () => {
      const dispatch = vi.fn();
      renderHook(() => useKeyboard({ dispatch }));

      fireEvent.keyDown(window, { key: 'Backspace' });

      expect(dispatch).toHaveBeenCalledWith({
        type: 'BACKSPACE',
      });
    });

    it('should dispatch DECIMAL action for . key', () => {
      const dispatch = vi.fn();
      renderHook(() => useKeyboard({ dispatch }));

      fireEvent.keyDown(window, { key: '.' });

      expect(dispatch).toHaveBeenCalledWith({
        type: 'DECIMAL',
      });
    });
  });

  describe('parentheses keys', () => {
    it('should dispatch PARENTHESIS action for ( key', () => {
      const dispatch = vi.fn();
      renderHook(() => useKeyboard({ dispatch }));

      fireEvent.keyDown(window, { key: '(' });

      expect(dispatch).toHaveBeenCalledWith({
        type: 'PARENTHESIS',
        payload: '(',
      });
    });

    it('should dispatch PARENTHESIS action for ) key', () => {
      const dispatch = vi.fn();
      renderHook(() => useKeyboard({ dispatch }));

      fireEvent.keyDown(window, { key: ')' });

      expect(dispatch).toHaveBeenCalledWith({
        type: 'PARENTHESIS',
        payload: ')',
      });
    });
  });

  describe('enabled flag', () => {
    it('should not dispatch actions when enabled is false', () => {
      const dispatch = vi.fn();
      renderHook(() => useKeyboard({ dispatch, enabled: false }));

      fireEvent.keyDown(window, { key: '5' });
      fireEvent.keyDown(window, { key: '+' });
      fireEvent.keyDown(window, { key: 'Enter' });

      expect(dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch actions when enabled is true', () => {
      const dispatch = vi.fn();
      renderHook(() => useKeyboard({ dispatch, enabled: true }));

      fireEvent.keyDown(window, { key: '5' });

      expect(dispatch).toHaveBeenCalledWith({
        type: 'DIGIT',
        payload: '5',
      });
    });

    it('should dispatch actions when enabled is undefined (defaults to true)', () => {
      const dispatch = vi.fn();
      renderHook(() => useKeyboard({ dispatch }));

      fireEvent.keyDown(window, { key: '5' });

      expect(dispatch).toHaveBeenCalledWith({
        type: 'DIGIT',
        payload: '5',
      });
    });
  });

  describe('event cleanup', () => {
    it('should remove event listener on unmount', () => {
      const dispatch = vi.fn();
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useKeyboard({ dispatch }));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('key combinations', () => {
    it('should handle sequence of key presses correctly', () => {
      const dispatch = vi.fn();
      renderHook(() => useKeyboard({ dispatch }));

      // Simulate typing: 2 + 3 =
      fireEvent.keyDown(window, { key: '2' });
      fireEvent.keyDown(window, { key: '+' });
      fireEvent.keyDown(window, { key: '3' });
      fireEvent.keyDown(window, { key: 'Enter' });

      const calls = dispatch.mock.calls as Array<[CalculatorAction]>;
      expect(calls[0][0]).toEqual({ type: 'DIGIT', payload: '2' });
      expect(calls[1][0]).toEqual({ type: 'OPERATOR', payload: '+' });
      expect(calls[2][0]).toEqual({ type: 'DIGIT', payload: '3' });
      expect(calls[3][0]).toEqual({ type: 'EQUALS' });
    });
  });

  describe('ignored keys', () => {
    it('should not dispatch actions for unsupported keys', () => {
      const dispatch = vi.fn();
      renderHook(() => useKeyboard({ dispatch }));

      fireEvent.keyDown(window, { key: 'a' });
      fireEvent.keyDown(window, { key: 'Z' });
      fireEvent.keyDown(window, { key: ' ' });
      fireEvent.keyDown(window, { key: 'Tab' });

      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
