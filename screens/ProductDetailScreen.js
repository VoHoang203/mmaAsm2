import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Platform,
} from "react-native";
import { CartContext } from "../contexts/CartContext";
import { COLORS } from "../theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";

async function fetchProductDetail(id) {
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  if (!res.ok) throw new Error("Failed to load product");
  return await res.json();
}

export default function ProductDetailScreen({ route }) {
  const { id } = route.params;
  const { add } = useContext(CartContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        setItem(await fetchProductDetail(id));
      } catch (e) {
        setErr(e.message || "Load error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8, color: COLORS.textSecondary }}>
          Loading detail…
        </Text>
      </SafeAreaView>
    );
  }

  if (err || !item) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: "tomato", fontWeight: "700" }}>Error</Text>
        <Text style={{ marginTop: 6, color: COLORS.textPrimary }}>
          {err || "Not found"}
        </Text>
      </SafeAreaView>
    );
  }

  const img = item.images?.[0] || item.thumbnail;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <FlatList
        data={[{ key: "content" }]}
        renderItem={() => (
          <View style={{ padding: 16 }}>
            <View style={styles.thumb}>
              <Image
                source={{ uri: img }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.price}>${item.price}</Text>

            <TouchableOpacity
              onPress={() => {
                add(item);
                if (Platform.OS === "android") {
                  ToastAndroid.show(
                    `${item.title} đã thêm vào giỏ`,
                    ToastAndroid.SHORT
                  );
                } else if (Platform.OS === "ios") {
                  Alert.alert(
                    "Đã thêm vào giỏ hàng",
                    item.title,
                    [{ text: "OK", style: "default" }],
                    { cancelable: true }
                  );
                }
              }}
              style={styles.primaryBtn}
            >
              <Text style={{ color: COLORS.white, fontWeight: "800" }}>
                Add to Cart
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: COLORS.background,
  },
  thumb: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: COLORS.inputBackground,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 12,
    color: COLORS.textDark,
  },
  desc: { marginTop: 8, color: COLORS.textPrimary },
  price: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
  },
  primaryBtn: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
});
