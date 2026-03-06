import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  ActivityIndicator, StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import uuid from 'react-native-uuid';
import { useAppContext, Job, RootStackParamList } from './App';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'JobFinder'>;

// ✅ Real data from empllo.com/api/v1 — used as fallback when fetch is blocked by CORS
const STATIC_JOBS = [
  { title: "Data Quality Specialist", companyName: "Mistral", jobType: "Full time", workModel: "On site", seniorityLevel: "Mid", locations: ["Paris"], minSalary: null, currency: "EUR", applicationLink: "https://empllo.com/jobs/view/data-quality-specialist-1200be477793", mainCategory: "Data" },
  { title: "Lead Site Reliability Engineer", companyName: "Zeta", jobType: "Full time", workModel: "On site", seniorityLevel: "Lead", locations: ["Worldwide"], minSalary: null, currency: "INR", applicationLink: "https://empllo.com/jobs/view/lead-site-reliability-engineer-2101fc9c9904", mainCategory: "Engineering" },
  { title: "Internship Communication Design", companyName: "Trivago", jobType: "Internship", workModel: "Hybrid", seniorityLevel: "Intern", locations: ["Düsseldorf"], minSalary: null, currency: "EUR", applicationLink: "https://empllo.com/jobs/view/internship-communication-design-8452213002", mainCategory: "Design" },
  { title: "Account Executive Junior", companyName: "Jobandtalent", jobType: "Full time", workModel: "Hybrid", seniorityLevel: "Junior", locations: ["Madrid"], minSalary: null, currency: "EUR", applicationLink: "https://empllo.com/jobs/view/account-executive-junior-b93bbfae2b8a", mainCategory: "Sales" },
  { title: "Web & UX Designer", companyName: "Altium", jobType: "Full time", workModel: "On site", seniorityLevel: "Mid", locations: ["Wroclaw", "Katowice"], minSalary: null, currency: "PLN", applicationLink: "https://empllo.com/jobs/view/web-ux-designer-4660607006", mainCategory: "Design" },
  { title: "Data Engineer", companyName: "Lighthouse", jobType: "Full time", workModel: "On site", seniorityLevel: "Senior", locations: ["Ghent"], minSalary: null, currency: "EUR", applicationLink: "https://empllo.com/jobs/view/data-engineer-4798753101", mainCategory: "Data" },
  { title: "Patching Analyst", companyName: "Ensono", jobType: "Full time", workModel: "On site", seniorityLevel: "Mid", locations: ["Chennai"], minSalary: null, currency: "INR", applicationLink: "https://empllo.com/jobs/view/patching-analyst-4667663005", mainCategory: "Engineering" },
  { title: "Senior Consultant – Cloud Infrastructure (OCI)", companyName: "Highstreet IT", jobType: "Full time", workModel: "Remote", seniorityLevel: "Senior", locations: ["Asia"], minSalary: null, currency: "INR", applicationLink: "https://empllo.com/jobs/view/senior-consultant-cloud-infrastructure-oci-ffe145277849", mainCategory: "Engineering" },
  { title: "Architect II", companyName: "CannonDesign", jobType: "Full time", workModel: "On site", seniorityLevel: "Mid", locations: ["Mumbai"], minSalary: null, currency: "INR", applicationLink: "https://empllo.com/jobs/view/architect-ii-8452194002", mainCategory: "Design" },
  { title: "Software Engineer II", companyName: "Bloomreach", jobType: "Full time", workModel: "Remote", seniorityLevel: "Mid", locations: ["India"], minSalary: null, currency: "INR", applicationLink: "https://empllo.com/jobs/view/software-engineer-ii-7686370", mainCategory: "Engineering" },
  { title: "Speech Language Pathologist", companyName: "BAYADA", jobType: "Part time", workModel: "On site", seniorityLevel: "Mid", locations: ["Warminster"], minSalary: null, currency: "USD", applicationLink: "https://empllo.com/jobs/view/speech-language-pathologist-slp-home-health-visits-8452322002", mainCategory: "Healthcare" },
  { title: "Product Manager Intern, LiveTV", companyName: "Roku", jobType: "Internship", workModel: "Hybrid", seniorityLevel: "Intern", locations: ["Cambridge"], minSalary: null, currency: "GBP", applicationLink: "https://empllo.com/jobs/view/product-manager-intern-livetv-7677396", mainCategory: "Product" },
  { title: "Senior DevOps Engineer", companyName: "Nice", jobType: "Full time", workModel: "Hybrid", seniorityLevel: "Senior", locations: ["Pune"], minSalary: null, currency: "INR", applicationLink: "https://empllo.com/jobs/view/senior-devops-engineer-4753187101", mainCategory: "Dev Ops" },
  { title: "AI/ML TechLead (LLMs, AWS)", companyName: "Provectus", jobType: "Full time", workModel: "Remote", seniorityLevel: "Lead", locations: ["Europe"], minSalary: null, currency: "EUR", applicationLink: "https://empllo.com/jobs/view/ai-ml-techlead-llms-aws-48676a2f7f3f", mainCategory: "Engineering" },
  { title: "Global Director, IT", companyName: "Showpad", jobType: "Full time", workModel: "On site", seniorityLevel: "Director", locations: ["Pune"], minSalary: null, currency: "INR", applicationLink: "https://empllo.com/jobs/view/global-director-it-7654039", mainCategory: "Engineering" },
  { title: "Java Developer III", companyName: "Smarsh", jobType: "Full time", workModel: "Hybrid", seniorityLevel: "Senior", locations: ["Worldwide"], minSalary: null, currency: "INR", applicationLink: "https://empllo.com/jobs/view/java-developer-iii-0204a70dd409", mainCategory: "Engineering" },
  { title: "Risk Analyst (f/m/x)", companyName: "refurbed", jobType: "Full time", workModel: "Remote", seniorityLevel: "Senior", locations: ["Worldwide"], minSalary: null, currency: "USD", applicationLink: "https://empllo.com/jobs/view/risk-analyst-f-m-x-4798898101", mainCategory: "Finance" },
  { title: "Senior Product Manager - Autonomous Agents", companyName: "Netomi", jobType: "Full time", workModel: "Remote", seniorityLevel: "Senior", locations: ["Worldwide", "Asia"], minSalary: null, currency: "INR", applicationLink: "https://empllo.com/jobs/view/senior-product-manager-autonomous-agents-057b97d21e38", mainCategory: "Product" },
  { title: "Global Director - Tech/Data Operations", companyName: "Map", jobType: "Full time", workModel: "Hybrid", seniorityLevel: "Director", locations: ["Toronto"], minSalary: null, currency: "CAD", applicationLink: "https://empllo.com/jobs/view/global-director-tech-data-operations", mainCategory: "Data" },
  { title: "Senior Software Engineer", companyName: "Neo4j", jobType: "Full time", workModel: "On site", seniorityLevel: "Senior", locations: ["Worldwide"], minSalary: null, currency: "EUR", applicationLink: "https://empllo.com/jobs/view/software-engineering-clustering-u0026-distributed-systems-4660592006", mainCategory: "Engineering" },
];

