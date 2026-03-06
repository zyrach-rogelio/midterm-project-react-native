import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppContext, RootStackParamList } from './App';

type FormRouteProp = RouteProp<RootStackParamList, 'ApplicationForm'>;
type NavProp = NativeStackNavigationProp<RootStackParamList, 'ApplicationForm'>;

// ✅ Moved OUTSIDE the screen component so it never gets recreated on re-render
interface FieldProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: any;
  errorKey: string;
  errors: Record<string, string>;
  isDarkMode: boolean;
}

const Field = ({ label, value, onChange, placeholder, multiline = false, keyboardType = 'default', errorKey, errors, isDarkMode }: FieldProps) => {
  const text = isDarkMode ? '#ffffff' : '#000000';
  const card = isDarkMode ? '#1e1e1e' : '#ffffff';
  const sub = isDarkMode ? '#aaaaaa' : '#666666';
  const border = isDarkMode ? '#333' : '#ddd';

  return (
    <View style={styles.fieldContainer}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: card, color: text, borderColor: errors[errorKey] ? '#b00020' : border },
          multiline && styles.multiline
        ]}
        placeholder={placeholder}
        placeholderTextColor={sub}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
      {errors[errorKey] ? <Text style={styles.error}>{errors[errorKey]}</Text> : null}
    </View>
  );
};

export const ApplicationFormScreen = () => {
  const route = useRoute<FormRouteProp>();
  const navigation = useNavigation<NavProp>();
  const { isDarkMode } = useAppContext();
  const { job, fromSavedJobs } = route.params;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [whyHireYou, setWhyHireYou] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Full name is required.';
    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email.';
    if (!contactNumber.trim()) newErrors.contactNumber = 'Contact number is required.';
    if (!whyHireYou.trim()) newErrors.whyHireYou = 'This field is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    Alert.alert(
      'Application Successful 🎉',
      `Thank you ${name}! Your application for ${job.title} at ${job.company} has been submitted.`,
      [{
        text: 'Okay',
        onPress: () => {
          setName('');
          setEmail('');
          setContactNumber('');
          setWhyHireYou('');
          setErrors({});
          if (fromSavedJobs) navigation.navigate('JobFinder');
          else navigation.goBack();
        }
      }]
    );
  };

  const bg = isDarkMode ? '#121212' : '#f5f5f5';
  const text = isDarkMode ? '#ffffff' : '#000000';
  const sub = isDarkMode ? '#aaaaaa' : '#666666';

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]}>
      <Text style={[styles.header, { color: text }]}>Applying for: {job.title}</Text>
      <Text style={[styles.subheader, { color: sub }]}>{job.company}</Text>

      <Field label="Full Name" value={name} onChange={setName} placeholder="John Doe" errorKey="name" errors={errors} isDarkMode={isDarkMode} />
      <Field label="Email Address" value={email} onChange={setEmail} placeholder="john@example.com" keyboardType="email-address" errorKey="email" errors={errors} isDarkMode={isDarkMode} />
      <Field label="Contact Number" value={contactNumber} onChange={setContactNumber} placeholder="09123456789" keyboardType="numeric" errorKey="contactNumber" errors={errors} isDarkMode={isDarkMode} />
      <Field label="Why should we hire you?" value={whyHireYou} onChange={setWhyHireYou} placeholder="I am a great fit because..." multiline errorKey="whyHireYou" errors={errors} isDarkMode={isDarkMode} />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Application</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  subheader: { fontSize: 14, marginBottom: 20 },
  fieldContainer: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15 },
  multiline: { height: 100, textAlignVertical: 'top' },
  error: { color: '#b00020', fontSize: 12, marginTop: 4 },
  submitBtn: { backgroundColor: '#6200ee', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 10, marginBottom: 40 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});