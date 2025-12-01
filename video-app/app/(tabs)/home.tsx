import { StyleSheet, ScrollView } from 'react-native';
import { View } from '@/components/Themed';

import VideoList from '@/components/VideoList';
import { useRouter } from 'expo-router';
import { CATEGORIES } from '@/store/services/youtubeApi';

function HomePage() {
  const router = useRouter();

  const handleShowMore = (categoryId: string) => {
    router.push(`/search?category=${categoryId}`);
  };

  return (
    <View style={styles.container}>
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
  scrollView: {
    flex: 1,
  }
});

export default HomePage;
