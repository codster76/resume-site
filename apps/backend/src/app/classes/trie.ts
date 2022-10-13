import { TrieNode } from "./trie-node";

// Usage notes
// Basically, all you need to do is insert your data as strings through the insert method.
// 

export class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(wordToAdd: string) {
    let currentNode: TrieNode = this.root;

    // Iterate through each letter of the word and move down the trie
    for (const letter of wordToAdd) {
      // If the letter does not exist in the current trie node, add it
      if (!currentNode.containsKey(letter)) {
        currentNode.put(letter, new TrieNode());
      }
      // Move down the trie
      currentNode = currentNode.get(letter);
    }

    // Once you've finished iterating through the word, flag the final node as the end node
    // Potential issue here: this code might set the wrong node as the end
    currentNode.setEnd();
  }

  // Returns true if a full word is found, false otherwise. e.g. "bike" would return true if "bike"
  // exists in the trie, but "bi" would return false.
  search(wordToFind: string) {
    let currentNode: TrieNode = this.root;

    // Iterate through each letter of the word and move down the trie
    for (const letter of wordToFind) {
      // If you follow the trie down and a letter can't be found, it doesn't exist
      if (!currentNode.containsKey(letter)) {
        return false;
      }
      // Move down the trie
      currentNode = currentNode.get(letter);
    }

    // Check the final letter to see if it's a finished word
    return currentNode.isEnd();
  }

  // Returns true if the string exists within any word. e.g. "bike" would return true if "bike"
  // exists in the trie. "bi" would also return true because it exists within "bike".
  startsWith(wordToFind: string) {
    let currentNode: TrieNode = this.root;

    // Iterate through each letter of the word and move down the trie
    for (const letter of wordToFind) {
      // If you follow the trie down and a letter can't be found, it doesn't exist
      if (!currentNode.containsKey(letter)) {
        return false;
      }
      // Move down the trie
      currentNode = currentNode.get(letter);
    }

    return true;
  }

  // Stick a string in as an input, then perform a depth-first search from that node.
  // Returns the specified number of words starting with the input string.
  getAutoComplete(wordToFind: string, numberToSearch: number) {
    let currentNode: TrieNode = this.root;

    // Iterate through until the end of the word
    for (const letter of wordToFind) {
      // If you follow the trie down and a letter can't be found, it doesn't exist
      if (!currentNode.containsKey(letter)) {
        return [];
      }
      // Move down the trie
      currentNode = currentNode.get(letter);
    }

    // If you iterate through to the end of the word, it has no other letters and it is flagged as the end, return it
    if (currentNode.isEnd() && this.checkIfNoMorePaths(currentNode)) {
      return [wordToFind];
    }

    // From the current node, search for the specified number of results
    return this.depthFirstSearch(
      currentNode,
      wordToFind,
      '',
      [],
      numberToSearch
    );
  }

  depthFirstSearch(
    startingNode: TrieNode,
    stringToAddTo: string,
    nextChar: string,
    stringList: string[],
    resultsToSearchFor: number
  ) {
    // Append the current letter to the word
    stringToAddTo += nextChar;

    // Exit condition. Reached the end of a word
    if (startingNode.isEnd()) {
      stringList.push(stringToAddTo);
      if (this.checkIfNoMorePaths(startingNode)) {
        return;
      }
    }

    // Iterate through the current node's list
    for (const node of startingNode.nodeList) {
      // Stop once the number of words to search for is reached
      if (stringList.length >= resultsToSearchFor) {
        return stringList;
      }

      if (node) {
        // Recur
        this.depthFirstSearch(node, stringToAddTo, String.fromCharCode(startingNode.nodeList.indexOf(node) + 'a'.charCodeAt(0)), stringList, resultsToSearchFor);
      }
    }

    // Return the final list
    return stringList;
  }

  // Returns true if the current node is the end of a word.
  checkIfNoMorePaths(node: TrieNode) {
    let isEnd = true;
    for (const childNode of node.nodeList) {
      if (childNode) {
        isEnd = false;
        break;
      }
    }
    return isEnd;
  }
}
