import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../services/firebaseAuth";

import AnimationExample from "../../animations/animation";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [appLoading, setAppLoading] = useState(false);

  type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Dashboard: undefined;
  };

  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();

  const checkLoggedIn = () => {
    onAuthStateChanged(auth, (user: any) => {
      if (user) {
        setAppLoading(false);
        navigation.navigate("Dashboard");
      }
    });
  };

  // Email validation
  const isValidEmail = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setErrorMessage("");

    // Validation
    if (!email || !password) {
      // Alert.alert("Error", "Please fill in all fields");
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      // Alert.alert("Error", "Please enter a valid email address");
      setErrorMessage("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      // Alert.alert("Error", "Password must be at least 6 characters");
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Login successful:", userCredential.user.email);
      // Alert.alert("Success", "Logged in successfully!");
      navigation.navigate("Dashboard");
    } catch (error: any) {
      console.log("Login error code:", error.code);
      console.log("Login error message:", error.message);

      let errorMessage = "Login failed";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email format";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Try again later";
          break;
        default:
          errorMessage = error.message;
      }
      setErrorMessage(errorMessage);
      // Alert.alert("Login Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate("Register");
  };

  useEffect(() => {
    setAppLoading(true);
    checkLoggedIn();
    setAppLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      {appLoading ? (
        <View style={{ width: "100%", alignItems: "center" }}>
          <AnimationExample width={450} height={300} />
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Login Account</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleLogin}
          />

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don't have an account?{" "}
              <Text style={styles.registerLink} onPress={navigateToRegister}>
                Register
              </Text>
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  registerContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: "#666",
  },
  registerLink: {
    color: "#4A90E2",
    fontWeight: "600",
  },

  errorBox: {
    backgroundColor: "#FFEBEE",
    borderLeftWidth: 4, // A simple left border accent
    borderLeftColor: "#F44336",
    padding: 10,
    marginVertical: 10,
    borderRadius: 4,
  },
  errorText: {
    color: "#B71C1C",
    fontSize: 14,
  },
});
