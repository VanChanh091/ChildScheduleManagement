import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import themeContext from "../../context/themeContext";
import { PaperProvider } from "react-native-paper";
import HeaderScreen from "../../components/header/HeaderScreen";

const Children = ({ navigation }) => {
  const data = [
    {
      id: "1",
      name: "Nguyễn Văn Y",
      avatar: require("../../img/imgTab/children_1.png"),
    },
    {
      id: "2",
      name: "Nguyễn Thị B",
      avatar: require("../../img/imgTab/children_1.png"),
    },
    {
      id: "3",
      name: "Nguyễn Văn C",
      avatar: require("../../img/imgTab/children_1.png"),
    },
  ];

  const theme = useContext(themeContext);
  const [children, setChildren] = useState(data);
  const [selectedChild, setSelectedChild] = useState(children[0]);

  const childItem = ({ item }) => (
    <TouchableOpacity
      style={{
        width: 150,
        height: 120,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#d0d0d0",
        marginHorizontal: 6,
        // justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={item.avatar}
        style={{ width: 90, height: 65, resizeMode: "contain", paddingTop: 12 }}
      />
      <Text style={{ fontSize: 16, paddingTop: 10 }}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <PaperProvider>
      <HeaderScreen
        title="Quản lý trẻ"
        showAddIcon="true"
        onPress={() => {
          navigation.navigate("AddChildren");
        }}
      />
      {data.length === 0 ? (
        <View style={{ flex: 1 }}>
          <View style={styles.noScheduleContainer}>
            <Image
              source={require("../../img/imgTab/children_1.png")}
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
              onPress={() => navigation.navigate("AddChildren")}
            >
              <Text style={styles.addButtonText}>THÊM HỒ SƠ CỦA TRẺ MỚI</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <View
            style={{
              flex: 1.5,
              alignItems: "center",
            }}
          >
            <Text style={styles.title}>Hiện tại bạn đang quản lý trẻ</Text>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "#fff",
                marginTop: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={data[0].avatar}
                style={{ width: 60, height: 60, resizeMode: "contain" }}
              />
            </View>
            <Text style={{ fontSize: 18, paddingTop: 10 }}>{data[0].name}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <FlatList
              data={children}
              keyExtractor={(item) => item.id}
              renderItem={childItem}
              horizontal={true}
            />
          </View>

          <View style={{ flex: 3 }}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Xóa hồ sơ trẻ hiện tại</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("UpdateChildren")}
            >
              <Text style={styles.buttonText}>
                Chỉnh sửa hồ sơ trẻ hiện tại
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </PaperProvider>
  );
};

export default Children;

const styles = StyleSheet.create({
  noScheduleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
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
  image: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  container: { flex: 1, padding: 10 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  button: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "white", fontSize: 16 },
});
