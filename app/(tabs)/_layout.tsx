import { Redirect, Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuthContext } from "../../providers/AuthProvider";

export default function TabsLayout() {
    const { isAuthenticated } = useAuthContext();
    if (!isAuthenticated) {
        return <Redirect href={"/login"} />
    }

    return (
        <Tabs screenOptions={{ 
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: styles.tabs,
            tabBarActiveTintColor: "#2898BD",
            tabBarInactiveTintColor: "#fff"
        }}>
            <Tabs.Screen name="index" options={{ 
                tabBarIcon: ({ color }) => <MaterialIcons name="space-dashboard" size={24} color={color} />
            }} />
            <Tabs.Screen name="workouts" options={{ 
                tabBarIcon: ({ color }) => <MaterialCommunityIcons name="weight-lifter" size={24} color={color} />
            }} />
            <Tabs.Screen name="macros" options={{ 
                tabBarIcon: ({ color }) => <MaterialCommunityIcons name="food-apple" size={24} color={color} />
            }} />
            <Tabs.Screen name="profile" options={{ 
                tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />
            }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabs: {
        backgroundColor: "#121212",
        borderTopColor: "#121212",
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.5,
    }
});