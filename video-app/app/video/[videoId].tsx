import { useState, useCallback, useEffect } from 'react';
import { 
    View, StyleSheet, ScrollView, ActivityIndicator, 
    TextInput, Pressable 
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGetDetailsQuery } from '@/store/services/youtubeApi';
import LikesIcon from '@/assets/icons/likes-icon.svg';
import ViewsIcon from '@/assets/icons/views-icon.svg';
import PersonIcon from '@/assets/icons/person-icon.svg';
import { PText } from '@/components/StyledText';
import VideoPlayer from '@/components/VideoPlayer';
interface Note {
    id: string;
    text: string;
    timestamp: string;
}

interface NotesData {
    [videoId: string]: Note[];
}

function VideoDetailsScreen() {
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
                <PText style={styles.title}>{details.snippet.title}</PText>
                
                <View style={styles.channelBox}>
                    <View style={styles.channelAvatar}>
                        <PersonIcon color={'#FFF'} width={20} />
                    </View>
                    <PText style={styles.channelName}>{details.snippet.channelTitle}</PText>
                </View>

                <View style={styles.tabs}>
                    <Pressable
                        style={[styles.tab, activeTab === 'details' && styles.tabActive]}
                        onPress={() => setActiveTab('details')}
                    >
                        <PText style={styles.tabText}>
                            Details
                        </PText>
                    </Pressable>
                    <Pressable 
                        style={[styles.tab, activeTab === 'notes' && styles.tabActive]}
                        onPress={() => setActiveTab('notes')}
                    >
                        <PText style={styles.tabText}>
                            Notes
                        </PText>
                    </Pressable>
                </View>

                {activeTab === 'details' ? (
                    <View style={styles.detailsContent}>
                        <PText style={styles.sectionTitle}>Description</PText>
                        <PText style={styles.description}>{details.snippet.description}</PText>

                        {details.statistics && (
                            <View>
                                <PText style={styles.sectionTitle}>Statistics</PText>
                                <View style={styles.statsGrid}>
                                    <View style={styles.statItem}>
                                        <ViewsIcon width={32} stroke={'#FFFFFF'}/>
                                        <PText style={styles.statValue}>
                                            {parseInt(details.statistics.viewCount).toLocaleString()} views
                                        </PText>
                                    </View>
                                    <View style={styles.statItem}>
                                        <LikesIcon width={32}/>
                                        <PText style={styles.statValue}>
                                            {parseInt(details.statistics.likeCount).toLocaleString()} likes
                                        </PText>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={styles.notesContent}>
                        {notes.map((note) => (
                            <View key={note.id} style={styles.noteCard}>
                                <PText style={styles.noteText}>{note.text}</PText>
                                <PText style={styles.noteTimestamp}>{note.timestamp}</PText>
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
                                <PText style={styles.addNoteButtonText}>Add note</PText>
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

export default VideoDetailsScreen;