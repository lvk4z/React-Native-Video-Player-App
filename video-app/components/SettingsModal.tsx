import { useState } from "react";
import { StyleSheet, View, Text, Pressable, Switch } from "react-native";
import { useRouter } from "expo-router";
import PersonIcon from "@/assets/icons/person-icon.svg";
import LetfArrowIcon from "@/assets/icons/leftarrow-icon.svg";
import NotificationsIcon from "@/assets/icons/notification-icon.svg";
import ClockIcon from "@/assets/icons/clock-icon.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PText } from "@/components/StyledText";

function SettingsModal() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("12:00");
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <LetfArrowIcon />
        </Pressable>
        <PText style={styles.headerTitle}>Settings</PText>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <PersonIcon />
        </View>
        <PText style={styles.userName}>John Doe</PText>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <NotificationsIcon />
          <PText style={styles.sectionTitle}>Learning reminders</PText>
        </View>

        <View style={styles.reminderRow}>
          <PText style={styles.reminderLabel}>Repeat everyday at</PText>
          <View style={styles.timeContainer}>
            <ClockIcon />
            <PText style={styles.timeText}>{reminderTime}</PText>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#FFFFFF", true: "#2B2D42" }}
            thumbColor={"#FFFFFF"}
            style={styles.switch}
          />
        </View>
        <PText style={styles.description}>
          You will receive friendly reminder to remember to study
        </PText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2B2D42",
  },
  profileSection: {
    justifyContent: "center",
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 30,
    backgroundColor: "#2B2D42",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2B2D42",
  },
  divider: {
    height: 2,
    backgroundColor: "#2B2D42",
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2B2D42",
  },
  reminderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  reminderLabel: {
    fontSize: 12,
    color: "#2B2D42",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2B2D42",
  },
  description: {
    fontSize: 10,
    color: "#000000 ",
    lineHeight: 24,
    paddingHorizontal: 16,
    textAlign: "center",
  },
  switch: {
    height: 40,
  },
});

export default SettingsModal;
