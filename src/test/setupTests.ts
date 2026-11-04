import { TextDecoder, TextEncoder } from 'node:util';
import '@testing-library/jest-dom';
import 'jest-styled-components';

Object.assign(globalThis, { TextDecoder, TextEncoder });
