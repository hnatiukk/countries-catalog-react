/** Fail the test if the browser talks to the live API host. */
export function blockLiveApi() {
  cy.intercept('https://api.restcountries.com/**', (req) => {
    throw new Error(`Unstubbed live API call: ${req.url}`);
  });
}

export function stubNameSearch(
  fixture: string,
  options: { delay?: number; statusCode?: number } = {},
) {
  cy.intercept('GET', '/api/countries/v5?*q=*', {
    fixture,
    delay: options.delay ?? 0,
    statusCode: options.statusCode ?? 200,
  }).as('nameSearch');
}

export function stubRegionSearch(
  fixture: string,
  options: { delay?: number; statusCode?: number } = {},
) {
  cy.intercept('GET', '/api/countries/v5?*region=*', {
    fixture,
    delay: options.delay ?? 0,
    statusCode: options.statusCode ?? 200,
  }).as('regionSearch');
}

export function stubCountryDetails(
  fixture: string,
  options: { delay?: number; statusCode?: number } = {},
) {
  cy.intercept('GET', '/api/countries/v5/codes.alpha_3/**', {
    fixture,
    delay: options.delay ?? 0,
    statusCode: options.statusCode ?? 200,
  }).as('countryDetails');
}
