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

import Editor, {EU} from 'react-native-mentions-editor';
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
  {id: 1, name: 'Raza Dar', username: 'mrazadar'},
  {id: 3, name: 'Atif Rashid', username: 'atif.rashid'},
  {id: 4, name: 'Peter Pan', username: 'peter.pan'},
  {id: 5, name: 'John Doe', username: 'john.doe'},
  {id: 6, name: 'Meesha Shafi', username: 'meesha.shafi'},
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
    <>
      <View style={styles.main}>
        <View>
          <Button
            title="Reset"
            onPress={() => {
              setMessages([]);
              setTags([]);
              setRawText('');
              setFormattedText('');
              setShowSuggestions(false);
              setTracking(null);
            }}
          />
        </View>
        <KeyboardAvoidingView behavior="position">
          <View style={styles.container}>
            <Text>{rawText}</Text>
            <View style={styles.footer}>
              <View testID="main">
                {showSuggestions && (
                  <Animated.View>
                    <FlatList
                      style={{maxHeight: 100}}
                      data={suggestionList}
                      keyExtractor={item => `suggestion-${item.id}`}
                      renderItem={({index, item, separators}) => {
                        return (
                          <TouchableHighlight
                            onPress={() => {
                              const displayText = item.name || item.username;

                              // remove trigger key from current text
                              setRawText(
                                rawText.substring(0, tracking.offset) +
                                  displayText,
                              );

                              setTags(
                                tags.concat({
                                  id: item.id,
                                  name: displayText,
                                  offset: tracking.offset, // also count @
                                  length: displayText.length, // also count @
                                }),
                              );

                              setTracking(null);
                              setShowSuggestions(false);

                              inputRef.focus();
                            }}>
                            <View style={{backgroundColor: 'yellow'}}>
                              <Text>{`${item.id} - ${item.username} - ${
                                item.name
                              }`}</Text>
                            </View>
                          </TouchableHighlight>
                        );
                      }}
                    />
                  </Animated.View>
                )}
                <View testID="without-mentions" style={editorStyle.container}>
                  <ScrollView
                    ref={scroll => {
                      setScrollRef(scroll);
                    }}
                    onContentSizeChange={() => {
                      if (scrollRef) {
                        scrollRef.scrollToEnd({animated: true});
                      }
                    }}
                    keyboardShouldPersistTaps="always">
                    <View testID="editor" style={{height: editorHeight}}>
                      <View
                        testID="masked-input"
                        style={editorStyle.formmatedTextWrapper}>
                        <Text style={{backgroundColor: 'cyan'}}>
                          {formattedText}
                        </Text>
                      </View>
                      <TextInput
                        ref={inputRef => setInputRef(inputRef)}
                        style={editorStyle.input}
                        multiline
                        autoFocus
                        numberOfLines={100}
                        name={'message'}
                        value={rawText}
                        onSelectionChange={({nativeEvent}) => {
                          if (selections.length === 0) {
                            return setSelections([null, nativeEvent.selection]);
                          }

                          return setSelections([
                            selections.pop(),
                            nativeEvent.selection,
                          ]);
                        }}
                        onKeyPress={({nativeEvent}) => {
                          if (nativeEvent.key === triggerSuggestionKey) {
                            if (!tracking) {
                              setTracking({
                                offset: rawText.length,
                              });
                            }
                          }
                        }}
                        onChangeText={text => {
                          setRawText(text);

                          if (tracking) {
                            // check if user input look like someone's user or username
                            const keyword = text.substring(tracking.offset + 1);

                            if (keyword) {
                              const normalizedKeyword = keyword.toLowerCase();

                              const suggestions = users.filter(user => {
                                return (
                                  (user.name &&
                                    `${user.name}`
                                      .toLowerCase()
                                      .startsWith(normalizedKeyword)) ||
                                  (user.username &&
                                    `${user.username}`
                                      .toLowerCase()
                                      .startsWith(normalizedKeyword))
                                );
                              });

                              // if can't find any matching users, probably they aren't trying to tag anyone, disable tracking
                              if (suggestions.length > 0) {
                                setSuggestionList(suggestions);
                                setShowSuggestions(true);
                              } else {
                                setShowSuggestions(false);
                              }
                            }
                          }
                        }}
                        scrollEnabled={false}
                      />
                    </View>
                  </ScrollView>
                </View>
              </View>

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
    </>
  );
};

export default App;
