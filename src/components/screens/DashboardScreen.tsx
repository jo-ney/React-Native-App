import Expense from "@/components/expense/expense";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";



import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../../services/firebaseAuth";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();

  const logOut = () => {
    signOut(auth).then(() => {
      navigation.navigate("Login");
    });
    onAuthStateChanged(auth, (user: any) => {
      if (user) {
        console.log("console------>(user:", user);
      }
    });
  };

  const checkLoggedIn = () => {
    onAuthStateChanged(auth, (user: any) => {
      if (!user) {
        navigation.navigate("Login");
      }
    });
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.welcomeLabel}>Welcome back</Text>
          <Text style={styles.welcomeTitle}>Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logOut}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Expense list */}
      <Expense />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  welcomeLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  logoutBtn: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
