import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { Appbar, DataTable, PaperProvider } from "react-native-paper";
import themeContext from "../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";

const UserManagementScreen = ({ navigation }) => {
  const theme = useContext(themeContext);
  const [search, setSearch] = useState("");

  const [dataUser, setDataUser] = useState([
    {
      id: 1,
      name: "Nguyen Van A",
      email: "a@gmail.com",
      timeJoin: "Ng 20, Thg 5, 2021",
      activity: "Ng 25, Thg 5, 2025",
    },
    {
      id: 2,
      name: "Nguyen Van B",
      email: "b@gmail.com",
      timeJoin: "Ng 20, Thg 5, 2020",
      activity: "Ng 19, Thg 5, 2025",
    },
    {
      id: 3,
      name: "Nguyen Van C",
      email: "c@gmail.com",
      timeJoin: "Ng 20, Thg 5, 2021",
      activity: "Ng 20, Thg 5, 2025",
    },
  ]);

  const handleDeleteUser = (id) => {
    const updatedUsers = dataUser.filter((user) => user.id !== id);
    setDataUser(updatedUsers);
  };

  return (
    <PaperProvider>
      <Appbar.Header
        elevated="true"
        style={{ backgroundColor: theme.background }}
      >
        <View
          style={{
            width: "85%",
            height: "100%",
            justifyContent: "center",
            paddingLeft: 15,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 30, color: "#3B7DED" }}>
            CSM
          </Text>
        </View>

        <TouchableOpacity>
          <Appbar.Action icon="bell" size={30} color={theme.color} />
        </TouchableOpacity>
      </Appbar.Header>
      {/* search */}
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View
          style={{
            flex: 1.5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "82%",
              height: 55,
              borderWidth: 1,
              borderColor: "#9C9A9AFF",
              flexDirection: "row",
              borderRadius: 10,
              backgroundColor: "#f5f3f3",
            }}
          >
            <View style={{ flex: 8.5 }}>
              <TextInput
                placeholder="Tìm kiếm người dùng"
                style={{
                  width: "100%",
                  height: 55,
                  borderColor: "#9C9A9AFF",
                  paddingLeft: 12,
                  fontSize: 16,
                }}
                value={search}
                onChange={(value) => setSearch(value)}
              />
            </View>
            <View
              style={{
                flex: 1.5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="search" size="35" color="black" />
            </View>
          </View>
        </View>

        {/* table */}
        <View style={{ flex: 8.5 }}>
          <ScrollView horizontal>
            <DataTable>
              <DataTable.Header style={styles.tableHeader}>
                <DataTable.Title style={styles.stt}>
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>STT</Text>
                </DataTable.Title>
                <DataTable.Title style={styles.name}>
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                    Họ và tên
                  </Text>
                </DataTable.Title>
                <DataTable.Title style={styles.email}>
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                    Email
                  </Text>
                </DataTable.Title>
                <DataTable.Title style={styles.timeJoin}>
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                    Tham gia tạo
                  </Text>
                </DataTable.Title>
                <DataTable.Title style={styles.timeLogin}>
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                    Hoạt động
                  </Text>
                </DataTable.Title>
                <DataTable.Title style={styles.nullBox}></DataTable.Title>
              </DataTable.Header>

              <ScrollView style={{ maxHeight: 300 }}>
                {dataUser.map((item, index) => (
                  <DataTable.Row
                    key={item.id}
                    style={styles.tableHeader}
                    onPress={() =>
                      navigation.navigate("InformationOfUser", { data: item })
                    }
                  >
                    <DataTable.Cell style={styles.stt}>
                      <Text style={{ fontSize: 15 }}>{index + 1}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.name}>
                      <Text style={{ fontSize: 15 }}>{item.name}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.email}>
                      <Text style={{ fontSize: 15 }}>{item.email}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.timeJoin}>
                      <Text style={{ fontSize: 15 }}>{item.timeJoin}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.timeLogin}>
                      <Text style={{ fontSize: 15 }}>{item.activity}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.nullBox}>
                      <TouchableOpacity
                        style={{
                          width: 50,
                          height: 35,
                          borderRadius: 10,
                          backgroundColor: "red",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => handleDeleteUser(item.id)}
                      >
                        <Text style={{ fontSize: 16, color: "white" }}>
                          Xóa
                        </Text>
                      </TouchableOpacity>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </ScrollView>
            </DataTable>
          </ScrollView>
        </View>
      </View>
    </PaperProvider>
  );
};

export default UserManagementScreen;

const styles = StyleSheet.create({
  tableHeader: {
    backgroundColor: "#f1f8ff",
    borderTopWidth: 1,
    borderColor: "#d0d0d0",
  },
  stt: {
    width: 50,
    borderRightWidth: 1,
    justifyContent: "center",
    borderColor: "#d0d0d0",
  },
  name: {
    width: 180,
    borderRightWidth: 1,
    justifyContent: "center",
    borderColor: "#d0d0d0",
  },
  email: {
    width: 180,
    borderRightWidth: 1,
    justifyContent: "center",
    borderColor: "#d0d0d0",
  },
  timeJoin: {
    width: 180,
    borderRightWidth: 1,
    justifyContent: "center",
    borderColor: "#d0d0d0",
  },
  timeLogin: {
    width: 180,
    borderRightWidth: 1,
    justifyContent: "center",
    borderColor: "#d0d0d0",
  },
  nullBox: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    height: 40,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
