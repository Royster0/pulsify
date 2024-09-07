import { Button, Input } from "@rneui/themed";
import { Alert, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { useState } from "react";
import { Stack } from "expo-router";

export default function CreateFood() {
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');
    const [sugar, setSugar] = useState('');
    const [protein, setProtein] = useState('');

    const createFood = async () => {
        const { data, error } = await supabase
        .from("Food")
        .insert([{
            food_name: foodName,
            carbs: parseInt(carbs),
            fat: parseInt(fat),
            sugar: parseInt(sugar),
            protein: parseInt(protein),
            calories: parseInt(calories)
        }])
        .select()

        if (error) {
            Alert.alert("Error adding new food.");
        } else {
            Alert.alert("New food added. Select it from the dropdown!");
            setFoodName('');
            setCalories('');
            setCarbs('');
            setFat('');
            setSugar('');
            setProtein('');
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                headerTitle: "Create new Food",
                headerTintColor: "#2898BD",
                headerStyle: {
                    backgroundColor: "#121212",   
                }
            }}/>

            <View style={{ marginBottom: 30 }}>
                <Input 
                    placeholder="Food Name"
                    value={foodName}
                    onChangeText={setFoodName}
                    inputStyle={styles.input}
                />
                <Input 
                    placeholder="Carbs"
                    value={carbs}
                    onChangeText={setCarbs}
                    inputStyle={styles.input}
                />
                <Input 
                    placeholder="Fat"
                    value={fat}
                    onChangeText={setFat}
                    inputStyle={styles.input}
                />
                <Input 
                    placeholder="Sugar"
                    value={sugar}
                    onChangeText={setSugar}
                    inputStyle={styles.input}
                />
                <Input 
                    placeholder="Protein"
                    value={protein}
                    onChangeText={setProtein}
                    inputStyle={styles.input}
                />
                <Input 
                    placeholder="Calories"
                    value={calories}
                    onChangeText={setCalories}
                    inputStyle={styles.input}
                />
            </View>

            <View style={{ alignItems: "center" }}>
                <Button
                    title={"Create Food"}
                    onPress={() => createFood()}
                    style={styles.button}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 15,
        paddingTop: 60
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