import '@testing-library/cypress/add-commands';
import { blockLiveApi } from './apiStubs';

beforeEach(() => {
  blockLiveApi();
});
