import { Pressable, StyleSheet, Text, View } from "react-native";
import { supabase } from "../../lib/supabase";
import { useAuthContext } from "../../providers/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
    const { session } = useAuthContext();

    return (
        <SafeAreaView style={styles.container}>
            <Pressable onPress={() => supabase.auth.signOut()}>
                <Text style={styles.h1}>Sign Out</Text>
                <Text style={{ color: "#fff", marginTop: 40, fontSize: 20 }}>{session.user.email}</Text>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 15,
    },
    h1: {
        color: "#2898BD",
        fontSize: 17,
        fontWeight: "500",
    }
});