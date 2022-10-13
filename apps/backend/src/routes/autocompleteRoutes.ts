import express from 'express';
import { Trie } from '../app/classes/trie';
import { sampleDataAsArray } from '../assets/SampleData';

const router = express.Router();
const trie: Trie = new Trie();
populateTrie();

router.get('/:autocompleteRequest/:numberOfResults', (req: any, res: any) => {
  res.send(
    trie.getAutoComplete(
      req.params.autocompleteRequest,
      req.params.numberOfResults
    )
  );
});

function populateTrie() {
  console.log('run again?');
  for (const word of sampleDataAsArray) {
    trie.insert(word);
  }
}

export default router;
