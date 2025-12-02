import { View, StyleSheet, Text, Pressable } from 'react-native'
import { PText } from '@/components/StyledText'

interface SearchHeaderProps {
    count: number;
    query: string;
    onSort: () => void;
    sortText: string;
}

function SearchHeader ({ count, query, onSort, sortText }: SearchHeaderProps) {
    return (
        <View style={styles.container}>
            <PText style={styles.result}>{count} results found for: 
                <PText style={styles.boldTextLabel}>{query}</PText>
            </PText>

            <Pressable onPress={onSort} style={styles.sortButton}>
                <PText style={styles.sortLabel}>Sort by:
                    <PText style={styles.boldTextLabel}>{sortText}</PText>
                </PText>
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