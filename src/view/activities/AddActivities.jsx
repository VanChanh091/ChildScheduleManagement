import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import HeaderScreen from "../../components/header/HeaderScreen";
import { PaperProvider } from "react-native-paper";
import themeContext from "../../context/themeContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";

const AddActivities = () => {
  const theme = useContext(themeContext);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [isExam, setIsExam] = useState(false);
  const [isWeekly, setIsWeekly] = useState(true);
  const [openChild, setOpenChild] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [activity, setActivity] = useState("");
  const [value, setValue] = useState("");
  const [items, setItems] = useState([
    { label: "Nguyễn Văn Y", value: "Nguyễn Văn Y" },
    { label: "Nguyễn Thị B", value: "Nguyễn Thị B" },
  ]);
  const [timer, setTimer] = useState([
    { id: 1, label: "15 phút", value: "15 phút" },
    { id: 2, label: "30 phút", value: "30 phút" },
    { id: 3, label: "45 phút", value: "45 phút" },
    { id: 4, label: "60 phút", value: "60 phút" },
  ]);
  const [selectedTimer, setSelectedTimer] = useState(null);

  const activities = [
    { id: 1, label: "Học tập", icon: "📘" },
    { id: 2, label: "Vệ sinh cá nhân", icon: "🧼" },
    { id: 3, label: "Chạy bộ", icon: "🏃" },
    { id: 4, label: "Vui chơi", icon: "🎮" },
    { id: 5, label: "Ăn uống", icon: "🍽️" },
    { id: 6, label: "Ăn uống", icon: "🍽️" },
    { id: 7, label: "Ăn uống", icon: "🍽️" },
    { id: 8, label: "Ăn uống", icon: "🍽️" },
    { id: 9, label: "Ăn uống", icon: "🍽️" },
    { id: 10, label: "Ăn uống", icon: "🍽️" },
  ];

  return (
    <PaperProvider>
      <HeaderScreen title="Tạo thời gian biểu mới" />
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16 }}>Thời khóa biểu của:</Text>
            <DropDownPicker
              open={openChild}
              value={value}
              items={items}
              setOpen={setOpenChild}
              setValue={setValue}
              setItems={setItems}
              style={styles.dropdown}
              containerStyle={{ width: "60%" }}
              dropDownContainerStyle={{ zIndex: 1000 }}
            />
          </View>

          <Text style={styles.textActivities}>
            Chọn thời gian cho hoạt động:{" "}
          </Text>
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

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(e, selectedDate) => {
                const currentDate = selectedDate || date;
                setShowPicker(Platform.OS === "ios");
                setShowDate(false);
                setShowPicker(!showPicker);
                setDate(currentDate);
              }}
            />
          )}

          <Text style={styles.textActivities}>Chọn loại hoạt động: </Text>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              height: 185,
            }}
          >
            <FlatList
              data={activities}
              keyExtractor={(index) => index.id}
              numColumns={4}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.activityItem,
                    activity === item.label && { borderColor: "#33CC66" },
                  ]}
                  onPress={() => setActivity(item.label)}
                >
                  <Text style={{ fontSize: 28 }}>{item.icon}</Text>
                  <Text style={{ fontSize: 15, textAlign: "center" }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.textActivities}>Lặp lại định kỳ</Text>
            <Ionicons
              name={isWeekly ? "checkmark-circle-outline" : "ellipse-outline"}
              size={24}
              color={isWeekly ? "green" : "#ccc"}
              onPress={() => setIsWeekly(!isWeekly)}
              style={{ marginLeft: 8 }}
            />
          </View>

          <View style={styles.switchRow}>
            <View
              style={[styles.labelBox, !isExam ? styles.activeBoxBlue : null]}
            >
              <Text style={{ color: !isExam ? "#fff" : "#000" }}>
                Hàng ngày
              </Text>
            </View>
            <Switch
              value={isExam}
              onValueChange={() => setIsExam(!isExam)}
              thumbColor={isExam ? "#fff" : "#fff"}
              trackColor={{ false: "#ccc", true: "red" }}
            />
            <View
              style={[styles.labelBox, isExam ? styles.activeBoxRed : null]}
            >
              <Text style={{ color: isExam ? "#fff" : "#000" }}>Hàng tuần</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16 }}>Thời lượng:</Text>
            <DropDownPicker
              open={openTime}
              value={selectedTimer}
              items={timer}
              setOpen={setOpenTime}
              setValue={setSelectedTimer}
              setItems={setTimer}
              placeholder="Chọn thời lượng"
              style={styles.dropdown}
              containerStyle={{ width: "60%" }}
              dropDownContainerStyle={{ zIndex: 1000, borderColor: "#ccc" }}
            />
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={styles.textActivities}>Thời gian bắt đầu:</Text>
            <DateTimePicker
              value={startTime}
              mode="time"
              display="default"
              onChange={(e, selectedTime) => {
                if (selectedTime) setStartTime(selectedTime);
              }}
            />
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>TẠO</Text>
          </TouchableOpacity>

          <View style={{ width: "100%", height: 70 }}></View>
        </View>
      </View>
    </PaperProvider>
  );
};

export default AddActivities;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  textActivities: {
    fontSize: 16,
    paddingVertical: 12,
  },
  selectBox: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 12,
  },
  labelBox: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginHorizontal: 10,
  },
  activeBoxBlue: {
    backgroundColor: "#7ce0f9",
    borderColor: "#7ce0f9",
  },
  activeBoxRed: {
    backgroundColor: "#f55",
    borderColor: "#f55",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dropdown: {
    marginBottom: 15,
    borderColor: "#ccc",
  },
  iconRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 10,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activityItem: {
    width: 82,
    height: 82,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginVertical: 4,
  },
  checkboxRow: { flexDirection: "row", marginVertical: 8, gap: 16 },
  checkbox: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  checked: { backgroundColor: "#A8E6CF" },
  button: {
    backgroundColor: "#33CC66",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
