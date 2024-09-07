import React, { useState } from 'react';
import { Alert, StyleSheet, View, AppState, Text } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Button, Input } from '@rneui/themed';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import PulsifyLogo from '../../assets/pulsifyLogo';

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      Alert.alert(error.message)
    }
    console.log("Signed in");
    setLoading(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.header}>Pulsify</Text>
      </View>
      <View>
        <Input
          label="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
          labelStyle={styles.label}
          inputStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
        />
      </View>
      <View>
        <Input
          label="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="*****"
          autoCapitalize={'none'}
          labelStyle={styles.label}
          inputStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
        />
      </View>
      <View style={{ alignItems: "center" }}>
        <Button 
          title="Sign in" 
          disabled={loading} 
          onPress={() => signInWithEmail()} 
          buttonStyle={styles.button}
        />
      </View>

      <View style={{ alignItems: 'center', marginTop: 50 }}>
        <Text style={styles.text}>
          New here?     
          <Link href={"/signup"} style={styles.link}>  Sign up</Link>
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 15,
  },
  header: {
    color: "#fff",
    fontSize: 50,
    fontWeight: '400'
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