const mapJobs = (rawJobs: any[]): Job[] =>
  rawJobs.map((job) => ({
    ...job,
    id: uuid.v4().toString(),
    company: job.companyName || 'Unknown',
    location: Array.isArray(job.locations) ? job.locations.join(', ') : 'N/A',
    salary: job.minSalary ? `${job.minSalary} ${job.currency || ''}` : 'N/A',
  }));

export const JobFinderScreen = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { saveJob, savedJobs, isDarkMode } = useAppContext();
  const navigation = useNavigation<NavProp>();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await fetch('https://empllo.com/api/v1?limit=50');
        if (!response.ok) throw new Error(`Status ${response.status}`);
        const data = await response.json();
        const rawJobs = data.jobs || [];
        if (rawJobs.length > 0) {
          setJobs(mapJobs(rawJobs));
          return;
        }
        throw new Error('Empty jobs array');
      } catch (error) {
        // ✅ CORS or network blocked — use real static data from the API
        console.log('Using static data due to fetch error:', error);
        setJobs(mapJobs(STATIC_JOBS));
      } finally {
        setIsLoading(false);
      }
    };
    loadJobs();
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isJobSaved = (id: string) => savedJobs.some(j => j.id === id);

  const bg = isDarkMode ? '#121212' : '#f5f5f5';
  const card = isDarkMode ? '#1e1e1e' : '#ffffff';
  const text = isDarkMode ? '#ffffff' : '#000000';
  const sub = isDarkMode ? '#aaaaaa' : '#666666';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <TextInput
        style={[styles.searchBar, { backgroundColor: card, color: text, borderColor: isDarkMode ? '#333' : '#ddd' }]}
        placeholder="Search jobs or companies..."
        placeholderTextColor={sub}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#6200ee" style={{ marginTop: 40 }} />
      ) : filteredJobs.length === 0 ? (
        <Text style={[styles.emptyText, { color: sub }]}>No jobs found.</Text>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: card }]}>
              <Text style={[styles.title, { color: text }]}>{item.title}</Text>
              <Text style={[styles.company, { color: sub }]}>{item.company}</Text>
              <Text style={[styles.detail, { color: sub }]}>📍 {item.location}</Text>
              <Text style={[styles.detail, { color: sub }]}>💰 {item.salary}</Text>
              <Text style={[styles.detail, { color: sub }]}>🏢 {item.jobType} · {item.workModel}</Text>
              <Text style={[styles.detail, { color: sub }]}>⭐ {item.seniorityLevel}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={() => navigation.navigate('ApplicationForm', { job: item, fromSavedJobs: false })}
                >
                  <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveBtn, isJobSaved(item.id) && styles.savedBtn]}
                  onPress={() => saveJob(item)}
                >
                  <Text style={styles.saveText}>{isJobSaved(item.id) ? 'Saved ✓' : 'Save Job'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  searchBar: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 15, fontSize: 15 },
  card: { borderRadius: 12, padding: 15, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  company: { fontSize: 14, marginBottom: 4 },
  detail: { fontSize: 13, marginBottom: 2 },
  buttonRow: { flexDirection: 'row', marginTop: 12, gap: 10 },
  applyBtn: { flex: 1, backgroundColor: '#6200ee', borderRadius: 8, padding: 10, alignItems: 'center' },
  applyText: { color: '#fff', fontWeight: 'bold' },
  saveBtn: { flex: 1, backgroundColor: '#03dac6', borderRadius: 8, padding: 10, alignItems: 'center' },
  savedBtn: { backgroundColor: '#aaaaaa' },
  saveText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16 },
});