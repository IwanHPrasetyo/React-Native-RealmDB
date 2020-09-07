import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Button,
  TouchableOpacity,
  Pressable,
  Modal,
  TextInput,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import ListContact from '../Component/ListContact';
import {FlatList} from 'react-native-gesture-handler';
import Realm from 'realm';
import {
  BOOK_SCHEMA,
  PATH,
  PhoneBook,
  SCHEMA_VERSION,
} from '../../Realm/RealmSchema';

const {height, width} = Dimensions.get('window');

const Contact = () => {
  const [floating, setFloating] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [id, setId] = useState();
  const [nama, setNama] = useState();
  const [telfon, setTelfon] = useState();
  const [isChange, setIsChange] = useState(true);
  const [dataContact, setDataContact] = useState([]);

  const databaseOptions = {
    path: PATH,
    schema: [PhoneBook],
    schemaVersion: SCHEMA_VERSION,
  };

  useEffect(() => {
    Realm.open(databaseOptions).then(async (realm) => {
      setDataContact(realm.objects(BOOK_SCHEMA));
    });
  }, [isChange]);

  const getRealm = async () => {
    let data = await Realm.open(databaseOptions).then((realm) => {
      return realm.objects(BOOK_SCHEMA).length;
    });

    return data;
  };

  const addContact = async () => {
    let id = (await getRealm()) + 1;

    let data = {
      userId: parseInt(telfon) + id,
      name: nama,
      number: telfon,
      status: 'premium',
    };

    Realm.open(databaseOptions).then((realm) => {
      realm.write(() => {
        realm.create(BOOK_SCHEMA, data);
        Toast('Berhasil tambah data');
      });
    });
    setIsChange(!isChange);
    setModal(false);
  };

  const modalEditOpen = async (status, item) => {
    setModalEdit(status);
    setId(item.userId);
    setNama(item.name);
    setTelfon(item.number);
  };

  const updateContact = async () => {
    Realm.open(databaseOptions).then((realm) => {
      realm.write(() => {
        let data = realm.objects(BOOK_SCHEMA).filtered('userId =' + id);
        data.length > 0
          ? ((data[0].name = nama),
            (data[0].number = telfon),
            setModalEdit(false),
            setIsChange(!isChange),
            Toast('Berhasil Update Data'))
          : Toast('update gagal');
      });
    });
  };

  const Toast = (status) => {
    ToastAndroid.show(status, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
  };

  const deleteContact = async (userId) => {
    Realm.open(databaseOptions).then((realm) => {
      realm.write(() => {
        let data = realm.objects(BOOK_SCHEMA).filtered('userId =' + userId)
          .length;
        data > 0
          ? (realm.delete(
              realm.objects(BOOK_SCHEMA).filtered('userId =' + userId),
            ),
            Toast('Berhasil hapus data'))
          : Toast('data tidak ada');
      });
    });
    setIsChange(!isChange);
  };

  const showData = () => {
    console.log(dataContact);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dataContact}
        renderItem={({item, index}) => (
          <ListContact
            key={index}
            item={item}
            index={index}
            deleteContact={deleteContact}
            modalEditOpen={modalEditOpen}
          />
        )}
        style={styles}
        keyExtractor={(item, index) => 'key' + index}
      />
      <Pressable
        style={styles.floatingButton}
        onPress={() => {
          setFloating(!floating);
        }}>
        {floating ? (
          <Text style={[styles.font, {fontSize: 30}]}>-</Text>
        ) : (
          <Text style={[styles.font, {fontSize: 30}]}>+</Text>
        )}
      </Pressable>
      {floating ? (
        <>
          <Pressable
            style={[
              styles.floatingButton,
              {right: 159, width: 40, height: 40, bottom: 100},
            ]}
            onPress={() => {
              setModal(true);
              setFloating(false);
            }}>
            <Text style={styles.font}>Add</Text>
          </Pressable>
        </>
      ) : null}

      <Modal transparent={true} animationType="fade" visible={modal}>
        <View style={styles.modalMain}>
          <View style={styles.modalView}>
            <Text style={styles.fontTitle}>Tambah Kontak</Text>
            <TextInput
              onChangeText={(text) => {
                setNama(text);
              }}
              placeholder="Nama"
              style={styles.textModal}
            />
            <TextInput
              keyboardType="number-pad"
              onChangeText={(text) => {
                setTelfon(text);
              }}
              placeholder="Nomer Telfon"
              style={styles.textModal}
            />
            <Pressable
              onPress={() => {
                addContact();
              }}
              style={styles.buttonSimpan}>
              <Text style={styles.font}>Simpan</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setModal(false);
              }}
              style={styles.buttonBatal}>
              <Text style={[styles.font, {color: '#f53b57'}]}>Batal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal transparent={true} animationType="fade" visible={modalEdit}>
        <View style={styles.modalMain}>
          <View style={styles.modalView}>
            <Text style={styles.fontTitle}>Edit Kontak</Text>
            <TextInput
              value={nama}
              onChangeText={(text) => {
                setNama(text);
              }}
              placeholder="Nama"
              style={styles.textModal}
            />
            <TextInput
              value={telfon}
              keyboardType="number-pad"
              onChangeText={(text) => {
                setTelfon(text);
              }}
              placeholder="Nomer Telfon"
              style={styles.textModal}
            />
            <Pressable
              onPress={() => {
                updateContact();
              }}
              style={styles.buttonSimpan}>
              <Text style={styles.font}>Simpan</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setModalEdit(false);
              }}
              style={styles.buttonBatal}>
              <Text style={[styles.font, {color: '#f53b57'}]}>Batal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  floatingButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 50,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    right: 150,
    elevation: 2,
    backgroundColor: '#f53b57',
  },
  font: {fontWeight: 'bold', color: 'white'},
  fontTitle: {
    fontWeight: 'bold',
    color: '#f53b57',
    fontSize: 20,
    marginBottom: 20,
  },
  modalMain: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(30, 39, 46,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    height: 350,
    width: 300,
    borderRadius: 20,
    backgroundColor: '#fff',
    opacity: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textModal: {
    height: '12%',
    width: '80%',
    borderRadius: 5,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: '#afafaf',
    marginBottom: 10,
  },
  buttonSimpan: {
    width: '80%',
    height: '12%',
    borderRadius: 10,
    elevation: 2,
    marginBottom: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f53b57',
  },
  buttonBatal: {
    width: '80%',
    height: '12%',
    borderRadius: 10,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dff9fb',
  },
});

export default Contact;
