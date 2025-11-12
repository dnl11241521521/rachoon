# contributing to rachoon

thank you for considering contributing to rachoon. this document outlines the process and guidelines.

## code of conduct

this project adheres to a code of conduct that all contributors are expected to follow. please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before contributing.

key points:
- be respectful and professional
- provide constructive feedback
- focus on what is best for the project and community

## getting started

### development setup

1. fork and clone the repository
```bash
git clone https://github.com/your-username/rachoon.git
cd rachoon
```

2. install dependencies
```bash
pnpm install
```

3. start development servers
```bash
# start all services via docker
docker compose up -d

# or run locally
pnpm dev
```

4. database setup
```bash
# migrations will run automatically on first start
# or run manually:
cd apps/backend
node ace migration:run
node ace db:seed
```

## project structure

```
rachoon/
├── apps/
│   ├── backend/     # adonisjs api server
│   └── frontend/    # nuxt.js web application
├── packages/
│   ├── common/      # shared code
│   └── typescript-config/
└── docker/          # docker configuration
```

## development workflow

### branching strategy

- `main` - production-ready code
- feature branches - `feature/your-feature-name`
- bugfix branches - `fix/issue-description`
- hotfix branches - `hotfix/critical-fix`

### commit messages

follow conventional commits:

```
feat: add invoice template customization
fix: resolve postgres connection timeout
chore: update dependencies
docs: improve setup instructions
test: add unit tests for invoice service
refactor: simplify template rendering logic
```

### code quality standards

1. **code style**
   - use prettier for formatting
   - run `pnpm format` before committing
   - follow existing code patterns

2. **linting**
   - fix all eslint warnings
   - run `pnpm lint` before committing

3. **testing**
   - write tests for new features
   - ensure existing tests pass
   - run `pnpm test` before pushing
   - maintain test coverage above 70%

4. **type safety**
   - fix all typescript errors
   - avoid using `any` types
   - run `pnpm build` to verify

## making changes

### 1. create a branch

```bash
git checkout -b feature/your-feature-name
```

### 2. make your changes

- write clean, readable code
- add comments for complex logic
- update documentation as needed

### 3. test your changes

```bash
# run tests
pnpm test

# run specific package tests
cd apps/backend
pnpm test

# run build to check for errors
pnpm build
```

### 4. commit your changes

```bash
git add .
git commit -m "feat: add your feature description"
```

### 5. push and create pull request

```bash
git push origin feature/your-feature-name
```

then open a pull request on github.

## pull request process

### pr checklist

before submitting, ensure:

- [ ] code follows project style guidelines
- [ ] all tests pass locally
- [ ] new tests added for new features
- [ ] documentation updated if needed
- [ ] commit messages follow convention
- [ ] no merge conflicts with main
- [ ] build completes successfully

### pr description template

```markdown
## description
brief description of changes

## type of change
- [ ] bug fix
- [ ] new feature
- [ ] breaking change
- [ ] documentation update

## testing
describe testing done

## screenshots (if applicable)
add screenshots for ui changes

## checklist
- [ ] tests pass
- [ ] build succeeds
- [ ] documentation updated
```

### review process

1. automated ci checks must pass
2. at least one maintainer review required
3. address review feedback
4. maintainer merges approved pr

## testing guidelines

### backend tests (japa)

```typescript
import { test } from '@japa/runner'

test('should create invoice', async ({ client, assert }) => {
  const response = await client
    .post('/api/invoices')
    .json({ /* invoice data */ })

  response.assertStatus(201)
  assert.exists(response.body().id)
})
```

### frontend tests (vitest)

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InvoiceForm from './InvoiceForm.vue'

describe('InvoiceForm', () => {
  it('renders form fields', () => {
    const wrapper = mount(InvoiceForm)
    expect(wrapper.find('input[name="amount"]').exists()).toBe(true)
  })
})
```

## database migrations

when adding database changes:

1. create migration
```bash
cd apps/backend
node ace make:migration add_feature_table
```

2. write up/down methods
```typescript
export default class extends BaseSchema {
  public async up() {
    this.schema.createTable('table_name', (table) => {
      table.increments('id')
      // add columns
    })
  }

  public async down() {
    this.schema.dropTable('table_name')
  }
}
```

3. test migration
```bash
node ace migration:run
node ace migration:rollback
```

## api changes

when modifying api:

1. update controllers and routes
2. update api documentation
3. add tests for new endpoints
4. ensure backward compatibility
5. version api if breaking change

## documentation

keep documentation up to date:

- update README.md for setup changes
- add jsdoc comments for public functions
- document api endpoints
- explain complex algorithms
- provide examples for new features

## reporting issues

when reporting bugs:

1. check existing issues first
2. provide clear title and description
3. include steps to reproduce
4. add system information
5. include error messages/logs
6. attach screenshots if relevant

### bug report template

```markdown
**describe the bug**
clear description of what the bug is

**to reproduce**
1. go to '...'
2. click on '...'
3. see error

**expected behavior**
what you expected to happen

**screenshots**
if applicable

**environment**
- os: [e.g. ubuntu 22.04]
- node version: [e.g. 18.x]
- pnpm version: [e.g. 8.9.0]
```

## feature requests

when requesting features:

1. check if already requested
2. explain the problem it solves
3. describe proposed solution
4. provide use cases
5. consider alternatives

## security issues

do not open public issues for security vulnerabilities.
email security concerns to: [maintainer-email]

## getting help

- read documentation first
- search existing issues
- ask questions in discussions
- join community chat

## license

by contributing, you agree that your contributions will be licensed under the project's license.

## recognition

contributors will be acknowledged in:
- github contributors list
- release notes (for significant contributions)
- project readme (for major features)

thank you for contributing to rachoon!
