---
title: "Building a Result type in TypeScript"
description: "Rust has poisoned my brain and now I intend to make it everyone's problem with advanced TypeScript."
pubDate: "2025-04-28"
tags: ["technology", "programming", "typescript", "rust", "ishod"]
---

I've been using Rust for a while now and I kinda love it.
I know it's not a language for everyone, but its just useful enough for me to be able to overlook the rough edges.
When I use other languages I kinda miss the niceties of Rust.
Traits are great, enums make life so much easier, and some of the ecosystem packages are out of this world ([`serde`](https://crates.io/crates/serde) my beloved).

Most of these language features aren't _quite_ available in other languages like Go, {Java,Type}Script or Python.
There are some features which are easier to stick onto these languages.
In this case, the `Result` type is one of them.

## The Result type

The `Result` type is a way to represent a value that might be an error.
In Rust, it's a plain enum with two variants:

```rust
enum Result<T, E> {
  Ok(T),
  Err(E),
}
```

It is either an `Ok` variant with the value we want or an `Err` variant that contains the error.

Why would we want to do this?

Because it makes it impossible to ignore errors while still letting you know that an error might happen.
Other popular ways include returning a tuple (multiple return values) with one of the values being the error or throwing an exception.

### Attempt 1: Throwing an exception

In JavaScript (and many other languages), we can just throw an exception.

```js
function aFunctionThatMightFail() {
  throw new Error("an error");
}

function main() {
  try {
    aFunctionThatMightFail();
  } catch (error) {
    console.error(error);
  }
}
```

This is quite bad as we not only don't know if the function might fail, but we also don't know what the error might be.

```js
function aFunctionThatMightFail() {
  // Perfectly valid code
  throw 7;
}
```

So if you want to write code that won't crash randomly, you have to do one of the following:

- Look up every function (and its descendants) and see if there's a chance it might throw.
- Wrap everything in a `try/catch` block and have complex error logging because who knows what might be thrown.

### Attempt 2: Returning a tuple

In Go, we can return a tuple from a function. The convention is to return a tuple with the first element being the value and the second being the error.

```go
package main

import "errors"

func aFunctionThatMightFail() (bool, error) {
  return false, errors.New("an error")
}

func main() {
  result, err := aFunctionThatMightFail()
  if err != nil {
    println(err)
  }
}
```

This is immediately better than the first attempt as we know when the function fails what type the error is.
There is a downside however: The returned error can be just ignored, sometimes by accident or if improperly handled.

```go
package main

import "errors"

func aFunctionThatMightFail(a int) (bool, error) {
  if a % 2 == 0 {
    return false, errors.New("even number")
  }
  return true, nil
}

func main() {
  result, err := aFunctionThatMightFail(1)
  if err != nil {
    println(err)
    return;
  }
  println(result)

  result, err = aFunctionThatMightFail(2)
  // Whoops, we forgot to handle the error!
  // The compiler doesn't complain, but we can still access the value.
  // We're sailing into the land of undefined behavior!
  println(result)

  result, err = aFunctionThatMightFail(3)
  if err != nil {
    println(err)
    return;
  }
  println(result)
}
```

### Attempt 3: Results

In Rust however, we have the `Result` type.

```rust
fn a_function_that_might_fail() -> Result<bool, &'static str> {
  Err("an error")
}

fn main() {
  match a_function_that_might_fail() {
    Ok(result) => println!("Value: {}", result),
    Err(e) => println!("Error: {}", e),
  }
}
```

It forces us to handle the error case like with Go's system with multiple return values.
We can still "ignore" the error at our own peril, but we have to do it explicitly.

```rust
fn a_function_that_might_fail() -> Result<bool, &'static str> {
  Err("an error")
}

fn main() {
  let result = a_function_that_might_fail();
  println!("Value: {}", result.unwrap());
}
```

Unwrapping means that we try to get the value out of the `Result` type and panic if it's an error.
There's even a [lint rule](https://rust-lang.github.io/rust-clippy/master/index.html#unwrap_used) to discourage you from doing it.

It's a nice compromise of verbosity and safety.

If I were a better engineer I'd implement it in all the languages I use.
But I'm not, so I'm just going to do it in my primary language: TypeScript.

## The problem with errors in TypeScript

TypeScript inherits all the language features of JavaScript.
That also includes throwing exceptions as a way to handle errors.

```ts
function divide(a: number, b: number) {
  return a / b;
}
```

Which is _fine_ in theory. You can always just `try/catch` it.

```ts
try {
  divide(1, 0);
} catch (error) {
  console.error("You broke my heckin' program!");
}
```

But it starts getting really annoying and error-prone when you need to do something with the result.

```ts
function divide(a: number, b: number) {
  return a / b;
}

// Typed as `any` by default :(
let result;
try {
  result = divide(1, 2);
} catch (error) { }

if (result === undefined) {
  // Somehow handle the error case
} else {
  const tripleResult = result * 3;
  console.log(tripleResult);
}

```

### Promise me not to throw

Throwing errors gets exponentially worse when you involve Promises. They tend to sneak up on you when you least expect them:

```ts
const exampleResponse = await fetch("https://example.com/");
const exampleText = await exampleResponse.text();
console.log(exampleText);
```

The code above can throw in two places:

1. When the `fetch` call fails.
2. When the `text` call fails.

Meaning each time we use `await` we can potentially throw.
To handle this, we have several options, none of which are fantastic:

1. Nest try/catch blocks.
1. Using one big try/catch block.
1. Falling back to using Promise methods (`.then`, `.catch`).
1. Have temporary variables for each call.

Or any mix of the above.

```ts:let-graveyard.ts
let exampleResponse: Response | null = null;
try {
  exampleResponse = await fetch("https://example.com/");
} catch (e) {
  console.error("Failed to fetch example.com", e);
  return null;
}

let exampleText: string | null = null;
try {
  exampleText = await exampleResponse.text();
} catch (e) {
  console.error("Failed to read response body", e);
  return null;
}

console.log(exampleText);
```

I tend to just use a sprinkling of Promise methods to handle the errors.
Even then, you either get loads of spaghetti or lose information in the process.

```ts:my-preference.ts
const exampleResponse =
  await fetch("https://example.com/")
    .catch((e) => {
      console.error("Failed to fetch example.com", e);
      return null;
    });

const exampleText =
  await exampleResponse
    ?.text()
    .catch((e) => {
      console.error(
        "Failed to read response body",
        e,
      );
      return null;
    });

console.log(exampleText);
```

## What's your suggestion, Mr. Smartypants?

I'm glad you asked. Since we're in `$CURRENT_YEAR`, we're already using TypeScript for our project.
And TypeScript has a nice way to define custom types.
I'm gonna assume you're familiar with the basics of TypeScript and move on to the good stuff.

```ts
type Result<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: unknown;
    };
```

This is a simple `Result` type. It's a union of two types:

1. An object with a `true` `ok` property and a `value` property of type `T`.
1. An object with a `false` `ok` property and an `error` property of type `unknown`.

Unions basically mean "either this or that". So `A | B` means "either `A` or `B`".
TypeScript is usually smart enough to combine common properties of the two types.
In this case, `Result` always has an `ok` property, and depending on whether it's `true` or `false` it will have a `value` or an `error`.

In theory, we could call it a day here and assume engineers will be principled and use it for everything.

```ts
const exampleResponse =
  await fetch("https://example.com/")
    .then((response) => {
      return {
        ok: true,
        value: response,
      } as Result<Response>;
    })
    .catch((e) => {
      return {
        ok: false,
        error: `Failed to fetch example.com: ${e}`,
      } as Result<Response>;
    });

if (!exampleResponse.ok) {
  // We got an error, so we'll just return it
  return exampleResponse;
}

const exampleText =
  await exampleResponse
    .value
    .text()
    .then((body) => {
      return {
        ok: true,
        value: body,
      } as Result<string>;
    })
    .catch((e) => {
      return {
        ok: false,
        error: `Failed to read response body: ${e}`,
      } as Result<string>;
    });

if (!exampleText.ok) {
  return exampleText;
}

console.log(exampleText.value);
```

### Wait, that looks even worse than the original!

You're right. It does. We can do _way_ better.

First, it's useful to split the `Result` type into two separate types so we can talk about them separately.

```ts
type Ok<T> = {
  ok: true;
  value: T;
};

type Err<E> = {
  ok: false;
  error: E;
};

type Result<
  T = unknown,
  E = unknown,
> = Ok<T> | Err<E>;
```

The equals sign in the `Result` type definition is called a default generic argument.
It means that if we don't specify a generic argument, it will use the default one.
eg. `Result` is the same as `Result<unknown, unknown>`, and `Result<number>` is the same as `Result<number, unknown>`.

Now that we have a base upon which to build on we can create a small API around it.

First, lets define the building block functions: `ok` and `err`.

```ts
function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

function err<E>(error: E): Err<E> {
  return { ok: false, error };
}
```

I usually start with something to simulate the `try/catch` we're used to.

```ts
function try$<T>(fn: () => T): Result<T> {
  try {
    return ok(fn());
  } catch (error) {
    return err(error);
  }
}
```

Using this, the initial example can be rewritten as:

```ts
function divide(a: number, b: number) {
  return a / b;
}

const result = try$(() => divide(1, 2));

if (result.ok) {
  const tripleResult = result.value * 3;
  console.log(tripleResult);
} else {
  console.error(result.error);
}
```

If we try to do the same with promises, we get a bit of a problem.

```ts
const result = try$(() => Promise.reject(new Error("Boom")));
//    ^? Result<Promise<never>, unknown>
```

The promise is inside the `Result` type.
That's a bit awkward.
The worst part is that if we try to do something with the promise, it will throw an error.

```ts
const result = try$(() => Promise.reject(new Error("Boom")));
// The result is the Ok variant because the function didn't throw
if (!result.ok) {
  return undefined;
}
console.log("We passed the error check"); // Logged ✅
// But if we try to await the value, it will throw an error
const text = await result.value; // Boom 🧨
console.log("This will never be reached");
```

We have to explicitly handle the promise case in our `try$` function.

```ts
function try$<T>(
  fn: (() => T) | Promise<T>,
): Result<T> | Promise<Result<T>> {
  if (fn instanceof Promise) {
    return fn.then(
      (value) => ok(value),
    ).catch(
      (error) => err(error),
    );
  }

  try {
    const result = fn();

    if (result instanceof Promise) {
      return try$(result);
    }

    return ok(result) as Result<T>;
  } catch (error) {
    return err(error as Error);
  }
}
```

This... also doesn't quite work.

```ts
function divide(a: number, b: number) {
  return a / b;
}

const result = try$(() => divide(1, 2));
//    ^? Result<number, unknown> | Promise<Result<number, unknown>>
```

This basic `try$` function we wrote doesn't know that if we pass it a function, it's not gonna return a Promise.
To fix it, we're gonna have to be a bit more clever with our types.
Again, this could be done a couple of ways, but for now our best bet the following:

```ts
function try$<T>(fn: () => T): Result<T>;
function try$<T>(fn: Promise<T>): Promise<Result<T>>;
function try$<T>(
  fn: (() => T) | Promise<T>,
): Result<T> | Promise<Result<T>> {
  if (fn instanceof Promise) {
    return fn
      .then((value) => ok(value))
      .catch((error) => err(error)) as Promise<Result<T>>;
  }

  try {
    const result = fn();

    if (result instanceof Promise) {
      return try$(result);
    }

    return ok(result) as Result<T>;
  } catch (error) {
    return err(error) as Result<T>;
  }
}
```

If you haven't done more advanced TypeScript, this might look a bit weird.

```ts
function try$<T>(fn: () => T): Result<T>;
function try$<T>(fn: Promise<T>): Promise<Result<T>>;
```

This is called function overloading.
It allows us to define multiple function signatures (what the function takes in as arguments and what type it returns) for the same function implementation.
The last overload is the actual implementation of the function and must be able to handle all the cases of the other overloads.

```ts
function try$<T>(
  fn: (() => T) | Promise<T>,
): Result<T> | Promise<Result<T>> {
  // ...
}
```

Hence why we have loads of unions in it.
This can quickly explode in complexity, but we trade this pain of writing it once for the ability to handle both sync and async functions properly everywhere.

Now that we have this, our divide example works as expected:

```ts
function divide(a: number, b: number) {
  return a / b;
}

const result1 = try$(() => divide(1, 2));
//    ^? Result<number, unknown>

const result2 = try$(fetch("https://example.com/"));
//    ^? Promise<Result<Response, unknown>>
```

And the request example shrinks down to:

```ts
const exampleResponse = await try$(
  fetch("https://example.com/")
);

// We got an error, so we'll just return it
if (!exampleResponse.ok) {
  return exampleResponse;
}

const exampleText = await try$(exampleResponse.value.text());

if (!exampleText.ok) {
  return exampleText;
}

console.log(exampleText.value);
```

This really is a somewhat reasonable stopping point if you don't want or need something more complex.

## But can we make it even better?

Of course we can.

You may have noticed that we don't have custom error messages anymore.
Let's implement a bit more of the API:

```ts
function map<T, E, U>(
  result: Promise<Result<T, E>>,
  fn: (value: T) => U,
): Promise<Result<Awaited<U>, E>>;
function map<T, E, U>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E>;
function map<T, E, U>(
  result: Result<T, E> | Promise<Result<T, E>>,
  fn: (value: T) => U,
): Result<U, E> | Promise<Result<Awaited<U>, E>> {
  if (result instanceof Promise) {
    return result.then((x) => map(x, fn)) as Promise<Result<Awaited<U>, E>>;
  }

  if (result.ok) {
    return try$(() => fn(result.value)) as Result<U, E>;
  }

  return result;
}

function mapErr<T, E, U>(
  result: Promise<Result<T, E>>,
  fn: (error: E) => U,
): Promise<Result<T, U>>;
function mapErr<T, E, U>(
  result: Result<T, E>,
  fn: (error: E) => U,
): Result<T, U>;
function mapErr<T, E, U>(
  result: Result<T, E> | Promise<Result<T, E>>,
  fn: (error: E) => U,
): Result<T, U> | Promise<Result<T, U>> {
  if (result instanceof Promise) {
    return result.then((x) => mapErr(x, fn)) as Promise<Result<T, U>>;
  }

  if (!result.ok) {
    return err(fn(result.error)) as Result<T, U>;
  }

  return result;
}
```

Again, looks like a jumble of symbols, but it's just the simple type stuff repeated a bunch of times.

So now, our request example can be rewritten as:

```ts
const exampleResponse = try$(fetch("https://example.com/"));
const exampleResponseWithError = mapErr(
  exampleResponse,
  (e) => `Failed to fetch example.com: ${e}`,
);
const exampleBody = map(
  exampleResponseWithError,
  (response) => response.text(),
);
const exampleBodyWithError = mapErr(
  exampleBody,
  (e) => `Failed to get response body: ${e}`,
);
```

This is a bit more verbose than before, but I think it's reasonable _enough_.
It will get infinitely better once javascript gets the [pipe operator](https://github.com/tc39/proposal-pipeline-operator):

```ts
const exampleBody = try$(fetch("https://example.com/"))
  |> mapErr(%, (e) => `Failed to fetch example.com: ${e}`)
  |> map(%, (response) => response.text())
  |> mapErr(%, (e) => `Failed to get response body: ${e}`);
```

That dream will probably have to wait for a couple years still, but I'm really hoping for it to come true.

But... Hiding behind the shiny exterior lies something cool.
While fondling the response we also didn't have to do something very subtle.

### We never awaited anything!

We _can_ await stuff at any point, but we don't _have to_.
We've abstracted away both Promise hell and the `try/catch` pyramids/temp graveyard that comes with `await`.
All in one fell swoop.

At this point, I must congratulate you. For you've successfully built a simple Monad from first principles.

You have earned the right to use the quote

> A monad is just a monoid in the category of endofunctors, what's the problem?

And be smug about it without feeling guilty.

## The ishod of the situation

If you don't wanna build your own `Result` type, you can use the one I made.
I called it `ishod` and it's available on [npm](https://www.npmjs.com/package/@allynet/ishod).
At its heart it's the same thing, but it does a bit more fancy stuff with the types and has a few more methods.
For example, the `try$` function (at the time of writing) looks like this:

```ts
export function try$<const T extends Primitive, E>(
  fn: () => T,
): Result<T, E>;
export function try$<T, E>(
  fn: Promise<T>,
): Promise<Result<T, E>>;
export function try$<T, E>(
  fn: () => Promise<T>,
): Promise<Result<T, E>>;
export function try$<T, E>(
  fn: () => T,
): Result<T, E>;
export function try$<T, E>(
  fn: Promise<T> | (() => T | Promise<T>),
): Promise<Result<T, E>> | Result<T, E> {
  if (isPromise(fn)) {
    return fn.then(ok).catch(err) as Promise<Result<T, E>>;
  }

  try {
    const res = fn();

    if (isPromise(res)) {
      return try$(res);
    }

    return ok(res);
  } catch (e) {
    return err(e as E);
  }
}
```

Wait, what in the seven hells is `const T extends Primitive`?

`Primitive` is just a type union of all the primitive types: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`.

The `extends` keyword is called a [type constraint](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints) and it means that `T` must be something _like_ a `Primitive`.
In this case meaning `T` cannot be an object. Why? Because object would behave a bit weirdly in this case.

`const` here is interesting. It's a [somewhat new addition to TypeScript](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters) by the name of const types.
It's a nice to have here because it takes the `T` literally. By default, if you have a function like this:

```ts
function foo<T>(x: T) {
  return x;
}
```

The `T` is unconstrained and can be anything.
TypeScript will infer the general type of the thing we pass into the function and use that as the type of `T`.

```ts
const x = foo("hello");
//    ^? string
```

But if we make `T` a const type:

```ts
function foo<const T>(x: T) {
  return x;
}
```

Now, `T` is "exactly" what we passed into the function.

```ts
const x = foo("hello");
//    ^? "hello"
```

or in our case:

```ts
const x = try$(() => "hello");
//    ^? Result<"hello", unknown>
```

Simple!

## OK but why not just use X?

[Effect](https://effect.website/) and [fp-ts](https://gcanti.github.io/fp-ts/) are both great libraries that do this and more.
But they're also gigantic and you kinda have to fully buy into the ecosystem to use them.

With `ishod` you get a simple, easy to understand, and easy to use `Result` type that you can use in any project.
You can dip in and out of the `ishod` ecosystem as you see fit with little to no friction.

Maybe there's some library out there that already does this stuff and I re-invented the wheel.
If so, please let me know and I'll happily give credit.

But reinventing the wheel is fun and you can get a lot of mileage out of it.

## Conclusion

I've been using this `Result` implementation in all my projects for a while now and I haven't looked back.
It's saved me from a lot of pain and I hope it can save you from some too.

It's also a tale of how learning different languages usually has more benefits than _just_ being able to use multiple languages.

You start to see patterns and how to approach the same problem from different angles.
Having that knowledge is way more valuable than you'd expect and it's something you can't really vibe code yourself into.

So if you have a project that you've been putting off, build it in a technology you don't know.
You might come to the conclusion that it's not for you, but the small flaps of the learning butterfly's wings might just change how you look at the world.

<!-- Or you might just use python and just regret it altogether. -->

Also, use [`ishod`](https://www.npmjs.com/package/@allynet/ishod) in your projects.
