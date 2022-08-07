# Testes

## Integration Tests

Integration tests should come in this folder.

Integration tests should be separated by scenarios (e.g. `newAccount`). Ideally, integration tests should not mock any internal or external library/code, they should run the actual code, mocks should be restricted to API responses only. That is, we will mock the response and not the "axios" or "fetch".

The purpose of integration testing is to verify that the behavior is correct in an overview of the system and we should not be concerned with testing specific paths of code or some "piece" of logic. Tests should be "big picture" and functionally focused.

When testing the creation of a new account, we should check for errors if any parameter is missing or incorrect, we should check what happens if the API call returns an error (404, 500, etc). Not whether "line 85 of a file was called or not" is not the subject of this test.

Corner cases should also be added here, as long as they represent "functionality" and not an exception in the code. The key here is to think "what should my system do" without worrying/watching the code.

## Unit Tests

Unit tests must be alongside the code it tests. That is, along with the codes inside the `src` folder.

Unit tests see the correct testing of the specific function/scope ensuring that the "local logic" is correct. The purpose of this test is to ensure that the implementation of the function is correct. In unit tests we must test the returns, expected behaviors (are we calling a certain function in the right way and with the correct parameters?)

The purpose of unit testing is not to check the logic as a whole, but to check as much detail as possible of the function you are testing. For this reason mocks are accepted (although, ideally, we should always avoid using them).

Here we must test every "if" and every path that the code can go through, as well as exceptions and errors. Ideally, each change to the code should be accompanied by more test cases (ensuring that behavior is desired) and possibly changes to existing tests once the code's behavior has changed.

## To run tests

To run them, just run the command `npm run test`, which will run both the integration tests and the unit tests.
