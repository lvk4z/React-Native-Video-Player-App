import { View, StyleSheet, Text, Pressable } from 'react-native'

interface SearchHeaderProps {
    count: number;
    query: string;
    onSort: () => void;
    sortText: string;
}

function SearchHeader ({ count, query, onSort, sortText }: SearchHeaderProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.result}>{count} results found for: 
                <Text style={styles.boldTextLabel}>{query}</Text>
            </Text>

            <Pressable onPress={onSort} style={styles.sortButton}>
                <Text style={styles.sortLabel}>Sort by:
                    <Text style={styles.boldTextLabel}>{sortText}</Text>
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        
    },
    result: {
        fontSize: 10,
        color: '#2B2D42'

    },
    sortButton: {
        flexDirection: 'row',
        color: '#444444',
        marginTop: 15,
    },
    sortLabel: {
        fontSize: 12,
    },
    boldTextLabel: {
        fontWeight: 'bold',
        marginLeft: 5,
    },

})

export default SearchHeader;