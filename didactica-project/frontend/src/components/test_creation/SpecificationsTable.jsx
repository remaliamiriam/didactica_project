import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Table, Form, Button, InputGroup, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap';
import './SpecificationsTable.css';

const cognitiveObjectives = [
  'Cunoaștere',
  'Înțelegere',
  'Aplicare',
  'Analiză',
  'Sinteză',
  'Evaluare',
];

const SpecificationsTable = ({ competencies, onSpecificationsChange, onNextStep, onBack }) => {
  const [tableData, setTableData] = useState({});
  const [newCompetency, setNewCompetency] = useState('');
  const [activeCell, setActiveCell] = useState({ row: 0, col: 0 });
  const [error, setError] = useState('');
  const tableRef = useRef(null);

  const rowKeys = useMemo(() => Object.keys(tableData), [tableData]);
  const maxRow = rowKeys.length - 1;
  const maxCol = cognitiveObjectives.length - 1;

  useEffect(() => {
    if (tableRef.current) {
      const activeElement = tableRef.current.querySelector('.cell-active input');
      if (activeElement) activeElement.focus();
    }
  }, [activeCell]);

  useEffect(() => {
    if (competencies && competencies.length > 0) {
      const initialData = {};
      competencies.forEach((c, index) => {
        const key = `C${index + 1}`;
        const comp = c.competency || 'Competență nedefinită';
        const cont = c.contentUnit || 'Unitate nedefinită';
        initialData[key] = {
          name: key,
          label: `${comp} / ${cont}`,
          objectives: Array(6).fill(0),
          locked: true,
        };
      });
      setTableData(initialData);
    }
  }, [competencies]);

  const handleInputFocus = (rowKey, colIndex) => {
    const rowNum = rowKeys.indexOf(rowKey);
    setActiveCell({ row: rowNum, col: colIndex });
  };

  const handleInputChange = (rowKey, colIndex, value) => {
    const updated = { ...tableData };
    const numValue = Math.max(0, Number(value));
    updated[rowKey].objectives[colIndex] = isNaN(numValue) ? 0 : numValue;
    setTableData(updated);
    onSpecificationsChange(updated);
  };

  const handleLabelChange = (rowKey, newLabel) => {
    const updated = { ...tableData };
    updated[rowKey].label = newLabel;
    setTableData(updated);
    onSpecificationsChange(updated);
  };

  const handleAddRow = () => {
    const trimmed = newCompetency.trim();
    if (!trimmed) {
      setError('Eticheta nu poate fi goală.');
      return;
    }

    const exists = Object.values(tableData).some(r => r.label === trimmed);
    if (exists) {
      setError('Această competență este deja adăugată.');
      return;
    }

    setError('');
    const newKey = `C${rowKeys.length + 1}`;
    const updated = {
      ...tableData,
      [newKey]: {
        name: newKey,
        label: trimmed,
        objectives: Array(6).fill(0),
        locked: false,
      },
    };

    setTableData(updated);
    setNewCompetency('');
    onSpecificationsChange(updated);
    setActiveCell({ row: rowKeys.length, col: 0 });
  };

  const handleDeleteRow = (key) => {
    const updated = { ...tableData };
    delete updated[key];
    setTableData(updated);
    onSpecificationsChange(updated);
    if (activeCell.row >= Object.keys(updated).length) {
      setActiveCell(prev => ({
        row: Math.max(0, prev.row - 1),
        col: prev.col,
      }));
    }
  };

  const handleKeyDown = (e) => {
    const { row, col } = activeCell;

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
      e.preventDefault();
    }

    switch (e.key) {
      case 'ArrowUp':
        if (row > 0) setActiveCell({ row: row - 1, col });
        break;
      case 'ArrowDown':
        if (row < maxRow) setActiveCell({ row: row + 1, col });
        break;
      case 'ArrowLeft':
        if (col > 0) setActiveCell({ row, col: col - 1 });
        break;
      case 'ArrowRight':
        if (col < maxCol) setActiveCell({ row, col: col + 1 });
        break;
      case 'Tab':
        if (e.shiftKey) {
          if (col > 0) {
            setActiveCell({ row, col: col - 1 });
          } else if (row > 0) {
            setActiveCell({ row: row - 1, col: maxCol });
          }
        } else {
          if (col < maxCol) {
            setActiveCell({ row, col: col + 1 });
          } else if (row < maxRow) {
            setActiveCell({ row: row + 1, col: 0 });
          }
        }
        break;
      case 'Enter':
        if (row < maxRow) setActiveCell({ row: row + 1, col });
        break;
      case 'Home':
        setActiveCell(e.ctrlKey ? { row: 0, col: 0 } : { row, col: 0 });
        break;
      case 'End':
        setActiveCell(e.ctrlKey ? { row: maxRow, col: maxCol } : { row, col: maxCol });
        break;
      case 'PageUp':
        setActiveCell({ row: 0, col });
        break;
      case 'PageDown':
        setActiveCell({ row: maxRow, col });
        break;
      default:
        if (/^[0-9]$/.test(e.key)) {
          const currentValue = tableData[rowKeys[row]]?.objectives[col] || 0;
          const newValue = parseInt(`${currentValue}${e.key}`, 10);
          handleInputChange(rowKeys[row], col, newValue);
        }
    }
  };

  const getColumnTotal = (index) =>
    Object.values(tableData).reduce((sum, row) => sum + row.objectives[index], 0);

  const getTotalItems = () =>
    Object.values(tableData).reduce(
      (sum, row) => sum + row.objectives.reduce((a, b) => a + b, 0),
      0
    );

  const getPercentage = (count, total) =>
    total > 0 ? `${((count / total) * 100).toFixed(2)}%` : '0%';

  const totalItems = getTotalItems();

  return (
    <div className="mt-4" ref={tableRef}>
      <h4>2. Tabelul de specificații</h4>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Adaugă o nouă competență / unitate de conținut"
          value={newCompetency}
          onChange={(e) => setNewCompetency(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddRow()}
          aria-label="Adăugare competență nouă"
        />
        <Button variant="primary" onClick={handleAddRow}>
          Adaugă rând
        </Button>
      </InputGroup>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="table-responsive">
        <Table bordered onKeyDown={handleKeyDown} tabIndex={0}>
          <thead>
            <tr>
              <th rowSpan="2">Competențe / Unități</th>
              <th colSpan={6} className="text-center">Obiective cognitive</th>
              <th rowSpan="2" className="text-center">Acțiuni</th>
            </tr>
            <tr>
              {cognitiveObjectives.map((obj, i) => <th key={i}>{obj}</th>)}
            </tr>
          </thead>
          <tbody>
            {rowKeys.map((key, rowIdx) => {
              const row = tableData[key];
              return (
                <tr key={key}>
                  <th>
                    {row.locked ? row.label : (
                      <Form.Control
                        type="text"
                        value={row.label}
                        onChange={(e) => handleLabelChange(key, e.target.value)}
                      />
                    )}
                  </th>
                  {row.objectives.map((val, colIdx) => {
                    const isActive = activeCell.row === rowIdx && activeCell.col === colIdx;
                    return (
                      <td key={colIdx} className={isActive ? 'cell-active' : ''}>
                        <Form.Control
                          type="number"
                          min="0"
                          value={val}
                          onChange={(e) => handleInputChange(key, colIdx, e.target.value)}
                          onFocus={() => handleInputFocus(key, colIdx)}
                          tabIndex={isActive ? 0 : -1}
                        />
                      </td>
                    );
                  })}
                  <td className="text-center">
                    {!row.locked && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteRow(key)}
                        aria-label={`Șterge rândul ${row.label}`}
                      >
                        Șterge
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              {cognitiveObjectives.map((_, i) => (
                <th key={i} className="text-center">
                  {getColumnTotal(i)}
                </th>
              ))}
              <th></th>
            </tr>
            <tr>
              <th>Procentaj</th>
              {cognitiveObjectives.map((_, i) => (
                <th key={i} className="text-center">
                  {getPercentage(getColumnTotal(i), totalItems)}
                </th>
              ))}
              <th></th>
            </tr>
          </tfoot>
        </Table>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={onBack}>
          Înapoi
        </Button>

        {totalItems === 0 ? (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip-disabled">Completează tabelul pentru a continua</Tooltip>}
          >
            <span className="d-inline-block">
              <Button
                variant="success"
                disabled
                style={{ pointerEvents: 'none' }}
              >
                Continuă
              </Button>
            </span>
          </OverlayTrigger>
        ) : (
          <Button
            variant="success"
            onClick={onNextStep}
          >
            Continuă
          </Button>
        )}
      </div>
    </div>
  );
};

export default SpecificationsTable;
