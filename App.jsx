import React, { useState, useEffect } from 'react';
import { View, Text, PermissionsAndroid, Alert, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import CallLogs from 'react-native-call-log';
import moment from 'moment'
const formatDuration = duration => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration - hours * 3600) / 60);
  const seconds = duration - hours * 3600 - minutes * 60;
  return `${hours}:${minutes}:${seconds}`;
};

const App = () => {
  const [callLogs, setCallLogs] = useState([]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
          {
            title: 'Call Log Example',
            message:
              'Access your call logs',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

          CallLogs.load(40).then(c => {
            console.log(c)
            setCallLogs(c)
          });
        } else {
          Alert.prompt('Call Log permission denied');
        }
      }
      catch (e) {
        console.log(e);
      } finally {
        setLoading(false)
      }
    })()
  }, []);
  const Item = ({ call }) => (
    <View style={styles.callContainer} >
      <Text style={styles.callNumber}>{call.name}</Text>
      <Text style={styles.callNumber}>{call.phoneNumber}</Text>
      <Text style={styles.callType}>{call.callType}</Text>
      <Text style={styles.callDate}>
        {moment(call.date).format('MMM DD, YYYY hh:mm:ss A')}
      </Text>
      <Text style={styles.callDuration}>
        {formatDuration(call.duration)}
      </Text>
    </View>
  );
  return (
    // <View style={styles.container}>
    //   <Text style={styles.header}>Call Log</Text>
    //   {loading && <Text style={styles.callNumber}>Loading call logs...</Text>}
    //   {callLogs.map(call => (
    //     <View key={call.timestamp} style={styles.callContainer}>
    //       <Text style={styles.callNumber}>{call.name}</Text>
    //       <Text style={styles.callNumber}>{call.phoneNumber}</Text>
    //       <Text style={styles.callType}>{call.callType}</Text>
    //       <Text style={styles.callDate}>
    //         {moment(call.date).format('MMM DD, YYYY hh:mm:ss A')}
    //       </Text>
    //       <Text style={styles.callDuration}>
    //         {formatDuration(call.duration)}
    //       </Text>
    //     </View>
    //   ))}
    // </View>
    <SafeAreaView >
     
      {
        loading && <View style={styles.container}>
          <Text style={styles.header}>Loading call logs...</Text>
        </View>
      }
      {
        !loading &&
        <View>
            <View >
              <Text style={styles.header}>Call logs</Text>
            </View>
          <FlatList

            data={callLogs}
            renderItem={({ item }) => <Item call={item} />}
            keyExtractor={item => item.timestamp}

          />
        </View>
       
      }
      {
        loading && callLogs.length<=0 && <View style={styles.container}>
          <Text style={styles.header}>Not Found</Text>
        </View>
      }
      
      

    </SafeAreaView>

  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign:'center'
  },
  callContainer: {
    // width: '100%',
    flex:1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
  },
  callNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  callType: {
    fontSize: 16,
    marginBottom: 5,
  },
  callDate: {
    fontSize: 14,
    marginBottom: 5,
  },
  callDuration: {
    fontSize: 14,
  },
});
