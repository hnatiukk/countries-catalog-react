import { useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CountryPage } from '@/pages/CountryPage';
import { SearchPage } from '@/pages/SearchPage';

type AppView = 'search' | 'country';

function App() {
  // TODO(Task 6): replace with React Router
  const [view, setView] = useState<AppView>('search');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(
    null,
  );

  const openCountry = (code: string) => {
    setSelectedCountryCode(code);
    setView('country');
  };

  const backToSearch = () => {
    setView('search');
    setSelectedCountryCode(null);
  };

  if (view === 'country' && selectedCountryCode) {
    return (
      <ErrorBoundary>
        <CountryPage
          countryCode={selectedCountryCode}
          onBack={backToSearch}
          onCountryClick={openCountry}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <SearchPage onCountryClick={openCountry} />
    </ErrorBoundary>
  );
}

export default App;
