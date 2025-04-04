import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import themeContext from "../../context/themeContext";
import { PaperProvider } from "react-native-paper";
import HeaderScreen from "../../components/header/HeaderScreen";

const ActivitiesScreen = ({ navigation }) => {
  const theme = useContext(themeContext);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Nguyễn Văn Y");
  const [items, setItems] = useState([
    { label: "Nguyễn Văn Y", value: "Nguyễn Văn Y" },
    { label: "Nguyễn Thị B", value: "Nguyễn Thị B" },
  ]);

  const activities = [
    {
      id: 1,
      title: "Hoạt động thể chất",
      icon: "🏃",
      duration: "45 phút",
      start: "16 giờ 45 phút",
    },
    {
      id: 2,
      title: "Học tập",
      icon: "📘",
      duration: "180 phút",
      start: "18 giờ 00 phút",
    },
    {
      id: 3,
      title: "Vệ sinh cá nhân",
      icon: "🧼",
      duration: "20 phút",
      start: "21 giờ 30 phút",
    },
  ];

  return (
    <PaperProvider>
      <HeaderScreen
        title="Thời gian biểu"
        showAddIcon="true"
        onPress={() => navigation.navigate("AddActivities")}
      />

      {activities.length === 0 ? (
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
              source={require("../../img/imgTab/run.png")}
              style={styles.image}
            />
            <Text style={styles.noText}>
              Hiện tại không có thời gian biểu nào
            </Text>
            <Text style={styles.noText}>
              Bạn hãy tạo thời gian biểu cho trẻ
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("AddActivities")}
            >
              <Text style={styles.addButtonText}>THÊM THỜI GIAN BIỂU MỚI</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              height: 80,
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
          <ScrollView>
            {activities.map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.title}>
                  {item.title} {item.icon}
                </Text>
                <Text style={styles.textActivities}>
                  Thời lượng:{" "}
                  <Text style={{ color: "#33CC66" }}>{item.duration}</Text>
                </Text>
                <Text style={styles.textActivities}>
                  Thời gian bắt đầu:{" "}
                  <Text style={{ color: "#33CC66" }}>{item.start}</Text>
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </PaperProvider>
  );
};

export default ActivitiesScreen;

const styles = StyleSheet.create({
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
  textActivities: {
    paddingVertical: 5,
    fontSize: 16,
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
  dropdown: {
    zIndex: 1000,
    borderColor: "#ccc",
  },

  container: { padding: 16, flex: 1, backgroundColor: "#fff" },
  header: { fontSize: 16, marginBottom: 12, fontWeight: "bold" },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    marginTop: 10,
  },
  title: {
    color: "#00B0FF",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 6,
  },
});
