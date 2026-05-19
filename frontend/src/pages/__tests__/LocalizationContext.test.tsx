import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { LocalizationProvider, useLocalization } from '../../contexts/LocalizationContext.tsx';

function TestComponent() {
  const { language, setLanguage, t } = useLocalization();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="text">{t('nav.home')}</span>
      <button onClick={() => setLanguage('de')}>SetDE</button>
    </div>
  );
}

describe('LocalizationProvider & useLocalization', () => {
  beforeEach(() => {
    localStorage.removeItem('language');
  });

  it('renders with default language and updates when setLanguage is called', async () => {
    render(
      <LocalizationProvider>
        <TestComponent />
      </LocalizationProvider>
    );

    // default language should be 'en'
    expect(screen.getByTestId('lang').textContent).toBe('en');

    // Initially t may return the key because i18n may not be loaded synchronously
    // Click button to switch to German and wait for the translation to appear
    await userEvent.click(screen.getByText('SetDE'));

    // After switching language the provider updates local state synchronously
    expect(screen.getByTestId('lang').textContent).toBe('de');

    // Now wait for the translation to be loaded and rendered
    const german = await screen.findByText('Startseite');
    expect(german).toBeTruthy();

    // The selection should have been persisted
    expect(localStorage.getItem('language')).toBe('de');
  });
});

