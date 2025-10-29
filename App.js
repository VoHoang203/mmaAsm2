import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProductListScreen from "./screens/ProductListScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import CartScreen from "./screens/CartScreen";
import { CartProvider } from "./contexts/CartContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
const Stack = createNativeStackNavigator();
import { COLORS } from "./theme/colors";

export default function App() {
  return (
    <CartProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Products"
              component={ProductListScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Detail"
              component={ProductDetailScreen}
              options={{ title: "Product Detail" }}
            />
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{ title: "Your Cart" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </CartProvider>
  );
}
