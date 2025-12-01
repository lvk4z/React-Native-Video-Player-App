import { useState, useCallback, useEffect, useRef } from 'react';
import { 
    View, Text, StyleSheet, ScrollView, ActivityIndicator, 
    TextInput, Pressable 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Video, { VideoRef, OnProgressData, OnLoadData } from 'react-native-video';
import { useGetDetailsQuery } from '@/store/services/youtubeApi';
import BackwardIcon from '@/assets/icons/backward-icon.svg';
import VolumeIcon from '@/assets/icons/volume-icon.svg';
import AirplayIcon from '@/assets/icons/airplay-icon.svg';
import PlayIcon from '@/assets/icons/play-icon.svg';
import ForwardIcon from '@/assets/icons/forward-icon.svg';
import FullscreenIcon from '@/assets/icons/fullscreen-icon.svg';
import LikesIcon from '@/assets/icons/likes-icon.svg';
import ViewsIcon from '@/assets/icons/views-icon.svg';
import PersonIcon from '@/assets/icons/person-icon.svg';
import LetfArrowIcon from '@/assets/icons/leftarrow-icon.svg';

const videoFile = require('@/assets/video/broadchurch.mp4');

const VideoPlayer = () => {
    const router = useRouter();
    const videoRef = useRef<VideoRef>(null);
    const [paused, setPaused] = useState(true);
    const [progress, setProgress] = useState<OnProgressData>({
        currentTime: 0,
        playableDuration: 0,
        seekableDuration: 0,
    });
    const [duration, setDuration] = useState(0);
    const [isBuffering, setIsBuffering] = useState(false);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleProgress = (data: OnProgressData) => {
        setProgress(data);
    };

    const handleLoad = (data: OnLoadData) => {
        setDuration(data.duration);
        setIsBuffering(false);
    };

    const togglePlayPause = () => {
        setPaused(!paused);
    };

    return (
        <View style={styles.playerContainer}>
            <Video
                ref={videoRef}
                source={videoFile}
                style={styles.video}
                paused={paused}
                onProgress={handleProgress}
                onLoad={handleLoad}
                onBuffer={({ isBuffering }) => setIsBuffering(isBuffering)}
                onError={(error) => console.error('Video Error:', error)}
            />
            <View style={styles.playerHeader}>
                <Pressable 
                    style={styles.headerButton}
                    onPress={() => router.back()}
                >
                    <LetfArrowIcon />
                </Pressable>
                <View style={styles.headerRight}>
                    <Pressable style={styles.headerButton}>
                        <VolumeIcon />
                    </Pressable>
                    <Pressable style={styles.headerButton}>
                        <AirplayIcon />
                    </Pressable>
                </View>
            </View>

            <Pressable 
                style={styles.playPauseOverlay}
                onPress={togglePlayPause}
            >
                {paused && (
                    <View style={styles.playPanel}>
                        <BackwardIcon />
                        <PlayIcon />
                        <ForwardIcon />
                    </View>
                )}
            </Pressable>

            {isBuffering && (
                <View style={styles.bufferingContainer}>
                    <ActivityIndicator size="large" />
                </View>
            )}

            <View style={styles.progressBar}>
                <Text style={styles.progressTime}>
                    {formatTime(progress.currentTime)} / {formatTime(duration)}
                </Text>
                <View style={styles.progressTrack}>
                    <View 
                        style={[
                            styles.progressFill, 
                            { width: `${(progress.currentTime / duration) * 100}%` }
                        ]} 
                    />
                </View>
                <Pressable style={styles.fullscreenButton}>
                    <FullscreenIcon />
                </Pressable>
            </View>
        </View>
    );
};

interface Note {
    id: string;
    text: string;
    timestamp: string;
}

interface NotesData {
    [videoId: string]: Note[];
}

export default function VideoDetailsScreen() {
    const { videoId } = useLocalSearchParams<{ videoId: string }>();
    
    const [activeTab, setActiveTab] = useState<'details' | 'notes'>('details');
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNoteText, setNewNoteText] = useState('');

    const { data, isLoading, isError, error } = useGetDetailsQuery(videoId || '');
    
    const details = data?.items?.[0] || null;

    useEffect(() => {
        if (isError) {
            console.error("Błąd API YouTube:", error);
        }
    }, [isError, error]);

    const loadNotes = useCallback(async () => {
        if (!videoId) return;
        try {
            const res = await AsyncStorage.getItem('notes');
            const allNotes: NotesData = res ? JSON.parse(res) : {};
            setNotes(allNotes[videoId] || []);
        } catch (err) { 
            console.error('Error loading notes:', err); 
        }
    }, [videoId]);

    const addNote = useCallback(async () => {
        if (!videoId || !newNoteText.trim()) return;
        
        const newNote: Note = {
            id: Date.now().toString(),
            text: newNoteText.trim(),
            timestamp: '2:08',
        };

        try {
            const res = await AsyncStorage.getItem('notes');
            const allNotes: NotesData = res ? JSON.parse(res) : {};
            const videoNotes = allNotes[videoId] || [];
            videoNotes.push(newNote);
            allNotes[videoId] = videoNotes;
            
            await AsyncStorage.setItem('notes', JSON.stringify(allNotes));
            setNotes(videoNotes);
            setNewNoteText('');
        } catch (err) { 
            console.error('Error saving note:', err); 
        }
    }, [videoId, newNoteText]);

    useEffect(() => {
        if (videoId) loadNotes();
    }, [videoId, loadNotes]);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large'/>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <VideoPlayer />

            <ScrollView style={styles.scrollContent}>
                <Text style={styles.title}>{details.snippet.title}</Text>
                
                <View style={styles.channelBox}>
                    <View style={styles.channelAvatar}>
                        <PersonIcon color={'#FFF'} width={20} />
                    </View>
                    <Text style={styles.channelName}>{details.snippet.channelTitle}</Text>
                </View>

                <View style={styles.tabs}>
                    <Pressable
                        style={[styles.tab, activeTab === 'details' && styles.tabActive]}
                        onPress={() => setActiveTab('details')}
                    >
                        <Text style={styles.tabText}>
                            Details
                        </Text>
                    </Pressable>
                    <Pressable 
                        style={[styles.tab, activeTab === 'notes' && styles.tabActive]}
                        onPress={() => setActiveTab('notes')}
                    >
                        <Text style={styles.tabText}>
                            Notes
                        </Text>
                    </Pressable>
                </View>

                {activeTab === 'details' ? (
                    <View style={styles.detailsContent}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{details.snippet.description}</Text>

                        {details.statistics && (
                            <View>
                                <Text style={styles.sectionTitle}>Statistics</Text>
                                <View style={styles.statsGrid}>
                                    <View style={styles.statItem}>
                                        <ViewsIcon width={32} stroke={'#FFFFFF'}/>
                                        <Text style={styles.statValue}>
                                            {parseInt(details.statistics.viewCount).toLocaleString()} views
                                        </Text>
                                    </View>
                                    <View style={styles.statItem}>
                                        <LikesIcon width={32}/>
                                        <Text style={styles.statValue}>
                                            {parseInt(details.statistics.likeCount).toLocaleString()} likes
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={styles.notesContent}>
                        {notes.map((note) => (
                            <View key={note.id} style={styles.noteCard}>
                                <Text style={styles.noteText}>{note.text}</Text>
                                <Text style={styles.noteTimestamp}>{note.timestamp}</Text>
                            </View>
                        ))}

                        <View style={styles.addNoteContainer}>
                            <TextInput
                                style={styles.noteInput}
                                multiline
                                placeholder="Enter notes..."
                                placeholderTextColor="#999"
                                value={newNoteText}
                                onChangeText={setNewNoteText}
                            />
                            <Pressable 
                                style={styles.addNoteButton}
                                onPress={addNote}
                            >
                                <Text style={styles.addNoteButtonText}>Add note</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    playerContainer: {
        width: '100%',
        height: 280,
        backgroundColor: '#000000',
        position: 'relative',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    playerHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    headerButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
        opacity: 25,
        borderRadius: 16,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 8,
    },
    playPauseOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playPanel: {
        flexDirection: 'row',
        gap: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bufferingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    progressBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    progressTime: {
        color: '#FFFFFF',
        fontSize: 12,
        minWidth: 80,
    },
    progressTrack: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 2,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#C71F1F',
        borderRadius: 2,
    },
    fullscreenButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenIcon: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: 26,
        paddingVertical: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: '#2B2D42',
        lineHeight: 12,
    },
    channelBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    channelAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#2B2D42',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        color: '#FFFFFF'
    },
    avatarIcon: {
        color: '#FFFFFF'
    },
    channelName: {
        fontWeight: '600',
        color: '#2B2D42',
        fontSize: 14,
    },
    
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        justifyContent: 'center',
        borderColor: '#2B2D42',
        marginBottom: 20,
    },
    tab: {
        paddingVertical: 5, 
        width: '50%',
        alignItems: 'center',
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#2B2D42',
    },
    tabText: {
        fontSize: 12,
        color: '#2B2D42',
        fontWeight: '500',
    },
    detailsContent: {
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: '700',
        marginBottom: 8,
        color: '#2B2D42',
        lineHeight: 12,

    },
    description: {
        lineHeight: 12,
        color: '#2B2D42',
        fontSize: 12,
        marginBottom: 14,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 20,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2B2D42',
        paddingHorizontal: 16,
        borderRadius: 8,
        gap: 8,
        color: '#FFFFFF',
    },
    statValue: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    notesContent: {
        paddingBottom: 40,
    },
    noteCard: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    noteText: {
        fontSize: 12,
        color: '#2B2D42',
        lineHeight: 12,
        marginBottom: 8,
    },
    noteTimestamp: {
        fontSize: 12,
        color: '#999999',
        textAlign: 'right',
    },
    addNoteContainer: {
        marginTop: 70,
        alignItems: 'center',
    },
    noteInput: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        padding: 16,
        fontSize: 12,
        color: '#2B2D42',
        minHeight: 60,
        textAlignVertical: 'top',
        marginBottom: 12,
        width: '100%',
    },
    addNoteButton: {
        backgroundColor: '#2B2D42',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        width: '70%',
    },
    addNoteButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});