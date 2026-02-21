import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Alert,
  Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ViewState = 'main' | 'question' | 'confirm-relapse' | 'result' | 'relapsed';

const QUESTIONS = [
  "Vuoi morire?",
  "Vuoi davvero puzzare di posacenere?",
  "Vuoi un cancro ai polmoni?",
  "Vuoi regalare altri 5€ alle multinazionali?",
  "Pensa al tuo alito. Vuoi davvero?",
  "Sei più debole di un cilindro di carta?",
  "Vuoi invecchiare prima del tempo?",
  "Ti piace sprecare salute per 5 minuti di fumo?",
  "Ricordi come si respira a pieni polmoni?",
  "La sigaretta decide per te?",
];

export default function App() {
  const [view, setView] = useState<ViewState>('main');
  const [count, setCount] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState("");

  // Carica il counter all'avvio
  useEffect(() => {
    const loadCount = async () => {
      const saved = await AsyncStorage.getItem('resistCount');
      if (saved) setCount(parseInt(saved, 10));
    };
    loadCount();
  }, []);

  // Salva il counter quando cambia
  const updateCount = async (newCount: number) => {
    setCount(newCount);
    await AsyncStorage.setItem('resistCount', newCount.toString());
  };

  const handleCravingClick = () => {
    const randomIdx = Math.floor(Math.random() * QUESTIONS.length);
    setCurrentQuestion(QUESTIONS[randomIdx]);
    setView('question');
  };

  const handleResponse = (answer: 'si' | 'no') => {
    if (answer === 'no') {
      updateCount(count + 1);
      setView('result');
    } else {
      setView('confirm-relapse');
    }
  };

  const executeRelapse = () => {
    updateCount(0);
    setView('relapsed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {view === 'main' && (
        <View style={styles.screen}>
          <Text style={styles.title}>Brutta storia la dipendenza..</Text>
          <TouchableOpacity style={styles.btnMain} onPress={handleCravingClick}>
            <Text style={styles.btnMainText}>HO VOGLIA DI FUMARE</Text>
          </TouchableOpacity>
          
          <View style={styles.counterContainer}>
            <Text style={styles.counterLabel}>Resistenze consecutive</Text>
            <Text style={styles.counterValue}>{count}</Text>
          </View>

          <TouchableOpacity style={styles.btnRelapseManual} onPress={() => setView('confirm-relapse')}>
            <Text style={styles.btnRelapseManualText}>Ho ceduto... (reset)</Text>
          </TouchableOpacity>
        </View>
      )}

      {(view === 'question' || view === 'confirm-relapse') && (
        <View style={styles.screen}>
          <Text style={styles.questionText}>
            {view === 'question' ? currentQuestion : "Sei sicuro al 100%?"}
          </Text>
          {view === 'confirm-relapse' && (
             <Text style={styles.subText}>Il tuo record di {count} verrà azzerato.</Text>
          )}
          
          <View style={styles.btnGroup}>
            <TouchableOpacity 
              style={[styles.btnSide, styles.btnSi]} 
              onPress={() => view === 'question' ? handleResponse('si') : executeRelapse()}
            >
              <Text style={styles.btnTextSi}>SÌ</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.btnSide, styles.btnNo]} 
              onPress={() => view === 'question' ? handleResponse('no') : setView('main')}
            >
              <Text style={styles.btnText}>NO</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {(view === 'result' || view === 'relapsed') && (
        <View style={styles.screen}>
          <Text style={styles.title}>
            {view === 'result' ? "E allora non fumare." : "Si riparte."}
          </Text>
          <Text style={styles.subText}>
            {view === 'result' ? "Ottima scelta." : "Non abbatterti, ricomincia ora."}
          </Text>
          <TouchableOpacity style={styles.btnReset} onPress={() => setView('main')}>
            <Text style={styles.btnText}>OK</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: 'white',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  subText: {
    color: '#888',
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  btnMain: {
    backgroundColor: '#e74c3c',
    width: '100%',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  btnMainText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
  btnGroup: {
    flexDirection: 'row',
    gap: 15,
  },
  btnSide: {
    flex: 1,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  btnSi: {
    backgroundColor: '#2a2a2a',
  },
  btnNo: {
    backgroundColor: '#2ecc71',
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnTextSi: {
    color: '#666',
    fontSize: 18,
    fontWeight: 'bold',
  },
  counterContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  counterLabel: {
    color: '#f1c40f',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  counterValue: {
    color: '#f1c40f',
    fontSize: 80,
    fontWeight: '900',
  },
  btnRelapseManual: {
    marginTop: 50,
    padding: 10,
  },
  btnRelapseManualText: {
    color: '#e74c3c',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  btnReset: {
    backgroundColor: '#3498db',
    width: '100%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  }
});