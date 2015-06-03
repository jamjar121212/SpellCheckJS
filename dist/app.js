(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
var Trie = require("./Trie");

var DICTIONARY_PATH = "dictionaries/dictionary";

var DICTIONARY_LOADING_MESSAGE = "loading dictionary...";
var DICTIONARY_LOADED_MESSAGE = "dictionary loaded.";
var DICTIONARY_ERROR_MESSAGE = "error loading dictionary: ";

var WORD_FOUND_COLOUR = "black";
var WORD_NOT_FOUND_COLOUR = "red";

var MAX_SUGGESTIONS = 5;

var inputField = $( "#input" )
var outputField = $( "#output" )

var DictionaryRoot = Trie.newNode();

// utility functions
var wordLength = function(a, b) {
	return b.length - a.length;
};

var inverseWordLength = function(a, b) {
	return wordLength(b, a);
};

var resetOutputField = function() {
	setOutputFieldMessage("");
	inputField.css("color", WORD_FOUND_COLOUR);
};

var setOutputFieldMessage = function(message) {
	outputField.text(message);
};


// dictionary loading functions
var loadDictionary = function( callback ) {
	$.ajax( DICTIONARY_PATH )
		.success(function(data) {
			callback(data);
		})
		.fail(function() {
			alert( DICTIONARY_ERROR_MESSAGE + DICTIONARY_PATH );
		});
};

var onDictionaryLoaded = function(dictionaryText) {
	var words = dictionaryText.split( "\n" );

	for (i= 0; i < words.length; i++) {
		Trie.insertWord( DictionaryRoot, words[i] );
	}

	setOutputFieldMessage(DICTIONARY_LOADED_MESSAGE);
	inputField.on("input", onInputChanged);
};


// callback executed when the input field changes (only after the dictionary has loaded)
var onInputChanged = function(e) {
	var word = e.target.value;

	if (word.length === 0) {
		resetOutputField();
		return; 
	}

	var suggestions = Trie.getSuggestions( DictionaryRoot, word );
	suggestions.sort( inverseWordLength );

	if ( Trie.checkWord( DictionaryRoot, word ) ) {
		// if the word is in the dictionary, it will be first on the suggestion list, so we can slice it off
		inputField.css("color", WORD_FOUND_COLOUR);
		suggestions = suggestions.slice(1, MAX_SUGGESTIONS);
	} else {
		// if the word is not in the dictionary, just take  all the suggestions.
		inputField.css("color", WORD_NOT_FOUND_COLOUR);
		suggestions = suggestions.slice(0, MAX_SUGGESTIONS);
	}

	if (suggestions) {
		setOutputFieldMessage(suggestions);	
	} else {
		setOutputFieldMessage(word);	
	}
};


// start the dictionary load process
setOutputFieldMessage(DICTIONARY_LOADING_MESSAGE);
loadDictionary( onDictionaryLoaded );


},{"./Trie":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9UcmllLmpzIiwianMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBUcmllID0ge31cblxuVHJpZS5uZXdOb2RlID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0Y2hpbGRyZW4gOiB7fSxcblx0XHRsZWFmOiBmYWxzZSxcblx0XHR3b3JkOiB1bmRlZmluZWRcblx0fTtcbn07XG5cblRyaWUuaW5zZXJ0V29yZCA9IGZ1bmN0aW9uKG5vZGUsIHdvcmQsIGZ1bGxXb3JkKSB7XG5cdGZ1bGxXb3JkID0gKGZ1bGxXb3JkICE9PSB1bmRlZmluZWQpID8gZnVsbFdvcmQgOiB3b3JkO1xuXHR2YXIgZmlyc3RMZXR0ZXIgPSB3b3JkLmNoYXJBdCgwKTtcblxuXHRpZiAoIG5vZGUuY2hpbGRyZW5bZmlyc3RMZXR0ZXJdID09PSB1bmRlZmluZWQgKSB7XG5cdFx0bm9kZS5jaGlsZHJlbltmaXJzdExldHRlcl0gPSBUcmllLm5ld05vZGUoKTtcblx0fVxuXG5cdGlmICh3b3JkLmxlbmd0aCA+IDEpIHtcblx0XHR2YXIgdGFpbCA9IHdvcmQuc2xpY2UoMSk7XG5cdFx0VHJpZS5pbnNlcnRXb3JkKG5vZGUuY2hpbGRyZW5bZmlyc3RMZXR0ZXJdLCB0YWlsLCBmdWxsV29yZCk7XG5cdH0gZWxzZSB7XG5cdFx0bm9kZS5jaGlsZHJlbltmaXJzdExldHRlcl0ubGVhZiA9IHRydWU7XG5cdFx0bm9kZS5jaGlsZHJlbltmaXJzdExldHRlcl0ud29yZCA9IGZ1bGxXb3JkO1xuXHR9XG59O1xuXG5UcmllLmNoZWNrV29yZCA9IGZ1bmN0aW9uKG5vZGUsIHdvcmQpIHtcblx0dmFyIGZpcnN0TGV0dGVyID0gd29yZC5jaGFyQXQoMCk7XG5cdHZhciB0YWlsID0gd29yZC5zbGljZSgxKTtcblx0dmFyIGlzV29yZEluTm9kZSA9IGZhbHNlO1xuXG5cdGlmICggbm9kZS5jaGlsZHJlbltmaXJzdExldHRlcl0gIT0gdW5kZWZpbmVkKSB7XG5cdFx0aWYgKHdvcmQubGVuZ3RoID4gMSkge1xuXHRcdFx0aXNXb3JkSW5Ob2RlID0gVHJpZS5jaGVja1dvcmQobm9kZS5jaGlsZHJlbltmaXJzdExldHRlcl0sIHRhaWwpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAobm9kZS5jaGlsZHJlbltmaXJzdExldHRlcl0ubGVhZiA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRpc1dvcmRJbk5vZGUgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBcblxuXHRyZXR1cm4gaXNXb3JkSW5Ob2RlO1xufTtcblxuVHJpZS5nZXRTdWdnZXN0aW9ucyA9IGZ1bmN0aW9uKG5vZGUsIHdvcmQpIHtcblx0dmFyIGhpZ2hlc3ROb2RlID0gZmluZEhpZ2hlc3ROb2RlRm9yV29yZChub2RlLCB3b3JkKTtcblx0dmFyIHN1Z2dlc3Rpb25zID0gc3VnZ2VzdFdvcmRzKGhpZ2hlc3ROb2RlKTtcblx0cmV0dXJuIHN1Z2dlc3Rpb25zO1xufTtcblxuZmluZEhpZ2hlc3ROb2RlRm9yV29yZCA9IGZ1bmN0aW9uKG5vZGUsIHdvcmQpIHtcblx0dmFyIGN1cnJlbnROb2RlID0gbm9kZTtcblx0d2hpbGUgKHdvcmQubGVuZ3RoID4gMCkge1xuXHRcdHZhciBmaXJzdExldHRlciA9IHdvcmQuY2hhckF0KDApO1xuXHRcdGlmIChjdXJyZW50Tm9kZS5jaGlsZHJlbltmaXJzdExldHRlcl0gIT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLmNoaWxkcmVuW2ZpcnN0TGV0dGVyXTtcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gY3VycmVudE5vZGU7XG5cdFx0fVxuXHRcdHdvcmQgPSB3b3JkLnNsaWNlKDEpO1xuXHR9XG5cdHJldHVybiBjdXJyZW50Tm9kZTtcbn07XG5cbnN1Z2dlc3RXb3JkcyA9IGZ1bmN0aW9uKG5vZGUsIHN1Z2dlc3Rpb25zKSB7XG5cdHZhciBzdWdnZXN0aW9ucyA9IChzdWdnZXN0aW9ucykgPyBzdWdnZXN0aW9ucyA6IFtdO1xuXG5cdGlmIChub2RlLmxlYWYgPT09IHRydWUpIHtcblx0XHRzdWdnZXN0aW9ucy5wdXNoKG5vZGUud29yZCk7XG5cdH1cblxuXHR2YXIgY3VycmVudENoaWxkS2V5cyA9IE9iamVjdC5rZXlzKG5vZGUuY2hpbGRyZW4pO1xuXG5cdGlmIChjdXJyZW50Q2hpbGRLZXlzLmxlbmd0aCA+IDApIHtcblx0XHRjdXJyZW50Q2hpbGRLZXlzLmZvckVhY2goIGZ1bmN0aW9uKGtleSkge1xuXHRcdFx0c3VnZ2VzdFdvcmRzKCBub2RlLmNoaWxkcmVuW2tleV0sIHN1Z2dlc3Rpb25zICk7XG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4gc3VnZ2VzdGlvbnM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyaWU7XG4iLCJ2YXIgVHJpZSA9IHJlcXVpcmUoXCIuL1RyaWVcIik7XG5cbnZhciBESUNUSU9OQVJZX1BBVEggPSBcImRpY3Rpb25hcmllcy9kaWN0aW9uYXJ5XCI7XG5cbnZhciBESUNUSU9OQVJZX0xPQURJTkdfTUVTU0FHRSA9IFwibG9hZGluZyBkaWN0aW9uYXJ5Li4uXCI7XG52YXIgRElDVElPTkFSWV9MT0FERURfTUVTU0FHRSA9IFwiZGljdGlvbmFyeSBsb2FkZWQuXCI7XG52YXIgRElDVElPTkFSWV9FUlJPUl9NRVNTQUdFID0gXCJlcnJvciBsb2FkaW5nIGRpY3Rpb25hcnk6IFwiO1xuXG52YXIgV09SRF9GT1VORF9DT0xPVVIgPSBcImJsYWNrXCI7XG52YXIgV09SRF9OT1RfRk9VTkRfQ09MT1VSID0gXCJyZWRcIjtcblxudmFyIE1BWF9TVUdHRVNUSU9OUyA9IDU7XG5cbnZhciBpbnB1dEZpZWxkID0gJCggXCIjaW5wdXRcIiApXG52YXIgb3V0cHV0RmllbGQgPSAkKCBcIiNvdXRwdXRcIiApXG5cbnZhciBEaWN0aW9uYXJ5Um9vdCA9IFRyaWUubmV3Tm9kZSgpO1xuXG4vLyB1dGlsaXR5IGZ1bmN0aW9uc1xudmFyIHdvcmRMZW5ndGggPSBmdW5jdGlvbihhLCBiKSB7XG5cdHJldHVybiBiLmxlbmd0aCAtIGEubGVuZ3RoO1xufTtcblxudmFyIGludmVyc2VXb3JkTGVuZ3RoID0gZnVuY3Rpb24oYSwgYikge1xuXHRyZXR1cm4gd29yZExlbmd0aChiLCBhKTtcbn07XG5cbnZhciByZXNldE91dHB1dEZpZWxkID0gZnVuY3Rpb24oKSB7XG5cdHNldE91dHB1dEZpZWxkTWVzc2FnZShcIlwiKTtcblx0aW5wdXRGaWVsZC5jc3MoXCJjb2xvclwiLCBXT1JEX0ZPVU5EX0NPTE9VUik7XG59O1xuXG52YXIgc2V0T3V0cHV0RmllbGRNZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSkge1xuXHRvdXRwdXRGaWVsZC50ZXh0KG1lc3NhZ2UpO1xufTtcblxuXG4vLyBkaWN0aW9uYXJ5IGxvYWRpbmcgZnVuY3Rpb25zXG52YXIgbG9hZERpY3Rpb25hcnkgPSBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XG5cdCQuYWpheCggRElDVElPTkFSWV9QQVRIIClcblx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRjYWxsYmFjayhkYXRhKTtcblx0XHR9KVxuXHRcdC5mYWlsKGZ1bmN0aW9uKCkge1xuXHRcdFx0YWxlcnQoIERJQ1RJT05BUllfRVJST1JfTUVTU0FHRSArIERJQ1RJT05BUllfUEFUSCApO1xuXHRcdH0pO1xufTtcblxudmFyIG9uRGljdGlvbmFyeUxvYWRlZCA9IGZ1bmN0aW9uKGRpY3Rpb25hcnlUZXh0KSB7XG5cdHZhciB3b3JkcyA9IGRpY3Rpb25hcnlUZXh0LnNwbGl0KCBcIlxcblwiICk7XG5cblx0Zm9yIChpPSAwOyBpIDwgd29yZHMubGVuZ3RoOyBpKyspIHtcblx0XHRUcmllLmluc2VydFdvcmQoIERpY3Rpb25hcnlSb290LCB3b3Jkc1tpXSApO1xuXHR9XG5cblx0c2V0T3V0cHV0RmllbGRNZXNzYWdlKERJQ1RJT05BUllfTE9BREVEX01FU1NBR0UpO1xuXHRpbnB1dEZpZWxkLm9uKFwiaW5wdXRcIiwgb25JbnB1dENoYW5nZWQpO1xufTtcblxuXG4vLyBjYWxsYmFjayBleGVjdXRlZCB3aGVuIHRoZSBpbnB1dCBmaWVsZCBjaGFuZ2VzIChvbmx5IGFmdGVyIHRoZSBkaWN0aW9uYXJ5IGhhcyBsb2FkZWQpXG52YXIgb25JbnB1dENoYW5nZWQgPSBmdW5jdGlvbihlKSB7XG5cdHZhciB3b3JkID0gZS50YXJnZXQudmFsdWU7XG5cblx0aWYgKHdvcmQubGVuZ3RoID09PSAwKSB7XG5cdFx0cmVzZXRPdXRwdXRGaWVsZCgpO1xuXHRcdHJldHVybjsgXG5cdH1cblxuXHR2YXIgc3VnZ2VzdGlvbnMgPSBUcmllLmdldFN1Z2dlc3Rpb25zKCBEaWN0aW9uYXJ5Um9vdCwgd29yZCApO1xuXHRzdWdnZXN0aW9ucy5zb3J0KCBpbnZlcnNlV29yZExlbmd0aCApO1xuXG5cdGlmICggVHJpZS5jaGVja1dvcmQoIERpY3Rpb25hcnlSb290LCB3b3JkICkgKSB7XG5cdFx0Ly8gaWYgdGhlIHdvcmQgaXMgaW4gdGhlIGRpY3Rpb25hcnksIGl0IHdpbGwgYmUgZmlyc3Qgb24gdGhlIHN1Z2dlc3Rpb24gbGlzdCwgc28gd2UgY2FuIHNsaWNlIGl0IG9mZlxuXHRcdGlucHV0RmllbGQuY3NzKFwiY29sb3JcIiwgV09SRF9GT1VORF9DT0xPVVIpO1xuXHRcdHN1Z2dlc3Rpb25zID0gc3VnZ2VzdGlvbnMuc2xpY2UoMSwgTUFYX1NVR0dFU1RJT05TKTtcblx0fSBlbHNlIHtcblx0XHQvLyBpZiB0aGUgd29yZCBpcyBub3QgaW4gdGhlIGRpY3Rpb25hcnksIGp1c3QgdGFrZSAgYWxsIHRoZSBzdWdnZXN0aW9ucy5cblx0XHRpbnB1dEZpZWxkLmNzcyhcImNvbG9yXCIsIFdPUkRfTk9UX0ZPVU5EX0NPTE9VUik7XG5cdFx0c3VnZ2VzdGlvbnMgPSBzdWdnZXN0aW9ucy5zbGljZSgwLCBNQVhfU1VHR0VTVElPTlMpO1xuXHR9XG5cblx0aWYgKHN1Z2dlc3Rpb25zKSB7XG5cdFx0c2V0T3V0cHV0RmllbGRNZXNzYWdlKHN1Z2dlc3Rpb25zKTtcdFxuXHR9IGVsc2Uge1xuXHRcdHNldE91dHB1dEZpZWxkTWVzc2FnZSh3b3JkKTtcdFxuXHR9XG59O1xuXG5cbi8vIHN0YXJ0IHRoZSBkaWN0aW9uYXJ5IGxvYWQgcHJvY2Vzc1xuc2V0T3V0cHV0RmllbGRNZXNzYWdlKERJQ1RJT05BUllfTE9BRElOR19NRVNTQUdFKTtcbmxvYWREaWN0aW9uYXJ5KCBvbkRpY3Rpb25hcnlMb2FkZWQgKTtcblxuIl19
