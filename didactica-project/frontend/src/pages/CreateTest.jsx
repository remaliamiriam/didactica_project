import React, { useState, useEffect } from 'react';
import CompetenciesSelection from '../components/test_creation/CompetenciesSelection.jsx';
import SpecificationsTable from '../components/test_creation/SpecificationsTable.jsx';
import QuestionDistributionForm from '../components/test_creation/QuestionDistributionForm.jsx';
import QuestionsForm from '../components/test_creation/QuestionsForm.jsx';
import TestPreview from '../components/test_creation/TestPreview.jsx';
import TestFeedback from '../components/test_creation/TestFeedback.jsx';
import { Button, Container, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './CreateTest.css';

const CreateTest = () => {
  const savedData = JSON.parse(localStorage.getItem('testCreationData')) || {};

  const [competencies, setCompetencies] = useState(savedData.competencies || []);
  const [specifications, setSpecifications] = useState(savedData.specifications || {});
  const [questions, setQuestions] = useState(savedData.questions || []);
  const [step, setStep] = useState(savedData.step || 1);
  const [testDuration, setTestDuration] = useState(savedData.testDuration || null);
  const [testFeedback, setTestFeedback] = useState(savedData.testFeedback || null);

  useEffect(() => {
    const dataToSave = {
      competencies,
      specifications,
      questions,
      step,
      testDuration,
      testFeedback
    };
    localStorage.setItem('testCreationData', JSON.stringify(dataToSave));
  }, [competencies, specifications, questions, step, testDuration, testFeedback]);

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const clearProgress = () => {
    localStorage.removeItem('testCreationData');
    setCompetencies([]);
    setSpecifications({});
    setQuestions([]);
    setStep(1);
    setTestDuration(null);
    setTestFeedback(null);
  };

  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="create-test-title m-0">Creare Test</h2>
          <Button variant="danger" onClick={clearProgress}>
            Șterge Progresul
          </Button>
        </div>

        <Card className="shadow-lg" style={{ position: 'relative' }}>
          <div
            className="scrollable-content"
            style={{ height: '70vh', overflowY: 'auto', padding: '1.5rem' }}
          >
            {step === 1 && (
              <CompetenciesSelection
                onSave={(entries) => setCompetencies(entries)}
                onNext={nextStep}
                onBack={prevStep}
                initialCompetencies={competencies}
              />
            )}
            {step === 2 && (
              <SpecificationsTable
                competencies={competencies}
                onSpecificationsChange={setSpecifications}
                onNextStep={nextStep}
                onBack={prevStep}
                initialSpecifications={specifications}
              />
            )}
            {step === 3 && (
              <QuestionDistributionForm
                specifications={specifications}
                onSubmit={(validatedData) => {
                  setTestDuration(validatedData.duration);
                  nextStep();
                }}
                onBack={prevStep}
                initialDuration={testDuration}
              />
            )}
            {step === 4 && (
              <QuestionsForm
                competencies={competencies}
                specifications={specifications}
                onQuestionsChange={setQuestions}
                onNextStep={nextStep}
                onBack={prevStep}
                initialQuestions={questions}
              />
            )}
            {step === 5 && (
              <TestPreview
                questions={questions}
                specifications={specifications}
                duration={testDuration}
                feedback={testFeedback}
                onBack={prevStep}
              />
            )}
          </div>
        </Card>
      </motion.div>
    </Container>
  );
};

export default CreateTest;
