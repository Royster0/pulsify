import { useState } from "react"
import { Alert, AppState, View, StyleSheet, Text } from "react-native"
import { supabase } from "../../lib/supabase"
import { Input, Button } from "@rneui/themed"
import { Link } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    async function signUpWithEmail() {
        setLoading(true)
        const {
        data: { session },
        error,
        } = await supabase.auth.signUp({
        email: email,
        password: password,
        })

        if (error) Alert.alert(error.message)
        if (!session) Alert.alert('Please check your inbox for email verification!')
        setLoading(false)
  }

  return (
    <SafeAreaView style={styles.container}>
        <View>
            <Input
                label="Email"
                placeholder="email@address.com"
                onChangeText={(text) => { setEmail(text) }}
                value={email}
                autoCapitalize={"none"}
                labelStyle={styles.label}
                inputStyle={styles.input}
                inputContainerStyle={styles.inputContainer}
            />
        </View>

        <View>
            <Input
                label="Password"
                placeholder="*****"
                onChangeText={(text) => { setPassword(text) }}
                value={password}
                autoCapitalize={"none"}
                secureTextEntry={true}
                labelStyle={styles.label}
                inputStyle={styles.input}
                inputContainerStyle={styles.inputContainer}
            />
        </View>

        <View style={{ alignItems: "center" }}>
            <Button 
              title="Sign up" 
              disabled={loading} 
              onPress={() => signUpWithEmail()} 
              buttonStyle={styles.button}
            />
        </View>

        <View style={{ alignItems: 'center', paddingTop: 100 }}>
            <Text style={styles.text}>
            Have an account?
            <Link href={"/login"} style={styles.link}>   Log in</Link>
            </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center"
  },
  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "400"
  },
  link: {
    color: "#2898BD"
  },
  label: {
    color: "#fff",
    marginBottom: 5
  },
  input: {
    color: "#121212",
    paddingHorizontal: 10
  },
  inputContainer: {
    borderBottomWidth: 0, 
    backgroundColor: "#fff", 
    borderRadius: 5
  },
  button: {
    width: 200,
    borderRadius: 5,
    backgroundColor: "#2898BD",
    marginTop: 20
  }
})