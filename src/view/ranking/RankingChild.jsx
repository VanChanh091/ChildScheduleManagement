import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import HeaderScreen from "../../components/header/HeaderScreen";

const RankingChild = () => {
  const [isChartView, setIsChartView] = useState(true);
  const [animatedData, setAnimatedData] = useState([]);

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

  const sortedRanking = [...sampleRanking].sort((a, b) => b.points - a.points);

  useEffect(() => {
    const anim = sortedRanking.map(() => new Animated.Value(0));
    setAnimatedData(anim);

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
  }, []);

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
                        ? "#F5DC4D"
                        : index === 1
                        ? "#FFA726"
                        : index === 2
                        ? "#4FC3F7"
                        : "#90A4AE",
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

  const renderTable = () => {
    const medalEmojis = ["🥇", "🥈", "🥉"];

    return (
      <FlatList
        data={sortedRanking}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View className="flex-row items-center justify-between bg-white p-3 border-b border-gray-200">
            <Text className="text-lg w-8">
              {medalEmojis[index] || index + 1}
            </Text>
            <Text className="text-base flex-1 ml-2">{item.childName}</Text>
            <Text className="text-lg font-bold">{item.points}</Text>
          </View>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
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
    </View>
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
});
