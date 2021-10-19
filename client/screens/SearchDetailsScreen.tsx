import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import {Avatar, Input, ThemeProvider} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {getAllQuests, questSelector} from '../redux/questSlice';
import {getUsers, stateSelector} from '../redux/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {elementsTheme} from '../styles/react-native-elements-theme-provider';

const SearchDetailsScreen = ({navigation}) => {
  const dispatch = useDispatch();
  let {quests} = useSelector(questSelector);
  let {usersList} = useSelector(stateSelector);
  let {user} = useSelector(stateSelector);
  usersList = usersList.filter(friend => friend.userName !== user.userName);
  const [questArray, setQuestArray] = useState([...quests]);
  const [usersArray, setUsersArray] = useState([...usersList]);
  const [searchFriends, setSearchFriends] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const {loading} = useSelector(stateSelector);
  const toggleSwitch = () => setSearchFriends(previousState => !previousState);

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('OtherUser', {id: item.id})}>
        <View style={styles.listItems}>
          <Avatar size="large" source={require('../assets/avatar.png')} />
          <Text>{item.userName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getQuests = async () => {
    dispatch(
      getAllQuests({
        api: {
          url: 'quests',
        },
      }),
    );
  };

  const getToken = async () => {
    return await AsyncStorage.getItem('token');
  };

  const getAllUsers = async () => {
    dispatch(
      getUsers({
        api: {
          url: 'users',
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        },
      }),
    );
  };

  useEffect(() => {
    getQuests();
    getAllUsers();
  }, []);

  const handleSearch = text => {
    setSearchVal(text);
    const re = new RegExp(text, 'i');
    if (searchFriends) {
      setUsersArray(usersList.filter(friend => re.test(friend.userName)));
    } else {
      setQuestArray(quests.filter(quest => re.test(quest.name)));
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        searchFriends ? (
          <>
            <Text>Friends</Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={searchFriends ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={searchFriends}
            />
          </>
        ) : (
          <>
            <Text>Quests</Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={searchFriends ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={searchFriends}
            />
          </>
        ),
    });
  });
  let renderList;
  if (searchFriends) renderList = searchVal ? usersArray : [];
  else renderList = searchVal ? questArray : quests;
  if (loading)
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.loader}>Loading...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  return (
    <View style={styles.content}>
      <ImageBackground
        style={{flex: 1}}
        source={require('../assets/mauve-stacked-waves-haikei.png')}>
        <ThemeProvider theme={elementsTheme}>
          <Input
            containerStyle={{marginTop: 10}}
            placeholder="Search..."
            inputStyle={styles.inputStyle}
            onChangeText={text => handleSearch(text)}
            value={searchVal}
          />
          {searchFriends ? (
            <>
              <Text style={styles.title}>All Users</Text>
              <FlatList
                data={renderList}
                numColumns={3}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            </>
          ) : (
            <>
              <Text style={styles.title}>All Quests</Text>

              <FlatList
                data={renderList}
                numColumns={3}
                keyExtractor={item => item.id}
                renderItem={({item}) => {
                  const setImage = () => {
                    if (item.category === 'Health')
                      return (
                        <Avatar
                          size="large"
                          source={require('../assets/heart.png')}
                        />
                      );
                    if (item.category === 'Spirtual')
                      return (
                        <Avatar
                          size="large"
                          source={require('../assets/spiritual.png')}
                        />
                      );
                    if (item.category === 'Mental')
                      return (
                        <Avatar
                          size="large"
                          source={require('../assets/mental.png')}
                        />
                      );
                    if (item.category === 'Financial')
                      return (
                        <Avatar
                          size="large"
                          source={require('../assets/financial.png')}
                        />
                      );
                  };
                  return (
                    <View style={styles.listItems}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('QuestDetailsScreen', {
                            id: item.id,
                          })
                        }>
                        {setImage()}
                        <Text style={styles.name}>{item.name}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </>
          )}
        </ThemeProvider>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  name: {
    width: 110,
    fontWeight: 'bold',
    justifyContent: 'center',
    // flexWrap: 'wrap',
  },
  listItems: {
    // paddingHorizontal: 5,
    paddingLeft: 25,
    paddingTop: 20,
    alignContent: 'center',
  },
  inputStyle: {
    borderColor: 'gray',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    color: 'red',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  loaderContainer: {
    marginTop: 100,
  },
  loader: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default SearchDetailsScreen;
