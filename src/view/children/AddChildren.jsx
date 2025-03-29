import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import themeContext from "../../context/themeContext";
import HeaderScreen from "../../components/header/HeaderScreen";
import { PaperProvider, RadioButton } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const AddChildren = ({ navigation }) => {
  const theme = useContext(themeContext);
  const [date, setDate] = useState(new Date());
  const [checked, setChecked] = useState("male");
  const [open, setOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const [child, setChild] = useState([
    { label: "Cấp 1", value: "Cấp 1" },
    { label: "Cấp 2", value: "Cấp 2" },
    { label: "Cấp 3", value: "Cấp 3" },
    { label: "Đại học/Cao Đẳng", value: "Đại học/Cao Đẳng" },
  ]);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "ios");
    setShowPicker(!showPicker);
    setDate(currentDate);
  };

  return (
    <PaperProvider>
      <HeaderScreen title="Thêm hồ sơ trẻ" />
      <View style={{ flex: 1, padding: 10 }}>
        <View style={{ flex: 8, padding: 10 }}>
          <View style={styles.viewText}>
            <Text style={styles.textActivities}>Họ và tên:</Text>
            <TextInput
              placeholder="Nhập họ và tên"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 12,
                borderRadius: 6,
                marginBottom: 15,
              }}
            />
          </View>

          <View style={styles.viewText}>
            <Text style={styles.textActivities}>Ngày sinh:</Text>
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
                onChange={onChangeDate}
                style={{ marginBottom: 12 }}
              />
            )}
          </View>

          <View style={styles.viewText}>
            <Text style={styles.textActivities}>Giới tính:</Text>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flexDirection: "row" }}>
                <RadioButton
                  value="male"
                  status={checked === "male" ? "checked" : "unchecked"}
                  onPress={() => setChecked("male")}
                />
                <Text style={{ fontSize: 16, marginTop: 7 }}>Nam</Text>
              </View>
              <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                <RadioButton
                  value="female"
                  status={checked === "female" ? "checked" : "unchecked"}
                  onPress={() => setChecked("female")}
                />
                <Text style={{ fontSize: 16, marginTop: 7 }}>Nữ</Text>
              </View>
            </View>
          </View>

          <View style={styles.viewText}>
            <Text style={styles.textActivities}>Cấp bậc:</Text>
            <DropDownPicker
              open={open}
              value={selectedLesson}
              items={child}
              setOpen={setOpen}
              setValue={setSelectedLesson}
              setItems={setChild}
              placeholder="Chọn cấp bậc"
              style={styles.dropdown}
              dropDownContainerStyle={{ borderColor: "#ccc" }}
            />
          </View>
        </View>
        <View style={{ flex: 2 }}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Lưu hồ sơ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PaperProvider>
  );
};

export default AddChildren;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "white", fontSize: 16 },
  textActivities: {
    fontSize: 16,
    paddingVertical: 12,
  },
  // viewText: {
  //   flex: 1,
  // },
  dropdown: {
    marginBottom: 15,
    borderColor: "#ccc",
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
});
