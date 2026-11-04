import { logger } from './logger';

describe('logger', () => {
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let infoSpy: jest.SpyInstance;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
    infoSpy.mockRestore();
  });

  it('logs an error message without details', () => {
    logger.error('boom');

    expect(errorSpy).toHaveBeenCalledWith('boom');
  });

  it('logs an error message with details', () => {
    const details = { code: 500 };

    logger.error('boom', details);

    expect(errorSpy).toHaveBeenCalledWith('boom', details);
  });

  it('logs a warning with and without details', () => {
    logger.warn('careful');
    logger.warn('careful', { id: 1 });

    expect(warnSpy).toHaveBeenNthCalledWith(1, 'careful');
    expect(warnSpy).toHaveBeenNthCalledWith(2, 'careful', { id: 1 });
  });

  it('logs info with and without details', () => {
    logger.info('hello');
    logger.info('hello', 'extra');

    expect(infoSpy).toHaveBeenNthCalledWith(1, 'hello');
    expect(infoSpy).toHaveBeenNthCalledWith(2, 'hello', 'extra');
  });
});
