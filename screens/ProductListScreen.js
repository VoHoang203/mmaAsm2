import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CartContext } from "../contexts/CartContext";
import ProductCard from "../components/ProductCard";
import { COLORS } from "../theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";

async function fetchAllProducts() {
  const res = await fetch("https://dummyjson.com/products?limit=100");
  if (!res.ok) throw new Error("Failed to load products");
  const data = await res.json();
  return data.products || [];
}

const PAGE_SIZE = 12;

export default function ProductListScreen({ navigation }) {
  const { totalItems, items } = useContext(CartContext);
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const fetching = useRef(false);
  const listRef = useRef(null);
  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const data = await fetchAllProducts();
        setRaw(data);
      } catch (e) {
        setErr(e.message || "Load error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
     const qq = q.trim().toLowerCase();
     if (!qq) return raw;
     return raw.filter(
       (p) =>
         (p.title || "").toLowerCase().includes(qq) 
     );
   }, [q, raw]);
 
   const visible = useMemo(
     () => filtered.slice(0, page * PAGE_SIZE),
     [filtered, page]
   );

  const onEndReached = () => {
    if (fetching.current) return;
    if (visible.length >= filtered.length) return;
    fetching.current = true;
    setTimeout(() => {
      setPage((p) => p + 1);
      fetching.current = false;
    }, 250);
  };
  useEffect(() => {
    setPage(1);
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    });
  }, [q]);
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8, color: COLORS.textSecondary }}>
          Loading products…
        </Text>
      </SafeAreaView>
    );
  }

  if (err) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: "tomato", fontWeight: "700" }}>Error</Text>
        <Text style={{ marginTop: 6, color: COLORS.textPrimary }}>{err}</Text>
        <TouchableOpacity
          style={[styles.btn, { marginTop: 12 }]}
          onPress={async () => {
            setErr("");
            setLoading(true);
            try {
              setRaw(await fetchAllProducts());
            } catch (e) {
              setErr(e.message || "Load error");
            } finally {
              setLoading(false);
            }
          }}
        >
          <Text style={styles.btnTxt}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shop</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Cart")}
          style={styles.cartBtn}
        >
          <Text style={styles.cartBtnTxt}>Cart ({totalItems})</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          placeholder="Search products…"
          placeholderTextColor={COLORS.placeholderText}
          value={q}
          onChangeText={(t) => {
            setQ(t);
            setPage(1);
          }}
          style={styles.searchInput}
        />
      </View>

      {filtered.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: COLORS.textSecondary }}>No results found.</Text>
        </View>
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(it) => String(it.id)}
          contentContainerStyle={styles.listWrap}
          numColumns={2}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onPress={() => navigation.navigate("Detail", { id: item.id })}
            />
          )}
          onEndReachedThreshold={0.35}
          onEndReached={onEndReached}
          ListFooterComponent={
            visible.length < filtered.length ? (
              <View style={{ paddingVertical: 16, alignItems: "center" }}>
                <ActivityIndicator />
              </View>
            ) : null
          }
        />
      )}
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.cardBackground,
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textDark },
  cartBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  cartBtnTxt: { color: COLORS.white, fontWeight: "800" },
  searchWrap: { padding: 16, paddingBottom: 8 },
  searchInput: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
  },
  listWrap: { padding: 8 },
  btn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnTxt: { color: COLORS.white, fontWeight: "700" },
});
