import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../../SplashScreen/SplashScreen";
import { useState } from "react";
import { useEffect } from "react";
import {
  RequestResetPassword,
  ResetPassword,
  SignIn,
  SignUp,
  Verification,
} from "../view/auth";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../redux/reducers/authReducer";
import HomeScreen from "../view/tabScreen/HomeScreen";
import ManageScreen from "../view/tabScreen/ManageScreen";
import AccountScreen from "../view/tabScreen/AccountScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ChatBotAI } from "../view/tabScreen";
import { Ionicons } from "@expo/vector-icons";
import { AddSchedule, ScheduleScreen } from "../view/schedule";
import { ActivitiesScreen, AddActivities } from "../view/activities";
import { AddChildren, Children } from "../view/children";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthenNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Verification"
        component={Verification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RequestResetPassword"
        component={RequestResetPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const TabNavigationContainer = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Trang chủ",
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="home-outline" size={size} color={color} />;
          },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ManageScreen"
        component={ManageScreen}
        options={{
          tabBarLabel: "Quản lý",
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="reader-outline" size={size} color={color} />;
          },
          headerShown: false,
        }}
      />
      {/* chatbot */}
      <Tab.Screen
        name="ChatBotAI"
        component={ChatBotAI}
        options={{
          tabBarLabel: "ChatBot",
          tabBarIcon: ({ color, size }) => {
            return (
              <Ionicons name="chatbubbles-outline" size={size} color={color} />
            );
          },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountNavigation}
        options={{
          tabBarLabel: "Tài khoản",
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="person-outline" size={size} color={color} />;
          },
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const ScheduleNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ScheduleScreen"
        component={ScheduleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddSchedule"
        component={AddSchedule}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const ActivitiesNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ActivitiesScreen"
        component={ActivitiesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddActivities"
        component={AddActivities}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const AccountNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AccountScreen"
        component={AccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ResetPassword}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const ChildrenNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Children"
        component={Children}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddChildren"
        component={AddChildren}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TabNavigationContainer"
        component={TabNavigationContainer}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ScheduleNavigation"
        component={ScheduleNavigation}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ActivitiesNavigation"
        component={ActivitiesNavigation}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ChildrenNavigation"
        component={ChildrenNavigation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const NavigationStack = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const { getItem } = useAsyncStorage("auth");

  const auth = useSelector(authSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    checkLogin();

    const timeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const checkLogin = async () => {
    const res = await getItem();

    if (res) {
      dispatch(addAuth(JSON.parse(res)));
      console.log("res :", res);
    } else {
      // Xử lý trường hợp không tìm thấy thông tin đăng nhập
    }
  };

  return (
    <>
      {/* {isShowSplash ? (
        <SplashScreen />
      ) : auth.accesstoken ? (
        <MainNavigator />
      ) : (
        <AuthenNavigation />
      )} */}

      <MainNavigator />
      {/* <AuthenNavigation /> */}
    </>
  );
};

export default NavigationStack;
