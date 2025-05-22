import React, { useState, useEffect, useRef } from 'react';
import { Table, Form, Button, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './SpecificationsTable.css';

const cognitiveObjectives = [
  'Cunoaștere',
  'Înțelegere',
  'Aplicare',
  'Analiză',
  'Sinteză',
  'Evaluare',
];

const SpecificationsTable = ({ competencies, onSpecificationsChange, onNextStep }) => {
  const [tableData, setTableData] = useState({});
  const [newCompetency, setNewCompetency] = useState('');
  const [activeCell, setActiveCell] = useState({ row: 0, col: 0 });
  const tableRef = useRef(null);

  // Focus management
  useEffect(() => {
    if (tableRef.current) {
      const activeElement = tableRef.current.querySelector('.cell-active input');
      if (activeElement) {
        activeElement.focus();
      }
    }
  }, [activeCell]);

  // Initialize table data
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
    const rowNum = parseInt(rowKey.replace('C', '')) - 1;
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
    if (!newCompetency.trim()) return;
    const newKey = `C${Object.keys(tableData).length + 1}`;
    const updated = {
      ...tableData,
      [newKey]: {
        name: newKey,
        label: newCompetency,
        objectives: Array(6).fill(0),
        locked: false,
      },
    };
    setTableData(updated);
    setNewCompetency('');
    onSpecificationsChange(updated);
    // Set focus to the new row's first cell
    setActiveCell({ 
      row: Object.keys(updated).length - 1, 
      col: 0 
    });
  };

  const handleDeleteRow = (key) => {
    const updated = { ...tableData };
    delete updated[key];
    setTableData(updated);
    onSpecificationsChange(updated);
    // Adjust active cell if needed
    if (activeCell.row >= Object.keys(updated).length) {
      setActiveCell(prev => ({
        row: Math.max(0, prev.row - 1),
        col: prev.col
      }));
    }
  };

  const handleKeyDown = (e) => {
    const { row, col } = activeCell;
    const rowKeys = Object.keys(tableData);
    const maxRow = rowKeys.length - 1;
    const maxCol = cognitiveObjectives.length - 1;

    // Prevent default for arrow keys to avoid page scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
      e.preventDefault();
    }

    switch(e.key) {
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
          // Shift+Tab - move left or up
          if (col > 0) {
            setActiveCell({ row, col: col - 1 });
          } else if (row > 0) {
            setActiveCell({ row: row - 1, col: maxCol });
          }
        } else {
          // Tab - move right or down
          if (col < maxCol) {
            setActiveCell({ row, col: col + 1 });
          } else if (row < maxRow) {
            setActiveCell({ row: row + 1, col: 0 });
          }
        }
        break;
      case 'Enter':
        // Move down or to next row
        if (row < maxRow) {
          setActiveCell({ row: row + 1, col });
        }
        break;
      case 'Home':
        if (e.ctrlKey) {
          // Ctrl+Home - first cell
          setActiveCell({ row: 0, col: 0 });
        } else {
          // Home - first column
          setActiveCell({ row, col: 0 });
        }
        break;
      case 'End':
        if (e.ctrlKey) {
          // Ctrl+End - last cell
          setActiveCell({ row: maxRow, col: maxCol });
        } else {
          // End - last column
          setActiveCell({ row, col: maxCol });
        }
        break;
      case 'PageUp':
        setActiveCell({ row: 0, col });
        break;
      case 'PageDown':
        setActiveCell({ row: maxRow, col });
        break;
      default:
        // Handle number input
        if (/^[0-9]$/.test(e.key)) {
          const currentValue = tableData[rowKeys[row]]?.objectives[col] || 0;
          const newValue = parseInt(`${currentValue}${e.key}`);
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
        <Button
          variant="primary"
          onClick={handleAddRow}
          aria-label="Adaugă rând nou"
        >
          Adaugă rând
        </Button>
      </InputGroup>

      <div className="table-responsive">
        <Table bordered onKeyDown={handleKeyDown} tabIndex={0}>
          <thead>
            <tr>
              <th rowSpan="2" scope="col">Competențe / Unități de conținut</th>
              <th colSpan={6} className="text-center" scope="colgroup">
                Obiectivele învățării (cognitive)
              </th>
              <th rowSpan="2" className="text-center" scope="col">Acțiuni</th>
            </tr>
            <tr>
              {cognitiveObjectives.map((objective, i) => (
                <th key={i} scope="col">{objective}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(tableData).map(([key, row], rowIdx) => (
              <tr key={key}>
                <th scope="row">
                  {row.locked ? (
                    row.label
                  ) : (
                    <Form.Control
                      type="text"
                      value={row.label}
                      onChange={(e) => handleLabelChange(key, e.target.value)}
                      aria-label={`Editare etichetă pentru rândul ${rowIdx + 1}`}
                    />
                  )}
                </th>
                {row.objectives.map((val, colIdx) => {
                  const isActive = activeCell.row === rowIdx && activeCell.col === colIdx;
                  return (
                    <td 
                      key={colIdx} 
                      className={isActive ? 'cell-active' : ''}
                      aria-label={`${row.label}, ${cognitiveObjectives[colIdx]}`}
                    >
                      <Form.Control
                        type="number"
                        min="0"
                        value={val}
                        onChange={(e) => handleInputChange(key, colIdx, e.target.value)}
                        onFocus={() => handleInputFocus(key, colIdx)}
                        className={isActive ? 'active-cell' : ''}
                        tabIndex={isActive ? 0 : -1}
                        aria-label={`Număr întrebări pentru ${cognitiveObjectives[colIdx]}`}
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
                      aria-label={`Șterge rândul ${rowIdx + 1}`}
                    >
                      Șterge
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            <tr className="summary-row">
              <th scope="row"><strong>Total</strong></th>
              {cognitiveObjectives.map((_, colIdx) => (
                <td key={colIdx}><strong>{getColumnTotal(colIdx)}</strong></td>
              ))}
              <td></td>
            </tr>
            <tr className="summary-row">
              <th scope="row"><strong>%</strong></th>
              {cognitiveObjectives.map((_, colIdx) => (
                <td key={colIdx}>
                  <strong>{getPercentage(getColumnTotal(colIdx), totalItems)}</strong>
                </td>
              ))}
              <td></td>
            </tr>
          </tbody>
        </Table>
      </div>

      <div className="d-flex justify-content-end mt-4">
        <OverlayTrigger
          placement="top"
          overlay={
            totalItems === 0 ? (
              <Tooltip id="tooltip-disabled">Completează tabelul pentru a continua</Tooltip>
            ) : <></>
          }
        >
          <span className="d-inline-block">
            <Button
              variant="success"
              onClick={onNextStep}
              disabled={totalItems === 0}
              style={totalItems === 0 ? { pointerEvents: 'none' } : {}}
              aria-label="Continuă la pasul următor"
            >
              Continuă
            </Button>
          </span>
        </OverlayTrigger>
      </div>
    </div>
  );
};

export default SpecificationsTable;