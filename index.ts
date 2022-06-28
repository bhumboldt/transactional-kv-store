import { CommandType } from './CommandTypes';
import { ReadLine } from "readline";
import { SimpleStack } from './Stack';

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '=> '
}) as ReadLine;

/* State */
const transactionStack = new SimpleStack<Map<string, string>>();
let kvStore = new Map<string, string>();

/* Terminal Processing */
readline.write(`
Welcome to the TransactionL KV Store! Available commands are below:
  SET <key> <value> // store the value for key
  GET <key> // return the current value for key
  DELETE <key> // remove the entry for key
  COUNT <value> // return the number of keys that have the given value
  BEGIN // start a new transaction
  COMMIT // complete the current transaction
  ROLLBACK // revert to state prior to BEGIN call
`);

readline.prompt();

readline.on('line', (input: string) => {
  if (input.trim()) {
    const commandSplit = input.split(' ');
    const command = commandSplit.shift();
    switch (command) {
      case CommandType.GET:
        processGetCommand(commandSplit);
      break;
      case CommandType.SET:
        processSetCommand(commandSplit);  
      break;
      case CommandType.DELETE:
        processDeleteCommand(commandSplit);  
      break;
      case CommandType.COUNT:
        processCountCommand(commandSplit);  
      break;
      case CommandType.BEGIN:
        processBeginCommand(commandSplit);  
      break;
      case CommandType.COMMIT:
        processCommitCommand(commandSplit);  
      break;
      case CommandType.ROLLBACK:
        processRollbackCommand(commandSplit);  
      break;
      default: console.log(`Command not recognized: ${input}`); break;
    }
  }

  readline.prompt();
});


/* GET command functions */
function processGetCommand(args: Array<string>): void {
  if (args.length === 1) {
    const key = args.shift()!;
    const value = getFromStore(key);
    if (value) {
      console.log(value);
    } else {
      console.log(`Key ${key} not set`);
    }
  } else {
    printInvalidArguments(CommandType.GET, args);
  }
}

function getFromStore(key: string): string | undefined {
  return kvStore.get(key);
}

/* SET command functions */
function processSetCommand(args: Array<string>): void {
  if (args.length >= 2) {
    const key = args.shift()!;
    const value = args.join(' ');
    setValueForKeyInStore(key, value);
  } else {
    printInvalidArguments(CommandType.SET, args);
  }
}

function setValueForKeyInStore(key: string, value: string): void {
  kvStore.set(key, value);
}

/* DELETE command functions */
function processDeleteCommand(args: Array<string>): void {
  if (args.length === 1) {
    const key = args.shift()!;
    deleteKeyFromStore(key);
  } else {
    printInvalidArguments(CommandType.DELETE, args);
  }
}

function deleteKeyFromStore(key: string): void {
  kvStore.delete(key);
}

/* BEGIN command functions */
function processBeginCommand(args: Array<string>): void {
  if (args.length === 0) {
    storeCurrentState();
  } else {
    printInvalidArguments(CommandType.BEGIN, args);
  }
}

function storeCurrentState() {
  const newMap = new Map<string, string>(kvStore);
  transactionStack.push(newMap);
}


/* COUNT command functions */
function processCountCommand(args: Array<string>): void {
  if (args.length > 0) {
    const value = args.join(' ');
    const countFound = countValuesInStore(value);
    console.log(countFound);
  } else {
    printInvalidArguments(CommandType.COUNT, args);
  }
}

function countValuesInStore(valueToFind: string): number {
  let count = 0;
  kvStore.forEach((value: string, key: string) => { if (value === valueToFind) count++; });
  return count;
}

/* COMMIT command functions */
function processCommitCommand(args: Array<string>): void {
  if (args.length === 0) {
    const transactionCommitted = commitTransaction();
    const transactionCommitMessage = transactionCommitted ? `Transaction committed successfully` : `No transactions to commit`;
    console.log(transactionCommitMessage); 
  } else {
    printInvalidArguments(CommandType.COMMIT, args);
  }
}

function commitTransaction(): boolean {
  return transactionStack.pop() ? true : false;
}

/* ROLLBACK command functions */
function processRollbackCommand(args: Array<string>): void {
  if (args.length === 0) {
    const stateRestored = rollBackState();
    const stateRestoredMessage = stateRestored ? `Transaction rolled back successfully` : `No transactions to roll back`;
    console.log(stateRestoredMessage);
  } else {
    printInvalidArguments(CommandType.ROLLBACK, args);
  }
}

function rollBackState(): boolean {
  const stateBeforeBegin = transactionStack.pop();
  if (stateBeforeBegin) {
    kvStore = new Map<string, string>(stateBeforeBegin);
    return true;
  } else {
    return false;
  }
}

/* Extra utility functions */
function printInvalidArguments(command: string, args: Array<string>): void {
  console.log(`Invalid use of ${command}: ${args.join(' ')}`);
}