import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import themeContext from "../../context/themeContext";
import { PaperProvider } from "react-native-paper";
import HeaderScreen from "../../components/header/HeaderScreen";
import { getToken } from "../../ultis/authHelper";
import { useDispatch } from "react-redux";
import { appInfo } from "../../constants/appInfos";
import { useFocusEffect } from "@react-navigation/native";

const Children = ({ navigation }) => {
  const theme = useContext(themeContext);
  const [allChild, setAllChild] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const fetchAllChild = async () => {
  //     try {
  //       const token = await getToken(dispatch);
  //       if (!token) {
  //         console.error("Không lấy được token");
  //         return;
  //       }

  //       console.log("Token gửi đi:", token);

  //       const res = await fetch(`${appInfo.BASE_URL}/api/children`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (!res.ok) {
  //         throw new Error(`Lỗi khi gọi API: ${res.status}`);
  //       }

  //       const data = await res.json();
  //       setAllChild(data.data);
  //       if (data.data.length > 0) {
  //         setSelectedChild(data.data[0]);
  //       }
  //       console.log("Danh sách trẻ nhận được:", data.data);
  //     } catch (error) {
  //       console.error("Lỗi khi lấy danh sách trẻ:", error.message);
  //     }
  //   };

  //   fetchAllChild();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchAllChild = async () => {
        try {
          const token = await getToken(dispatch);
          if (!token) {
            console.error("Không lấy được token");
            return;
          }

          console.log("Token gửi đi:", token);

          const res = await fetch(`${appInfo.BASE_URL}/api/children`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error(`Lỗi khi gọi API: ${res.status}`);
          }

          const data = await res.json();
          setAllChild(data.data);
          if (data.data.length > 0) {
            setSelectedChild(data.data[0]);
          }
          console.log("Danh sách trẻ nhận được:", data.data);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách trẻ:", error.message);
        }
      };

      fetchAllChild();
    }, [])
  );

  const confirmDeleteChild = () => {
    Alert.alert(
      "Xác nhận xoá",
      `Bạn có chắc chắn muốn xoá hồ sơ của ${selectedChild?.name}?`,
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", onPress: deleteChild, style: "destructive" },
      ]
    );
  };

  const deleteChild = async () => {
    if (!selectedChild) return;

    try {
      const token = await getToken(dispatch);
      if (!token) {
        console.error("Không lấy được token");
        return;
      }

      const res = await fetch(
        `${appInfo.BASE_URL}/api/children/${selectedChild._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Lỗi khi gọi API: ${res.status}`);
      }

      // Cập nhật danh sách sau khi xóa
      setAllChild(allChild.filter((child) => child._id !== selectedChild._id));

      // Chọn trẻ khác nếu danh sách còn
      if (allChild.length > 1) {
        setSelectedChild(
          allChild.find((child) => child._id !== selectedChild._id)
        );
      } else {
        setSelectedChild(null);
      }

      console.log("Xóa hồ sơ trẻ thành công");
    } catch (error) {
      console.error("Lỗi khi xóa hồ sơ trẻ:", error.message);
    }
  };

  const childItem = ({ item }) => (
    <TouchableOpacity
      style={styles.childItem}
      onPress={() => setSelectedChild(item)}
    >
      <Image source={{ uri: item.avatar }} style={styles.childImage} />
      <Text style={styles.childText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <PaperProvider>
      <HeaderScreen
        title="Quản lý trẻ"
        showAddIcon={true}
        onPress={() => navigation.navigate("AddChildren")}
      />
      {allChild.length === 0 ? (
        <View style={styles.noScheduleContainer}>
          <Image
            source={require("../../img/imgTab/children_1.png")}
            style={styles.image}
          />
          <Text style={styles.noText}>Hiện tại không có hồ sơ trẻ</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddChildren")}
          >
            <Text style={styles.addButtonText}>THÊM HỒ SƠ CỦA TRẺ MỚI</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.selectedChildContainer}>
            <Text style={styles.title}>Hiện tại bạn đang quản lý trẻ</Text>
            {selectedChild && (
              <View style={styles.selectedChildCard}>
                <Image
                  source={{ uri: selectedChild.avatar }}
                  style={styles.selectedChildImage}
                />
              </View>
            )}
          </View>

          <FlatList
            data={allChild}
            keyExtractor={(item) => item._id}
            renderItem={childItem}
            horizontal={true}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={confirmDeleteChild}
            >
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
  selectedChildContainer: {
    flex: 1.5,
    alignItems: "center",
  },
  selectedChildCard: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedChildImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  selectedChildName: {
    fontSize: 18,
    paddingTop: 10,
  },
  childItem: {
    width: 150,
    height: 120,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    marginHorizontal: 6,
    alignItems: "center",
  },
  childImage: {
    width: 90,
    height: 65,
    resizeMode: "contain",
    paddingTop: 12,
  },
  childText: {
    fontSize: 16,
    paddingTop: 10,
  },
  buttonContainer: {
    flex: 3,
  },
  button: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
