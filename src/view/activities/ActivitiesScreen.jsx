import React, { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import themeContext from "../../context/themeContext";
import { PaperProvider } from "react-native-paper";
import HeaderScreen from "../../components/header/HeaderScreen";

import { getToken } from "../../ultis/authHelper";
import { appInfo } from "../../constants/appInfos";
import { useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

const ActivitiesScreen = ({ navigation }) => {
  const theme = useContext(themeContext);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [allChild, setAllChild] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [childActivities, setChildActivities] = useState([]);

  const getIconByTitle = (title) => {
    const icons = {
      "Học tập": "📘",
      "Vệ sinh cá nhân": "🧼",
      "Chạy bộ": "🏃",
      "Vui chơi": "🎮",
      "Ăn uống": "🍽️",
      "Đọc sách": "📚",
      Ngủ: "💤",
      "Thể dục": "🏋️",
      "Ngoài trời": "🌳",
      Nhạc: "🎵",
    };
    return icons[title] || "📌";
  };

  const getDurationFromNote = (note) => {
    const match = note?.match(/(\d+ phút)/);
    return match ? match[1] : "Không rõ";
  };

  const fetchScheduleByChild = async (childId) => {
    if (!childId) {
      console.log("Child ID is missing!");
      return;
    }

    try {
      const token = await getToken(dispatch);
      const res = await fetch(
        `${appInfo.BASE_URL}/api/thoigianbieu/${childId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Lỗi khi tải thời gian biểu");
      }

      const formatted = data.data.map((item, index) => {
        console.log("Raw schedule item:", item); // 👈 in raw trước khi xử lý
        const startTime = item.startTime;

        return {
          id: item._id,
          title: item.title,
          icon: getIconByTitle(item.title),
          duration: getDurationFromNote(item.note),
          start: item.startTime
            ? new Date(`1970-01-01T${item.startTime}:00`).toLocaleTimeString(
                "vi-VN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )
            : "Không xác định",
        };
      });

      setChildActivities(formatted);
    } catch (err) {
      console.error("Lỗi khi lấy thời gian biểu:", err.message);
      setChildActivities([]);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Xoá hoạt động", "Bạn có chắc muốn xoá hoạt động này?", [
      {
        text: "Huỷ",
        style: "cancel",
      },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            // Lấy token người dùng
            const token = await getToken(dispatch);

            // Gửi request DELETE
            const res = await fetch(
              `${appInfo.BASE_URL}/api/thoigianbieu/${id}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            // Kiểm tra kết quả trả về từ API
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message || "Xoá thất bại");
            }

            // Sau khi xoá thành công, làm mới danh sách thời gian biểu
            fetchScheduleByChild(selectedChild._id);
          } catch (err) {
            // Xử lý lỗi nếu có
            console.error("Lỗi xoá:", err.message);
            Alert.alert("Lỗi", err.message || "Không thể xoá hoạt động");
          }
        },
      },
    ]);
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchAllChild = async () => {
        setLoading(true);
        try {
          const token = await getToken(dispatch);
          if (!token) {
            console.error("Không lấy được token");
            setLoading(false);
            return;
          }

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
          const children = data.data || [];

          const formattedChildren = children.map((child) => ({
            ...child,
            fullName: child.name,
          }));

          setAllChild(formattedChildren);
          if (formattedChildren.length > 0) {
            const firstChild = formattedChildren[0];
            setSelectedChild(firstChild);
            setValue(firstChild.fullName);
            setItems(
              formattedChildren.map((child) => ({
                label: child.fullName,
                value: child.fullName,
              }))
            );
            fetchScheduleByChild(firstChild._id);
          }
        } catch (error) {
          console.error("Lỗi khi lấy danh sách trẻ:", error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchAllChild();
    }, [dispatch])
  );

  useEffect(() => {
    if (selectedChild) {
      fetchScheduleByChild(selectedChild._id);
    }
  }, [selectedChild]);

  const handleChildChange = (valFunc) => {
    const selectedName = valFunc();
    setValue(selectedName);
    const selected = allChild.find((child) => child.fullName === selectedName);
    setSelectedChild(selected);
  };

  if (loading) {
    return (
      <View style={styles.noScheduleContainer}>
        <ActivityIndicator size="large" color="#33CC66" />
        <Text style={styles.noText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <HeaderScreen
        title="Thời gian biểu"
        showAddIcon="true"
        onPress={() => navigation.navigate("AddActivities")}
      />

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
          <View style={{ zIndex: 10, width: "60%" }}>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={handleChildChange}
              setItems={setItems}
              style={styles.dropdown}
              dropDownContainerStyle={{ zIndex: 1000 }}
            />
          </View>
        </View>

        {childActivities.length === 0 ? (
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
        ) : (
          <ScrollView>
            {childActivities.map((item, index) => {
              const uniqueKey = item.id ? item.id.toString() : `temp-${index}`;

              return (
                <TouchableOpacity
                  key={uniqueKey}
                  onLongPress={() => handleDelete(item.id)} // Gọi hàm xoá khi nhấn giữ
                  delayLongPress={500}
                  style={styles.card}
                >
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
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    </PaperProvider>
  );
};

export default ActivitiesScreen;

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: "#fff" },
  dropdown: {
    zIndex: 1000,
    borderColor: "#ccc",
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
  textActivities: {
    paddingVertical: 5,
    fontSize: 16,
  },
});
