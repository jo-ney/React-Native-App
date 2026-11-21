import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#FFD93D",
  "#6C63FF",
  "#FF9A3C",
  "#1DB954",
];

export default function Expense() {
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const totalSpent =
    expenseData?.reduce((sum: number, e: any) => sum + e.itemPrice, 0) || 0;

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://dal-first-base-code.onrender.com/api/expense/search",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort: "desc", limit: 15, page: 0 }),
        }
      );
      const data = await response.json();
      setExpenseData(data?.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello</Text>
          <Text style={styles.headerTitle}>My Expenses</Text>
        </View>
        <View style={styles.totalBadge}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{totalSpent}</Text>
        </View>
      </View>

      {/* Loading */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {expenseData?.map((expense: any, i: number) => (
            <View
              key={i}
              style={[
                styles.card,
                { borderLeftColor: COLORS[i % COLORS.length] },
              ]}
            >
              <View style={styles.cardTop}>
                <Text style={styles.itemName}>{expense.itemName}</Text>
                <Text style={styles.itemPrice}>₹{expense.itemPrice}</Text>
              </View>
              <View style={styles.cardBottom}>
                <Text style={styles.date}>
                  {new Date(expense.dateTime).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
                {expense.description ? (
                  <Text style={styles.desc}>{expense.description}</Text>
                ) : null}
              </View>
              {expense.actualPrice > 0 && (
                <View style={styles.row}>
                  <Text style={styles.label}>Actual paid</Text>
                  <Text style={styles.value}>₹{expense.actualPrice}</Text>
                </View>
              )}
            </View>
          ))}
          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", marginTop: 20 },
  header: {
    backgroundColor: "#6C63FF",
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 4 },
  headerTitle: { fontSize: 26, fontWeight: "700", color: "#fff" },
  totalBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  totalLabel: { fontSize: 11, color: "rgba(255,255,255,0.8)" },
  totalValue: { fontSize: 18, fontWeight: "700", color: "#fff" },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#999",
  },
  listContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  itemName: { fontSize: 15, fontWeight: "600", color: "#111", flex: 1 },
  itemPrice: { fontSize: 16, fontWeight: "700", color: "#6C63FF" },
  cardBottom: { flexDirection: "row", justifyContent: "space-between" },
  date: { fontSize: 12, color: "#999" },
  desc: { fontSize: 12, color: "#bbb" },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  label: { fontSize: 12, color: "#aaa" },
  value: { fontSize: 12, fontWeight: "500", color: "#555" },
});