import { createTodo, addTodo, countDone } from "./todoUtils";
import type { Todo } from "./todoUtils";

// Statement coverage: createTodo has no branches, so one call runs every statement.
describe("createTodo — Statement Coverage", () => {
  it("creates a todo with the given text, done set to false, and a numeric id", () => {
    const todo = createTodo("Buy milk");

    expect(todo.text).toBe("Buy milk");
    expect(todo.done).toBe(false);
    expect(typeof todo.id).toBe("number");
  });
});

// Branch coverage: the `if (!trimmed)` check has two outcomes (true and false).
describe("addTodo — Branch Coverage", () => {
  it("does not add a todo when the text is blank (if condition is true)", () => {
    const todos: Todo[] = [];
    const result = addTodo(todos, "   ");

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it("adds a new todo when the text is valid (if condition is false)", () => {
    const todos: Todo[] = [];
    const result = addTodo(todos, "Buy milk");

    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("Buy milk");
    expect(result[0].done).toBe(false);
  });
});

// Loop coverage: run the for loop zero times, once, and several times.
describe("countDone — Loop Coverage", () => {
  it("returns 0 for an empty list (loop runs zero times)", () => {
    const todos: Todo[] = [];

    expect(countDone(todos)).toBe(0);
  });

  it("returns 1 for a list with one finished todo (loop runs once)", () => {
    const todos: Todo[] = [{ id: 1, text: "Buy milk", done: true }];

    expect(countDone(todos)).toBe(1);
  });

  it("counts only the finished todos in a mixed list (loop runs several times)", () => {
    const todos: Todo[] = [
      { id: 1, text: "Buy milk", done: true },
      { id: 2, text: "Walk the dog", done: false },
      { id: 3, text: "Write tests", done: true },
    ];

    expect(countDone(todos)).toBe(2);
  });
});
