import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import VideoCard from "@/components/VideoCard";
import SearchHeader from "@/components/SearchHeader";
import { useLazySearchVideosQuery } from "@/store/services/youtubeApi";
import SortModal, { SortOption } from "@/components/SortModal";

export default function Search() {
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const query = q as string;

  const [currentSort, setCurrentSort] = useState<SortOption>("rating");
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [triggerSearch, { data, isLoading, isError, error }] =
    useLazySearchVideosQuery();

  const videos = data?.items || [];
  const totalCount = data?.pageInfo.totalResults || 0;

  useEffect(() => {
    if (query) {
      triggerSearch({
        query,
        order: getApiOrder(currentSort),
      });
    }
  }, [query, triggerSearch, currentSort]);

  const handleVideoPress = (videoId: string) => {
    router.push(`/video/${videoId}`);
  };

  const handleSortPress = () => {
    setSortModalVisible(true);
  };

  const handleSelectSort = (sort: SortOption) => {
    setCurrentSort(sort);
  };

  const getSortText = (sort: SortOption) => {
    switch (sort) {
      case "date":
        return "Upload date: latest";
      case "date-oldest":
        return "Upload date: oldest";
      case "rating":
        return "Most popular";
      default:
        return "Most popular";
    }
  };

  const getApiOrder = (sort: SortOption): "date" | "rating" | "relevance" => {
    switch (sort) {
      case "date":
      case "date-oldest":
        return "date";
      case "rating":
        return "rating";
      default:
        return "relevance";
    }
  };

  const loadMore = () => {
    if (data?.nextPageToken && !isLoading) {
      triggerSearch({ query, pageToken: data.nextPageToken });
    }
  };

  if (!query) {
    return <View style={styles.container}></View>;
  }

  if (isLoading && videos.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2B2B40" />
      </View>
    );
  }

  if (error) {
    const msg = "Error during search";
    return (
      <View style={styles.container}>
        <Text style={styles.errorMsg}>{msg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id.videoId}
        ListHeaderComponent={() => (
          <SearchHeader
            count={totalCount}
            query={query}
            onSort={handleSortPress}
            sortText={getSortText(currentSort)}
          />
        )}
        renderItem={({ item }) => (
          <VideoCard video={item} onPress={handleVideoPress} />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />

      <SortModal
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        selectedSort={currentSort}
        onSelectSort={handleSelectSort}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  errorMsg: {
    fontSize: 18,
    color: "#888888",
  },
});
