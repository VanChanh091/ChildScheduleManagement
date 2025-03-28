import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import themeContext from "../../context/themeContext";
import HeaderScreen from "../../components/header/HeaderScreen";
import { PaperProvider } from "react-native-paper";

const AddChildren = () => {
  const theme = useContext(themeContext);
  return (
    <PaperProvider>
      <HeaderScreen title="Thêm hồ sơ trẻ" />
    </PaperProvider>
  );
};

export default AddChildren;

const styles = StyleSheet.create({});
