import { Link, Stack } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { useAuthContext } from "../../providers/AuthProvider";
import { Dropdown } from "react-native-element-dropdown";
import { Macro } from "../../types/db";
import AntDesign from '@expo/vector-icons/AntDesign';
import { format } from "date-fns";
import Collapsible from "react-native-collapsible";

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

export default function Macros() {
    const { session } = useAuthContext();
    const [foods, setFoods] = useState([]);
    const [food, setFood] = useState('');
    const [macros, setMacros] = useState<Macro[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    // Get saved foods
    const retrieveFood = async () => {
        const { data, error } =  await supabase
        .from("Food")
        .select("food_name")
        .eq("user_id", session.user.id)

        if (error) {
            Alert.alert("Error retrieving foods");
            return;
        } 
        setFoods(data);
    }

    // Add a macro from the dropdown list
    const addMacro = async () => {
        const { data, error: selectError } = await supabase
        .from("Food")
        .select("food_name, carbs, fat, sugar, protein, calories")
        .eq("food_name", food)
        .eq("user_id", session.user.id);

        if (selectError) {
            Alert.alert("Error selecting data from food table.");
        }

        const { error: insertError } = await supabase
        .from("Macros")
        .insert(data)

        if (insertError) {
            Alert.alert("Error inserting data into food table.");
            console.log(insertError);
        }
    };

    const date = format(new Date(), "yyyy-MM-dd");

    const retrieveMacrosByDate = async () => {
        const { data: selectMacro, error: selectMError } = await supabase
        .from("Macros")
        .select("*")
        .eq("created_at", date)
        .eq("user_id", session.user.id)

        if (selectMError) {
            Alert.alert("Error retrieving macros");
            console.log(selectMError);
        }

        setMacros(selectMacro);
    }

    const deleteMacro = async (food_name: string) => {
        const { error: deleteError } = await supabase
        .from("Macros")
        .delete()
        .eq("food_name", food_name)
        .eq("created_at", date)
        .eq("user_id", session.user.id);

        if (deleteError) {
            Alert.alert("Error deleting macro");
            console.log(deleteError);
        } else {
            retrieveMacrosByDate();
        }
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        retrieveFood();
        retrieveMacrosByDate();
        setRefreshing(false);
    }, []);

    useEffect(() => {
        retrieveFood();
        retrieveMacrosByDate();
    },[]);

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: "Macros" }} />

            <Text style={styles.h1}>Macros</Text>

            <Dropdown 
                style={styles.dropdown}
                data={foods}
                search
                maxHeight={300}
                labelField="food_name"
                valueField="food_name"
                value={food}
                placeholder="Select food"
                searchPlaceholder="Search..."
                onChange={(item) => {
                    setFood(item.food_name);
                }}
            />

            <View style={{ flexDirection: "row", justifyContent: "center", gap: 30 }}>
                <Pressable style={styles.button} onPress={addMacro} >
                    <Text style={styles.buttonText}>Add Macro</Text>
                </Pressable>
                <Pressable style={styles.button}>
                    <Link href={"/create/new_food"} style={styles.buttonText}>
                        Create Food
                    </Link>
                </Pressable>
            </View>

            <Text style={styles.h1}>Today</Text>
            <FlatList
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={styles.cardContainer}
                data={macros}
                renderItem={({ item }) => (
                    <AccordionItem title={item.food_name}>
                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.cardText}>
                                Carbs: {item.carbs}
                            </Text>
                            <Text style={styles.cardText}>
                                Fat: {item.fat}
                            </Text>
                            <Text style={styles.cardText}>
                                Sugar: {item.sugar}
                            </Text>
                            <Text style={styles.cardText}>
                                Protein: {item.protein}
                            </Text>
                            <Text style={styles.cardText}>
                                Calories: {item.calories}
                            </Text>
                            <Pressable onPress={() => deleteMacro(item.food_name)} style={{ marginTop: 10 }}>
                                <AntDesign name="delete" size={20} color="red" />
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
        width: 150,
        height: 50,
        backgroundColor: "#2898BD",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500"
    },
    dropdown: {
        margin: 15,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 7,
        padding: 15,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    cardContainer: {
        flex: 1,
        padding: 10,
        gap: 10
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