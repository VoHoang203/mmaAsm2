import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

export default function ProductCard({ item, onPress }) {
  const [imgLoading, setImgLoading] = useState(true);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.card}>
      <View style={styles.thumbWrap}>
        <Image
          source={{ uri: item.thumbnail }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          onLoadEnd={() => setImgLoading(false)}
        />
        {imgLoading && (
          <View style={styles.overlay}>
            <ActivityIndicator />
          </View>
        )}
      </View>
      <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>${item.price}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    padding: 10,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thumbWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: COLORS.inputBackground,
  },
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  title: { marginTop: 8, fontWeight: "600", color: COLORS.textDark },
  price: { marginTop: 6, fontWeight: "800", color: COLORS.primary },
});
