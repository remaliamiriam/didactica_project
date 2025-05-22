import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { validateObjective } from '../../utils/validator.js';

// === Funcții pentru generarea automată a competenței ===

const cleanVerb = (text) => {
  return text
    .toLowerCase()
    .replace(/(la finalul lecției, )?(elevul )?(va fi capabil să|poate să|să)?/gi, '')
    .replace(/(se )?(poată |fie |va putea )?/gi, '')
    .trim()
    .split(' ')[0];
};

const deriveCompetencyFromVerb = (verb) => {
  if (!verb) return '';

  const rules = [
    { suffix: 'uiască', replacement: 'uirea' },
    { suffix: 'ească', replacement: 'area' },
    { suffix: 'eze', replacement: 'area' },
    { suffix: 'iza', replacement: 'izarea' },
    { suffix: 'ifica', replacement: 'ificarea' },
    { suffix: 'ie', replacement: 'ierea' },
    { suffix: 'i', replacement: 'irea' },
    { suffix: 'î', replacement: 'îrea' },
    { suffix: 'e', replacement: 'area' },
    { suffix: 'a', replacement: 'area' },
  ];

  for (const { suffix, replacement } of rules) {
    if (verb.endsWith(suffix)) {
      const stem = verb.slice(0, -suffix.length);
      const nounForm = stem + replacement;
      return nounForm.charAt(0).toUpperCase() + nounForm.slice(1);
    }
  }

  // fallback
  return verb.charAt(0).toUpperCase() + verb + 'area';
};

const generateCompetencyFromObjective = (objectiveText) => {
  const verb = cleanVerb(objectiveText);
  if (!verb) return '';
  return deriveCompetencyFromVerb(verb);
};

// === Componenta principală ===

const CompetenciesSelection = ({ onNext, onSave }) => {
  const [objective, setObjective] = useState('');
  const [competency, setCompetency] = useState('');
  const [contentUnit, setContentUnit] = useState('');
  const [entries, setEntries] = useState([]);
  const [objectiveErrors, setObjectiveErrors] = useState([]);
  const [competencyEdited, setCompetencyEdited] = useState(false);

  useEffect(() => {
    if (!competencyEdited) {
      const autoCompetency = generateCompetencyFromObjective(objective);
      setCompetency(autoCompetency);
    }
  }, [objective, competencyEdited]);

  const handleAddEntry = () => {
    const errors = validateObjective(objective);

    if (errors.length > 0) {
      setObjectiveErrors(errors);
      return;
    }

    setObjectiveErrors([]);

    const newEntry = {
      objective,
      competency,
      contentUnit
    };

    setEntries([...entries, newEntry]);
    setObjective('');
    setCompetency('');
    setContentUnit('');
    setCompetencyEdited(false);
  };

  const handleDeleteEntry = (indexToDelete) => {
    setEntries(entries.filter((_, idx) => idx !== indexToDelete));
  };

  const handleContinue = () => {
    if (entries.length > 0) {
      onSave(entries);
      onNext();
    }
  };

  return (
    <div className="p-4">
      <h3>1. Selectarea competențelor și a unităților de conținut</h3>

      <Alert variant="info">
        💡 <strong>Sugestie:</strong> Scrie obiectivul în formatul: <br />
        <em>"La finalul lecției, elevul va fi capabil să [verb] ... Obiectivul va fi îndeplinit dacă [același verb] ..."</em>
      </Alert>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Obiectiv operațional</Form.Label>
          <Form.Control
            type="text"
            value={objective}
            onChange={(e) => {
              setObjective(e.target.value);
              setCompetencyEdited(false);
            }}
            placeholder="Ex: La finalul lecției, elevul va fi capabil să creeze..."
            isInvalid={objectiveErrors.length > 0}
          />
          {objectiveErrors.length > 0 && (
            <Alert variant="danger" className="mt-2">
              {objectiveErrors.map((err, i) => (
                <div key={i}>• {err}</div>
              ))}
            </Alert>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Competență</Form.Label>
          <Form.Control
            type="text"
            value={competency}
            onChange={(e) => {
              setCompetency(e.target.value);
              setCompetencyEdited(true);
            }}
            placeholder="Ex: Crearea unui document"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Unitate de conținut</Form.Label>
          <Form.Control
            type="text"
            value={contentUnit}
            onChange={(e) => setContentUnit(e.target.value)}
            placeholder="Ex: Structura unui algoritm"
          />
        </Form.Group>

        <Button variant="secondary" onClick={handleAddEntry}>
          Adaugă
        </Button>
      </Form>

      <hr />

      <h5>Obiective adăugate:</h5>
      {entries.length === 0 && <p>Nu ai adăugat încă niciun obiectiv.</p>}
      <ul>
        {entries.map((entry, index) => (
          <li key={index} className="mb-3">
            <strong>Obiectiv:</strong> {entry.objective}<br />
            <strong>Competență:</strong> {entry.competency}<br />
            <strong>Conținut:</strong> {entry.contentUnit}<br />
            <Button
              variant="danger"
              size="sm"
              className="mt-1"
              onClick={() => handleDeleteEntry(index)}
            >
              Șterge
            </Button>
          </li>
        ))}
      </ul>

      <Button variant="primary" onClick={handleContinue} disabled={entries.length === 0}>
        Continuă
      </Button>
    </div>
  );
};

export default CompetenciesSelection;
