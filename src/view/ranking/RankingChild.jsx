import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import HeaderScreen from "../../components/header/HeaderScreen";
import { DataTable, PaperProvider } from "react-native-paper";
import { useDispatch } from "react-redux";
import { appInfo } from "../../constants/appInfos";
import { getToken } from "../../ultis/authHelper";

const RankingChild = () => {
  const [isChartView, setIsChartView] = useState(true);
  const [animatedData, setAnimatedData] = useState([]);
  const [rankingData, setRankingData] = useState([]);
const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const sampleRanking = [
    { childName: "Bé Tom", points: 30 },
    { childName: "Bé Bông", points: 20 },
    { childName: "Bé Na", points: 25 },
    { childName: "Bé Jerry", points: 15 },
  ];
  const medals = {
    0: require("../../img/imgTab/gold.png"),
    1: require("../../img/imgTab/silver.png"),
    2: require("../../img/imgTab/bronze.png"),
  };

useEffect(() => {
  const getRankingChilds = async (childId) => {
    setLoading(true);
    try {
      const token = await getToken(dispatch);
      if (!token) return;
      const res = await fetch(
        `${appInfo.BASE_URL}/api/rankings`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
        setRankingData(json.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy thời khóa biểu:", error.message);
      Alert.alert("Lỗi", "Không thể tải thời khóa biểu");
    }
    finally {
      setLoading(false);
    }
  };
  getRankingChilds();
}, []);

  const sortedRanking = [...rankingData].sort((a, b) => b.points - a.points);

  const rowColors = ["#F5DC4D", "#FFA726", "#4FC3F7", "#90A4AE"];

  useEffect(() => {
    if (isChartView) {
      const anim = sortedRanking.map(() => new Animated.Value(0));
      setAnimatedData(anim);

      setTimeout(() => {
        Animated.stagger(
          200,
          anim.map((value, i) =>
            Animated.timing(value, {
              toValue: sortedRanking[i].points,
              duration: 800,
              useNativeDriver: false,
            })
          )
        ).start();
      }, 100);
    }
  }, [isChartView]);

  const maxPoint = Math.max(...sampleRanking.map((r) => r.points), 1);

  const renderBarChart = () => (
    <View style={styles.chartContainer}>
      {sortedRanking.map((item, index) => {
        const height = animatedData[index]?.interpolate({
          inputRange: [0, maxPoint],
          outputRange: [0, 220],
          extrapolate: "clamp",
        });

        const isTopThree = index < 3;

        return (
          <View key={index} style={styles.barItem}>
            {isTopThree && (
              <Image source={medals[index]} style={styles.medalIcon} />
            )}

            <View style={styles.barWrapper}>
              <Animated.View
                style={[
                  styles.bar,
                  {
                    height,
                    backgroundColor:
                      index === 0
                        ? rowColors[0]
                        : index === 1
                        ? rowColors[1]
                        : index === 2
                        ? rowColors[2]
                        : rowColors[3],
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                {/* 🏷 Điểm số nằm giữa thanh */}
                <Animated.Text style={styles.barScore}>
                  {Math.round(item.points)}
                </Animated.Text>
              </Animated.View>
            </View>

            {/* 👶 Tên */}
            <Text style={styles.barName}>{item.childName}</Text>
          </View>
        );
      })}
    </View>
  );

  // Hàm riêng để render từng dòng có animation
  const AnimatedRow = ({ item, index, medalIcon, backgroundColor }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <DataTable.Row style={{ backgroundColor, height: 70 }}>
          <DataTable.Cell
            style={{ flex: 0.5, borderRightWidth: 1, borderColor: "#d0d0d0" }}
          >
            {medalIcon && (
              <Image
                source={medalIcon}
                style={{ resizeMode: "contain", width: 40, height: 40 }}
              />
            )}
          </DataTable.Cell>
          <DataTable.Cell
            style={{
              flex: 2,
              alignItems: "center",
              justifyContent: "center",
              borderRightWidth: 1,
              borderColor: "#d0d0d0",
            }}
          >
            <Text style={{ fontSize: 17 }}>{item.childName}</Text>
          </DataTable.Cell>
          <DataTable.Cell
            numeric
            style={{
              flex: 0.7,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 17 }}>{item.points}</Text>
          </DataTable.Cell>
        </DataTable.Row>
      </Animated.View>
    );
  };

  const renderTable = () => {
    return (
      <DataTable>
        <DataTable.Header
          style={{
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderColor: "#d0d0d0",
          }}
        >
          <DataTable.Title
            style={{ flex: 0.5, borderRightWidth: 1, borderColor: "#d0d0d0" }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>Hạng</Text>
          </DataTable.Title>
          <DataTable.Title
            style={{
              flex: 2,
              alignItems: "center",
              justifyContent: "center",
              borderRightWidth: 1,
              borderColor: "#d0d0d0",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>
              Họ và tên bé
            </Text>
          </DataTable.Title>
          <DataTable.Title
            numeric
            style={{
              flex: 0.7,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>Điểm</Text>
          </DataTable.Title>
        </DataTable.Header>

        <ScrollView>
          {rankingData.map((item, index) => {
            const backgroundColor = rowColors[index] || "white";
            const medalIcon = medals[index];

            return (
              <AnimatedRow
                key={index}
                item={item}
                index={index}
                backgroundColor={backgroundColor}
                medalIcon={medalIcon}
              />
            );
          })}
        </ScrollView>
      </DataTable>
    );
  };

  if (loading) {
    return (
      <PaperProvider>
        <HeaderScreen title="Bảng Xếp Hạng" />
        <View style={styles.loadingContainer}><ActivityIndicator size="large" /><Text>Đang tải...</Text></View>
      </PaperProvider>
    );
  }

  return (
    
    <PaperProvider style={styles.container}>
      <HeaderScreen title="Bảng Xếp Hạng" />
      <View
        style={{
          flex: 1.5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../img/imgTab/bannerRanking.png")}
          style={{ width: "65%", height: "65%", resizeMode: "contain" }}
        />
      </View>

      {/* char/table */}
      <View style={{ flex: 7, paddingBottom: 10 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../img/imgTab/rankingChild.png")}
            style={{ width: "80%", height: "80%", resizeMode: "contain" }}
          />
        </View>

        {/* Chart hoặc Table */}
        <View style={{ flex: 1.8, justifyContent: "flex-end" }}>
          {isChartView ? renderBarChart() : renderTable()}
        </View>
      </View>

      {/* button */}
      <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => setIsChartView(!isChartView)}
          style={{
            backgroundColor: "#2ecc71",
            width: "80%",
            height: 55,
            paddingVertical: 12,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: "#fff", fontWeight: "bold" }}>
            {isChartView ? "Xem dạng bảng" : "Xem dạng cột"}
          </Text>
        </TouchableOpacity>
      </View>
    </PaperProvider>
  );
};

export default RankingChild;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  barItem: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  medalIcon: {
    width: 45,
    height: 45,
    marginBottom: 6,
    resizeMode: "contain",
  },
  bar: {
    width: 60,
    borderRadius: 6,
  },
  barName: {
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
  },
  barScore: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 2,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: "center",
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
  },
  rowTable: {
    height: 60,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
