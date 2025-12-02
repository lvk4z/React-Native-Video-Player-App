import { StyleSheet, View, Text, Pressable, Modal } from "react-native";
import { PText } from "@/components/StyledText";

export type SortOption = "date" | "date-oldest" | "rating";

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

function SortModal({
  visible,
  onClose,
  selectedSort,
  onSelectSort,
}: SortModalProps) {
  const handleSelect = (sort: SortOption) => {
    onSelectSort(sort);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <PText style={styles.title}>Sort records by:</PText>

              <View style={styles.optionsContainer}>
                <Pressable
                  style={styles.option}
                  onPress={() => handleSelect("date")}
                >
                  <View
                    style={[
                      styles.radio,
                      selectedSort === "date" && styles.radioSelected,
                    ]}
                  >
                    {selectedSort === "date" && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                  <PText style={styles.optionText}>Upload date: latest</PText>
                </Pressable>

                <Pressable
                  style={styles.option}
                  onPress={() => handleSelect("date-oldest")}
                >
                  <View
                    style={[
                      styles.radio,
                      selectedSort === "date-oldest" && styles.radioSelected,
                    ]}
                  >
                    {selectedSort === "date-oldest" && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                  <PText style={styles.optionText}>Upload date: oldest</PText>
                </Pressable>
                <Pressable
                  style={styles.option}
                  onPress={() => handleSelect("rating")}
                >
                  <View
                    style={[
                      styles.radio,
                      selectedSort === "rating" && styles.radioSelected,
                    ]}
                  >
                    {selectedSort === "rating" && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                  <PText style={styles.optionText}>Most popular</PText>
                </Pressable>
              </View>

              <Pressable style={styles.confirmButton} onPress={onClose}>
                <PText style={styles.confirmButtonText}>Confirm</PText>
              </Pressable>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: "#8D99AE",
    borderRadius: 24,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    color: "#FFFFFF",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  radioSelected: {
    borderColor: "#FFFFFF",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  optionText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  confirmButton: {
    backgroundColor: "#2B2D42",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default SortModal;
