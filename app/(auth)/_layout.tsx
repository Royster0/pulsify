import { Redirect, Slot } from "expo-router";
import { useAuthContext } from "../../providers/AuthProvider";

export default function AuthLayout() {
    const { isAuthenticated } = useAuthContext();
    if (isAuthenticated) {
        return <Redirect href="/" />
    }
    
    return (
        <Slot />
    )
}