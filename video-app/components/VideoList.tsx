import {
  View,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSearchVideosQuery } from "@/store/services/youtubeApi";
import { useRouter } from "expo-router";
import { PText } from "@/components/StyledText";

interface VideoListProps {
  title: string;
  query: string;
  onShowMore: () => void;
}

function VideoList({ title, query, onShowMore }: VideoListProps) {
  const router = useRouter();

  const { data, isLoading, error, refetch } = useSearchVideosQuery({
    query,
    maxResults: 6,
  });

  const handleVideoPress = (videoId: string) => {
    router.push(`/video/${videoId}`);
  };

  if (error) {
    return (
      <View style={styles.container}>
        <View>
          <PText style={styles.title}>{title}</PText>
        </View>
        <Pressable onPress={refetch}>
          <PText>Failded to load</PText>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <PText style={styles.title}>{title}</PText>
        <Pressable onPress={onShowMore}>
          <PText style={styles.showMore}>Show more</PText>
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.container}>
          <ActivityIndicator size="large"/>
          <PText>Loading videos...</PText>
        </View>
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={data?.items || []}
          keyExtractor={(item) => item.id.videoId}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.videoCard}
              onPress={() => handleVideoPress(item.id.videoId)}
            >
              <View style={styles.thumbnailBox}>
                <Image
                  source={{ uri: item.snippet.thumbnails.medium.url }}
                  style={styles.thumbnail}
                />
                <View>
                  <PText>1:00:00</PText>
                </View>
              </View>
              <View style={styles.info}>
                <PText style={styles.videoTitle} numberOfLines={2}>
                  {item.snippet.title}
                </PText>
                <PText>{item.snippet.channelTitle}</PText>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  videoCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    width: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  showMore: {
    color: "#2B2D42",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
    textDecorationColor: "#2B2D42",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 15
  },
  listContent: {
    paddingLeft: 16,
  },
  thumbnailBox: {
    position: "relative",
    width: 180,
    height: 180 / (16/9),
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#E0E0E0",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  info: {
    marginTop: 8,
  },
  videoTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1a1a2e",
    marginBottom: 4,
    lineHeight: 16,
  },
  divider: {
    height: 2,
    backgroundColor: "#2B2D42",
  }
});

export default VideoList;
