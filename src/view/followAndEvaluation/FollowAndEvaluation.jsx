import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { DataTable, PaperProvider } from "react-native-paper";
import HeaderScreen from "../../components/header/HeaderScreen";
import themeContext from "../../context/themeContext";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { AntDesign } from "@expo/vector-icons";

const FollowAndEvaluation = () => {
  const theme = useContext(themeContext);
  const [activityStatus, setActivityStatus] = useState({});
  const [open, setOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("Ngày");
  const [value, setValue] = useState("Nguyễn Văn Y");
  const [items, setItems] = useState([
    { label: "Nguyễn Văn Y", value: "Nguyễn Văn Y" },
    { label: "Nguyễn Thị B", value: "Nguyễn Thị B" },
  ]);

  const activities = [
    {
      id: 1,
      title: "Hoạt động thể chất",
      duration: "45",
      start: "16 giờ 45p",
    },
    {
      id: 2,
      title: "Học tập",
      duration: "180",
      start: "18 giờ 00p",
    },
    {
      id: 3,
      title: "Vệ sinh cá nhân",
      duration: "20",
      start: "23 giờ 45p",
    },
    {
      id: 4,
      title: "Tắm",
      duration: "20",
      start: "17 giờ 30p",
    },
    {
      id: 5,
      title: "Ỉa",
      duration: "15",
      start: "23 giờ 30p",
    },
  ];

  const normalizeTime = (timeStr) => {
    return timeStr.replace("p", "phút").replace(/\s+/g, " ").trim();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActivityStatus((prevStatus) => {
        const updatedStatus = { ...prevStatus };

        activities.forEach((activity) => {
          const normalized = normalizeTime(activity.start);
          const startTime = moment(normalized, "HH [giờ] mm [phút]");
          const endTime = startTime
            .clone()
            .add(parseInt(activity.duration), "minutes");
          const now = moment();

          if (now.isAfter(endTime) && !updatedStatus[activity.id]) {
            updatedStatus[activity.id] = "missed";
          }
        });

        return updatedStatus;
      });
    }, 30000); // Kiểm tra mỗi 30s

    return () => clearInterval(interval);
  }, []);

  const handleCheck = (id, startTime, duration) => {
    if (activityStatus[id] === "missed") return;

    const normalized = normalizeTime(startTime);
    const start = moment(normalized, "HH [giờ] mm [phút]");
    const end = start.clone().add(parseInt(duration), "minutes");
    const now = moment();

    if (now.isBefore(start)) {
      Alert.alert("Thông báo", "Chưa đến giờ thực hiện hoạt động này!");
      return;
    }

    if (now.isAfter(end)) {
      setActivityStatus((prev) => ({ ...prev, [id]: "missed" }));
    } else {
      setActivityStatus((prev) => ({ ...prev, [id]: "completed" }));
    }
  };

  return (
    <PaperProvider>
      <HeaderScreen title="Theo dõi và đánh giá" />
      {activities.length === 0 ? (
        <View style={{ flex: 1 }}>
          <Text>abc</Text>
        </View>
      ) : (
        <View style={styles.container}>
          {/* time */}
          <View style={{ flex: 1.5 }}>
            <View style={{ flex: 1 }}>
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
          </View>

          {/* table */}
          <View style={{ flex: 6 }}>
            <ScrollView>
              <DataTable>
                <DataTable.Header style={styles.header}>
                  <DataTable.Title style={styles.columnSTT}>
                    STT
                  </DataTable.Title>
                  <DataTable.Title style={styles.columnActivity}>
                    Hoạt động
                  </DataTable.Title>
                  <DataTable.Title style={styles.columnTime}>
                    Thời gian
                  </DataTable.Title>
                  <DataTable.Title style={styles.columnDuration}>
                    Thời lượng
                  </DataTable.Title>
                  <DataTable.Title style={styles.columnStatus}>
                    Đánh giá
                  </DataTable.Title>
                </DataTable.Header>

                {activities.map((item) => (
                  <DataTable.Row
                    key={item.id}
                    onPress={() =>
                      handleCheck(item.id, item.start, item.duration)
                    }
                    style={{
                      backgroundColor: item.id % 2 == 0 ? "#9895EE" : "#fff",
                    }}
                  >
                    <DataTable.Cell style={styles.columnSTT}>
                      {item.id}
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.columnActivity}>
                      <Text style={styles.cellText}>{item.title}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.columnTime}>
                      {item.start}
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.columnDuration}>
                      {item.duration} phút
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.columnStatus}>
                      {activityStatus[item.id] === "completed" ? (
                        <AntDesign name="checksquare" size={24} color="green" />
                      ) : activityStatus[item.id] === "missed" ? (
                        <AntDesign name="closesquare" size={24} color="red" />
                      ) : (
                        <AntDesign
                          name="checksquareo"
                          size={24}
                          color={item.id % 2 == 0 ? "white" : "black"}
                        />
                      )}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </ScrollView>
          </View>

          {/* button */}
          <View
            style={{
              flex: 1.5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                width: "80%",
                height: 60,
                borderRadius: 12,
                backgroundColor: "#2ecc71",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 18, color: "white" }}
              >
                HOÀN TẤT ĐÁNH GIÁ
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </PaperProvider>
  );
};

export default FollowAndEvaluation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  viewModeToggle: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderRadius: 5,
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
  header: {
    backgroundColor: "#D9D9D9",
  },
  cellText: {
    flexWrap: "wrap",
    flex: 1,
  },
  columnSTT: {
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
  },
  columnActivity: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  columnTime: {
    flex: 1.2,
    alignItems: "center",
    justifyContent: "center",
  },
  columnDuration: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  columnStatus: {
    flex: 0.8,
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
