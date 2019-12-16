/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Editor, {EU} from './Mentions';
import styles from './styles';

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
        const {item: message} = rowData;

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
  const [clearInput, setClearInput] = useState(false);

  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

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
