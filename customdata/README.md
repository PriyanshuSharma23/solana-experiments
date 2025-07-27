# Testing-Ready TypeScript Node.js Application

A complete TypeScript Node.js application setup with testing, linting, and build tools.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install dev dependencies (if not already installed)
npm install --save-dev @types/jest @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint jest ts-jest ts-node typescript
```

## 📁 Project Structure

```
├── src/
│   ├── models/
│   │   └── AddressInfo.ts
│   └── index.ts
├── tests/
│   └── AddressInfo.test.ts
├── package.json
├── tsconfig.json
├── jest.config.js
├── .eslintrc.js
├── .gitignore
└── README.md
```

## 🛠️ Available Scripts

### Development

```bash
# Run in development mode with ts-node
npm run dev

# Build the project
npm run build

# Start the built application
npm start
```

### Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Lint and auto-fix
npm run lint:fix

# Clean build directory
npm run clean
```

## 🧪 Testing

This project uses **Jest** as the testing framework with TypeScript support.

### Test Structure

- Tests are located in the `tests/` directory
- Test files should end with `.test.ts` or `.spec.ts`
- Use `describe()` for test suites and `it()` for individual tests
- Use `beforeEach()` and `afterEach()` for setup/teardown

### Example Test

```typescript
import { AddressInfo } from "../src/models/AddressInfo";

describe("AddressInfo", () => {
  it("should create an instance with provided data", () => {
    const address = new AddressInfo({
      name: "John Doe",
      houseNumber: 123,
      street: "Main St",
      city: "Anytown",
    });

    expect(address.name).toBe("John Doe");
  });
});
```

## 🔧 Configuration Files

### TypeScript (`tsconfig.json`)

- Target: ES2020
- Module: CommonJS
- Experimental decorators enabled
- Strict type checking

### Jest (`jest.config.js`)

- TypeScript support with ts-jest
- Coverage reporting
- Test file patterns

### ESLint (`.eslintrc.js`)

- TypeScript-aware linting
- Recommended rules
- Custom rule configurations

## 📦 Key Dependencies

### Production

- `@dao-xyz/borsh` - Serialization library

### Development

- `typescript` - TypeScript compiler
- `jest` - Testing framework
- `ts-jest` - Jest TypeScript support
- `eslint` - Code linting
- `@typescript-eslint/*` - TypeScript ESLint rules
- `ts-node` - TypeScript execution
- `@types/*` - Type definitions

## 🎯 Best Practices

1. **Type Safety**: Always use proper TypeScript types
2. **Testing**: Write tests for all new functionality
3. **Linting**: Run linting before committing code
4. **Coverage**: Maintain good test coverage
5. **Documentation**: Document complex functions and classes

## 🔄 Development Workflow

1. Write code in `src/`
2. Write tests in `tests/`
3. Run `npm run lint` to check code quality
4. Run `npm test` to ensure tests pass
5. Run `npm run build` to compile
6. Commit your changes

## 📊 Coverage Reports

After running `npm run test:coverage`, you'll find coverage reports in:

- `coverage/lcov-report/index.html` - HTML report
- `coverage/lcov.info` - LCOV format for CI/CD

## 🚀 Deployment

1. Build the project: `npm run build`
2. The compiled JavaScript will be in the `dist/` directory
3. Deploy the `dist/` directory to your production environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request
