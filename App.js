/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {useQuery, QueryClient, QueryClientProvider} from 'react-query';
import {persistQueryClient} from 'react-query/persistQueryClient-experimental';
import AsyncStorage from '@react-native-async-storage/async-storage';

const localStorageKey = `REACT_QUERY_OFFLINE_CACHE`;

const createAsyncStoragePersistor = () => {
  return {
    persistClient: persistedClient => {
      console.log(
        '🚀 ~ file: App.js ~ line 48 ~ createAsyncStoragePersistor ~ JSON.stringify(persistedClient)',
        JSON.stringify(persistedClient),
      );
      AsyncStorage.setItem(localStorageKey, JSON.stringify(persistedClient));
    },
    restoreClient: async () => {
      const cacheString = await AsyncStorage.getItem(localStorageKey);
      console.log(
        '🚀 ~ file: App.js ~ line 42 ~ createAsyncStoragePersistor ~ cacheString',
        cacheString,
      );

      if (!cacheString) {
        return;
      }
      AsyncStorage.removeItem(localStorageKey);

      return JSON.parse(cacheString);
    },
    removeClient: () => {
      AsyncStorage.removeItem(localStorageKey);
    },
  };
};

function throttle(func, wait = 100) {
  let timer = null;

  return function (...args) {
    if (timer === null) {
      timer = setTimeout(() => {
        func(...args);
        timer = null;
      }, wait);
    }
  };
}

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: 1000 * 60 * 60 * 24,
    },
  },
});
persistQueryClient({
  queryClient,
  persistor: createAsyncStoragePersistor(),
});

const Toto = () => {
  const [s, setS] = useState();

  const fetcha = async () => {
    const data = await queryClient.fetchQuery('todos', async () => {
      return new Promise(resolve => {
        resolve(Math.random());
      });
    });
    const a = await AsyncStorage.getItem(localStorageKey);
    const queryCache = queryClient.getQueryCache();
    console.log(data, a, queryCache.queries[0].state);

    setS(data);
  };

  console.log(s);

  return <Button onPress={fetcha} title="fetch" />;
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <QueryClientProvider client={queryClient}>
        <Toto />
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <Header />
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <Section title="Step One">
              Edit <Text style={styles.highlight}>App.js</Text> to change this
              screen and then come back to see your edits.
            </Section>
            <Section title="See Your Changes">
              <ReloadInstructions />
            </Section>
            <Section title="Debug">
              <DebugInstructions />
            </Section>
            <Section title="Learn More">
              Read the docs to discover what to do next:
            </Section>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </QueryClientProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
