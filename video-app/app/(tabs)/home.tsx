import { Pressable, StyleSheet, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';

import VideoList from '@/components/VideoList';
import { useRouter } from 'expo-router';

import SearchSvg from '@/assets/icons/search-icon.svg';
import SettingSvg from '@/assets/icons/settings-icon.svg';
import { CATEGORIES } from '@/store/services/youtubeApi';

function HomePage() {
  const router = useRouter();

  const handleSearch = () => {
    router.push('/search');
  };

  const handleShowMore = (categoryId: string) => {
    router.push(`/search?category=${categoryId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searhcBox}>
        <Pressable onPress={handleSearch}>
          <SearchSvg width={100} />
          <Text>Search videos</Text>
        </Pressable>
        <Pressable>
          <SettingSvg width={100} />
        </Pressable>
      </View>


      <ScrollView style={styles.scrollView} showsHorizontalScrollIndicator={false}>
        {CATEGORIES.map((category) => (
          <VideoList key={category.id} title={category.name} query={category.query} onShowMore={() => handleShowMore(category.id)}/>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searhcBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    gap: 12,
    paddingBottom: 16,
    justifyContent: 'space-around',
  },
  scrollView: {
    flex: 1,
  }
});

export default HomePage;
