import {
  AMERICAS_REGION,
  NAME_QUERY,
  NO_MATCH_QUERY,
  REGION_QUERY,
  americasNamesByArea,
  americasNamesByPopulation,
  detailCountry,
  nameSearchCount,
  nameSearchResults,
  regionSearchCount,
  regionSearchResults,
} from '../support/mockExpectations';

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

  it('filters the grid by name and updates the count', () => {
    cy.visit('/');
    searchByName(NAME_QUERY);

    cy.findByText(`${nameSearchCount} countries found`).should('be.visible');
    nameSearchResults.forEach((country) => {
      cy.findByRole('button', { name: country.name.common }).should(
        'be.visible',
      );
    });
  });

  it('filters the grid by region and updates the count', () => {
    cy.visit('/');
    searchByRegion(REGION_QUERY);

    cy.findByText(`${regionSearchCount} countries found`).should('be.visible');
    regionSearchResults.forEach((country) => {
      cy.findByRole('button', { name: country.name.common }).should(
        'be.visible',
      );
    });
  });

  it('reorders cards when sorting by Area instead of Population', () => {
    cy.visit('/');
    searchByRegion(AMERICAS_REGION);

    cy.findByRole('region', { name: 'Countries' })
      .findAllByRole('button')
      .then((buttons) => {
        const names = [...buttons].map((el) => el.getAttribute('aria-label'));
        expect(names).to.deep.equal(americasNamesByPopulation);
      });

    cy.findByRole('button', { name: 'Area' }).click();

    cy.findByRole('region', { name: 'Countries' })
      .findAllByRole('button')
      .then((buttons) => {
        const names = [...buttons].map((el) => el.getAttribute('aria-label'));
        expect(names).to.deep.equal(americasNamesByArea);
      });
  });

  it('shows empty state when the search has no matches', () => {
    cy.visit('/');
    searchByName(NO_MATCH_QUERY);

    cy.findByText('0 countries found').should('be.visible');
    cy.findByRole('status').should('contain.text', 'No results');
  });

  it('opens country details from a card and returns via back', () => {
    cy.visit('/');
    searchByName(detailCountry.name.common);

    cy.findByRole('button', { name: detailCountry.name.common }).click();

    cy.findByRole('heading', { name: detailCountry.name.common }).should(
      'be.visible',
    );
    cy.findByText(
      `${detailCountry.region} · ${detailCountry.subregion}`,
    ).should('be.visible');
    cy.findByText(detailCountry.population.toLocaleString('en-US')).should(
      'be.visible',
    );
    cy.findByText(
      `${detailCountry.area.toLocaleString('en-US')} km²`,
    ).should('be.visible');
    cy.findByText(/More countries in the same region/).should('be.visible');

    cy.findByRole('button', { name: 'Back to search' }).click();

    cy.findByRole('heading', { name: 'Find your country' }).should(
      'be.visible',
    );
  });
});
