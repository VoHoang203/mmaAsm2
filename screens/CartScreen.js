// screens/CartScreen.js
import React, { useContext } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CartContext } from "../contexts/CartContext";
import { COLORS } from "../theme/colors";
import { SafeAreaView } from 'react-native-safe-area-context';

function CartRow({ item, onInc, onDec, onRemove }) {
  return (
    <View style={styles.row}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
      <View style={{ flex: 1, marginHorizontal: 12 }}>
        <Text numberOfLines={2} style={{ fontWeight: "600", color: COLORS.textDark }}>{item.title}</Text>
        <Text style={{ marginTop: 4, color: COLORS.textPrimary }}>${item.price} x {item.qty}</Text>
        <Text style={{ marginTop: 4, fontWeight: "700", color: COLORS.primary }}>${(item.price * item.qty).toFixed(2)}</Text>
      </View>
      <View style={styles.qtyCol}>
        <TouchableOpacity onPress={onDec} style={styles.qtyBtn}><Text style={styles.qtyTxt}>-</Text></TouchableOpacity>
        <Text style={styles.qtyVal}>{item.qty}</Text>
        <TouchableOpacity onPress={onInc} style={styles.qtyBtn}><Text style={styles.qtyTxt}>+</Text></TouchableOpacity>
        <TouchableOpacity onPress={onRemove} style={[styles.qtyBtn, { marginTop: 6, backgroundColor: "#d9534f" }]}><Text style={styles.qtyTxt}>×</Text></TouchableOpacity>
      </View>
    </View>
  );
}

export default function CartScreen() {
  const { items, updateQty, remove, totalItems, totalPrice, clear } = useContext(CartContext);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <View style={styles.pill}><Text style={styles.pillTxt}>{totalItems} items</Text></View>
      </View>

      {items.length === 0 ? (
        <View style={styles.center}><Text style={{ color: COLORS.textSecondary }}>Your cart is empty.</Text></View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(it) => String(it.id)}
            contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
            renderItem={({ item }) => (
              <CartRow
                item={item}
                onInc={() => updateQty(item.id, item.qty + 1)}
                onDec={() => updateQty(item.id, item.qty - 1)}
                onRemove={() => remove(item.id)}
              />
            )}
          />
          <View style={styles.summary}>
            <View>
              <Text style={{ color: COLORS.white, fontWeight: "700" }}>Items: {totalItems}</Text>
              <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: "800" }}>${totalPrice.toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={clear} style={styles.clearBtn}>
              <Text style={{ color: COLORS.white, fontWeight: "700" }}>Clear Cart</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  header: {
    paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", borderBottomWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.cardBackground
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textDark },
  pill: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  pillTxt: { color: COLORS.white, fontWeight: "800" },
  row: {
    flexDirection: "row", alignItems: "center", padding: 12, marginBottom: 12,
    backgroundColor: COLORS.cardBackground, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border
  },
  thumb: { width: 64, height: 64, borderRadius: 8, backgroundColor: COLORS.inputBackground },
  qtyCol: { alignItems: "center" },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 6, backgroundColor: COLORS.primary,
    alignItems: "center", justifyContent: "center"
  },
  qtyTxt: { color: COLORS.white, fontWeight: "800", fontSize: 16 },
  qtyVal: { paddingHorizontal: 8, minWidth: 24, textAlign: "center", color: COLORS.textPrimary },
  summary: {
    position: "absolute", left: 0, right: 0, bottom: 0,
    padding: 16, backgroundColor: COLORS.textPrimary, flexDirection: "row",
    justifyContent: "space-between", alignItems: "center"
  },
  clearBtn: { paddingHorizontal: 14, paddingVertical: 10, backgroundColor: "#ef4444", borderRadius: 10 },
});
