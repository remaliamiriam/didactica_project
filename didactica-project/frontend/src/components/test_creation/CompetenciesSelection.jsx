import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { validateObjective } from '../../utils/validator.js';
import { FaMagic, FaSave } from 'react-icons/fa';

// === Funcții pentru generarea automată a competenței ===

const cleanVerb = (text) => {
  if (!text) return '';

  const normalized = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  const match = normalized.match(/\b(sa|să)\s+([a-zăîâșț]+)/i);
  const verb = match?.[2] || '';

  console.log('🔍 Verbul detectat:', verb);
  return verb;
};

const deriveCompetencyFromVerb = (verb) => {
  if (!verb) return '';

  const lowerVerb = verb.toLowerCase();
  const rules = [
    { suffix: 'uiasca', replacement: 'uirea' },
    { suffix: 'easca', replacement: 'area' },
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
    if (lowerVerb.endsWith(suffix)) {
      const stem = lowerVerb.slice(0, -suffix.length);
      const nounForm = stem + replacement;
      return nounForm.charAt(0).toUpperCase() + nounForm.slice(1);
    }
  }

  return lowerVerb.charAt(0).toUpperCase() + lowerVerb + 'area';
};

const generateCompetencyFromObjective = (objectiveText) => {
  const verb = cleanVerb(objectiveText);
  if (!verb || verb.length < 3) return '';
  return deriveCompetencyFromVerb(verb);
};

// === Componenta principală ===

const CompetenciesSelection = ({ onNext, onSave, initialCompetencies = [] }) => {
  const [objective, setObjective] = useState('');
  const [competency, setCompetency] = useState('');
  const [contentUnit, setContentUnit] = useState('');
  const [entries, setEntries] = useState([]);
  const [objectiveErrors, setObjectiveErrors] = useState([]);
  const [competencyEdited, setCompetencyEdited] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!competencyEdited && objective.trim()) {
      const autoCompetency = generateCompetencyFromObjective(objective);
      setCompetency(autoCompetency);
    }
  }, [objective, competencyEdited]);

  useEffect(() => {
    if (initialCompetencies.length > 0) {
      setEntries(initialCompetencies);
    }
  }, [initialCompetencies]);

  const handleAddEntry = () => {
    const errors = validateObjective(objective);
    const hasEmptyFields = !objective.trim() || !competency.trim() || !contentUnit.trim();

    if (errors.length > 0) {
      setObjectiveErrors(errors);
      return;
    }

    if (hasEmptyFields) {
      setFormError('Toate câmpurile trebuie completate.');
      return;
    }

    setObjectiveErrors([]);
    setFormError('');

    const newEntry = { objective, competency, contentUnit };
    setEntries(prev => [...prev, newEntry]);

    setObjective('');
    setCompetency('');
    setContentUnit('');
    setCompetencyEdited(false);
  };

  const handleDeleteEntry = (indexToDelete) => {
    setEntries(prev => prev.filter((_, idx) => idx !== indexToDelete));
  };

  const handleContinue = () => {
    if (entries.length > 0) {
      onSave(entries);
      onNext();
    }
  };

  const handleMagicInsert = () => {
    const exampleText = 'La finalul lecției, elevul va fi capabil să ... Obiectivul va fi îndeplinit dacă ...';
    setObjective(exampleText);
    setCompetencyEdited(false);
  };

  return (
    <div className="p-4">
      <h3>1. Selectarea competențelor și a unităților de conținut</h3>

      <Alert variant="info" className="d-flex align-items-center justify-content-between">
        <div>
          💡 <strong>Sugestie:</strong> Scrie obiectivul în formatul:<br />
          <em>"La finalul lecției, elevul va fi capabil să [verb] ... Obiectivul va fi îndeplinit dacă [același verb] ..."</em>
        </div>
        <OverlayTrigger
          placement="left"
          overlay={
            <Tooltip id="tooltip-magic">
              Inserează sugestia
            </Tooltip>
          }
        >
          <Button variant="outline-primary" size="sm" onClick={handleMagicInsert} title="Inserează sugestia">
            <FaMagic />
          </Button>
        </OverlayTrigger>
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

        {formError && (
          <Alert variant="danger">{formError}</Alert>
        )}

        <Button variant="secondary" onClick={handleAddEntry}>
          Adaugă
        </Button>
      </Form>

      <hr />

      <h5>Obiective adăugate:</h5>
      {entries.length === 0 ? (
        <p>Nu ai adăugat încă niciun obiectiv.</p>
      ) : (
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
      )}

      <Button
        variant="primary"
        onClick={handleContinue}
        disabled={entries.length === 0}
        className="mt-3"
      >
        Continuă
      </Button>
    </div>
  );
};

export default CompetenciesSelection;
