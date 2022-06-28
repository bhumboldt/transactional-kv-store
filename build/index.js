"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommandTypes_1 = require("./CommandTypes");
var Stack_1 = require("./Stack");
var readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '=> '
});
/* State */
var transactionStack = new Stack_1.SimpleStack();
var kvStore = new Map();
/* Terminal Processing */
readline.write("\nWelcome to the TransactionL KV Store! Available commands are below:\n  SET <key> <value> // store the value for key\n  GET <key> // return the current value for key\n  DELETE <key> // remove the entry for key\n  COUNT <value> // return the number of keys that have the given value\n  BEGIN // start a new transaction\n  COMMIT // complete the current transaction\n  ROLLBACK // revert to state prior to BEGIN call\n");
readline.prompt();
readline.on('line', function (input) {
    if (input.trim()) {
        var commandSplit = input.split(' ');
        var command = commandSplit.shift();
        switch (command) {
            case CommandTypes_1.CommandType.GET:
                processGetCommand(commandSplit);
                break;
            case CommandTypes_1.CommandType.SET:
                processSetCommand(commandSplit);
                break;
            case CommandTypes_1.CommandType.DELETE:
                processDeleteCommand(commandSplit);
                break;
            case CommandTypes_1.CommandType.COUNT:
                processCountCommand(commandSplit);
                break;
            case CommandTypes_1.CommandType.BEGIN:
                processBeginCommand(commandSplit);
                break;
            case CommandTypes_1.CommandType.COMMIT:
                processCommitCommand(commandSplit);
                break;
            case CommandTypes_1.CommandType.ROLLBACK:
                processRollbackCommand(commandSplit);
                break;
            default:
                console.log("Command not recognized: " + input);
                break;
        }
    }
    readline.prompt();
});
/* GET command functions */
function processGetCommand(args) {
    if (args.length === 1) {
        var key = args.shift();
        var value = getFromStore(key);
        if (value) {
            console.log(value);
        }
        else {
            console.log("Key " + key + " not set");
        }
    }
    else {
        printInvalidArguments(CommandTypes_1.CommandType.GET, args);
    }
}
function getFromStore(key) {
    return kvStore.get(key);
}
/* SET command functions */
function processSetCommand(args) {
    if (args.length >= 2) {
        var key = args.shift();
        var value = args.join(' ');
        setValueForKeyInStore(key, value);
    }
    else {
        printInvalidArguments(CommandTypes_1.CommandType.SET, args);
    }
}
function setValueForKeyInStore(key, value) {
    kvStore.set(key, value);
}
/* DELETE command functions */
function processDeleteCommand(args) {
    if (args.length === 1) {
        var key = args.shift();
        deleteKeyFromStore(key);
    }
    else {
        printInvalidArguments(CommandTypes_1.CommandType.DELETE, args);
    }
}
function deleteKeyFromStore(key) {
    kvStore.delete(key);
}
/* BEGIN command functions */
function processBeginCommand(args) {
    if (args.length === 0) {
        storeCurrentState();
    }
    else {
        printInvalidArguments(CommandTypes_1.CommandType.BEGIN, args);
    }
}
function storeCurrentState() {
    var newMap = new Map(kvStore);
    transactionStack.push(newMap);
}
/* COUNT command functions */
function processCountCommand(args) {
    if (args.length > 0) {
        var value = args.join(' ');
        var countFound = countValuesInStore(value);
        console.log(countFound);
    }
    else {
        printInvalidArguments(CommandTypes_1.CommandType.COUNT, args);
    }
}
function countValuesInStore(valueToFind) {
    var count = 0;
    kvStore.forEach(function (value, key) { if (value === valueToFind)
        count++; });
    return count;
}
/* COMMIT command functions */
function processCommitCommand(args) {
    if (args.length === 0) {
        var transactionCommitted = commitTransaction();
        var transactionCommitMessage = transactionCommitted ? "Transaction committed successfully" : "No transactions to commit";
        console.log(transactionCommitMessage);
    }
    else {
        printInvalidArguments(CommandTypes_1.CommandType.COMMIT, args);
    }
}
function commitTransaction() {
    return transactionStack.pop() ? true : false;
}
/* ROLLBACK command functions */
function processRollbackCommand(args) {
    if (args.length === 0) {
        var stateRestored = rollBackState();
        var stateRestoredMessage = stateRestored ? "Transaction rolled back successfully" : "No transactions to roll back";
        console.log(stateRestoredMessage);
    }
    else {
        printInvalidArguments(CommandTypes_1.CommandType.ROLLBACK, args);
    }
}
function rollBackState() {
    var stateBeforeBegin = transactionStack.pop();
    if (stateBeforeBegin) {
        kvStore = new Map(stateBeforeBegin);
        return true;
    }
    else {
        return false;
    }
}
/* Extra utility functions */
function printInvalidArguments(command, args) {
    console.log("Invalid use of " + command + ": " + args.join(' '));
}
