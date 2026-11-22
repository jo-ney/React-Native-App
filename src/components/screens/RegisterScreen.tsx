import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { auth } from "../../services/firebaseAuth";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Dashboard: undefined;
  };

  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();

  // Email validation function
  const isValidEmail = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    setErrorMessage("");

    console.log("handleRegister called");
    console.log("Email:", email);
    console.log("Password length:", password.length);

    // Validation
    if (!email || !password) {
      // Alert.alert("Error", "Please fill in all fields");
      setErrorMessage("Please fill in all fields");
      return;
    }

    // Email format validation
    if (!isValidEmail(email)) {
      // Alert.alert("Error", "Please enter a valid email address (e.g., name@example.com)");
      setErrorMessage(
        "Please enter a valid email address (e.g., name@example.com)"
      );
      return;
    }

    if (password.length < 6) {
      // Alert.alert("Error", "Password must be at least 6 characters");
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    if (!auth) {
      console.error("Auth is undefined!");
      // Alert.alert("Error", "Firebase not initialized. Please restart the app.");
      setErrorMessage("Firebase not initialized. Please restart the app.");
      return;
    }

    setLoading(true);

    try {
      console.log("Attempting registration with:", email);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Registration successful!", userCredential.user.email);
      // Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Login");
    } catch (error: any) {
      console.log("Registration error code:", error.code);
      console.log("Registration error message:", error.message);

      let errorMessage = "Registration failed";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered";
          break;
        case "auth/invalid-email":
          errorMessage =
            "Please enter a valid email address (e.g., name@example.com)";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters";
          break;
        case "auth/operation-not-allowed":
          errorMessage =
            "Email/password sign up is not enabled in Firebase Console";
          break;
        default:
          errorMessage = error.message;
      }

      setErrorMessage(errorMessage);

      // Alert.alert("Registration Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email (e.g., name@example.com)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
      />

      <TextInput
        style={styles.input}
        placeholder="Password (min 6 characters)"
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={handleRegister}
        secureTextEntry
        autoCapitalize="none"
      />

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={styles.loginLink}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
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
    backgroundColor: "#f9f9f9",
  },
  registerButton: {
    backgroundColor: "#6C63FF",
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
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#6C63FF",
    textAlign: "center",
    fontSize: 14,
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
