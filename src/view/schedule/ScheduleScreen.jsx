import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";
import themeContext from "../../context/themeContext";
import { PaperProvider } from "react-native-paper";
import HeaderScreen from "../../components/header/HeaderScreen";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

const ScheduleScreen = ({ navigation }) => {
  const data = [
    {
      id: "1",
      subject: "Tiếng Việt",
      lesson: "1 - 3",
      teacher: "Nguyễn Văn A",
      type: "lichhoc",
    },
    {
      id: "2",
      subject: "Tiếng Anh",
      lesson: "4 - 6",
      teacher: "Nguyễn Văn C",
      type: "lichthi",
    },
  ];

  const theme = useContext(themeContext);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Nguyễn Văn Y");
  const [items, setItems] = useState([
    { label: "Nguyễn Văn Y", value: "Nguyễn Văn Y" },
    { label: "Nguyễn Thị B", value: "Nguyễn Thị B" },
  ]);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [viewMode, setViewMode] = useState("Ngày");

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "ios");
    setShowPicker(!showPicker);
    setDate(currentDate);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        item.type === "lichthi" ? styles.examCard : styles.lessonCard,
      ]}
    >
      <Text style={styles.subject}>{item.subject}</Text>
      <Text style={styles.lesson}>
        Tiết: <Text style={styles.lessonBold}>{item.lesson}</Text>
      </Text>
      <Text style={styles.teacher}>
        Giáo viên: <Text style={styles.teacherName}>{item.teacher}</Text>
      </Text>
      <View
        style={[
          styles.sideColor,
          { backgroundColor: item.type === "lichthi" ? "red" : "cyan" },
        ]}
      />
    </View>
  );

  return (
    <PaperProvider>
      <HeaderScreen
        title={"Thời khóa biểu"}
        showAddIcon="true"
        onPress={() => {
          navigation.navigate("AddSchedule");
        }}
      />

      {data.length === 0 ? (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              height: 100,
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ fontSize: 16 }}>Thời khóa biểu của:</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              style={styles.dropdown}
              containerStyle={{ width: "60%" }}
              dropDownContainerStyle={{ zIndex: 1000 }}
            />
          </View>

          <View style={styles.noScheduleContainer}>
            <Image
              source={require("../../img/imgTab/noSchedule.png")}
              style={styles.image}
            />
            <Text style={styles.noText}>
              Hiện tại không có thời khóa biểu nào
            </Text>
            <Text style={styles.noText}>
              Bạn hãy tạo thời khóa biểu cho trẻ
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("AddSchedule")}
            >
              <Text style={styles.addButtonText}>THÊM THỜI KHÓA BIỂU MỚI</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          {/* Date dropdown & buttons */}
          <View style={{ flex: 1.8 }}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 2 }}>
                <TouchableOpacity
                  onPress={() => setShowPicker(!showPicker)}
                  style={styles.datePicker}
                >
                  <Text>
                    Ngày {date.getDate()}, Tháng {date.getMonth() + 1},{" "}
                    {date.getFullYear()}
                  </Text>
                  <Ionicons name="chevron-down" size={20} />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.viewModeToggle}>
                  <TouchableOpacity
                    onPress={() => setViewMode("Ngày")}
                    style={[
                      styles.modeButton,
                      viewMode === "Ngày" && styles.activeMode,
                    ]}
                  >
                    <Text style={viewMode === "Ngày" && { color: "white" }}>
                      Ngày
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setViewMode("Tháng")}
                    style={[
                      styles.modeButton,
                      viewMode === "Tháng" && styles.activeMode,
                    ]}
                  >
                    <Text style={viewMode === "Tháng" && { color: "white" }}>
                      Tháng
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}

            {/* Info text & dropdown */}
            <View
              style={{
                flexDirection: "row",
                flex: 1.2,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16 }}>Thời khóa biểu của:</Text>
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                style={styles.dropdown}
                containerStyle={{ width: "60%" }}
                dropDownContainerStyle={{ zIndex: 1000 }}
              />
            </View>
          </View>

          {/* Lesson cards */}
          <View style={{ flex: 6.5 }}>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
            />
          </View>

          {/* Legend + bottom nav */}
          <View style={{ flex: 0.7 }}>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.circle, { backgroundColor: "cyan" }]} />
                <Text>lịch học</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.circle, { backgroundColor: "red" }]} />
                <Text>lịch thi</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </PaperProvider>
  );
};

export default ScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 6,
    borderRadius: 6,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    backgroundColor: "#2DAA4F",
    padding: 10,
    paddingTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: "white", fontSize: 18 },
  dateRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateSelector: {
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 5,
  },
  viewModeToggle: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderRadius: 5,
  },
  modeButton: {
    width: "50%",
    height: 40,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  activeMode: {
    backgroundColor: "#2DAA4F",
    borderRadius: 5,
    color: "white",
  },
  viewingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  dropdown: {
    zIndex: 1000,
    borderColor: "#ccc",
  },
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    position: "relative",
  },
  subject: {
    color: "deepskyblue",
    fontSize: 16,
    fontWeight: "600",
  },
  lesson: {
    marginTop: 4,
    color: "#333",
  },
  lessonBold: {
    fontWeight: "bold",
    color: "blue",
  },
  teacher: {
    marginTop: 4,
  },
  teacherName: {
    color: "green",
    fontWeight: "500",
  },
  sideColor: {
    position: "absolute",
    width: 8,
    top: 10,
    bottom: 10,
    right: 4,
    borderRadius: 4,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 5,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
  navItem: {
    fontSize: 14,
    color: "#444",
  },
  dateBox: {
    backgroundColor: "#E5E5E5",
    padding: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noScheduleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  noText: {
    fontSize: 14,
    textAlign: "center",
  },
  addButton: {
    marginTop: 20,
    backgroundColor: "#33CC66",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scheduleList: {
    marginTop: 20,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 16,
    position: "relative",
  },
  typeBar: {
    width: 8,
    height: "100%",
    position: "absolute",
    right: 4,
    top: 4,
    borderRadius: 4,
  },
  subject: {
    fontSize: 18,
    color: "#00B0FF",
    fontWeight: "bold",
    marginBottom: 8,
  },
  lesson: {
    color: "#000",
    marginBottom: 4,
  },
  teacher: {
    color: "green",
  },
});
