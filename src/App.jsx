import { useState } from 'react';
import LandingPage from './components/LandingPage';
import AssessmentForm from './components/AssessmentForm';
import ResultsDashboard from './components/ResultsDashboard';
import { calculateScore, getActionItems } from './utils/questions';
import { sendToSheet } from './utils/sheets';
import './App.css';

function App() {
  const [step, setStep] = useState('landing');
  const [leadData, setLeadData] = useState(null);
  const [results, setResults] = useState(null);

  const handleLeadSubmit = (data) => {
    setLeadData(data);
    setStep('form');
    window.scrollTo(0, 0);
  };

  const handleAssessment = (answers) => {
    const scoreResults = calculateScore(answers);
    const actionItems = getActionItems(answers, scoreResults.sectionScores);
    const finalResults = { ...scoreResults, actionItems };
    setResults(finalResults);
    setStep('results');
    window.scrollTo(0, 0);

    sendToSheet({
      ...leadData,
      totalScore: scoreResults.totalScore,
      grade: scoreResults.gradeLabel,
      ...answers,
    });
  };

  return (
    <>
      {step === 'landing' && <LandingPage onSubmit={handleLeadSubmit} />}
      {step === 'form' && (
        <AssessmentForm leadData={leadData} onSubmit={handleAssessment} />
      )}
      {step === 'results' && (
        <ResultsDashboard results={results} leadData={leadData} />
      )}
    </>
  );
}

export default App;
