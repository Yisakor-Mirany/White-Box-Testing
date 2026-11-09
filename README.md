# AD361 White Box Testing

| | |
|---|---|
| **Course** | AD361 |
| **Assignment** | Learning Practice: White Box Testing |
| **Student** | Yisakor Mirany |
| **Repository** | <https://github.com/Yisakor-Mirany/White-Box-Testing> |

## Project Overview

This repository contains the instructor-provided starter project (`newWeek5.zip`). It is a small Todo List app built with React, TypeScript, and Vite. The app has one React component (`src/App.tsx`) and a small utility module (`src/todoUtils.ts`) with three functions:

| Function | What it does | Coverage technique tested |
|---|---|---|
| `createTodo(text)` | Builds a new todo object `{ id, text, done: false }` | Statement coverage |
| `addTodo(todos, text)` | Adds a todo to the list, unless the text is blank | Branch coverage |
| `countDone(todos)` | Loops over the list and counts finished todos | Loop coverage |

White box testing means reading the source code first and then designing tests based on how the code works internally. All tests are in one file, **`src/todoUtils.test.ts`**. Only `src/todoUtils.ts` is tested, as the assignment instructions require. The application code was not changed.

## Learning Objectives

- Organize related test cases into suites (`describe` blocks) and files.
- Write a test that runs every statement in a function (statement coverage).
- Write tests that run both outcomes of a branch (branch coverage).
- Test a loop with zero, one, and several items (loop coverage).
- Use a Jest coverage report to check which code the tests reached.

## Technologies Used

| Technology | Purpose |
|---|---|
| TypeScript | Language for the app and the tests |
| React + Vite | Todo List user interface and dev server |
| Jest | Test runner and coverage reports |
| ts-jest | Lets Jest run TypeScript test files |
| Node.js / npm | Runtime and package manager |

## Project Structure

```
White-Box-Testing/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.tsx              # Single React component (uses the utility functions)
│   ├── index.css
│   ├── main.tsx             # App entry point
│   ├── todoUtils.ts         # Todo type + createTodo, addTodo, countDone (code under test)
│   └── todoUtils.test.ts    # Jest tests (3 suites, 6 test cases)  ← added for this assignment
├── .gitignore
├── eslint.config.js
├── index.html
├── jest.config.cjs          # Jest configuration (ts-jest, node environment)
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── tsconfig.test.json       # TypeScript settings used by Jest
├── vite.config.ts
└── README.md
```

## Installation

