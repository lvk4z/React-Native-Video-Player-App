import { useState, useRef } from 'react';
import { 
    View, StyleSheet, ActivityIndicator, 
    Pressable 
} from 'react-native';
import { useRouter } from 'expo-router';
import Video, { VideoRef, OnProgressData, OnLoadData } from 'react-native-video';
import * as ScreenOrientation from 'expo-screen-orientation';
import BackwardIcon from '@/assets/icons/backward-icon.svg';
import VolumeIcon from '@/assets/icons/volume-icon.svg';
import AirplayIcon from '@/assets/icons/airplay-icon.svg';
import PlayIcon from '@/assets/icons/play-icon.svg';
import ForwardIcon from '@/assets/icons/forward-icon.svg';
import FullscreenIcon from '@/assets/icons/fullscreen-icon.svg';
import LetfArrowIcon from '@/assets/icons/leftarrow-icon.svg';
import { PText } from '@/components/StyledText';

const VideoPlayer = ({ uri }: { uri: string }) => {
    const router = useRouter();
    const videoRef = useRef<VideoRef>(null);

    const [paused, setPaused] = useState(true);
    const [muted, setMuted] = useState(false);
    const [progress, setProgress] = useState<OnProgressData>({
        currentTime: 0,
        playableDuration: 0,
        seekableDuration: 0,
    });
    const [duration, setDuration] = useState(0);
    const [isBuffering, setIsBuffering] = useState(false);
    const [trackWidth, setTrackWidth] = useState(0);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    const togglePlayPause = () => setPaused(prev => !prev);
    const rewind10 = () => videoRef.current?.seek(progress.currentTime - 10);
    const forward10 = () => videoRef.current?.seek(progress.currentTime + 10);
    const toggleMute = () => setMuted(prev => !prev);

    const toggleFullscreen = async () => {
        await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE
        );
    };

    return (
        <View style={styles.playerContainer}>
            <Video
                ref={videoRef}
                source={{ uri: 'https://bitmovin-a.akamaihd.net/content/sintel/hls/playlist.m3u8' }}
                style={styles.video}
                paused={paused}
                muted={muted}
                resizeMode="contain"
                onProgress={setProgress}
                onLoad={(data) => setDuration(data.duration)}
                onBuffer={({ isBuffering }) => setIsBuffering(isBuffering)}
                onError={(e) => console.log("Video error:", e)}
            />

            <View style={styles.playerHeader}>
                <Pressable 
                    style={styles.iconCircleSmall}
                    onPress={() => router.back()}
                >
                    <LetfArrowIcon />
                </Pressable>
                <View style={styles.headerRight}>
                    <Pressable style={styles.iconCircleSmall} onPress={toggleMute}>
                        <VolumeIcon />
                    </Pressable>
                    <Pressable style={styles.iconCircleSmall}>
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
                        <Pressable onPress={rewind10} style={styles.iconCircle}>
                            <BackwardIcon />
                        </Pressable>
                        
                        <Pressable onPress={togglePlayPause} style={styles.iconCircle}>
                            <PlayIcon />
                        </Pressable>
                        
                        <Pressable onPress={forward10} style={styles.iconCircle}>
                            <ForwardIcon />
                        </Pressable>
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

                <Pressable
                    style={styles.progressTrack}
                    onPress={(e) => {
                        const x = e.nativeEvent.locationX;
                        const seekTo = (x / trackWidth) * duration;
                        videoRef.current?.seek(seekTo);
                    }}
                    onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
                >
                    <View 
                        style={[
                            styles.progressFill,
                            { width: `${(progress.currentTime / duration) * 100}%` }
                        ]} 
                    />
                </Pressable>

                <Pressable style={styles.fullscreenButton} onPress={toggleFullscreen}>
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
        backgroundColor: '#000',
        position: 'relative',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    playerHeader: {
        position: 'absolute',
        zIndex: 20,
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 8,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 48,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircleSmall: {
        width: 36,
        height: 36,
        borderRadius: 36,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playPauseOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
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
        color: '#FFF',
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
});

export default VideoPlayer;