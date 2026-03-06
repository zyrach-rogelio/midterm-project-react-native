import React, { createContext, useState, useContext, ReactNode } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface Job {
  id: string;
  title: string;
  companyName: string;
  company: string;
  companyLogo?: string;
  jobType?: string;
  workModel?: string;
  seniorityLevel?: string;
  locations: string[];
  location: string;
  minSalary?: number | null;
  maxSalary?: number | null;
  salary: string;
  currency?: string;
  description?: string;
  applicationLink?: string;
}

export type RootStackParamList = {
  JobFinder: undefined;
  SavedJobs: undefined;
  ApplicationForm: { job: Job; fromSavedJobs: boolean };
};

// ─── CONTEXT ─────────────────────────────────────────────────────────────────

interface AppContextType {
  savedJobs: Job[];
  saveJob: (job: Job) => void;
  removeJob: (id: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const saveJob = (job: Job) => {
    setSavedJobs(prev => prev.some(j => j.id === job.id) ? prev : [...prev, job]);
  };

  const removeJob = (id: string) => {
    setSavedJobs(prev => prev.filter(j => j.id !== id));
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <AppContext.Provider value={{ savedJobs, saveJob, removeJob, isDarkMode, toggleDarkMode }}>
      {children}
    </AppContext.Provider>
  );
};

// ─── NAVIGATION ───────────────────────────────────────────────────────────────

import { JobFinderScreen } from './JobFinderScreen';
import { SavedJobsScreen } from './SavedJobsScreen';
import { ApplicationFormScreen } from './ApplicationFormScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isDarkMode, toggleDarkMode } = useAppContext();
  const theme = isDarkMode ? NavigationDarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerRight: () => (
            <TouchableOpacity onPress={toggleDarkMode} style={{ marginRight: 15 }}>
              <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={isDarkMode ? 'white' : 'black'} />
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen
          name="JobFinder"
          component={JobFinderScreen}
          options={({ navigation }) => ({
            title: 'Find Jobs',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate('SavedJobs')} style={{ marginRight: 20 }}>
                <Ionicons name="bookmarks" size={24} color={isDarkMode ? 'white' : 'black'} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="SavedJobs" component={SavedJobsScreen} options={{ title: 'My Saved Jobs' }} />
        <Stack.Screen name="ApplicationForm" component={ApplicationFormScreen} options={{ title: 'Apply Now' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}