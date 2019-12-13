/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState} from 'react';
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
    Animated
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
    width: '100%',
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
  const [tagged, setTagged] = useState({});
  const [clearInput, setClearInput] = useState(false);
  const [showEditor, setShowEditor] = useState(true);
  const [showMentions, setShowMentions] = useState(true);
  const [message, setMessage] = useState('');
  const [scrollRef, setScrollRef] = useState(null);
  const [rawText, setRawText] = useState('');
  const [formattedText, setFormattedText] = useState('');

  const triggerSuggestionKey = '@';

  const editorHeight = 100;
  return (
    <>
      <View style={styles.main}>
        <View>
          <Button title="Reset" onPress={() => setMessages([])} />
        </View>
        <KeyboardAvoidingView behavior="position">
          <View style={styles.container}>
            {renderMessageList(messages)}
            <View style={styles.footer}>
              <View testID="main">
                {showMentions && (
                  <Animated.View>
                    <FlatList
                      style={{ maxHeight: 100 }}
                      getItemCount={data => data.length}
                      data={users}
                      getItem={(data, index) => data[index]}
                      keyExtractor={item => `suggestion-${item.id}`}
                      renderItem={item => {
                        return (
                          <TouchableHighlight
                            onPress={() => {
                              setTagged({
                                ...tagged,
                                [item.id]: {
                                  text: item.name || item.username,
                                },
                              });
                            }}>
                            <View style={{backgroundColor: 'white'}}>
                              <Text>{item.title}</Text>
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
                    }}>
                    <View testID="editor" style={{height: editorHeight}}>
                      <View
                        testID="masked-input"
                        style={editorStyle.formmatedTextWrapper}>
                        <Text style={editorStyle.formmatedText}>
                          {formattedText}
                        </Text>
                      </View>
                      <TextInput
                        style={editorStyle.input}
                        multiline
                        autoFocus
                        numberOfLines={100}
                        name={'message'}
                        value={rawText}
                        onKeyPress={key => {
                          if (key === triggerSuggestionKey) {
                            if (!showMentions) {
                              setShowMentions(true);
                            }
                          }
                        }}
                        onChangeText={text => {
                          console.log(text);
                          setRawText(text);
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
