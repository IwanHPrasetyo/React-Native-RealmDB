import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Button,
  Pressable,
} from 'react-native';

const {height, width} = Dimensions.get('window');

const ListContact = ({item, index, deleteContact, modalEditOpen}) => {
  return (
    <View key={item.userId} style={styles.CardList}>
      <View style={{flex: 4, justifyContent: 'center'}}>
        <Text key={'name' + item.userId}>{item.name}</Text>
        <Text key={'number' + item.userId}>{item.number}</Text>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Pressable
          style={{
            borderRadius: 100,
            backgroundColor: '#3498db',
            height: '75%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            modalEditOpen(true, item);
          }}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Edit</Text>
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 10,
        }}>
        <Pressable
          style={{
            borderRadius: 100,
            backgroundColor: '#f39c12',
            height: '75%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            deleteContact(item.userId);
          }}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Hapus</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  CardList: {
    marginVertical: 5,
    borderRadius: 10,
    height: 60,
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    width: width * 0.9,
    elevation: 2,
  },
});

export default ListContact;
