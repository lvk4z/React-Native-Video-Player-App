import { View, Text, StyleSheet } from 'react-native';

function DetailsPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Video Details - Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 18,
    color: '#1a1a2e',
  },
});

export default DetailsPage;