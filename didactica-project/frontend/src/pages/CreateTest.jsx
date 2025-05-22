import React, { useState } from 'react';
import CompetenciesSelection from '../components/test_creation/CompetenciesSelection.jsx';
import SpecificationsTable from '../components/test_creation/SpecificationsTable.jsx';
import QuestionDistributionValidation from '../components/test_creation/QuestionDistributionForm.jsx';
import QuestionsForm from '../components/test_creation/QuestionsForm.jsx';
import TestPreview from '../components/test_creation/TestPreview.jsx';
import TestFeedback from '../components/test_creation/TestFeedback.jsx';
import { Button, Container, Card, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './CreateTest.css'; // Import CSS for styling

const CreateTest = () => {
  const [competencies, setCompetencies] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [testFeedback, setTestFeedback] = useState(null);
  const [step, setStep] = useState(1);
  const [testDuration, setTestDuration] = useState(null);


  const handleCompetenciesChange = (selectedCompetencies) => {
    setCompetencies(selectedCompetencies);
    setStep(2);
  };

  const handleSpecificationsChange = (newSpecifications) => {
    setSpecifications(newSpecifications);
    setStep(3);
  };

  const handleQuestionsChange = (newQuestions) => {
    setQuestions(newQuestions);
  };

  const handlePreviewTest = () => {
    setIsPreviewing(true);
  };

  const handleGenerateFeedback = (feedback) => {
    setTestFeedback(feedback);
  };

  const getProgress = () => {
    if (isPreviewing) return 100;
    return step * 25;
  };

  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4 text-center">Creare Test Docimologic</h2>

        {!isPreviewing ? (
          <Card className="shadow-lg" style={{ position: 'relative' }}>
            <div
              className="scrollable-content"
              style={{
                height: '70vh', // Setează o înălțime fixă
                overflowY: 'auto',
                padding: '1.5rem',
              }}
            >
              {step === 1 && (
                <CompetenciesSelection onNext={() => setStep(2)} onSave={handleCompetenciesChange} />
              )}
              {step === 2 && (
                <SpecificationsTable
                  competencies={competencies}
                  onSpecificationsChange={handleSpecificationsChange}
                />
              )}
              {step === 3 && (
               <QuestionDistributionValidation
                specifications={specifications}
                onSubmit={(validatedData) => {
                  setQuestions(specifications); // Păstrezi specificațiile ca întrebări (dacă asta dorești)
                  setTestDuration(validatedData.duration); // Salvezi durata
                  setIsPreviewing(true);
                }}
              />

              )}
              {step === 4 && (
                <>
                  <QuestionsForm
                    competencies={competencies}
                    specifications={specifications}
                    onQuestionsChange={handleQuestionsChange}
                  />
                  <div className="d-flex justify-content-end mt-3">
                    <Button onClick={handlePreviewTest} variant="success">
                      Previzualizează Testul
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        ) : (
          <Card className="p-4 shadow">
            <TestPreview
              questions={questions}
              onGenerateFeedback={handleGenerateFeedback}
            />
            <hr />
            <TestFeedback feedback={testFeedback} />
          </Card>
        )}
      </motion.div>
    </Container>
  );
};

export default CreateTest; 