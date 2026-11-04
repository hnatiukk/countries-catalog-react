import {
  stubCountryDetails,
  stubNameSearch,
  stubRegionSearch,
} from '../support/apiStubs';

const AMERICAS_BY_POPULATION = [
  'Argentina',
  'Bahamas',
  'Barbados',
  'Aruba',
  'Antigua and Barbuda',
  'Anguilla',
];

const AMERICAS_BY_AREA = [
  'Argentina',
  'Bahamas',
  'Antigua and Barbuda',
  'Barbados',
  'Aruba',
  'Anguilla',
];

function searchByName(query: string) {
  cy.findByRole('button', { name: 'Name' }).click();
  cy.findByRole('searchbox', { name: 'Search countries' }).clear().type(query);
  cy.findByRole('button', { name: 'Search' }).click();
}

function searchByRegion(query: string) {
  cy.findByRole('button', { name: 'Region' }).click();
  cy.findByRole('searchbox', { name: 'Search countries' }).clear().type(query);
  cy.findByRole('button', { name: 'Search' }).click();
}

describe('Countries catalog e2e', () => {
  it('renders the search page chrome with default toggles and empty grid', () => {
    cy.visit('/');

    cy.findByRole('heading', { name: 'Find your country' }).should(
      'be.visible',
    );
    cy.findByRole('searchbox', { name: 'Search countries' }).should(
      'be.visible',
    );
    cy.findByRole('button', { name: 'Name' }).should(
      'have.attr',
      'aria-pressed',
      'true',
    );
    cy.findByRole('button', { name: 'Population' }).should(
      'have.attr',
      'aria-pressed',
      'true',
    );
    cy.findByText('0 countries found').should('be.visible');
    cy.findByRole('status').should('contain.text', 'No results');
  });

  it('searches by name and updates the count', () => {
    stubNameSearch('search-name-ukraine.json');
    cy.visit('/');
    searchByName('Ukraine');

    cy.wait('@nameSearch');
    cy.findByText('1 countries found').should('be.visible');
    cy.findByRole('button', { name: 'Ukraine' }).should('be.visible');
  });

  it('searches by region and updates the count', () => {
    stubRegionSearch('search-region-europe.json');
    cy.visit('/');
    searchByRegion('Europe');

    cy.wait('@regionSearch');
    cy.findByText('6 countries found').should('be.visible');
    cy.findByRole('button', { name: 'Albania' }).should('be.visible');
    cy.findByRole('button', { name: 'Belgium' }).should('be.visible');
  });

  it('reorders cards when sorting by Area instead of Population', () => {
    stubRegionSearch('search-region-americas.json');
    cy.visit('/');
    searchByRegion('Americas');
    cy.wait('@regionSearch');

    cy.findByRole('region', { name: 'Countries' })
      .findAllByRole('button')
      .then((buttons) => {
        const names = [...buttons].map((el) => el.getAttribute('aria-label'));
        expect(names).to.deep.equal(AMERICAS_BY_POPULATION);
      });

    cy.findByRole('button', { name: 'Area' }).click();

    cy.findByRole('region', { name: 'Countries' })
      .findAllByRole('button')
      .then((buttons) => {
        const names = [...buttons].map((el) => el.getAttribute('aria-label'));
        expect(names).to.deep.equal(AMERICAS_BY_AREA);
      });
  });

  it('shows empty state when the search has no matches', () => {
    stubNameSearch('empty.json');
    cy.visit('/');
    searchByName('zzzznotacountry999');

    cy.wait('@nameSearch');
    cy.findByText('0 countries found').should('be.visible');
    cy.findByRole('status').should('contain.text', 'No results');
  });

  it('opens country details from a card and returns via back', () => {
    stubNameSearch('search-name-ukraine.json');
    stubCountryDetails('country-ukr.json');
    stubRegionSearch('related-europe.json');

    cy.visit('/');
    searchByName('Ukraine');
    cy.wait('@nameSearch');

    cy.findByRole('button', { name: 'Ukraine' }).click();
    cy.wait('@countryDetails');
    cy.wait('@regionSearch');

    cy.findByRole('heading', { name: 'Ukraine' }).should('be.visible');
    cy.findByText('Europe · Eastern Europe').should('be.visible');
    cy.findByText('28,700,000').should('be.visible');
    cy.findByText('603,500 km²').should('be.visible');
    cy.findByText(/More countries in the same region/).should('be.visible');

    cy.findByRole('button', { name: 'Back to search' }).click();

    cy.findByRole('heading', { name: 'Find your country' }).should(
      'be.visible',
    );
  });

  it('shows a loading state while a search is in flight', () => {
    stubNameSearch('search-name-ukraine.json', { delay: 500 });
    cy.visit('/');
    searchByName('Ukraine');

    cy.findByRole('status').should('contain.text', 'Loading countries…');
    cy.wait('@nameSearch');
    cy.findByRole('button', { name: 'Ukraine' }).should('be.visible');
  });

  it('shows an API error with retry for 500 and 429 responses', () => {
    cy.intercept('GET', '/api/countries/v5?*q=*', {
      statusCode: 500,
      fixture: 'error-500.json',
    }).as('nameSearchFail');

    cy.visit('/');
    searchByName('Ukraine');
    cy.wait('@nameSearchFail');

    cy.findByRole('alert').should('be.visible');
    cy.findByRole('button', { name: 'Try again' }).should('be.visible');

    cy.intercept('GET', '/api/countries/v5?*q=*', {
      fixture: 'search-name-ukraine.json',
    }).as('nameSearchOk');

    cy.findByRole('button', { name: 'Try again' }).click();
    cy.wait('@nameSearchOk');
    cy.findByRole('button', { name: 'Ukraine' }).should('be.visible');

    cy.intercept('GET', '/api/countries/v5?*q=*', {
      statusCode: 429,
      fixture: 'error-429.json',
    }).as('nameSearchRateLimited');

    searchByName('Ukraine');
    cy.wait('@nameSearchRateLimited');
    cy.findByRole('alert').should(
      'contain.text',
      'Too many requests. Please wait a moment and try again.',
    );
  });

  it('searches by region Americas and shows results', () => {
    stubRegionSearch('search-region-americas.json');
    cy.visit('/');
    searchByRegion('Americas');
    cy.wait('@regionSearch');

    cy.findByText('6 countries found').should('be.visible');
    cy.findByRole('button', { name: 'Argentina' }).should('be.visible');
  });
});
