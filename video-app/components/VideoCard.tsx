import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
} from "react-native";
import { YoutubeVideo } from "@/store/services/youtubeApi";
import { PText } from '@/components/StyledText'

interface VideoCardProps {
  video: YoutubeVideo;
  onPress: (videoId: string) => void;
}

function VideoCard({ video, onPress }: VideoCardProps) {
    const publishedAt = new Date(video.snippet.publishTime).toLocaleString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onPress(video.id.videoId)}
    >
        <Image
            style={styles.thumbnail}
            source={{ uri: video.snippet.thumbnails.medium.url }}
        />
        <View style={styles.detailsBox}>
            <PText style={styles.title} numberOfLines={1}>{video.snippet.channelTitle}</PText>
            <View style={styles.descriptionBox}>
                <PText style={styles.description} numberOfLines={2}>{video.snippet.description}</PText>
                <PText style={styles.dateLabel}>{publishedAt}</PText>
            </View>
        </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 30,
    backgroundColor: '#FFFFFF',
  },
  thumbnail: {
    width: Dimensions.get('window').width - 60,
    height: (Dimensions.get('window').width - 60) / (16/9),
    borderRadius: 16,
    marginBottom: 8,
  },
  detailsBox: {
    paddingBottom: 10
  },
  description: {
    flex: 1,
    fontSize: 12,
    color: '#2B2D42',
    lineHeight: 12,
    letterSpacing: 1,
  },
  dateLabel: {
    fontSize: 10,
    minWidth: 70,
    textAlign: 'right',
    color: '#2B2D42',
    marginTop: 30,
  },
  title: {
    fontSize: 12,
    marginBottom: 4,
    color: '#2B2D42',
    fontWeight: '600'
  },
  descriptionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
});

export default VideoCard;