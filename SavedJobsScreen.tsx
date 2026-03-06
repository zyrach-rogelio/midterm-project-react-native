import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppContext, RootStackParamList } from './App';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'SavedJobs'>;

export const SavedJobsScreen = () => {
  const { savedJobs, removeJob, isDarkMode } = useAppContext();
  const navigation = useNavigation<NavProp>();

  const bg = isDarkMode ? '#121212' : '#f5f5f5';
  const card = isDarkMode ? '#1e1e1e' : '#ffffff';
  const text = isDarkMode ? '#ffffff' : '#000000';
  const sub = isDarkMode ? '#aaaaaa' : '#666666';

  if (savedJobs.length === 0) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: bg }]}>
        <Text style={[styles.emptyText, { color: sub }]}>No saved jobs yet!</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <FlatList
        data={savedJobs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: card }]}>
            <Text style={[styles.title, { color: text }]}>{item.title}</Text>
            <Text style={[styles.company, { color: sub }]}>{item.company}</Text>
            <Text style={[styles.detail, { color: sub }]}>📍 {item.location}</Text>
            <Text style={[styles.detail, { color: sub }]}>💰 {item.salary}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => navigation.navigate('ApplicationForm', { job: item, fromSavedJobs: true })}
              >
                <Text style={styles.btnText}>Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeJob(item.id)}
              >
                <Text style={styles.btnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  card: { borderRadius: 12, padding: 15, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  company: { fontSize: 14, marginBottom: 4 },
  detail: { fontSize: 13, marginBottom: 2 },
  buttonRow: { flexDirection: 'row', marginTop: 12, gap: 10 },
  applyBtn: { flex: 1, backgroundColor: '#6200ee', borderRadius: 8, padding: 10, alignItems: 'center' },
  removeBtn: { flex: 1, backgroundColor: '#b00020', borderRadius: 8, padding: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { fontSize: 16 },
});