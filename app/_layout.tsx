import { Stack } from "expo-router";
import AuthProvider from "../providers/AuthProvider";

export default function RootLayout() {
    console.log("Testing git push from Mac");

    return (
        <AuthProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack>
        </AuthProvider>
    );
}