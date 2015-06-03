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