You need [Node.js](https://nodejs.org/) installed. These results were produced with Node.js v22.

```bash
git clone https://github.com/Yisakor-Mirany/White-Box-Testing.git
```

```bash
cd White-Box-Testing
```

```bash
npm install
```

To try the app in a browser (optional):

```bash
npm run dev
```

## Running the Jest Tests

```bash
npm test
```

In this starter project, the `test` script is already set to `jest --coverage`, so `npm test` runs the tests **and** prints the coverage table.

To see each test's name in the output:

```bash
npm test -- --verbose
```

## Generating Coverage Reports

```bash
npm test -- --coverage
```

> **Note:** The instructor's README mentions `npm run coverage`. The starter `package.json` has no `coverage` script, and its `test` script already includes `--coverage`. So `npm test` (or `npm test -- --coverage`) prints the same report.

Jest prints a summary table in the terminal and writes a detailed HTML report to `coverage/lcov-report/index.html`. Open that file in a browser to see each line highlighted as covered or not covered. The `coverage/` folder is generated output, so `.gitignore` keeps it out of the repository.

## White Box Testing Concepts

### Statement Coverage

**Statement coverage** checks whether every statement in the code ran at least once during the tests.

```ts
export function createTodo(text: string): Todo {
  return { id: Date.now(), text, done: false };
}
```

`createTodo` has no `if` statements or loops, so there is only one path through it. One call runs every statement. The test checks the result: the text matches the input, `done` is `false`, and `id` is a number.

### Branch Coverage

**Branch coverage** checks whether every possible outcome of each decision (such as an `if`) ran at least once.

```ts
export function addTodo(todos: Todo[], text: string): Todo[] {
  const trimmed = text.trim();
  if (!trimmed) {          // decision with two outcomes
    return todos;          // TRUE  → blank text, list returned unchanged
  }
  return [...todos, createTodo(trimmed)];   // FALSE → valid text, todo added
}
```

The `if (!trimmed)` check can be **true** (the text is empty or only spaces) or **false** (the text has real content). Full branch coverage needs one test for each outcome. One statement-coverage test is not enough here, because a single call only goes down one of the two paths.

### Loop Coverage

**Loop coverage** checks that a loop works when it runs **zero times**, **once**, and **several times**. Bugs often hide at these edges.

```ts
export function countDone(todos: Todo[]): number {
  let count = 0;
  for (const todo of todos) {   // loop
    if (todo.done) {            // decision inside the loop
      count++;
    }
  }
  return count;
}
```

An empty list skips the loop body entirely. A one-item list runs it once. A mixed list runs it several times and also takes both outcomes of the `if (todo.done)` inside the loop.

## Test Cases

All six tests are in `src/todoUtils.test.ts`, grouped into three `describe` suites.

| # | Suite | Test case | Input | Expected result | Coverage purpose |
|---|---|---|---|---|---|
| 1 | `createTodo — Statement Coverage` | creates a todo with the given text, done set to false, and a numeric id | `"Buy milk"` | `text` is `"Buy milk"`, `done` is `false`, `typeof id` is `"number"` | Runs every statement in `createTodo` |
| 2 | `addTodo — Branch Coverage` | does not add a todo when the text is blank (if condition is true) | `[]`, `"   "` | Returns `[]` (length 0) | **True** branch of `if (!trimmed)` |
| 3 | `addTodo — Branch Coverage` | adds a new todo when the text is valid (if condition is false) | `[]`, `"Buy milk"` | Length 1, `text` is `"Buy milk"`, `done` is `false` | **False** branch of `if (!trimmed)` |
| 4 | `countDone — Loop Coverage` | returns 0 for an empty list (loop runs zero times) | `[]` | `0` | Loop runs **0** times |
| 5 | `countDone — Loop Coverage` | returns 1 for a list with one finished todo (loop runs once) | 1 todo, `done: true` | `1` | Loop runs **1** time |
| 6 | `countDone — Loop Coverage` | counts only the finished todos in a mixed list (loop runs several times) | 3 todos (2 done, 1 not done) | `2` | Loop runs **several** times; both outcomes of `if (todo.done)` |

## Test Results

Actual output from running `npm test -- --verbose` (Node.js v22, Jest 30.5.2; per-test timings removed):

```
PASS  src/todoUtils.test.ts
  createTodo — Statement Coverage
    ✓ creates a todo with the given text, done set to false, and a numeric id
  addTodo — Branch Coverage
    ✓ does not add a todo when the text is blank (if condition is true)
    ✓ adds a new todo when the text is valid (if condition is false)
  countDone — Loop Coverage
    ✓ returns 0 for an empty list (loop runs zero times)
    ✓ returns 1 for a list with one finished todo (loop runs once)
    ✓ counts only the finished todos in a mixed list (loop runs several times)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
```

**Result: 6 of 6 tests passed.**

## Code Coverage Results

Actual coverage table from running `npm test -- --coverage`:

```
--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------|---------|----------|---------|---------|-------------------
All files     |     100 |      100 |     100 |     100 |
 todoUtils.ts |     100 |      100 |     100 |     100 |
--------------|---------|----------|---------|---------|-------------------
```

| Metric | `src/todoUtils.ts` |
|---|---|
| Statement coverage (% Stmts) | **100%** |
| Branch coverage (% Branch) | **100%** |
| Function coverage (% Funcs) | **100%** |
| Line coverage (% Lines) | **100%** |
| Uncovered lines | None |

### Experiment: Removing the Blank-Text Test

The instructor's README suggests removing the blank-text test (Test 2) and running the report again. I tried this by running every test except Test 2:

```
 todoUtils.ts |    92.3 |       75 |     100 |    92.3 | 16
```

Statement coverage dropped to 92.3%, branch coverage dropped to **75%**, and line 16 (`return todos;`, the blank-text branch) was listed as uncovered. This shows that Test 2 is the only test that covers the `true` outcome of `if (!trimmed)`. After the full test file was restored, coverage went back to 100%.

## Conclusion

This practice showed how white box testing uses knowledge of the source code to design tests:

- **Statement coverage** is easy to reach for code with no branches. One call to `createTodo` was enough.
- **Branch coverage** is stronger than statement coverage. `addTodo` needed two tests, one for each outcome of the `if`. The experiment showed branch coverage falling to 75% when one outcome was not tested.
- **Loop coverage** tests the edges of a loop (zero, one, and many iterations), which is where off-by-one and empty-input bugs usually appear. The mixed-list test also covered both outcomes of the `if` inside the loop.
- Grouping the tests into one file with three `describe` suites made them easy to read and showed which technique each test demonstrates.
- The Jest coverage report confirms which lines and branches the tests reached. The "Uncovered Line #s" column points to the code that still needs a test.
