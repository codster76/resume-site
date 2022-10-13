export class TrieNode {
    nodeList: TrieNode[] = new Array(26);
    end = false;
  
    // This currently only works with lower case characters from a to z. If you want to work with more
    // characters, a lookup table is probably necessary.
    containsKey(character: string) {
      if (this.nodeList[character.charCodeAt(0) - 'a'.charCodeAt(0)]) {
        return true;
      } else {
        return false;
      }
    }
  
    get(character: string) {
      return this.nodeList[character.charCodeAt(0) - 'a'.charCodeAt(0)];
    }
  
    put(character: string, trieNode: TrieNode) {
      this.nodeList[character.charCodeAt(0) - 'a'.charCodeAt(0)] = trieNode;
    }
  
    setEnd() {
      this.end = true;
    }
  
    isEnd() {
      return this.end;
    }
  
    printNodeList() {
      for (const node of this.nodeList) {
        if (node) {
          console.log(
            String.fromCharCode(this.nodeList.indexOf(node) + 'a'.charCodeAt(0))
          );
        }
      }
    }
  }
  