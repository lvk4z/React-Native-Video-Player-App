import { useRouter, useGlobalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View, Text, TextInput } from 'react-native';
import SettingsIcon from '@/assets/icons/settings-icon.svg';
import SearchIcon from '@/assets/icons/search-icon.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

function Navbar() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const globalaQuery = useGlobalSearchParams();

  const [searchQuery, setSearchQuery] = useState(globalaQuery.q as string || '');

  useEffect(() => {
    const query = globalaQuery.q as string || '';
    if (searchQuery !== query) {
      setSearchQuery(query);
    }
  }, [globalaQuery.q])

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    router.push({
      pathname: "/(tabs)/search",
      params: {q: trimmed },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <View style={styles.searchBox}>
        <SearchIcon width={32} />
        <TextInput
          style={styles.searchInput}
          placeholder='Search videos'
          placeholderTextColor='#8F8F9D'
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType='search'
        />
      </View>
      <Pressable style={styles.settingsButton} onPress={() => router.push('/modal')}>
        <SettingsIcon width={32} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#FFFFFF',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 25,
      paddingBottom: 15,
      justifyContent: 'space-between',
    },
    settingsIcon: {
        marginRight: 1,

    },
    searchBox: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      height: 50,
      maxWidth: '80%',
      backgroundColor: '#FFFFFF',
      borderWidth: 2,      
      borderColor: '#2B2D42',
      paddingHorizontal: 15,
      borderRadius: 16,
    },
    searchInput: {
      flex: 1,
      height: '100%',
      color: '#2B2D42',
      fontSize: 16,
    },
    settingsButton: {
      padding: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
})

export default Navbar;