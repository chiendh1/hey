/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Button,
  TextInput,
  TouchableHighlight,
  Animated,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Editor, {EU} from './Mentions';
import styles from './styles';
import {updateTags} from './lib';

const editorStyle = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderColor: 'green',
    borderWidth: 1,
    width: 300,
  },
  textContainer: {
    alignSelf: 'stretch',
    position: 'relative',
    minHeight: 40,
    maxHeight: 140,
  },
  input: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
    paddingHorizontal: 20,
    minHeight: 40,
    position: 'absolute',
    top: 0,
    // color: 'transparent',
    alignSelf: 'stretch',
    width: '100%',
  },
  formmatedTextWrapper: {
    minHeight: 40,
    position: 'absolute',
    top: 0,
    paddingHorizontal: 20,
    paddingVertical: 5,
    // width: '100%',
  },
  formmatedText: {
    fontSize: 16,
    fontWeight: '400',
  },
  mention: {
    fontSize: 16,
    fontWeight: '400',
    backgroundColor: 'rgba(36, 77, 201, 0.05)',
    color: '#244dc9',
  },
  placeholderText: {
    color: 'rgba(0, 0, 0, 0.1)',
    fontSize: 16,
  },
});

const users = [
  {id: 1, name: 'Raza Dar', username: 'mrazadar', gender: 'male'},
  {id: 3, name: 'Atif Rashid', username: 'atif.rashid', gender: 'male'},
  {id: 4, name: 'Peter Pan', username: 'peter.pan', gender: 'male'},
  {id: 5, name: 'John Doe', username: 'john.doe', gender: 'male'},
  {id: 6, name: 'Meesha Shafi', username: 'meesha.shafi', gender: 'female'},
];

const formatMentionNode = (txt, key) => (
  <Text key={key} style={styles.mention}>
    {txt}
  </Text>
);

const renderMessageList = messages => {
  return (
    <FlatList
      style={styles.messageList}
      keyboardShouldPersistTaps={'always'}
      horizontal={false}
      inverted
      enableEmptySections={true}
      data={messages}
      keyExtractor={(message, index) => `${message.text}-${index}`}
      renderItem={rowData => {
        const {item: message, index} = rowData;

        return (
          <View style={styles.messageListItem}>
            <Text style={styles.messageText}>
              {EU.displayTextWithMentions(message.text, formatMentionNode)}
            </Text>
          </View>
        );
      }}
    />
  );
};
const App: () => React$Node = () => {
  const [messages, setMessages] = useState([]);
  const [tags, setTags] = useState([]);
  const [clearInput, setClearInput] = useState(false);

  const [message, setMessage] = useState('');
  const [scrollRef, setScrollRef] = useState(null);
  const [inputRef, setInputRef] = useState(null);
  const [rawText, setRawText] = useState('');
  const [formattedText, setFormattedText] = useState('');

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionList, setSuggestionList] = useState([]);

  // cursor selection before & after a change
  const [selections, setSelections] = useState([]);
  // show whether user is trying to tag someone
  const [tracking, setTracking] = useState(null);

  const triggerSuggestionKey = '@';

  const editorHeight = 100;

  useEffect(() => {
    const updated = updateTags(tags, selections);

    return setTags(updated);
  }, [rawText]);

  console.log(selections);

  return (
    <View style={styles.main}>
      <KeyboardAvoidingView behavior="position">
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.heading}>React-Native Mentions Package</Text>
            <Text style={styles.sub}>Built by @mrazadar</Text>
          </View>
          <ScrollView style={styles.messageList}>
            {renderMessageList(messages)}
          </ScrollView>
          <View style={styles.footer}>
            <Editor
              list={users}
              clearInput={clearInput}
              onChange={text => {
                setMessage(text);
                setClearInput(false);
              }}
              showEditor={true}
              showMentions={showSuggestions}
              onHideMentions={() => {
                setShowSuggestions(false);
              }}
              placeholder="You can write here..."
              transformMentionText={user => user.name || user.username}
            />
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={() => {
                setMessages(messages.concat(message));
                setMessage('');
                setClearInput(true);
              }}>
              <Text style={styles.sendBtnText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default App;
