import '@testing-library/jest-dom';

// Mock environment variables
process.env.REACT_APP_BASE_URL_FOR_URL_SHORTENER = 'http://localhost:3000';

// Mock axios for testing
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
  })),
}));
