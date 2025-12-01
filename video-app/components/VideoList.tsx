import { View, Text, FlatList, Image, Pressable, StyleSheet, ActivityIndicator} from 'react-native'
import { useSearchVideosQuery } from '@/store/services/youtubeApi';
import { useRouter } from 'expo-router';

interface VideoListProps {
    title: string;
    query: string;
    onShowMore: () => void;
}

function VideoList({ title, query, onShowMore}: VideoListProps) {
    const router= useRouter()

    const {data, isLoading, error, refetch} = useSearchVideosQuery({
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
                    <Text style={styles.title}>{title}</Text>
                </View>
                <Pressable onPress={refetch}>
                    <Text>Failded to load</Text>
                </Pressable>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Pressable onPress={onShowMore}>
                <Text style={styles.showMore}>Show more</Text>
                </Pressable>
            </View>

            {isLoading ? (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#6c63ff" />
                    <Text>Loading videos...</Text>
                </View>
            ): (
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={data?.items || []}
                    keyExtractor={(item) => item.id.videoId}
                    renderItem={({ item }) => (
                        <Pressable style={styles.videoCard} onPress={() => handleVideoPress(item.id.videoId)}>
                            <View style={styles.thumbnailBox}>
                                <Image 
                                    source={{ uri: item.snippet.thumbnails.medium.url }}
                                    style={styles.thumbnail}
                                />
                                <View>
                                    <Text>1:00:00</Text>
                                </View>
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.videoTitle} numberOfLines={2}>{item.snippet.title}</Text>
                                <Text>{item.snippet.channelTitle}</Text>
                            </View>
                        </Pressable>
                    )}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    videoCard: {
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        width: 200,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    showMore: {
        color: '#2B2D42',
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
        textDecorationColor: '#2B2D42',
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    listContent: {
        paddingLeft: 16,
    },
    thumbnailBox: {
        position: 'relative',
        width: 160,
        height: 90,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#e0e0e0',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },  
    info: {
        marginTop: 8,
    },
    videoTitle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#1a1a2e',
        marginBottom: 4,
        lineHeight: 16,
    },
})

export default VideoList;