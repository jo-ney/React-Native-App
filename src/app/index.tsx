import DashboardScreen from "@/components/screens/DashboardScreen";
import LoginScreen from "@/components/screens/LoginScreen";
import RegisterScreen from "@/components/screens/RegisterScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function HomeScreen() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#4A90E2", // Change header background color
        },
        headerTintColor: "#fff", // Change back arrow and title color
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }} // Hides header completely on Login
      />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
