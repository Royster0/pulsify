import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Foundation from '@expo/vector-icons/Foundation';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuthContext } from "../../providers/AuthProvider";
import { format } from "date-fns/format";

export default function Home() {
    const { session } = useAuthContext();
    const [totalWorkouts, setTotalWorkouts] = useState(0);
    const [totalCalories, setTotalCalories]= useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const date = format(new Date(), "yyyy-MM-dd");

    const fetchTotalWorkouts = async () => {
        const { count, error } = await supabase
        .from('Workouts')
        .select('*', { count: 'exact' })
        .eq("created_at", date)
        .eq("user_id", session.user.id);

        if (error) Alert.alert("Unable to fetch workout data...");
        else setTotalWorkouts(count);
    }

    const fetchTotalCalories = async () => {
        const { data, error } = await supabase
        .from("Macros")
        .select("calories")
        .eq("created_at", date)
        .eq("user_id", session.user.id)

        if (error) {
            Alert.alert("Unable to fetch macro data...");
        }

        const total = data.reduce((sum, record) => sum + record.calories, 0);
        setTotalCalories(total);
    }

    // Refresh page
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchTotalWorkouts();
        fetchTotalCalories();
        setRefreshing(false);
    }, []);

    // Retrieve initial data
    useEffect(() => {
        fetchTotalWorkouts();
        fetchTotalCalories();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={[styles.h1, { marginBottom: 20 }]}>Today</Text>

            <ScrollView 
                contentContainerStyle={{ gap: 20 }} 
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={styles.card}>
                    <Foundation name="graph-pie" size={100} color="#2898BD" />
                    <Text style={styles.cardHeader}>{totalCalories}</Text>
                    <Text style={styles.cardSubheader}>Calories</Text>
                </View>
                
                <View style={styles.card}>
                    <FontAwesome5 name="fire" size={90} color="#2898BD" />
                    <Text style={styles.cardHeader}>{totalWorkouts}</Text>
                    <Text style={styles.cardSubheader}>
                        {totalWorkouts === 1 ? "Workout" : "Workouts"}
                    </Text>
                </View>
            </ScrollView>
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
        color: "#fff",
        fontSize: 25,
        fontWeight: "400"
    },
    card: {
        backgroundColor: "#1E1E1E",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 25,
        gap: 10,
        borderRadius: 10
    },
    cardHeader: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "500",
    },
    cardSubheader: {
        color: "#fff",
        fontSize: 25,
        fontWeight: "300"
    }
});