import { Button, Input } from "@rneui/themed";
import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../lib/supabase";
import { Workout } from "../../types/db";
import Collapsible from "react-native-collapsible";
import { useAuthContext } from "../../providers/AuthProvider";
import { format } from "date-fns/format";
import AntDesign from '@expo/vector-icons/AntDesign';
import { SafeAreaView } from "react-native-safe-area-context";

function AccordionItem({ title, children }) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleExpanded = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <View style={styles.accordionItem}>
            <TouchableOpacity onPress={toggleExpanded}>
                <Text style={styles.accordionHeader}>{title}</Text>
            </TouchableOpacity>

            <Collapsible collapsed={isCollapsed}>
                <View>
                    {children}
                </View>
            </Collapsible>
        </View>
    );
}

export default function Workouts() {
    const { session } = useAuthContext();

    const [workoutName, setWorkoutName] = useState<string>('');
    const [sets, setSets] = useState<string>('');
    const [reps, setReps] = useState<string>('');
    const [load, setLoad] = useState<string>('');

    const [workouts, setWorkouts] = useState<Workout[]>([]);

    const date = format(new Date(), "yyyy-MM-dd");

    // Fetch data from database.
    const fetchWorkoutsByDate = async () => {
        let { data, error } = await supabase
            .from("Workouts")
            .select("*")
            .eq("created_at", date)
            .eq("user_id", session.user.id);
        if (error) {
            Alert.alert("Error fetching data.");
            return;
        }
        setWorkouts(data)
    };

    useEffect(() => {
        fetchWorkoutsByDate();
    }, []);

    // Add a workout to the database
    const createWorkout = async () => {
        const { data, error } = await supabase
        .from('Workouts')
        .insert([{
            created_at: date,
            workout_name: workoutName, 
            load: parseInt(load), 
            sets: parseInt(sets), 
            reps: parseInt(reps)
        }])
        .select()

        if (!error) {
            fetchWorkoutsByDate();
            setWorkoutName('');
            setLoad('');
            setReps('');
            setSets('');
        }
        else {
            Alert.alert("Error adding workout");
            console.log(error);
        } 
    }

    // Delete a workout
    const deleteWorkout = async (workout_name: string) => {
        const { error } = await supabase
        .from('Workouts')
        .delete()
        .eq('workout_name', workout_name)
        .eq('user_id', session.user.id);

        if (error) {
            Alert.alert("Error deleting workout");
        } else {
            fetchWorkoutsByDate();
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={[styles.h1, {marginBottom: 10}]}>Add a workout</Text>
            <View style={{ marginBottom: 30 }}>
                <Input
                    placeholder="Name"
                    value={workoutName}
                    onChangeText={setWorkoutName}
                    inputStyle={styles.input}
                />
                <Input 
                    placeholder="Sets"
                    value={sets}
                    onChangeText={setSets}
                    inputStyle={styles.input}
                />
                <Input 
                    placeholder="Reps"
                    value={reps}
                    onChangeText={setReps}
                    inputStyle={styles.input}
                />
                <Input 
                    placeholder="Load"
                    value={load}
                    onChangeText={setLoad}
                    inputStyle={styles.input}
                />

                <View style={{ alignItems: "center" }}>
                    <Button 
                        title={"Add Workout"} 
                        onPress={() => createWorkout()} 
                        style={styles.button} />
                </View>
            </View>

            <Text style={[styles.h1, { marginBottom: 15 }]}>Today</Text>

            <FlatList
                style={{ flex: 1 }}
                contentContainerStyle={styles.cardContainer}
                data={workouts}
                renderItem={({ item }) => (
                    <AccordionItem title={item.workout_name}>
                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.cardText}>
                                Load: {item.load}
                            </Text>
                            <Text style={styles.cardText}>
                                Sets: {item.sets}
                            </Text>
                            <Text style={styles.cardText}>
                                Reps: {item.reps}
                            </Text>
                            <Pressable onPress={() => deleteWorkout(item.workout_name)} style={{ marginTop: 10 }}>
                                {<AntDesign name="delete" size={20} color="red" />}
                            </Pressable>
                        </View>
                    </AccordionItem>
                )}
            />
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
        fontSize: 20,
        fontWeight: "500"
    },
    button: {
        width: 200,
        backgroundColor: "#2898BD",
        borderRadius: 5
    },
    input: {
        color: "#fff"
    },
    cardContainer: {
        padding: 10,
        gap: 10,
        marginBottom: 150
    },
    cardText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: '400',
        lineHeight: 30
    },
    accordionItem: {
        backgroundColor: "#1E1E1E",
        padding: 15,
        borderRadius: 5,
    },
    accordionHeader: {
        color: "#2898BD",
        fontSize: 19,
        fontWeight: '500',
    }
});