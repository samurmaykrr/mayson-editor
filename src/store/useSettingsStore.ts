import { useContext, useCallback } from 'react';
import {
  SettingsContext,
  type SettingsContextValue,
  type EditorSettings,
  type UISettings,
} from './settingsContext';

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}

export function useEditorSettings(): EditorSettings {
  const { settings } = useSettings();
  return settings.editor;
}

export function useFormattingSettings() {
  const { settings } = useSettings();
  return settings.formatting;
}

export function useBehaviorSettings() {
  const { settings } = useSettings();
  return settings.behavior;
}

export function useUISettings(): UISettings {
  const { settings } = useSettings();
  return settings.ui;
}

export function useTheme() {
  const { settings, updateUI } = useSettings();
  
  const setTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    updateUI({ theme });
  }, [updateUI]);
  
  const toggleTheme = useCallback(() => {
    const newTheme = settings.ui.theme === 'dark' ? 'light' : 'dark';
    updateUI({ theme: newTheme });
  }, [settings.ui.theme, updateUI]);
  
  return {
    theme: settings.ui.theme,
    setTheme,
    toggleTheme,
  };
}
