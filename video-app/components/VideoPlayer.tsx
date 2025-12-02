import { useState, useRef } from 'react';
import { 
    View, StyleSheet, ActivityIndicator, 
    Pressable 
} from 'react-native';
import { useRouter } from 'expo-router';
import Video, { VideoRef, OnProgressData, OnLoadData } from 'react-native-video';
import BackwardIcon from '@/assets/icons/backward-icon.svg';
import VolumeIcon from '@/assets/icons/volume-icon.svg';
import AirplayIcon from '@/assets/icons/airplay-icon.svg';
import PlayIcon from '@/assets/icons/play-icon.svg';
import ForwardIcon from '@/assets/icons/forward-icon.svg';
import FullscreenIcon from '@/assets/icons/fullscreen-icon.svg';
import LetfArrowIcon from '@/assets/icons/leftarrow-icon.svg';
import { PText } from '@/components/StyledText';

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
                <PText style={styles.progressTime}>
                    {formatTime(progress.currentTime)} / {formatTime(duration)}
                </PText>
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


const styles = StyleSheet.create({
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
});


export default VideoPlayer;