var Trie = {}

Trie.newNode = function() {
	return {
		children : {},
		leaf: false,
		word: undefined
	};
};

Trie.insertWord = function(node, word, fullWord) {
	fullWord = (fullWord !== undefined) ? fullWord : word;
	var firstLetter = word.charAt(0);

	if ( node.children[firstLetter] === undefined ) {
		node.children[firstLetter] = Trie.newNode();
	}

	if (word.length > 1) {
		var tail = word.slice(1);
		Trie.insertWord(node.children[firstLetter], tail, fullWord);
	} else {
		node.children[firstLetter].leaf = true;
		node.children[firstLetter].word = fullWord;
	}
};

Trie.checkWord = function(node, word) {
	var firstLetter = word.charAt(0);
	var tail = word.slice(1);
	var isWordInNode = false;

	if ( node.children[firstLetter] != undefined) {
		if (word.length > 1) {
			isWordInNode = Trie.checkWord(node.children[firstLetter], tail);
		} else {
			if (node.children[firstLetter].leaf === true) {
				isWordInNode = true;
			}
		}
	} 

	return isWordInNode;
};

Trie.getSuggestions = function(node, word) {
	var highestNode = findHighestNodeForWord(node, word);
	var suggestions = suggestWords(highestNode);
	return suggestions;
};

findHighestNodeForWord = function(node, word) {
	var currentNode = node;
	while (word.length > 0) {
		var firstLetter = word.charAt(0);
		if (currentNode.children[firstLetter] != undefined) {
			currentNode = currentNode.children[firstLetter];	
		} else {
			return currentNode;
		}
		word = word.slice(1);
	}
	return currentNode;
};

suggestWords = function(node, suggestions) {
	var suggestions = (suggestions) ? suggestions : [];

	if (node.leaf === true) {
		suggestions.push(node.word);
	}

	var currentChildKeys = Object.keys(node.children);

	if (currentChildKeys.length > 0) {
		currentChildKeys.forEach( function(key) {
			suggestWords( node.children[key], suggestions );
		});
	}

	return suggestions;
};

module.exports = Trie;
